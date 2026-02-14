using UnityEngine;

namespace MOVBattle.Core
{
    [CreateAssetMenu(menuName = "MOVBattle/Core/Battle Config", fileName = "BattleConfig")]
    public sealed class BattleConfig : ScriptableObject
    {
        [Min(100)] public int teamABudget = 5000;
        [Min(100)] public int teamBBudget = 5000;
        [Range(1, 300)] public int maxUnitsPerTeam = 100;
        [Range(0f, 10f)] public float countdownSeconds = 1.5f;
        [Min(0f)] public float optionalTimeLimitSeconds = 0f;
    }
}
