using System;
using MOVBattle.Combat;
using MOVBattle.Core;
using UnityEngine;
using UnityEngine.AI;

namespace MOVBattle.Units
{
    public sealed class RuntimeUnit : MonoBehaviour
    {
        [SerializeField] private NavMeshAgent navMeshAgent;
        [SerializeField] private Animator animator;
        [SerializeField] private Rigidbody rootBody;

        private Rigidbody[] _ragdollBodies;
        private Collider[] _ragdollColliders;
        private RagdollProfileDefinition _ragdollProfile;
        private float _nextAttackAt;
        private Vector3 _fallbackDestination;
        private bool _hasFallbackDestination;

        public UnitDefinition Definition { get; private set; }
        public TeamId Team { get; private set; }
        public float CurrentHealth { get; private set; }
        public bool IsDead { get; private set; }
        public float DeathCleanupAtTime { get; private set; }

        public event Action<RuntimeUnit> Died;

        private void Awake()
        {
            if (navMeshAgent == null)
            {
                navMeshAgent = GetComponent<NavMeshAgent>();
            }

            if (animator == null)
            {
                animator = GetComponentInChildren<Animator>();
            }

            if (rootBody == null)
            {
                rootBody = GetComponent<Rigidbody>();
            }

            _ragdollBodies = GetComponentsInChildren<Rigidbody>(true);
            _ragdollColliders = GetComponentsInChildren<Collider>(true);
        }

        public void Initialize(UnitDefinition definition, TeamId team, RagdollProfileDefinition ragdollProfile)
        {
            Definition = definition;
            Team = team;
            _ragdollProfile = ragdollProfile ?? new RagdollProfileDefinition();
            CurrentHealth = definition.MaxHealth;
            IsDead = false;
            DeathCleanupAtTime = float.PositiveInfinity;
            _nextAttackAt = 0f;
            _hasFallbackDestination = false;

            if (navMeshAgent != null)
            {
                navMeshAgent.speed = definition.MoveSpeed;
                navMeshAgent.angularSpeed = 600f;
                navMeshAgent.acceleration = 16f;
                navMeshAgent.stoppingDistance = Mathf.Max(0.05f, definition.CollisionRadius * 0.5f);
                navMeshAgent.enabled = true;
            }

            if (rootBody != null)
            {
                rootBody.mass = definition.Mass;
                rootBody.isKinematic = true;
            }

            SetRagdollActive(false);
        }

        public bool CanAttack(float now)
        {
            return !IsDead && now >= _nextAttackAt;
        }

        public void SetAttackCooldown(float now, float cooldown)
        {
            _nextAttackAt = now + Mathf.Max(0.05f, cooldown);
        }

        public void MoveTo(Vector3 target)
        {
            if (IsDead || Definition == null)
            {
                return;
            }

            if (navMeshAgent != null && navMeshAgent.enabled && navMeshAgent.isOnNavMesh)
            {
                navMeshAgent.SetDestination(target);
                _hasFallbackDestination = false;
                return;
            }

            _fallbackDestination = target;
            _hasFallbackDestination = true;
        }

        public void StopMoving()
        {
            _hasFallbackDestination = false;

            if (navMeshAgent == null || !navMeshAgent.enabled)
            {
                return;
            }

            navMeshAgent.ResetPath();
        }

        public void ApplyDamage(float damage, Vector3 impulse)
        {
            if (IsDead || damage <= 0f)
            {
                return;
            }

            CurrentHealth -= damage;
            ApplyImpact(impulse);

            if (CurrentHealth <= 0f)
            {
                Die(impulse);
            }
        }

        public void Heal(float amount)
        {
            if (IsDead || amount <= 0f)
            {
                return;
            }

            CurrentHealth = Mathf.Min(Definition.MaxHealth, CurrentHealth + amount);
        }

        private void Die(Vector3 impulse)
        {
            IsDead = true;
            CurrentHealth = 0f;

            if (navMeshAgent != null)
            {
                navMeshAgent.enabled = false;
            }

            if (animator != null)
            {
                animator.enabled = false;
            }

            SetRagdollActive(true);
            ApplyImpact(impulse * _ragdollProfile.DeathImpulseMultiplier);
            DeathCleanupAtTime = Time.time + _ragdollProfile.CleanupDelaySeconds;
            Died?.Invoke(this);
        }

        private void ApplyImpact(Vector3 impulse)
        {
            if (impulse.sqrMagnitude <= 0f)
            {
                return;
            }

            float multiplier = _ragdollProfile != null ? _ragdollProfile.ImpactMultiplier : 1f;
            Vector3 scaledImpulse = impulse * multiplier;

            if (!IsDead && rootBody != null && !rootBody.isKinematic)
            {
                rootBody.AddForce(scaledImpulse, ForceMode.Impulse);
            }

            if (IsDead && _ragdollBodies != null)
            {
                foreach (Rigidbody body in _ragdollBodies)
                {
                    if (body == null || body.isKinematic)
                    {
                        continue;
                    }

                    body.AddForce(scaledImpulse, ForceMode.Impulse);
                }
            }
        }

        private void Update()
        {
            if (IsDead || !_hasFallbackDestination || Definition == null)
            {
                return;
            }

            Vector3 offset = _fallbackDestination - transform.position;
            offset.y = 0f;
            if (offset.sqrMagnitude <= 0.01f)
            {
                _hasFallbackDestination = false;
                return;
            }

            Vector3 direction = offset.normalized;
            transform.position += direction * (Definition.MoveSpeed * Time.deltaTime);
            transform.forward = Vector3.Slerp(transform.forward, direction, Time.deltaTime * 8f);
        }

        private void SetRagdollActive(bool enabled)
        {
            if (_ragdollBodies != null)
            {
                foreach (Rigidbody body in _ragdollBodies)
                {
                    if (body == null || body == rootBody)
                    {
                        continue;
                    }

                    body.isKinematic = !enabled;
                }
            }

            if (_ragdollColliders != null)
            {
                foreach (Collider bodyCollider in _ragdollColliders)
                {
                    if (bodyCollider == null)
                    {
                        continue;
                    }

                    if (bodyCollider.gameObject == gameObject)
                    {
                        continue;
                    }

                    bodyCollider.enabled = enabled;
                }
            }

            if (rootBody != null)
            {
                rootBody.isKinematic = !enabled;
            }
        }
    }
}
