using System;

namespace MOVBattle.Core
{
    [Serializable]
    public readonly struct BattleResult
    {
        public TeamId Winner { get; }
        public bool IsDraw { get; }
        public float DurationSeconds { get; }
        public int TeamALiving { get; }
        public int TeamBLiving { get; }

        public BattleResult(
            TeamId winner,
            bool isDraw,
            float durationSeconds,
            int teamALiving,
            int teamBLiving)
        {
            Winner = winner;
            IsDraw = isDraw;
            DurationSeconds = durationSeconds;
            TeamALiving = teamALiving;
            TeamBLiving = teamBLiving;
        }
    }
}
