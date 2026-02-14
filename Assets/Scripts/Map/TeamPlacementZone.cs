using System;
using MOVBattle.Core;
using UnityEngine;

namespace MOVBattle.Map
{
    [Serializable]
    public struct TeamPlacementZone
    {
        public TeamId team;
        public Vector3 center;
        public Vector3 size;

        public bool Contains(Vector3 worldPoint)
        {
            Bounds bounds = new Bounds(center, size);
            return bounds.Contains(worldPoint);
        }
    }
}
