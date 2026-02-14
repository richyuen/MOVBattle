using System;
using System.Collections.Generic;
using UnityEngine;

namespace MOVBattle.Combat
{
    [CreateAssetMenu(menuName = "MOVBattle/Combat/Combat Catalog", fileName = "CombatCatalog")]
    public sealed class CombatCatalog : ScriptableObject
    {
        [SerializeField] private bool includeStandardProfiles = true;
        [SerializeField] private List<AttackProfileDefinition> attackProfiles = new();
        [SerializeField] private List<AIProfileDefinition> aiProfiles = new();
        [SerializeField] private List<RagdollProfileDefinition> ragdollProfiles = new();

        private Dictionary<string, AttackProfileDefinition> _attackIndex;
        private Dictionary<string, AIProfileDefinition> _aiIndex;
        private Dictionary<string, RagdollProfileDefinition> _ragdollIndex;

        private static readonly AttackProfileDefinition FallbackAttackProfile = new AttackProfileDefinition
        {
            Id = "fallback.attack",
            Type = AttackType.Melee,
            Damage = 20f,
            Cooldown = 1.2f,
            Windup = 0.15f,
            Knockback = 2f,
            SplashRadius = 0f
        };

        private static readonly AIProfileDefinition FallbackAIProfile = new AIProfileDefinition
        {
            Id = "fallback.ai",
            TargetPriority = TargetPriority.Nearest,
            RetargetInterval = 0.2f,
            Aggression = 1f,
            FormationBias = 0.15f,
            PrefersRangedDistance = false
        };

        private static readonly RagdollProfileDefinition FallbackRagdollProfile = new RagdollProfileDefinition
        {
            Id = "fallback.ragdoll",
            ImpactMultiplier = 1f,
            DeathImpulseMultiplier = 1f,
            CleanupDelaySeconds = 6f
        };

        private void OnEnable()
        {
            RebuildIndex();
        }

        private void OnValidate()
        {
            RebuildIndex();
        }

        public AttackProfileDefinition GetAttackProfile(string id)
        {
            EnsureBuilt();
            if (!string.IsNullOrWhiteSpace(id) && _attackIndex.TryGetValue(id, out AttackProfileDefinition profile))
            {
                return profile;
            }

            return FallbackAttackProfile;
        }

        public AIProfileDefinition GetAIProfile(string id)
        {
            EnsureBuilt();
            if (!string.IsNullOrWhiteSpace(id) && _aiIndex.TryGetValue(id, out AIProfileDefinition profile))
            {
                return profile;
            }

            return FallbackAIProfile;
        }

        public RagdollProfileDefinition GetRagdollProfile(string id)
        {
            EnsureBuilt();
            if (!string.IsNullOrWhiteSpace(id) && _ragdollIndex.TryGetValue(id, out RagdollProfileDefinition profile))
            {
                return profile;
            }

            return FallbackRagdollProfile;
        }

        public bool HasAttackProfile(string id)
        {
            EnsureBuilt();
            return !string.IsNullOrWhiteSpace(id) && _attackIndex.ContainsKey(id);
        }

        public bool HasAIProfile(string id)
        {
            EnsureBuilt();
            return !string.IsNullOrWhiteSpace(id) && _aiIndex.ContainsKey(id);
        }

        public bool HasRagdollProfile(string id)
        {
            EnsureBuilt();
            return !string.IsNullOrWhiteSpace(id) && _ragdollIndex.ContainsKey(id);
        }

        private void EnsureBuilt()
        {
            if (_attackIndex == null || _aiIndex == null || _ragdollIndex == null)
            {
                RebuildIndex();
            }
        }

        private void RebuildIndex()
        {
            _attackIndex = BuildAttackIndex();
            _aiIndex = BuildAIIndex();
            _ragdollIndex = BuildRagdollIndex();
        }

        private Dictionary<string, AttackProfileDefinition> BuildAttackIndex()
        {
            var index = new Dictionary<string, AttackProfileDefinition>(StringComparer.OrdinalIgnoreCase);

            if (includeStandardProfiles)
            {
                foreach (AttackProfileDefinition profile in StandardCombatProfiles.CreateAttackProfiles())
                {
                    index[profile.Id] = profile;
                }
            }

            foreach (AttackProfileDefinition profile in attackProfiles)
            {
                if (profile == null || string.IsNullOrWhiteSpace(profile.Id))
                {
                    continue;
                }

                index[profile.Id] = profile;
            }

            return index;
        }

        private Dictionary<string, AIProfileDefinition> BuildAIIndex()
        {
            var index = new Dictionary<string, AIProfileDefinition>(StringComparer.OrdinalIgnoreCase);

            if (includeStandardProfiles)
            {
                foreach (AIProfileDefinition profile in StandardCombatProfiles.CreateAIProfiles())
                {
                    index[profile.Id] = profile;
                }
            }

            foreach (AIProfileDefinition profile in aiProfiles)
            {
                if (profile == null || string.IsNullOrWhiteSpace(profile.Id))
                {
                    continue;
                }

                index[profile.Id] = profile;
            }

            return index;
        }

        private Dictionary<string, RagdollProfileDefinition> BuildRagdollIndex()
        {
            var index = new Dictionary<string, RagdollProfileDefinition>(StringComparer.OrdinalIgnoreCase);

            if (includeStandardProfiles)
            {
                foreach (RagdollProfileDefinition profile in StandardCombatProfiles.CreateRagdollProfiles())
                {
                    index[profile.Id] = profile;
                }
            }

            foreach (RagdollProfileDefinition profile in ragdollProfiles)
            {
                if (profile == null || string.IsNullOrWhiteSpace(profile.Id))
                {
                    continue;
                }

                index[profile.Id] = profile;
            }

            return index;
        }
    }
}
