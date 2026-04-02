| Unit | Role | Relation | Visible Actor | Targetable | Combat Emitter | Damage Owner | Victory Owner | Channels | Move Mode | Detach On Parent Death | Cleanup |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `secret.cavalry` | `horse` | `mount` | yes | no | no | parent | parent | none | anchored-parent | no | remove-with-parent |
| `secret.raptor_rider` | `raptor` | `mount` | yes | no | no | parent | parent | none | anchored-parent | no | remove-with-parent |
| `secret.bomb_cannon` | `gunner` | `crew` | yes | yes | yes | self | parent | attack | anchored-parent | no | remove-with-parent |
| `secret.bomb_cannon` | `loader` | `crew` | yes | no | no | parent | parent | none | anchored-parent | no | remove-with-parent |
| `secret.gatling_gun` | `crank gunner` | `crew` | yes | yes | yes | self | parent | attack | anchored-parent | no | remove-with-parent |
| `secret.gatling_gun` | `loader` | `crew` | yes | no | no | parent | parent | none | anchored-parent | no | remove-with-parent |
| `secret.bank_robbers` | `safe` | `attachment` | yes | no | no | parent | parent | none | anchored-parent | no | remove-with-parent |
| `secret.bank_robbers` | `flank robber` | `crew` | yes | no | yes | parent | parent | attack | anchored-parent | no | remove-with-parent |
| `secret.wheelbarrow_dragon` | `wheelbarrow cart` | `attachment` | yes | no | no | parent | parent | none | anchored-parent | no | remove-with-parent |
| `secret.wheelbarrow_dragon` | `dragon head` | `mount` | yes | no | yes | parent | parent | attack | anchored-parent | no | remove-with-parent |
| `secret.clams` | `clam shell` | `attachment` | yes | no | no | parent | parent | none | anchored-parent | no | remove-with-parent |

Notes:
- This tranche only upgrades operator-driven Secret artillery roles; mounts, shell attachments, and `bank_robbers` stay on the earlier parent-routed semantics.
- `secret.bomb_cannon.gunner` and `secret.gatling_gun.crank gunner` are now targetable self-damaged operators, but still do not count as separate victory actors.
- Parent attack capability is derived from alive operator contributors; movement remains parent-owned for all Secret roles in this matrix.
- Summoned units such as `secret.bomb_on_a_stick` spawned by `secret.clams` are not part of this matrix; they remain spawned combat children, not persistent linked roles.
