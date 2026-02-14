using MOVBattle.Combat;
using MOVBattle.Core;
using UnityEngine;
using UnityEngine.AI;

namespace MOVBattle.Units
{
    public sealed class UnitFactory : MonoBehaviour
    {
        [SerializeField] private Transform unitsRoot;
        [SerializeField] private Material teamAMaterial;
        [SerializeField] private Material teamBMaterial;

        public RuntimeUnit Spawn(UnitDefinition definition, TeamId team, Vector3 position, Quaternion rotation, RagdollProfileDefinition ragdollProfile)
        {
            GameObject unitObject;

            if (definition.PrefabRef != null)
            {
                unitObject = Instantiate(definition.PrefabRef, position, rotation, unitsRoot);
            }
            else
            {
                unitObject = CreateFallbackPrimitive(position, rotation);
            }

            if (unitObject.GetComponent<NavMeshAgent>() == null)
            {
                unitObject.AddComponent<NavMeshAgent>();
            }

            if (unitObject.GetComponent<Rigidbody>() == null)
            {
                Rigidbody body = unitObject.AddComponent<Rigidbody>();
                body.isKinematic = true;
            }

            RuntimeUnit runtimeUnit = unitObject.GetComponent<RuntimeUnit>();
            if (runtimeUnit == null)
            {
                runtimeUnit = unitObject.AddComponent<RuntimeUnit>();
            }

            ApplyTeamMaterial(unitObject, team);
            runtimeUnit.Initialize(definition, team, ragdollProfile);
            return runtimeUnit;
        }

        private GameObject CreateFallbackPrimitive(Vector3 position, Quaternion rotation)
        {
            GameObject primitive = GameObject.CreatePrimitive(PrimitiveType.Capsule);
            primitive.name = "Unit_Fallback";
            primitive.transform.SetPositionAndRotation(position, rotation);

            if (unitsRoot != null)
            {
                primitive.transform.SetParent(unitsRoot);
            }

            CapsuleCollider collider = primitive.GetComponent<CapsuleCollider>();
            collider.center = new Vector3(0f, 1f, 0f);
            collider.height = 2f;
            collider.radius = 0.4f;

            return primitive;
        }

        private void ApplyTeamMaterial(GameObject unitObject, TeamId team)
        {
            Material teamMaterial = team == TeamId.TeamA ? teamAMaterial : teamBMaterial;
            if (teamMaterial == null)
            {
                return;
            }

            foreach (Renderer renderer in unitObject.GetComponentsInChildren<Renderer>())
            {
                if (renderer == null)
                {
                    continue;
                }

                renderer.material = teamMaterial;
            }
        }
    }
}
