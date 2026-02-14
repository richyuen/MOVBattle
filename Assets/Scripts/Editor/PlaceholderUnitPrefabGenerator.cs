using System.IO;
using MOVBattle.Units;
using UnityEditor;
using UnityEngine;
using UnityEngine.AI;

namespace MOVBattle.Editor
{
    public static class PlaceholderUnitPrefabGenerator
    {
        private const string UnitsFolder = "Assets/Resources/Units";
        private const string FactionFolder = "Assets/Resources/Units/Factions";
        private const string MaterialFolder = "Assets/Art/Materials/Generated";

        [MenuItem("MOVBattle/Generate Placeholder Unit Prefabs")]
        public static void GenerateAll()
        {
            EnsureFolder("Assets/Resources");
            EnsureFolder("Assets/Resources/Units");
            EnsureFolder("Assets/Resources/Units/Factions");
            EnsureFolder("Assets/Art");
            EnsureFolder("Assets/Art/Materials");
            EnsureFolder("Assets/Art/Materials/Generated");

            foreach (FactionId faction in System.Enum.GetValues(typeof(FactionId)))
            {
                Material factionMaterial = GetOrCreateFactionMaterial(faction);
                GenerateFactionFallbackPrefab(faction, factionMaterial);
            }

            foreach (UnitDefinition unit in StandardRosterDefinitions.Create())
            {
                if (unit == null || string.IsNullOrWhiteSpace(unit.Id))
                {
                    continue;
                }

                Material factionMaterial = GetOrCreateFactionMaterial(unit.Faction);
                GenerateUnitPrefab(unit, factionMaterial);
            }

            AssetDatabase.SaveAssets();
            AssetDatabase.Refresh();
            Debug.Log("Generated placeholder prefabs for all standard MOVBattle units.");
        }

        private static void GenerateUnitPrefab(UnitDefinition unit, Material material)
        {
            string safeId = UnitResourcePaths.ToResourceSafeId(unit.Id);
            string prefabPath = $"{UnitsFolder}/{safeId}.prefab";
            GameObject root = BuildUnitVisual(unit.DisplayName, unit.MaxHealth, unit.Mass, material);
            PrefabUtility.SaveAsPrefabAsset(root, prefabPath);
            Object.DestroyImmediate(root);
        }

        private static void GenerateFactionFallbackPrefab(FactionId faction, Material material)
        {
            string prefabPath = $"{FactionFolder}/{faction}.prefab";
            GameObject root = BuildUnitVisual(faction.ToString(), 200f, 1.3f, material);
            root.name = $"Faction_{faction}";
            PrefabUtility.SaveAsPrefabAsset(root, prefabPath);
            Object.DestroyImmediate(root);
        }

        private static GameObject BuildUnitVisual(string name, float maxHealth, float mass, Material material)
        {
            float heightScale = Mathf.Clamp(0.75f + (maxHealth / 1100f), 0.8f, 2.1f);
            float widthScale = Mathf.Clamp(0.55f + (mass * 0.15f), 0.55f, 1.2f);

            GameObject root = GameObject.CreatePrimitive(PrimitiveType.Capsule);
            root.name = name;
            root.transform.localScale = new Vector3(widthScale, heightScale, widthScale);

            Rigidbody body = root.GetComponent<Rigidbody>();
            if (body == null)
            {
                body = root.AddComponent<Rigidbody>();
            }

            body.isKinematic = true;
            body.mass = Mathf.Max(0.5f, mass);

            if (root.GetComponent<NavMeshAgent>() == null)
            {
                root.AddComponent<NavMeshAgent>();
            }

            Renderer bodyRenderer = root.GetComponent<Renderer>();
            if (bodyRenderer != null && material != null)
            {
                bodyRenderer.sharedMaterial = material;
            }

            GameObject head = GameObject.CreatePrimitive(PrimitiveType.Sphere);
            head.name = "Head";
            head.transform.SetParent(root.transform, false);
            head.transform.localPosition = new Vector3(0f, 0.75f, 0f);
            head.transform.localScale = new Vector3(0.55f, 0.45f, 0.55f);
            Object.DestroyImmediate(head.GetComponent<Collider>());

            Renderer headRenderer = head.GetComponent<Renderer>();
            if (headRenderer != null && material != null)
            {
                headRenderer.sharedMaterial = material;
            }

            return root;
        }

        private static Material GetOrCreateFactionMaterial(FactionId faction)
        {
            string path = $"{MaterialFolder}/{faction}.mat";
            Material material = AssetDatabase.LoadAssetAtPath<Material>(path);
            if (material != null)
            {
                return material;
            }

            Shader shader = Shader.Find("Universal Render Pipeline/Lit");
            if (shader == null)
            {
                shader = Shader.Find("Standard");
            }

            material = new Material(shader)
            {
                color = GetFactionColor(faction)
            };
            AssetDatabase.CreateAsset(material, path);
            return material;
        }

        private static Color GetFactionColor(FactionId faction)
        {
            return faction switch
            {
                FactionId.Tribal => new Color(0.72f, 0.47f, 0.33f),
                FactionId.Farmer => new Color(0.69f, 0.62f, 0.35f),
                FactionId.Medieval => new Color(0.56f, 0.59f, 0.71f),
                FactionId.Ancient => new Color(0.86f, 0.79f, 0.54f),
                FactionId.Viking => new Color(0.6f, 0.72f, 0.78f),
                FactionId.Dynasty => new Color(0.78f, 0.42f, 0.37f),
                FactionId.Renaissance => new Color(0.42f, 0.56f, 0.73f),
                FactionId.Pirate => new Color(0.35f, 0.39f, 0.46f),
                _ => new Color(0.75f, 0.75f, 0.75f)
            };
        }

        private static void EnsureFolder(string folderPath)
        {
            if (AssetDatabase.IsValidFolder(folderPath))
            {
                return;
            }

            string parent = Path.GetDirectoryName(folderPath)?.Replace("\\", "/");
            string name = Path.GetFileName(folderPath);
            if (!string.IsNullOrEmpty(parent) && !string.IsNullOrEmpty(name))
            {
                EnsureFolder(parent);
                AssetDatabase.CreateFolder(parent, name);
            }
        }
    }
}
