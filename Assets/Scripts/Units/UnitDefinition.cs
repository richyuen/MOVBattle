using System;
using UnityEngine;

namespace MOVBattle.Units
{
    [Serializable]
    public sealed class UnitDefinition
    {
        [SerializeField] private string id = "unit.placeholder";
        [SerializeField] private string displayName = "Placeholder";
        [SerializeField] private FactionId faction = FactionId.Tribal;
        [SerializeField, Min(0)] private int cost = 100;
        [SerializeField, Min(1f)] private float maxHealth = 100f;
        [SerializeField, Min(0.1f)] private float mass = 1f;
        [SerializeField, Min(0.1f)] private float moveSpeed = 3f;
        [SerializeField, Min(0.1f)] private float engageRange = 1.5f;
        [SerializeField, Min(0.1f)] private float collisionRadius = 0.45f;
        [SerializeField] private string attackProfileId = "melee.light";
        [SerializeField] private string aiProfileId = "ai.rush";
        [SerializeField] private string ragdollProfileId = "ragdoll.medium";
        [SerializeField] private GameObject prefabRef;
        [SerializeField] private Sprite iconRef;
        [SerializeField] private AudioClip spawnAudio;

        public string Id
        {
            get => id;
            set => id = value;
        }

        public string DisplayName
        {
            get => displayName;
            set => displayName = value;
        }

        public FactionId Faction
        {
            get => faction;
            set => faction = value;
        }

        public int Cost
        {
            get => cost;
            set => cost = Mathf.Max(0, value);
        }

        public float MaxHealth
        {
            get => maxHealth;
            set => maxHealth = Mathf.Max(1f, value);
        }

        public float Mass
        {
            get => mass;
            set => mass = Mathf.Max(0.1f, value);
        }

        public float MoveSpeed
        {
            get => moveSpeed;
            set => moveSpeed = Mathf.Max(0.1f, value);
        }

        public float EngageRange
        {
            get => engageRange;
            set => engageRange = Mathf.Max(0.1f, value);
        }

        public float CollisionRadius
        {
            get => collisionRadius;
            set => collisionRadius = Mathf.Max(0.1f, value);
        }

        public string AttackProfileId
        {
            get => attackProfileId;
            set => attackProfileId = value;
        }

        public string AIProfileId
        {
            get => aiProfileId;
            set => aiProfileId = value;
        }

        public string RagdollProfileId
        {
            get => ragdollProfileId;
            set => ragdollProfileId = value;
        }

        public GameObject PrefabRef
        {
            get => prefabRef;
            set => prefabRef = value;
        }

        public Sprite IconRef
        {
            get => iconRef;
            set => iconRef = value;
        }

        public AudioClip SpawnAudio
        {
            get => spawnAudio;
            set => spawnAudio = value;
        }
    }
}
