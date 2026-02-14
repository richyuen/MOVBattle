using System.Collections;
using MOVBattle.Core;
using UnityEngine;
using UnityEngine.UI;

namespace MOVBattle.UI
{
    public sealed class PlacementHUDController : MonoBehaviour
    {
        [SerializeField] private BattleBootstrap battleBootstrap;
        [SerializeField] private Text teamABudgetText;
        [SerializeField] private Text teamBBudgetText;
        [SerializeField] private Text selectedUnitText;
        [SerializeField] private Text statusText;
        [SerializeField, Min(0.5f)] private float statusTextDuration = 2f;

        private Coroutine _statusCoroutine;

        private void OnEnable()
        {
            if (battleBootstrap == null)
            {
                return;
            }

            battleBootstrap.BudgetsChanged += HandleBudgetChanged;
            battleBootstrap.SelectedUnitChanged += HandleSelectedUnitChanged;
            battleBootstrap.PlacementRejected += ShowStatus;
            battleBootstrap.BattleResolved += HandleBattleResolved;
        }

        private void OnDisable()
        {
            if (battleBootstrap == null)
            {
                return;
            }

            battleBootstrap.BudgetsChanged -= HandleBudgetChanged;
            battleBootstrap.SelectedUnitChanged -= HandleSelectedUnitChanged;
            battleBootstrap.PlacementRejected -= ShowStatus;
            battleBootstrap.BattleResolved -= HandleBattleResolved;
        }

        public void SelectTeamA()
        {
            if (battleBootstrap == null)
            {
                return;
            }

            battleBootstrap.SetActiveTeam(TeamId.TeamA);
        }

        public void SelectTeamB()
        {
            if (battleBootstrap == null)
            {
                return;
            }

            battleBootstrap.SetActiveTeam(TeamId.TeamB);
        }

        public void SelectUnit(string unitId)
        {
            if (battleBootstrap == null)
            {
                return;
            }

            if (!battleBootstrap.SelectUnit(unitId))
            {
                ShowStatus("Unit not found in catalog.");
            }
        }

        public void EnableRemoveMode()
        {
            if (battleBootstrap == null)
            {
                return;
            }

            battleBootstrap.SelectUnit(string.Empty);
        }

        public void StartBattle()
        {
            if (battleBootstrap == null)
            {
                return;
            }

            battleBootstrap.StartBattle();
        }

        public void ResetBattle()
        {
            if (battleBootstrap == null)
            {
                return;
            }

            battleBootstrap.ResetBattle();
            ShowStatus("Battle reset.");
        }

        private void HandleBudgetChanged(int teamABudget, int teamBBudget)
        {
            if (teamABudgetText != null)
            {
                teamABudgetText.text = $"Team A Budget: {teamABudget}";
            }

            if (teamBBudgetText != null)
            {
                teamBBudgetText.text = $"Team B Budget: {teamBBudget}";
            }
        }

        private void HandleSelectedUnitChanged(string unitId)
        {
            if (selectedUnitText == null)
            {
                return;
            }

            selectedUnitText.text = string.IsNullOrWhiteSpace(unitId)
                ? "Selected Unit: Remove Mode"
                : $"Selected Unit: {unitId}";
        }

        private void HandleBattleResolved(BattleResult result)
        {
            string message = result.IsDraw
                ? "Draw"
                : $"Winner: {result.Winner}";
            ShowStatus(message);
        }

        private void ShowStatus(string message)
        {
            if (statusText == null)
            {
                return;
            }

            if (_statusCoroutine != null)
            {
                StopCoroutine(_statusCoroutine);
            }

            _statusCoroutine = StartCoroutine(ShowStatusRoutine(message));
        }

        private IEnumerator ShowStatusRoutine(string message)
        {
            statusText.text = message;
            statusText.enabled = true;
            yield return new WaitForSeconds(statusTextDuration);
            statusText.enabled = false;
            _statusCoroutine = null;
        }
    }
}
