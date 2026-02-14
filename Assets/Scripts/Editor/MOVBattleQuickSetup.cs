using System.IO;
using MOVBattle.Combat;
using MOVBattle.Core;
using MOVBattle.Map;
using MOVBattle.UI;
using MOVBattle.Units;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.Rendering;
using UnityEngine.Rendering.Universal;
using UnityEngine.SceneManagement;

namespace MOVBattle.Editor
{
    public static class MOVBattleQuickSetup
    {
        private const string BattleConfigPath = "Assets/Data/Generated/BattleConfig.asset";
        private const string MapDefinitionPath = "Assets/Data/Generated/MapDefinition.asset";
        private const string CombatCatalogPath = "Assets/Data/Generated/CombatCatalog.asset";
        private const string UnitCatalogPath = "Assets/Data/Generated/UnitCatalog.asset";

        [MenuItem("MOVBattle/Quick Setup Active Scene")]
        public static void SetupActiveScene()
        {
            EnsureFolder("Assets/Data");
            EnsureFolder("Assets/Data/Generated");
            PlaceholderUnitPrefabGenerator.GenerateAll();

            BattleConfig battleConfig = GetOrCreateAsset<BattleConfig>(BattleConfigPath);
            MapDefinition mapDefinition = GetOrCreateAsset<MapDefinition>(MapDefinitionPath);
            CombatCatalog combatCatalog = GetOrCreateAsset<CombatCatalog>(CombatCatalogPath);
            UnitCatalog unitCatalog = GetOrCreateAsset<UnitCatalog>(UnitCatalogPath);

            GameObject systemsRoot = GetOrCreate("MOVBattleSystems");
            GameStateMachine gameStateMachine = systemsRoot.GetComponent<GameStateMachine>() ?? systemsRoot.AddComponent<GameStateMachine>();
            SimulationSystem simulationSystem = systemsRoot.GetComponent<SimulationSystem>() ?? systemsRoot.AddComponent<SimulationSystem>();
            VictorySystem victorySystem = systemsRoot.GetComponent<VictorySystem>() ?? systemsRoot.AddComponent<VictorySystem>();
            BattleBootstrap battleBootstrap = systemsRoot.GetComponent<BattleBootstrap>() ?? systemsRoot.AddComponent<BattleBootstrap>();

            GameObject mapRoot = GetOrCreate("MapRoot");
            AncientSandboxMapBuilder mapBuilder = mapRoot.GetComponent<AncientSandboxMapBuilder>() ?? mapRoot.AddComponent<AncientSandboxMapBuilder>();
            MapZoneGizmoDrawer zoneDrawer = mapRoot.GetComponent<MapZoneGizmoDrawer>() ?? mapRoot.AddComponent<MapZoneGizmoDrawer>();

            GameObject factoryObject = GetOrCreate("UnitFactory");
            UnitFactory unitFactory = factoryObject.GetComponent<UnitFactory>() ?? factoryObject.AddComponent<UnitFactory>();

            Camera mainCamera = Camera.main;
            if (mainCamera == null)
            {
                GameObject cameraObject = new GameObject("Main Camera");
                cameraObject.tag = "MainCamera";
                mainCamera = cameraObject.AddComponent<Camera>();
                cameraObject.AddComponent<AudioListener>();
            }

            ConfigureCamera(mainCamera);
            ConfigureRenderPipeline();
            EnsureDirectionalLight();

            TouchCameraController touchController = mainCamera.GetComponent<TouchCameraController>() ?? mainCamera.gameObject.AddComponent<TouchCameraController>();

            AssignSerializedField(simulationSystem, "combatCatalog", combatCatalog);
            AssignSerializedField(victorySystem, "gameStateMachine", gameStateMachine);
            AssignSerializedField(victorySystem, "simulationSystem", simulationSystem);

            AssignSerializedField(mapBuilder, "mapDefinition", mapDefinition);
            AssignSerializedField(zoneDrawer, "mapDefinition", mapDefinition);
            mapBuilder.Generate();

            AssignSerializedField(battleBootstrap, "battleConfig", battleConfig);
            AssignSerializedField(battleBootstrap, "mapDefinition", mapDefinition);
            AssignSerializedField(battleBootstrap, "unitCatalog", unitCatalog);
            AssignSerializedField(battleBootstrap, "combatCatalog", combatCatalog);
            AssignSerializedField(battleBootstrap, "gameStateMachine", gameStateMachine);
            AssignSerializedField(battleBootstrap, "simulationSystem", simulationSystem);
            AssignSerializedField(battleBootstrap, "victorySystem", victorySystem);
            AssignSerializedField(battleBootstrap, "unitFactory", unitFactory);
            AssignSerializedField(battleBootstrap, "gameplayCamera", mainCamera);

            EditorSceneManager.MarkSceneDirty(SceneManager.GetActiveScene());
            AssetDatabase.SaveAssets();
            Debug.Log("MOVBattle quick setup complete. Press Play, left-click to place, N/B to switch unit type, Space to start, R to reset.");
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

        private static T GetOrCreateAsset<T>(string assetPath) where T : ScriptableObject
        {
            T existing = AssetDatabase.LoadAssetAtPath<T>(assetPath);
            if (existing != null)
            {
                return existing;
            }

            T asset = ScriptableObject.CreateInstance<T>();
            AssetDatabase.CreateAsset(asset, assetPath);
            return asset;
        }

        private static GameObject GetOrCreate(string name)
        {
            GameObject existing = GameObject.Find(name);
            return existing != null ? existing : new GameObject(name);
        }

        private static void ConfigureCamera(Camera camera)
        {
            camera.orthographic = false;
            camera.fieldOfView = 60f;
            camera.transform.position = new Vector3(0f, 28f, -36f);
            camera.transform.rotation = Quaternion.Euler(35f, 0f, 0f);
            camera.clearFlags = CameraClearFlags.SolidColor;
            camera.backgroundColor = new Color(0.74f, 0.79f, 0.84f);
        }

        private static void ConfigureRenderPipeline()
        {
            UniversalRenderPipelineAsset urpAsset = AssetDatabase.LoadAssetAtPath<UniversalRenderPipelineAsset>("Assets/Settings/UniversalRP.asset");
            if (urpAsset == null)
            {
                GraphicsSettings.defaultRenderPipeline = null;
                QualitySettings.renderPipeline = null;
                return;
            }

            if (UsesOnly2DRenderers(urpAsset))
            {
                // The scaffold spawns 3D primitives; a 2D-only renderer makes them invisible.
                GraphicsSettings.defaultRenderPipeline = null;
                QualitySettings.renderPipeline = null;
                Debug.LogWarning("Detected 2D-only URP renderer. Switched to built-in pipeline for visible 3D map/units.");
                return;
            }

            GraphicsSettings.defaultRenderPipeline = urpAsset;
            QualitySettings.renderPipeline = urpAsset;
        }

        private static bool UsesOnly2DRenderers(UniversalRenderPipelineAsset urpAsset)
        {
            SerializedObject so = new SerializedObject(urpAsset);
            SerializedProperty rendererList = so.FindProperty("m_RendererDataList");
            if (rendererList == null || rendererList.arraySize == 0)
            {
                return false;
            }

            bool hasRenderer = false;
            bool all2D = true;

            for (int i = 0; i < rendererList.arraySize; i++)
            {
                SerializedProperty entry = rendererList.GetArrayElementAtIndex(i);
                Object rendererData = entry.objectReferenceValue;
                if (rendererData == null)
                {
                    continue;
                }

                hasRenderer = true;
                if (!rendererData.GetType().Name.Contains("Renderer2DData"))
                {
                    all2D = false;
                }
            }

            return hasRenderer && all2D;
        }

        private static void EnsureDirectionalLight()
        {
            Light[] lights = Object.FindObjectsOfType<Light>();
            for (int i = 0; i < lights.Length; i++)
            {
                if (lights[i] != null && lights[i].type == LightType.Directional)
                {
                    return;
                }
            }

            GameObject lightObject = new GameObject("Directional Light");
            Light light = lightObject.AddComponent<Light>();
            light.type = LightType.Directional;
            light.intensity = 1.15f;
            light.color = new Color(1f, 0.97f, 0.9f);
            lightObject.transform.rotation = Quaternion.Euler(50f, -30f, 0f);
        }

        private static void AssignSerializedField(Object target, string fieldName, Object value)
        {
            SerializedObject so = new SerializedObject(target);
            SerializedProperty property = so.FindProperty(fieldName);
            if (property == null)
            {
                return;
            }

            property.objectReferenceValue = value;
            so.ApplyModifiedPropertiesWithoutUndo();
        }
    }
}
