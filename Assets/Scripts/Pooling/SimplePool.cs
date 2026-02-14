using System.Collections.Generic;
using UnityEngine;

namespace MOVBattle.Pooling
{
    public sealed class SimplePool : MonoBehaviour
    {
        [SerializeField] private GameObject prefab;
        [SerializeField, Min(0)] private int prewarmCount = 16;

        private readonly Queue<GameObject> _pool = new();

        private void Awake()
        {
            Prewarm();
        }

        public GameObject Get(Vector3 position, Quaternion rotation)
        {
            GameObject instance = _pool.Count > 0 ? _pool.Dequeue() : CreateInstance();
            instance.transform.SetPositionAndRotation(position, rotation);
            instance.SetActive(true);
            return instance;
        }

        public void Return(GameObject instance)
        {
            if (instance == null)
            {
                return;
            }

            instance.SetActive(false);
            instance.transform.SetParent(transform);
            _pool.Enqueue(instance);
        }

        private void Prewarm()
        {
            for (int i = 0; i < prewarmCount; i++)
            {
                GameObject instance = CreateInstance();
                instance.SetActive(false);
                _pool.Enqueue(instance);
            }
        }

        private GameObject CreateInstance()
        {
            if (prefab == null)
            {
                GameObject placeholder = new GameObject("PoolPlaceholder");
                placeholder.transform.SetParent(transform);
                return placeholder;
            }

            return Instantiate(prefab, transform);
        }
    }
}
