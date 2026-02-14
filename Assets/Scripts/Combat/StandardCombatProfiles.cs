using System.Collections.Generic;

namespace MOVBattle.Combat
{
    public static class StandardCombatProfiles
    {
        public static IReadOnlyList<AttackProfileDefinition> CreateAttackProfiles()
        {
            return new List<AttackProfileDefinition>
            {
                new AttackProfileDefinition { Id = "melee.light", Type = AttackType.Melee, Damage = 22f, Cooldown = 1.0f, Windup = 0.15f, Knockback = 2.5f, SplashRadius = 0f },
                new AttackProfileDefinition { Id = "melee.medium", Type = AttackType.Melee, Damage = 35f, Cooldown = 1.3f, Windup = 0.2f, Knockback = 4f, SplashRadius = 0f },
                new AttackProfileDefinition { Id = "melee.heavy", Type = AttackType.Melee, Damage = 55f, Cooldown = 1.8f, Windup = 0.3f, Knockback = 6f, SplashRadius = 0.5f },
                new AttackProfileDefinition { Id = "ranged.light", Type = AttackType.Ranged, Damage = 24f, Cooldown = 1.1f, Windup = 0.2f, Knockback = 1.5f, SplashRadius = 0f, ProjectileId = "projectile.arrow" },
                new AttackProfileDefinition { Id = "ranged.heavy", Type = AttackType.Ranged, Damage = 45f, Cooldown = 1.8f, Windup = 0.35f, Knockback = 3.5f, SplashRadius = 0f, ProjectileId = "projectile.bolt" },
                new AttackProfileDefinition { Id = "throw.explosive", Type = AttackType.Siege, Damage = 60f, Cooldown = 2.2f, Windup = 0.45f, Knockback = 7f, SplashRadius = 2.2f, ProjectileId = "projectile.bomb" },
                new AttackProfileDefinition { Id = "siege.catapult", Type = AttackType.Siege, Damage = 85f, Cooldown = 3.0f, Windup = 0.6f, Knockback = 9f, SplashRadius = 3f, ProjectileId = "projectile.stone" },
                new AttackProfileDefinition { Id = "support.heal", Type = AttackType.Support, Damage = 0f, Cooldown = 2.0f, Windup = 0.2f, Knockback = 0f, SplashRadius = 0f },
                new AttackProfileDefinition { Id = "boss.legendary", Type = AttackType.Melee, Damage = 95f, Cooldown = 2.3f, Windup = 0.5f, Knockback = 11f, SplashRadius = 2f }
            };
        }

        public static IReadOnlyList<AIProfileDefinition> CreateAIProfiles()
        {
            return new List<AIProfileDefinition>
            {
                new AIProfileDefinition { Id = "ai.rush", TargetPriority = TargetPriority.Nearest, RetargetInterval = 0.2f, Aggression = 1.1f, FormationBias = 0.1f, PrefersRangedDistance = false },
                new AIProfileDefinition { Id = "ai.brace", TargetPriority = TargetPriority.Nearest, RetargetInterval = 0.25f, Aggression = 0.9f, FormationBias = 0.55f, PrefersRangedDistance = false },
                new AIProfileDefinition { Id = "ai.ranged", TargetPriority = TargetPriority.LowestHealth, RetargetInterval = 0.18f, Aggression = 1f, FormationBias = 0.2f, PrefersRangedDistance = true },
                new AIProfileDefinition { Id = "ai.boss", TargetPriority = TargetPriority.HighestCost, RetargetInterval = 0.15f, Aggression = 1.4f, FormationBias = 0f, PrefersRangedDistance = false },
                new AIProfileDefinition { Id = "ai.support", TargetPriority = TargetPriority.LowestHealth, RetargetInterval = 0.2f, Aggression = 0.7f, FormationBias = 0.35f, PrefersRangedDistance = true }
            };
        }

        public static IReadOnlyList<RagdollProfileDefinition> CreateRagdollProfiles()
        {
            return new List<RagdollProfileDefinition>
            {
                new RagdollProfileDefinition { Id = "ragdoll.light", ImpactMultiplier = 1.2f, DeathImpulseMultiplier = 1.4f, CleanupDelaySeconds = 5f },
                new RagdollProfileDefinition { Id = "ragdoll.medium", ImpactMultiplier = 1f, DeathImpulseMultiplier = 1.2f, CleanupDelaySeconds = 6f },
                new RagdollProfileDefinition { Id = "ragdoll.heavy", ImpactMultiplier = 0.7f, DeathImpulseMultiplier = 0.9f, CleanupDelaySeconds = 7f },
                new RagdollProfileDefinition { Id = "ragdoll.boss", ImpactMultiplier = 0.45f, DeathImpulseMultiplier = 0.7f, CleanupDelaySeconds = 8f }
            };
        }
    }
}
