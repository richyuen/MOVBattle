using System;
using System.Collections;
using System.Collections.Generic;
using MOVBattle.Combat;
using MOVBattle.Map;
using MOVBattle.Units;
using UnityEngine;
#if ENABLE_INPUT_SYSTEM
using UnityEngine.InputSystem;
#endif

namespace MOVBattle.Core
{
    public sealed class BattleBootstrap : MonoBehaviour
    {
        [Header("Data")]
        [SerializeField] private BattleConfig battleConfig;
        [SerializeField] private MapDefinition mapDefinition;
        [SerializeField] private UnitCatalog unitCatalog;
        [SerializeField] private CombatCatalog combatCatalog;

        [Header("Systems")]
        [SerializeField] private GameStateMachine gameStateMachine;
        [SerializeField] private SimulationSystem simulationSystem;
        [SerializeField] private VictorySystem victorySystem;
        [SerializeField] private UnitFactory unitFactory;
        [SerializeField] private Camera gameplayCamera;

        [Header("Placement")]
        [SerializeField] private TeamId activePlacementTeam = TeamId.TeamA;
        [SerializeField] private string defaultSelectedUnitId = "tribal.clubber";

        private readonly List<RuntimeUnit> _placedUnits = new();
        private BudgetSystem _budgetSystem;
        private PlacementValidator _placementValidator;
        private Coroutine _countdownRoutine;
        private string _selectedUnitId;
        private bool _isInitialized;
        private int _selectedRosterIndex = -1;

        public TeamId ActivePlacementTeam => activePlacementTeam;
        public string SelectedUnitId => _selectedUnitId;

        public event Action<int, int> BudgetsChanged;
        public event Action<TeamId> ActiveTeamChanged;
        public event Action<string> SelectedUnitChanged;
        public event Action<string> PlacementRejected;
        public event Action<BattleResult> BattleResolved;

        private void Awake()
        {
            InitializeOrLogError();
        }

        private void OnEnable()
        {
            if (victorySystem != null)
            {
                victorySystem.BattleResolved += HandleBattleResolved;
            }

            if (gameStateMachine != null)
            {
                gameStateMachine.StateChanged += HandleStateChanged;
            }
        }

        private void OnDisable()
        {
            if (victorySystem != null)
            {
                victorySystem.BattleResolved -= HandleBattleResolved;
            }

            if (gameStateMachine != null)
            {
                gameStateMachine.StateChanged -= HandleStateChanged;
            }
        }

        private void InitializeOrLogError()
        {
            if (battleConfig == null || mapDefinition == null || unitCatalog == null || combatCatalog == null ||
                gameStateMachine == null || simulationSystem == null || victorySystem == null || unitFactory == null)
            {
                Debug.LogError("BattleBootstrap is missing required references.");
                _isInitialized = false;
                return;
            }

            if (gameplayCamera == null)
            {
                gameplayCamera = Camera.main;
            }

            _budgetSystem = new BudgetSystem(battleConfig.teamABudget, battleConfig.teamBBudget, battleConfig.maxUnitsPerTeam);
            _placementValidator = new PlacementValidator(mapDefinition);
            victorySystem.SetTimeLimit(battleConfig.optionalTimeLimitSeconds);
            _selectedUnitId = defaultSelectedUnitId;
            if (!unitCatalog.TryGetUnit(_selectedUnitId, out _))
            {
                IReadOnlyList<UnitDefinition> roster = unitCatalog.GetAllUnits();
                _selectedUnitId = roster.Count > 0 ? roster[0].Id : string.Empty;
            }

            _selectedRosterIndex = ResolveSelectedRosterIndex();
            _isInitialized = true;

            EmitBudgetEvent();
            SelectedUnitChanged?.Invoke(_selectedUnitId);
            ActiveTeamChanged?.Invoke(activePlacementTeam);
        }

