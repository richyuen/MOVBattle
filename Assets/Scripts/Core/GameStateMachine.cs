using System;
using UnityEngine;

namespace MOVBattle.Core
{
    public sealed class GameStateMachine : MonoBehaviour
    {
        [SerializeField] private GameState initialState = GameState.Placement;

        public GameState CurrentState { get; private set; }

        public event Action<GameState> StateChanged;

        private void Awake()
        {
            CurrentState = initialState;
        }

        public void SetState(GameState newState)
        {
            if (CurrentState == newState)
            {
                return;
            }

            CurrentState = newState;
            StateChanged?.Invoke(CurrentState);
        }
    }
}
