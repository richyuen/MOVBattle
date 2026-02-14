using System;
using MOVBattle.Combat;
using UnityEngine;

namespace MOVBattle.Core
{
    public sealed class VictorySystem : MonoBehaviour
    {
        [SerializeField] private GameStateMachine gameStateMachine;
        [SerializeField] private SimulationSystem simulationSystem;
        [SerializeField, Min(0f)] private float battleTimeLimitSeconds;

        public event Action<BattleResult> BattleResolved;

        public void SetTimeLimit(float seconds)
        {
            battleTimeLimitSeconds = Mathf.Max(0f, seconds);
        }

        private void Update()
        {
            if (gameStateMachine == null || simulationSystem == null)
            {
                return;
            }

            if (gameStateMachine.CurrentState != GameState.Simulation || !simulationSystem.IsRunning)
            {
                return;
            }

            int teamALiving = simulationSystem.GetLivingCount(TeamId.TeamA);
            int teamBLiving = simulationSystem.GetLivingCount(TeamId.TeamB);

            bool timedOut = battleTimeLimitSeconds > 0f && simulationSystem.BattleDuration >= battleTimeLimitSeconds;
            bool battleDone = timedOut || teamALiving == 0 || teamBLiving == 0;
            if (!battleDone)
            {
                return;
            }

            TeamId winner = TeamId.TeamA;
            bool isDraw = false;

            if (teamALiving > teamBLiving)
            {
                winner = TeamId.TeamA;
            }
            else if (teamBLiving > teamALiving)
            {
                winner = TeamId.TeamB;
            }
            else
            {
                isDraw = true;
            }

            simulationSystem.EndSimulation();
            gameStateMachine.SetState(GameState.Result);
            BattleResolved?.Invoke(new BattleResult(winner, isDraw, simulationSystem.BattleDuration, teamALiving, teamBLiving));
        }
    }
}