        private void Update()
        {
            if (gameStateMachine == null || gameplayCamera == null)
            {
                return;
            }

            if (!_isInitialized)
            {
                return;
            }

            HandleDebugInput();

            if (gameStateMachine.CurrentState != GameState.Placement)
            {
                return;
            }

            HandlePlacementInput();
        }

        public IReadOnlyList<UnitDefinition> GetRoster()
        {
            return unitCatalog.GetAllUnits();
        }

        public void SetActiveTeam(TeamId team)
        {
            if (!_isInitialized)
            {
                return;
            }

            activePlacementTeam = team;
            ActiveTeamChanged?.Invoke(activePlacementTeam);
        }

        public bool SelectUnit(string unitId)
        {
            if (!_isInitialized)
            {
                return false;
            }

            if (string.IsNullOrWhiteSpace(unitId))
            {
                _selectedUnitId = string.Empty;
                SelectedUnitChanged?.Invoke(_selectedUnitId);
                return true;
            }

            if (!unitCatalog.TryGetUnit(unitId, out _))
            {
                return false;
            }

            _selectedUnitId = unitId;
            _selectedRosterIndex = ResolveSelectedRosterIndex();
            SelectedUnitChanged?.Invoke(_selectedUnitId);
            return true;
        }

        public void StartBattle()
        {
            if (!_isInitialized)
            {
                return;
            }

            if (gameStateMachine.CurrentState != GameState.Placement)
            {
                return;
            }

            int teamACount = simulationSystem.GetLivingCount(TeamId.TeamA);
            int teamBCount = simulationSystem.GetLivingCount(TeamId.TeamB);
            if (teamACount == 0 || teamBCount == 0)
            {
                RejectPlacement("Both teams need at least one unit.");
                return;
            }

            if (_countdownRoutine != null)
            {
                StopCoroutine(_countdownRoutine);
            }

            _countdownRoutine = StartCoroutine(BeginSimulationAfterCountdown());
        }

        public void ResetBattle()
        {
            if (!_isInitialized)
            {
                return;
            }

            if (_countdownRoutine != null)
            {
                StopCoroutine(_countdownRoutine);
                _countdownRoutine = null;
            }

            simulationSystem.EndSimulation();

            for (int i = _placedUnits.Count - 1; i >= 0; i--)
            {
                RuntimeUnit unit = _placedUnits[i];
                if (unit != null)
                {
                    simulationSystem.UnregisterUnit(unit);
                    Destroy(unit.gameObject);
                }
            }

            _placedUnits.Clear();

            _budgetSystem = new BudgetSystem(battleConfig.teamABudget, battleConfig.teamBBudget, battleConfig.maxUnitsPerTeam);
            gameStateMachine.SetState(GameState.Placement);
            EmitBudgetEvent();
        }

        private IEnumerator BeginSimulationAfterCountdown()
        {
            gameStateMachine.SetState(GameState.Countdown);
            yield return new WaitForSeconds(battleConfig.countdownSeconds);

            simulationSystem.BeginSimulation();
            gameStateMachine.SetState(GameState.Simulation);
            _countdownRoutine = null;
        }

        private void HandlePlacementInput()
        {
            bool handled = false;

#if ENABLE_INPUT_SYSTEM
            handled = HandlePlacementInputSystem();
#endif

            if (handled)
            {
                return;
            }

#if ENABLE_LEGACY_INPUT_MANAGER
            if (Input.touchCount > 0)
            {
                Touch touch = Input.GetTouch(0);
                if (touch.phase == TouchPhase.Ended)
                {
                    OnScreenTap(touch.position);
                }

                return;
            }

#if UNITY_EDITOR || UNITY_STANDALONE
            if (Input.GetMouseButtonDown(0))
            {
                OnScreenTap(Input.mousePosition);
            }

            if (Input.GetMouseButtonDown(1))
            {
                TryRemoveUnitAtScreenPoint(Input.mousePosition);
            }
#endif
#endif
        }

        private void OnScreenTap(Vector2 screenPoint)
        {
            if (string.IsNullOrWhiteSpace(_selectedUnitId))
            {
                TryRemoveUnitAtScreenPoint(screenPoint);
                return;
            }

            TryPlaceSelectedUnit(screenPoint);
        }

