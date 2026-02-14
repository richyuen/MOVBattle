using System.Collections.Generic;
using MOVBattle.Combat;
using MOVBattle.Units;
using NUnit.Framework;
using UnityEngine;

namespace MOVBattle.Tests.EditMode
{
    public sealed class DataIntegrityTests
    {
        [Test]
        public void StandardRoster_IncludesExpectedCount_AndUniqueIds()
        {
            IReadOnlyList<UnitDefinition> units = StandardRosterDefinitions.Create();

            Assert.That(units.Count, Is.EqualTo(56), "Expected 56 standard units (8 factions x 7 units).");

            var ids = new HashSet<string>();
            foreach (UnitDefinition unit in units)
            {
                Assert.That(string.IsNullOrWhiteSpace(unit.Id), Is.False, "Unit id must not be empty.");
                Assert.That(ids.Add(unit.Id), Is.True, $"Duplicate unit id: {unit.Id}");
            }
        }

        [Test]
        public void CatalogValidation_HasNoMissingCombatProfiles()
        {
            CombatCatalog combatCatalog = ScriptableObject.CreateInstance<CombatCatalog>();
            UnitCatalog unitCatalog = ScriptableObject.CreateInstance<UnitCatalog>();

            List<string> errors = unitCatalog.ValidateAgainstCombatCatalog(combatCatalog);

            Assert.That(errors, Is.Empty, string.Join("\n", errors));
        }
    }
}
