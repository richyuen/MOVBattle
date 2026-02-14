using System;
using UnityEngine;

namespace MOVBattle.Combat
{
    [Serializable]
    public sealed class AttackProfileDefinition
    {
        [SerializeField] private string id = "melee.light";
        [SerializeField] private AttackType type = AttackType.Melee;
        [SerializeField, Min(0f)] private float damage = 25f;
        [SerializeField, Min(0.05f)] private float cooldown = 1.2f;
        [SerializeField, Min(0f)] private float windup = 0.2f;
        [SerializeField, Min(0f)] private float knockback = 2f;
        [SerializeField, Min(0f)] private float splashRadius = 0f;
        [SerializeField] private string projectileId = string.Empty;

        public string Id
        {
            get => id;
            set => id = value;
        }

        public AttackType Type
        {
            get => type;
            set => type = value;
        }

        public float Damage
        {
            get => damage;
            set => damage = Mathf.Max(0f, value);
        }

        public float Cooldown
        {
            get => cooldown;
            set => cooldown = Mathf.Max(0.05f, value);
        }

        public float Windup
        {
            get => windup;
            set => windup = Mathf.Max(0f, value);
        }

        public float Knockback
        {
            get => knockback;
            set => knockback = Mathf.Max(0f, value);
        }

        public float SplashRadius
        {
            get => splashRadius;
            set => splashRadius = Mathf.Max(0f, value);
        }

        public string ProjectileId
        {
            get => projectileId;
            set => projectileId = value;
        }
    }
}
