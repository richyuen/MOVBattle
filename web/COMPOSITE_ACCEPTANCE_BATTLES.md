| Scenario | Executable id | Expected distinction |
| --- | --- | --- |
| Bank Robbers composition check | `composite_bank_robbers` | Text state should expose the safe and robber crew composition rather than a plain single ranged actor |
| Bomb Cannon crew check | `composite_bomb_cannon` | Text state should expose gunner and loader composition for the artillery body |
| Bomb Cannon operator-loss check | `operator_bomb_cannon_gunner_loss` | Killing the exposed gunner should disable firing while preserving the parent chassis and loader role, and `playAgain()` should restore the operator/capability state |
| Gatling Gun crew check | `composite_gatling_gun` | Text state should expose crank gunner and loader composition for the rapid-fire chassis |
| Gatling Gun operator-loss check | `operator_gatling_gun_crank_loss` | Killing the exposed crank gunner should disable firing while preserving the parent chassis and loader role, and `playAgain()` should restore the operator/capability state |
| Cavalry and Raptor Rider mount check | `composite_mounts` | Mounted units should expose rider and mount links rather than reading like single humanoid bodies |
| Wheelbarrow Dragon composition check | `composite_wheelbarrow_dragon` | The unit should expose cart, driver, and dragon-head composition while preserving charge/fire identity |
| Wheelbarrow Dragon origin check | `composite_wheelbarrow_dragon_origin` | The unit should report linked-role attack and impact origins from the dragon head instead of generic parent origins |
| CLAMS shell check | `composite_clams` | The unit should expose an anchored shell attachment that stays distinct from its summoned bomb divers |
