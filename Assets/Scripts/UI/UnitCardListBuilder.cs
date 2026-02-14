using MOVBattle.Core;
using MOVBattle.Units;
using UnityEngine;
using UnityEngine.UI;

namespace MOVBattle.UI
{
    public sealed class UnitCardListBuilder : MonoBehaviour
    {
        [SerializeField] private BattleBootstrap battleBootstrap;
        [SerializeField] private Transform cardContainer;
        [SerializeField] private Button cardButtonPrefab;
        [SerializeField] private bool clearContainerBeforeBuild = true;

        private void Start()
        {
            Build();
        }

        [ContextMenu("Build Unit Cards")]
        public void Build()
        {
            if (battleBootstrap == null || cardContainer == null || cardButtonPrefab == null)
            {
                return;
            }

            if (clearContainerBeforeBuild)
            {
                for (int i = cardContainer.childCount - 1; i >= 0; i--)
                {
                    GameObject child = cardContainer.GetChild(i).gameObject;
                    if (Application.isPlaying)
                    {
                        Destroy(child);
                    }
                    else
                    {
                        DestroyImmediate(child);
                    }
                }
            }

            foreach (UnitDefinition unit in battleBootstrap.GetRoster())
            {
                Button button = Instantiate(cardButtonPrefab, cardContainer);
                string unitId = unit.Id;
                button.onClick.AddListener(() => battleBootstrap.SelectUnit(unitId));

                Text text = button.GetComponentInChildren<Text>();
                if (text != null)
                {
                    text.text = $"{unit.DisplayName} ({unit.Cost})";
                }
            }
        }
    }
}
