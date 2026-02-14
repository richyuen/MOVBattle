using System.Collections.Generic;
using MOVBattle.Core;
using UnityEngine;

namespace MOVBattle.Map
{
    public sealed class AncientSandboxMapBuilder : MonoBehaviour
    {
        [SerializeField] private MapDefinition mapDefinition;
        [SerializeField] private bool generateOnStart = true;
        [SerializeField] private Material sandMaterial;
        [SerializeField] private Material stoneMaterial;
        [SerializeField] private Transform generatedRoot;

        private void Start()
        {
            if (generateOnStart)
            {
                Generate();
            }
        }

        [ContextMenu("Generate Ancient Sandbox Like Map")]
        public void Generate()
        {
            if (generatedRoot == null)
            {
                GameObject root = new GameObject("AncientSandboxLike_Generated");
                root.transform.SetParent(transform, false);
                generatedRoot = root.transform;
            }

            ClearRoot();
            CreateGround();
            CreateCenterRuins();
            CreateFlankElevations();
            ConfigurePlacementZones();
        }

        private void ClearRoot()
        {
            for (int i = generatedRoot.childCount - 1; i >= 0; i--)
            {
                Transform child = generatedRoot.GetChild(i);
                if (Application.isPlaying)
                {
                    Destroy(child.gameObject);
                }
                else
                {
                    DestroyImmediate(child.gameObject);
                }
            }
        }

        private void CreateGround()
        {
            GameObject ground = GameObject.CreatePrimitive(PrimitiveType.Plane);
            ground.name = "Ground";
            ground.transform.SetParent(generatedRoot, false);
            ground.transform.localScale = new Vector3(16f, 1f, 16f);

            if (sandMaterial != null)
            {
                Renderer renderer = ground.GetComponent<Renderer>();
                renderer.material = sandMaterial;
            }
        }

        private void CreateCenterRuins()
        {
            CreateRuinBlock(new Vector3(0f, 1.4f, 0f), new Vector3(14f, 2.8f, 8f), 0f);
            CreateRuinBlock(new Vector3(-12f, 1.1f, 6f), new Vector3(8f, 2.2f, 5f), 18f);
            CreateRuinBlock(new Vector3(12f, 1.1f, -6f), new Vector3(8f, 2.2f, 5f), -18f);

            for (int i = 0; i < 8; i++)
            {
                float angle = i * 45f;
                Vector3 pos = Quaternion.Euler(0f, angle, 0f) * new Vector3(18f, 1.8f, 0f);
                CreateColumn(pos, 0.8f, 3.6f);
            }
        }

        private void CreateFlankElevations()
        {
            CreateRuinBlock(new Vector3(-35f, 1.5f, 22f), new Vector3(12f, 3f, 20f), 0f);
            CreateRuinBlock(new Vector3(35f, 1.5f, -22f), new Vector3(12f, 3f, 20f), 0f);
            CreateRuinBlock(new Vector3(-35f, 0.7f, -20f), new Vector3(18f, 1.4f, 14f), 8f);
            CreateRuinBlock(new Vector3(35f, 0.7f, 20f), new Vector3(18f, 1.4f, 14f), -8f);
        }

        private void CreateRuinBlock(Vector3 localPos, Vector3 localScale, float yawDegrees)
        {
            GameObject block = GameObject.CreatePrimitive(PrimitiveType.Cube);
            block.name = "RuinBlock";
            block.transform.SetParent(generatedRoot, false);
            block.transform.localPosition = localPos;
            block.transform.localRotation = Quaternion.Euler(0f, yawDegrees, 0f);
            block.transform.localScale = localScale;

            if (stoneMaterial != null)
            {
                Renderer renderer = block.GetComponent<Renderer>();
                renderer.material = stoneMaterial;
            }
        }

        private void CreateColumn(Vector3 localPos, float radius, float height)
        {
            GameObject column = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
            column.name = "Column";
            column.transform.SetParent(generatedRoot, false);
            column.transform.localPosition = localPos;
            column.transform.localScale = new Vector3(radius, height * 0.5f, radius);

            if (stoneMaterial != null)
            {
                Renderer renderer = column.GetComponent<Renderer>();
                renderer.material = stoneMaterial;
            }
        }

        private void ConfigurePlacementZones()
        {
            if (mapDefinition == null)
            {
                return;
            }

            mapDefinition.SetTeamPlacementZones(new List<TeamPlacementZone>
            {
                new TeamPlacementZone
                {
                    team = TeamId.TeamA,
                    center = new Vector3(-52f, 0f, 0f),
                    size = new Vector3(42f, 18f, 72f)
                },
                new TeamPlacementZone
                {
                    team = TeamId.TeamB,
                    center = new Vector3(52f, 0f, 0f),
                    size = new Vector3(42f, 18f, 72f)
                }
            });
        }
    }
}
