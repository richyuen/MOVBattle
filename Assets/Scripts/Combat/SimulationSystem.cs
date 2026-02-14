using System;
using System.Collections.Generic;
using MOVBattle.Core;
using MOVBattle.Units;
using UnityEngine;

namespace MOVBattle.Combat
{
    public sealed class SimulationSystem : MonoBehaviour
    {
        [SerializeField] private CombatCatalog combatCatalog;
        [SerializeField, Min(0.02f)] private float minimumDecisionInterval = 0.08f;
        [SerializeField, Min(0f)] private float attackRangePadding = 0.2f;
        [SerializeField, Min(0.2f)] private float cleanupSweepInterval = 0.75f;

        private readonly List<RuntimeUnit> _units = new();
        private readonly Dictionary<RuntimeUnit, float> _nextDecisionAt = new();

        private bool _isRunning;
        private float _battleStartedAt;
        private float _nextCleanupSweepAt;
        private float _lastBattleDuration;

        public bool IsRunning => _isRunning;
        public float BattleDuration => _isRunning ? Time.time - _battleStartedAt : _lastBattleDuration;
        public IReadOnlyList<RuntimeUnit> Units => _units;

        public void RegisterUnit(RuntimeUnit unit)
        {
            if (unit == null || _units.Contains(unit))
            {
                return;
            }

            _units.Add(unit);
            _nextDecisionAt[unit] = 0f;
        }

        public void UnregisterUnit(RuntimeUnit unit)
        {
            if (unit == null)
            {
                return;
            }

            _units.Remove(unit);
            _nextDecisionAt.Remove(unit);
        }

        public void BeginSimulation()
        {
            _isRunning = true;
            _battleStartedAt = Time.time;
            _nextCleanupSweepAt = Time.time + cleanupSweepInterval;
            _lastBattleDuration = 0f;
        }

        public void EndSimulation()
        {
            if (_isRunning)
            {
                _lastBattleDuration = Time.time - _battleStartedAt;
            }

            _isRunning = false;
            for (int i = 0; i < _units.Count; i++)
            {
                RuntimeUnit unit = _units[i];
                if (unit != null)
                {
                    unit.StopMoving();
                }
            }
        }

        private void Update()
        {
            if (!_isRunning || combatCatalog == null)
            {
                return;
            }

            float now = Time.time;

            for (int i = 0; i < _units.Count; i++)
            {
                RuntimeUnit unit = _units[i];
                if (unit == null || unit.IsDead)
                {
                    continue;
                }

                if (!_nextDecisionAt.TryGetValue(unit, out float nextDecision) || now < nextDecision)
                {
                    continue;
                }

                AIProfileDefinition aiProfile = combatCatalog.GetAIProfile(unit.Definition.AIProfileId);
                ProcessUnitDecision(unit, aiProfile, now);
                _nextDecisionAt[unit] = now + Mathf.Max(minimumDecisionInterval, aiProfile.RetargetInterval);
            }

            if (now >= _nextCleanupSweepAt)
            {
                CleanupExpiredCorpses(now);
                _nextCleanupSweepAt = now + cleanupSweepInterval;
            }
        }

        public int GetLivingCount(TeamId team)
        {
            int count = 0;
            for (int i = 0; i < _units.Count; i++)
            {
                RuntimeUnit unit = _units[i];
                if (unit != null && !unit.IsDead && unit.Team == team)
                {
                    count++;
                }
            }

            return count;
        }

        private void ProcessUnitDecision(RuntimeUnit unit, AIProfileDefinition aiProfile, float now)
        {
            AttackProfileDefinition attackProfile = combatCatalog.GetAttackProfile(unit.Definition.AttackProfileId);

            if (attackProfile.Type == AttackType.Support)
            {
                RuntimeUnit ally = SelectAllyToSupport(unit, aiProfile);
                if (ally == null)
                {
                    return;
                }

                HandleSupportAction(unit, ally, attackProfile, now);
                return;
            }

            RuntimeUnit enemy = SelectEnemyTarget(unit, aiProfile);
            if (enemy == null)
            {
                unit.StopMoving();
                return;
            }

            float engageDistance = unit.Definition.EngageRange + attackRangePadding;
            float distance = Vector3.Distance(unit.transform.position, enemy.transform.position);
            if (distance <= engageDistance)
            {
                unit.StopMoving();
                TryAttack(unit, enemy, attackProfile, now);
            }
            else
            {
                unit.MoveTo(enemy.transform.position);
            }
        }

