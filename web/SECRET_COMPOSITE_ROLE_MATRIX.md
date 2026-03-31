| Unit | Role | Relation | Visible Actor | Combat Emitter | Damage Owner | Victory Owner | Move Mode | Detach On Parent Death | Cleanup |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `secret.cavalry` | `horse` | `mount` | yes | no | parent | parent | anchored-parent | no | remove-with-parent |
| `secret.raptor_rider` | `raptor` | `mount` | yes | no | parent | parent | anchored-parent | no | remove-with-parent |
| `secret.bomb_cannon` | `gunner` | `crew` | yes | yes | parent | parent | anchored-parent | no | remove-with-parent |
| `secret.bomb_cannon` | `loader` | `crew` | yes | no | parent | parent | anchored-parent | no | remove-with-parent |
| `secret.gatling_gun` | `crank gunner` | `crew` | yes | yes | parent | parent | anchored-parent | no | remove-with-parent |
| `secret.gatling_gun` | `loader` | `crew` | yes | no | parent | parent | anchored-parent | no | remove-with-parent |
| `secret.bank_robbers` | `safe` | `attachment` | yes | no | parent | parent | anchored-parent | no | remove-with-parent |
| `secret.bank_robbers` | `flank robber` | `crew` | yes | yes | parent | parent | anchored-parent | no | remove-with-parent |
| `secret.wheelbarrow_dragon` | `wheelbarrow cart` | `attachment` | yes | no | parent | parent | anchored-parent | no | remove-with-parent |
| `secret.wheelbarrow_dragon` | `dragon head` | `mount` | yes | yes | parent | parent | anchored-parent | no | remove-with-parent |
| `secret.clams` | `clam shell` | `attachment` | yes | no | parent | parent | anchored-parent | no | remove-with-parent |

Notes:
- This phase keeps all Secret linked roles on parent-owned movement.
- All listed roles use parent-routed damage and parent-owned victory semantics.
- Summoned units such as `secret.bomb_on_a_stick` spawned by `secret.clams` are not part of this matrix; they remain spawned combat children, not persistent linked roles.