        private bool TryPlaceSelectedUnit(Vector2 screenPoint)
        {
            if (!_isInitialized)
            {
                return false;
            }

            if (!unitCatalog.TryGetUnit(_selectedUnitId, out UnitDefinition definition))
            {
                RejectPlacement("Selected unit is unavailable.");
                return false;
            }

            if (!_budgetSystem.CanAddUnit(activePlacementTeam, simulationSystem.GetLivingCount(activePlacementTeam)))
            {
                RejectPlacement("Team unit cap reached.");
                return false;
            }

            Ray ray = gameplayCamera.ScreenPointToRay(screenPoint);
            if (!mapDefinition.TryGetPlacementPoint(ray, out Vector3 worldPoint))
            {
                RejectPlacement("Unable to project placement point.");
                return false;
            }

            if (!_placementValidator.ValidatePlacement(activePlacementTeam, worldPoint, definition.CollisionRadius, _placedUnits, out string reason))
            {
                RejectPlacement(reason);
                return false;
            }

            if (!_budgetSystem.TrySpend(activePlacementTeam, definition.Cost))
            {
                RejectPlacement("Not enough budget.");
                return false;
            }

            RagdollProfileDefinition ragdollProfile = combatCatalog.GetRagdollProfile(definition.RagdollProfileId);
            RuntimeUnit newUnit = unitFactory.Spawn(definition, activePlacementTeam, worldPoint, Quaternion.identity, ragdollProfile);
            newUnit.name = $"{activePlacementTeam}_{definition.Id}";
            _placedUnits.Add(newUnit);
            simulationSystem.RegisterUnit(newUnit);

            EmitBudgetEvent();
            return true;
        }

        private bool TryRemoveUnitAtScreenPoint(Vector2 screenPoint)
        {
            if (!_isInitialized)
            {
                return false;
            }

            Ray ray = gameplayCamera.ScreenPointToRay(screenPoint);
            if (!Physics.Raycast(ray, out RaycastHit hit, 300f))
            {
                return false;
            }

            RuntimeUnit runtimeUnit = hit.collider.GetComponentInParent<RuntimeUnit>();
            if (runtimeUnit == null || runtimeUnit.IsDead || runtimeUnit.Team != activePlacementTeam)
            {
                return false;
            }

            RemoveUnit(runtimeUnit, refund: true);
            return true;
        }

        private void RemoveUnit(RuntimeUnit runtimeUnit, bool refund)
        {
            if (runtimeUnit == null)
            {
                return;
            }

            simulationSystem.UnregisterUnit(runtimeUnit);
            _placedUnits.Remove(runtimeUnit);

            if (refund)
            {
                _budgetSystem.Refund(runtimeUnit.Team, runtimeUnit.Definition.Cost);
                EmitBudgetEvent();
            }

            Destroy(runtimeUnit.gameObject);
        }

        private void HandleBattleResolved(BattleResult result)
        {
            BattleResolved?.Invoke(result);
        }

        private void HandleStateChanged(GameState _)
        {
            if (gameStateMachine.CurrentState == GameState.Result)
            {
                for (int i = _placedUnits.Count - 1; i >= 0; i--)
                {
                    RuntimeUnit unit = _placedUnits[i];
                    if (unit == null)
                    {
                        _placedUnits.RemoveAt(i);
                    }
                }
            }
        }

        private void EmitBudgetEvent()
        {
            BudgetsChanged?.Invoke(_budgetSystem.GetRemaining(TeamId.TeamA), _budgetSystem.GetRemaining(TeamId.TeamB));
        }

        private void RejectPlacement(string message)
        {
            PlacementRejected?.Invoke(message);
            Debug.LogWarning(message);
        }

