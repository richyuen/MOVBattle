using System.Collections.Generic;
using MOVBattle.Core;
using UnityEngine;

namespace MOVBattle.Map
{
    [CreateAssetMenu(menuName = "MOVBattle/Map/Map Definition", fileName = "MapDefinition")]
    public sealed class MapDefinition : ScriptableObject
    {
        [SerializeField] private List<TeamPlacementZone> teamPlacementZones = new();
        [SerializeField] private LayerMask groundMask = 1;
        [SerializeField] private LayerMask unitBlockingMask = 0;
        [SerializeField, Min(1f)] private float maxRaycastDistance = 250f;
        [SerializeField] private Vector2 verticalBounds = new Vector2(-5f, 40f);

        public IReadOnlyList<TeamPlacementZone> TeamPlacementZones => teamPlacementZones;
        public LayerMask UnitBlockingMask => unitBlockingMask;

        public void SetTeamPlacementZones(List<TeamPlacementZone> zones)
        {
            teamPlacementZones = zones ?? new List<TeamPlacementZone>();
        }

        public void SetMasks(LayerMask ground, LayerMask blocking)
        {
            groundMask = ground;
            unitBlockingMask = blocking;
        }

        public bool TryGetPlacementPoint(Ray ray, out Vector3 point)
        {
            if (Physics.Raycast(ray, out RaycastHit hit, maxRaycastDistance, groundMask, QueryTriggerInteraction.Ignore))
            {
                point = hit.point;
                return IsWithinVerticalBounds(point.y);
            }

            Plane fallbackPlane = new Plane(Vector3.up, Vector3.zero);
            if (fallbackPlane.Raycast(ray, out float distance))
            {
                point = ray.GetPoint(distance);
                return IsWithinVerticalBounds(point.y);
            }

            point = default;
            return false;
        }

        public bool IsInsideTeamZone(TeamId team, Vector3 point)
        {
            for (int i = 0; i < teamPlacementZones.Count; i++)
            {
                TeamPlacementZone zone = teamPlacementZones[i];
                if (zone.team != team)
                {
                    continue;
                }

                if (zone.Contains(point))
                {
                    return true;
                }
            }

            return false;
        }

        private bool IsWithinVerticalBounds(float y)
        {
            return y >= verticalBounds.x && y <= verticalBounds.y;
        }
    }
}
