| Scenario | Executable id | Expected distinction |
| --- | --- | --- |
| Bank Robbers composition check | `composite_bank_robbers` | Text state should expose the safe and robber crew composition rather than a plain single ranged actor |
| Bomb Cannon crew check | `composite_bomb_cannon` | Text state should expose gunner and loader composition for the artillery body |
| Gatling Gun crew check | `composite_gatling_gun` | Text state should expose crank gunner and loader composition for the rapid-fire chassis |
| Cavalry and Raptor Rider mount check | `composite_mounts` | Mounted units should expose rider and mount links rather than reading like single humanoid bodies |
| Wheelbarrow Dragon composition check | `composite_wheelbarrow_dragon` | The unit should expose cart, driver, and dragon-head composition while preserving charge/fire identity |
