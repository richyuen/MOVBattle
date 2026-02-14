using MOVBattle.Core;
using UnityEngine;

namespace MOVBattle.Map
{
    public sealed class MapZoneGizmoDrawer : MonoBehaviour
    {
        [SerializeField] private MapDefinition mapDefinition;

        private void OnDrawGizmosSelected()
        {
            if (mapDefinition == null)
            {
                return;
            }

            foreach (TeamPlacementZone zone in mapDefinition.TeamPlacementZones)
            {
                Gizmos.color = zone.team == TeamId.TeamA
                    ? new Color(0.2f, 0.7f, 1f, 0.35f)
                    : new Color(1f, 0.35f, 0.35f, 0.35f);
                Gizmos.DrawCube(zone.center, zone.size);
                Gizmos.color = zone.team == TeamId.TeamA ? Color.cyan : Color.red;
                Gizmos.DrawWireCube(zone.center, zone.size);
            }
        }
    }
}
