using MOVBattle.Core;
using UnityEngine;
using UnityEngine.UI;

namespace MOVBattle.UI
{
    public sealed class ResultScreenController : MonoBehaviour
    {
        [SerializeField] private BattleBootstrap battleBootstrap;
        [SerializeField] private CanvasGroup canvasGroup;
        [SerializeField] private Text titleText;
        [SerializeField] private Text detailText;

        private void OnEnable()
        {
            HideImmediately();

            if (battleBootstrap != null)
            {
                battleBootstrap.BattleResolved += ShowResult;
            }
        }

        private void OnDisable()
        {
            if (battleBootstrap != null)
            {
                battleBootstrap.BattleResolved -= ShowResult;
            }
        }

        public void OnResetPressed()
        {
            HideImmediately();
            if (battleBootstrap != null)
            {
                battleBootstrap.ResetBattle();
            }
        }

        private void ShowResult(BattleResult result)
        {
            if (titleText != null)
            {
                titleText.text = result.IsDraw ? "Draw" : $"{result.Winner} Wins";
            }

            if (detailText != null)
            {
                detailText.text = $"Time: {result.DurationSeconds:0.0}s\nTeam A Remaining: {result.TeamALiving}\nTeam B Remaining: {result.TeamBLiving}";
            }

            SetVisible(true);
        }

        private void HideImmediately()
        {
            SetVisible(false);
        }

        private void SetVisible(bool visible)
        {
            if (canvasGroup == null)
            {
                return;
            }

            canvasGroup.alpha = visible ? 1f : 0f;
            canvasGroup.blocksRaycasts = visible;
            canvasGroup.interactable = visible;
        }
    }
}
