using MOVBattle.Core;
using NUnit.Framework;

namespace MOVBattle.Tests.EditMode
{
    public sealed class BudgetSystemTests
    {
        [Test]
        public void TrySpend_And_Refund_AdjustRemainingBudget()
        {
            var budget = new BudgetSystem(1000, 800, 10);

            bool spent = budget.TrySpend(TeamId.TeamA, 300);
            Assert.That(spent, Is.True);
            Assert.That(budget.GetRemaining(TeamId.TeamA), Is.EqualTo(700));

            budget.Refund(TeamId.TeamA, 120);
            Assert.That(budget.GetRemaining(TeamId.TeamA), Is.EqualTo(820));
        }

        [Test]
        public void TrySpend_Fails_WhenInsufficientBudget()
        {
            var budget = new BudgetSystem(200, 200, 5);

            bool spent = budget.TrySpend(TeamId.TeamB, 300);

            Assert.That(spent, Is.False);
            Assert.That(budget.GetRemaining(TeamId.TeamB), Is.EqualTo(200));
        }
    }
}
