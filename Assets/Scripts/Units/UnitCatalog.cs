using System;
using System.Collections.Generic;
using System.Linq;
using MOVBattle.Combat;
using UnityEngine;

namespace MOVBattle.Units
{
    [CreateAssetMenu(menuName = "MOVBattle/Units/Unit Catalog", fileName = "UnitCatalog")]
    public sealed class UnitCatalog : ScriptableObject
    {
        [SerializeField] private bool includeStandardRoster = true;
        [SerializeField] private List<UnitDefinition> customUnits = new();

        private Dictionary<string, UnitDefinition> _index;
        private List<UnitDefinition> _orderedUnits;

        private void OnEnable()
        {
            Rebuild();
        }

        private void OnValidate()
        {
            Rebuild();
        }

        public IReadOnlyList<UnitDefinition> GetAllUnits()
        {
            EnsureBuilt();
            return _orderedUnits;
        }

        public IReadOnlyList<UnitDefinition> GetUnitsByFaction(FactionId faction)
        {
            EnsureBuilt();
            return _orderedUnits.Where(unit => unit.Faction == faction).ToList();
        }

        public bool TryGetUnit(string id, out UnitDefinition definition)
        {
            EnsureBuilt();
            return _index.TryGetValue(id, out definition);
        }

        public List<string> ValidateAgainstCombatCatalog(CombatCatalog combatCatalog)
        {
            EnsureBuilt();
            var errors = new List<string>();

            if (combatCatalog == null)
            {
                errors.Add("Combat catalog is null.");
                return errors;
            }

            foreach (UnitDefinition unit in _orderedUnits)
            {
                if (string.IsNullOrWhiteSpace(unit.Id))
                {
                    errors.Add("Unit entry has empty id.");
                    continue;
                }

                if (unit.Cost < 0)
                {
                    errors.Add($"Unit '{unit.Id}' has negative cost.");
                }

                if (unit.MaxHealth <= 0f)
                {
                    errors.Add($"Unit '{unit.Id}' has invalid health.");
                }

                if (!combatCatalog.HasAttackProfile(unit.AttackProfileId))
                {
                    errors.Add($"Unit '{unit.Id}' references missing attack profile '{unit.AttackProfileId}'.");
                }

                if (!combatCatalog.HasAIProfile(unit.AIProfileId))
                {
                    errors.Add($"Unit '{unit.Id}' references missing AI profile '{unit.AIProfileId}'.");
                }

                if (!combatCatalog.HasRagdollProfile(unit.RagdollProfileId))
                {
                    errors.Add($"Unit '{unit.Id}' references missing ragdoll profile '{unit.RagdollProfileId}'.");
                }
            }

            return errors;
        }

        private void EnsureBuilt()
        {
            if (_index == null || _orderedUnits == null)
            {
                Rebuild();
            }
        }

        private void Rebuild()
        {
            _index = new Dictionary<string, UnitDefinition>(StringComparer.OrdinalIgnoreCase);

            if (includeStandardRoster)
            {
                foreach (UnitDefinition unit in StandardRosterDefinitions.Create())
                {
                    if (unit == null || string.IsNullOrWhiteSpace(unit.Id))
                    {
                        continue;
                    }

                    ResolveVisualReferences(unit);
                    _index[unit.Id] = unit;
                }
            }

            foreach (UnitDefinition unit in customUnits)
            {
                if (unit == null || string.IsNullOrWhiteSpace(unit.Id))
                {
                    continue;
                }

                ResolveVisualReferences(unit);
                _index[unit.Id] = unit;
            }

            _orderedUnits = _index.Values
                .OrderBy(unit => unit.Faction)
                .ThenBy(unit => unit.Cost)
                .ThenBy(unit => unit.DisplayName)
                .ToList();
        }

        private static void ResolveVisualReferences(UnitDefinition unit)
        {
            if (unit.PrefabRef == null)
            {
                unit.PrefabRef = Resources.Load<GameObject>(UnitResourcePaths.UnitPrefabResourcePath(unit.Id));
            }

            if (unit.PrefabRef == null)
            {
                unit.PrefabRef = Resources.Load<GameObject>($"Units/Factions/{unit.Faction}");
            }
        }
    }
}