        private void HandleDebugInput()
        {
#if ENABLE_INPUT_SYSTEM
            if (HandleDebugInputSystem())
            {
                return;
            }
#endif

#if ENABLE_LEGACY_INPUT_MANAGER
            if (Input.GetKeyDown(KeyCode.Space))
            {
                StartBattle();
            }

            if (Input.GetKeyDown(KeyCode.R))
            {
                ResetBattle();
            }

            if (Input.GetKeyDown(KeyCode.Tab))
            {
                SetActiveTeam(activePlacementTeam == TeamId.TeamA ? TeamId.TeamB : TeamId.TeamA);
            }

            if (Input.GetKeyDown(KeyCode.N))
            {
                SelectRelativeUnit(1);
            }
            else if (Input.GetKeyDown(KeyCode.B))
            {
                SelectRelativeUnit(-1);
            }
#endif
        }

#if ENABLE_INPUT_SYSTEM
        private bool HandlePlacementInputSystem()
        {
            Touchscreen touchScreen = Touchscreen.current;
            if (touchScreen != null)
            {
                bool hasActiveTouch = false;
                foreach (UnityEngine.InputSystem.Controls.TouchControl touch in touchScreen.touches)
                {
                    if (touch.press.isPressed)
                    {
                        hasActiveTouch = true;
                    }

                    if (touch.press.wasReleasedThisFrame)
                    {
                        OnScreenTap(touch.position.ReadValue());
                        return true;
                    }
                }

                if (hasActiveTouch)
                {
                    return true;
                }
            }

            Mouse mouse = Mouse.current;
            if (mouse == null)
            {
                return false;
            }

            if (mouse.leftButton.wasPressedThisFrame)
            {
                OnScreenTap(mouse.position.ReadValue());
                return true;
            }

            if (mouse.rightButton.wasPressedThisFrame)
            {
                TryRemoveUnitAtScreenPoint(mouse.position.ReadValue());
                return true;
            }

            return false;
        }

        private bool HandleDebugInputSystem()
        {
            Keyboard keyboard = Keyboard.current;
            if (keyboard == null)
            {
                return false;
            }

            if (keyboard.spaceKey.wasPressedThisFrame)
            {
                StartBattle();
                return true;
            }

            if (keyboard.rKey.wasPressedThisFrame)
            {
                ResetBattle();
                return true;
            }

            if (keyboard.tabKey.wasPressedThisFrame)
            {
                SetActiveTeam(activePlacementTeam == TeamId.TeamA ? TeamId.TeamB : TeamId.TeamA);
                return true;
            }

            if (keyboard.nKey.wasPressedThisFrame)
            {
                SelectRelativeUnit(1);
                return true;
            }

            if (keyboard.bKey.wasPressedThisFrame)
            {
                SelectRelativeUnit(-1);
                return true;
            }

            return false;
        }
#endif

        private void SelectRelativeUnit(int offset)
        {
            IReadOnlyList<UnitDefinition> roster = unitCatalog.GetAllUnits();
            if (roster == null || roster.Count == 0)
            {
                return;
            }

            if (_selectedRosterIndex < 0 || _selectedRosterIndex >= roster.Count)
            {
                _selectedRosterIndex = ResolveSelectedRosterIndex();
            }

            if (_selectedRosterIndex < 0)
            {
                _selectedRosterIndex = 0;
            }
            else
            {
                _selectedRosterIndex = (_selectedRosterIndex + offset + roster.Count) % roster.Count;
            }

            UnitDefinition target = roster[_selectedRosterIndex];
            SelectUnit(target.Id);
            Debug.Log($"Selected unit: {target.DisplayName} ({target.Id})");
        }

        private int ResolveSelectedRosterIndex()
        {
            IReadOnlyList<UnitDefinition> roster = unitCatalog.GetAllUnits();
            if (roster == null || roster.Count == 0)
            {
                return -1;
            }

            for (int i = 0; i < roster.Count; i++)
            {
                if (string.Equals(roster[i].Id, _selectedUnitId, StringComparison.OrdinalIgnoreCase))
                {
                    return i;
                }
            }

            return -1;
        }
    }
}
