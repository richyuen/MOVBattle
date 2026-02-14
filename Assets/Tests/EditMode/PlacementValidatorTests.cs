using System.Collections.Generic;
using MOVBattle.Combat;
using MOVBattle.Core;
using MOVBattle.Map;
using MOVBattle.Units;
using NUnit.Framework;
using UnityEngine;

namespace MOVBattle.Tests.EditMode
{
    public sealed class PlacementValidatorTests
    {
        [Test]
        public void ValidatePlacement_RejectsOutsideZone_AndOverlap()
        {
            MapDefinition map = ScriptableObject.CreateInstance<MapDefinition>();
            map.SetTeamPlacementZones(new List<TeamPlacementZone>
            {
                new TeamPlacementZone
                {
                    team = TeamId.TeamA,
                    center = new Vector3(0f, 0f, 0f),
                    size = new Vector3(20f, 10f, 20f)
                },
                new TeamPlacementZone
                {
                    team = TeamId.TeamB,
                    center = new Vector3(30f, 0f, 0f),
                    size = new Vector3(20f, 10f, 20f)
                }
            });
            map.SetMasks(0, 0);

            var validator = new PlacementValidator(map);
            UnitDefinition definition = StandardRosterDefinitions.Create()[0];

            var existing = new List<RuntimeUnit>();
            GameObject go = new GameObject("Existing");
            RuntimeUnit existingUnit = go.AddComponent<RuntimeUnit>();
            existingUnit.Initialize(definition, TeamId.TeamA, new RagdollProfileDefinition());
            go.transform.position = Vector3.zero;
            existing.Add(existingUnit);

            bool outsideZone = validator.ValidatePlacement(TeamId.TeamA, new Vector3(30f, 0f, 0f), definition.CollisionRadius, existing, out _);
            bool overlap = validator.ValidatePlacement(TeamId.TeamA, new Vector3(0.2f, 0f, 0.2f), definition.CollisionRadius, existing, out _);
            bool valid = validator.ValidatePlacement(TeamId.TeamA, new Vector3(6f, 0f, 2f), definition.CollisionRadius, existing, out _);

            Assert.That(outsideZone, Is.False);
            Assert.That(overlap, Is.False);
            Assert.That(valid, Is.True);

            Object.DestroyImmediate(go);
            Object.DestroyImmediate(map);
        }
    }
}