        private void HandleSupportAction(RuntimeUnit supporter, RuntimeUnit ally, AttackProfileDefinition attackProfile, float now)
        {
            float engageDistance = supporter.Definition.EngageRange + attackRangePadding;
            float distance = Vector3.Distance(supporter.transform.position, ally.transform.position);
            if (distance > engageDistance)
            {
                supporter.MoveTo(ally.transform.position);
                return;
            }

            supporter.StopMoving();
            if (!supporter.CanAttack(now))
            {
                return;
            }

            supporter.SetAttackCooldown(now, attackProfile.Cooldown);
            float healAmount = Mathf.Max(20f, attackProfile.Damage);
            ally.Heal(healAmount);
        }

        private void TryAttack(RuntimeUnit attacker, RuntimeUnit target, AttackProfileDefinition attackProfile, float now)
        {
            if (!attacker.CanAttack(now))
            {
                return;
            }

            attacker.SetAttackCooldown(now, attackProfile.Cooldown);
            Vector3 impulseDirection = (target.transform.position - attacker.transform.position);
            if (impulseDirection.sqrMagnitude > 0.0001f)
            {
                impulseDirection.Normalize();
            }
            else
            {
                impulseDirection = Vector3.up;
            }

            if (attackProfile.SplashRadius > 0f)
            {
                ApplySplashDamage(target.transform.position, attackProfile.SplashRadius, attacker.Team, attackProfile.Damage, impulseDirection * attackProfile.Knockback);
                return;
            }

            target.ApplyDamage(attackProfile.Damage, impulseDirection * attackProfile.Knockback);
        }

        private void ApplySplashDamage(Vector3 center, float radius, TeamId attackerTeam, float damage, Vector3 impulse)
        {
            float radiusSq = radius * radius;
            for (int i = 0; i < _units.Count; i++)
            {
                RuntimeUnit unit = _units[i];
                if (unit == null || unit.IsDead || unit.Team == attackerTeam)
                {
                    continue;
                }

                if ((unit.transform.position - center).sqrMagnitude > radiusSq)
                {
                    continue;
                }

                unit.ApplyDamage(damage, impulse);
            }
        }

        private RuntimeUnit SelectEnemyTarget(RuntimeUnit requester, AIProfileDefinition aiProfile)
        {
            RuntimeUnit best = null;
            float bestScore = float.PositiveInfinity;

            for (int i = 0; i < _units.Count; i++)
            {
                RuntimeUnit candidate = _units[i];
                if (candidate == null || candidate.IsDead || candidate.Team == requester.Team)
                {
                    continue;
                }

                float candidateScore = ScoreCandidate(requester, candidate, aiProfile.TargetPriority);
                if (candidateScore < bestScore)
                {
                    bestScore = candidateScore;
                    best = candidate;
                }
            }

            return best;
        }

        private RuntimeUnit SelectAllyToSupport(RuntimeUnit requester, AIProfileDefinition aiProfile)
        {
            RuntimeUnit best = null;
            float bestScore = float.PositiveInfinity;

            for (int i = 0; i < _units.Count; i++)
            {
                RuntimeUnit candidate = _units[i];
                if (candidate == null || candidate.IsDead || candidate.Team != requester.Team || candidate == requester)
                {
                    continue;
                }

                if (candidate.CurrentHealth >= candidate.Definition.MaxHealth)
                {
                    continue;
                }

                float candidateScore = ScoreCandidate(requester, candidate, aiProfile.TargetPriority);
                if (candidateScore < bestScore)
                {
                    bestScore = candidateScore;
                    best = candidate;
                }
            }

            return best;
        }

        private static float ScoreCandidate(RuntimeUnit requester, RuntimeUnit candidate, TargetPriority priority)
        {
            switch (priority)
            {
                case TargetPriority.LowestHealth:
                    return candidate.CurrentHealth;
                case TargetPriority.HighestCost:
                    return -candidate.Definition.Cost;
                default:
                    return Vector3.SqrMagnitude(candidate.transform.position - requester.transform.position);
            }
        }

        private void CleanupExpiredCorpses(float now)
        {
            for (int i = _units.Count - 1; i >= 0; i--)
            {
                RuntimeUnit unit = _units[i];
                if (unit == null)
                {
                    _units.RemoveAt(i);
                    continue;
                }

                if (!unit.IsDead || now < unit.DeathCleanupAtTime)
                {
                    continue;
                }

                _nextDecisionAt.Remove(unit);
                _units.RemoveAt(i);
                Destroy(unit.gameObject);
            }
        }
    }
}
