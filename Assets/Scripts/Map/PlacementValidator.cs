using System.Collections.Generic;
using MOVBattle.Core;
using MOVBattle.Units;
using UnityEngine;

namespace MOVBattle.Map
{
    public sealed class PlacementValidator
    {
        private readonly MapDefinition _mapDefinition;
        private readonly float _minimumSpacingPadding;

        public PlacementValidator(MapDefinition mapDefinition, float minimumSpacingPadding = 0.05f)
        {
            _mapDefinition = mapDefinition;
            _minimumSpacingPadding = Mathf.Max(0f, minimumSpacingPadding);
        }

        public bool ValidatePlacement(
            TeamId team,
            Vector3 point,
            float unitRadius,
            IReadOnlyList<RuntimeUnit> existingUnits,
            out string rejectionReason)
        {
            if (_mapDefinition == null)
            {
                rejectionReason = "Map definition is missing.";
                return false;
            }

            if (!_mapDefinition.IsInsideTeamZone(team, point))
            {
                rejectionReason = "Outside placement zone.";
                return false;
            }

            if (Physics.CheckSphere(point, unitRadius, _mapDefinition.UnitBlockingMask, QueryTriggerInteraction.Ignore))
            {
                rejectionReason = "Blocked by map obstacle.";
                return false;
            }

            if (existingUnits != null)
            {
                for (int i = 0; i < existingUnits.Count; i++)
                {
                    RuntimeUnit other = existingUnits[i];
                    if (other == null || other.IsDead)
                    {
                        continue;
                    }

                    float minimumDistance = unitRadius + other.Definition.CollisionRadius + _minimumSpacingPadding;
                    if (Vector3.SqrMagnitude(other.transform.position - point) < minimumDistance * minimumDistance)
                    {
                        rejectionReason = "Too close to another unit.";
                        return false;
                    }
                }
            }

            rejectionReason = string.Empty;
            return true;
        }
    }
}
