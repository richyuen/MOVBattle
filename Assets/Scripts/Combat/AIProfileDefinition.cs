using System;
using UnityEngine;

namespace MOVBattle.Combat
{
    [Serializable]
    public sealed class AIProfileDefinition
    {
        [SerializeField] private string id = "ai.rush";
        [SerializeField] private TargetPriority targetPriority = TargetPriority.Nearest;
        [SerializeField, Min(0.05f)] private float retargetInterval = 0.2f;
        [SerializeField, Range(0f, 2f)] private float aggression = 1f;
        [SerializeField, Range(0f, 1f)] private float formationBias = 0.25f;
        [SerializeField] private bool prefersRangedDistance;

        public string Id
        {
            get => id;
            set => id = value;
        }

        public TargetPriority TargetPriority
        {
            get => targetPriority;
            set => targetPriority = value;
        }

        public float RetargetInterval
        {
            get => retargetInterval;
            set => retargetInterval = Mathf.Max(0.05f, value);
        }

        public float Aggression
        {
            get => aggression;
            set => aggression = Mathf.Clamp(value, 0f, 2f);
        }

        public float FormationBias
        {
            get => formationBias;
            set => formationBias = Mathf.Clamp01(value);
        }

        public bool PrefersRangedDistance
        {
            get => prefersRangedDistance;
            set => prefersRangedDistance = value;
        }
    }
}
