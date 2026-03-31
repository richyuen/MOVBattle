| Unit | Role | Relation | Visible Actor | Combat Emitter | Impact Owner | Damage Owner | Victory Owner | Move Mode | Detach On Parent Death | Cleanup |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `legacy.tank` | `driver` | `crew` | yes | no | parent | parent | parent | anchored-parent | no | remove-with-parent |
| `legacy.tank` | `gunner` | `crew` | yes | yes | gunner | parent | parent | anchored-parent | no | remove-with-parent |
| `renaissance.da_vinci_tank` | `pilot` | `crew` | yes | yes | pilot | parent | parent | anchored-parent | no | remove-with-parent |
| `dynasty.hwacha` | `rocketeer` | `crew` | yes | yes | rocketeer | parent | parent | anchored-parent | no | remove-with-parent |
| `dynasty.hwacha` | `loader` | `crew` | yes | no | parent | parent | parent | anchored-parent | no | remove-with-parent |

Notes:
- This phase reuses the existing linked-role contract without adding detached crew, independent crew pathing, or new cleanup modes.
- All non-Secret artillery crew in this matrix use parent-routed damage and parent-owned victory semantics.
- Decorative operator stand-ins in the vehicle builders must be suppressed whenever these linked roles are active.
