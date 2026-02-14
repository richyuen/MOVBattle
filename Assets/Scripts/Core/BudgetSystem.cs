using System;
using System.Collections.Generic;

namespace MOVBattle.Core
{
    public sealed class BudgetSystem
    {
        private readonly Dictionary<TeamId, int> _remainingByTeam;
        private readonly int _maxUnitsPerTeam;

        public BudgetSystem(int teamABudget, int teamBBudget, int maxUnitsPerTeam)
        {
            _remainingByTeam = new Dictionary<TeamId, int>
            {
                [TeamId.TeamA] = Math.Max(0, teamABudget),
                [TeamId.TeamB] = Math.Max(0, teamBBudget)
            };

            _maxUnitsPerTeam = Math.Max(1, maxUnitsPerTeam);
        }

        public int GetRemaining(TeamId team)
        {
            return _remainingByTeam[team];
        }

        public bool CanAfford(TeamId team, int cost)
        {
            if (cost < 0)
            {
                return false;
            }

            return _remainingByTeam[team] >= cost;
        }

        public bool CanAddUnit(TeamId team, int existingCount)
        {
            if (existingCount < 0)
            {
                return false;
            }

            return existingCount < _maxUnitsPerTeam;
        }

        public bool TrySpend(TeamId team, int cost)
        {
            if (!CanAfford(team, cost))
            {
                return false;
            }

            _remainingByTeam[team] -= cost;
            return true;
        }

        public void Refund(TeamId team, int amount)
        {
            if (amount <= 0)
            {
                return;
            }

            _remainingByTeam[team] += amount;
        }
    }
}
