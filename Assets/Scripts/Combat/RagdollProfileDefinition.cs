using System;
using UnityEngine;

namespace MOVBattle.Combat
{
    [Serializable]
    public sealed class RagdollProfileDefinition
    {
        [SerializeField] private string id = "ragdoll.medium";
        [SerializeField, Min(0f)] private float impactMultiplier = 1f;
        [SerializeField, Min(0f)] private float deathImpulseMultiplier = 1.2f;
        [SerializeField, Min(0f)] private float cleanupDelaySeconds = 6f;

        public string Id
        {
            get => id;
            set => id = value;
        }

        public float ImpactMultiplier
        {
            get => impactMultiplier;
            set => impactMultiplier = Mathf.Max(0f, value);
        }

        public float DeathImpulseMultiplier
        {
            get => deathImpulseMultiplier;
            set => deathImpulseMultiplier = Mathf.Max(0f, value);
        }

        public float CleanupDelaySeconds
        {
            get => cleanupDelaySeconds;
            set => cleanupDelaySeconds = Mathf.Max(0f, value);
        }
    }
}
