| Unit | Role | Relation | Visible Actor | Targetable | Combat Emitter | Impact Owner | Damage Owner | Victory Owner | Channels | Move Mode | Detach On Parent Death | Cleanup |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `legacy.tank` | `driver` | `crew` | no | no | no | parent | parent | parent | none | anchored-parent | no | remove-with-parent |
| `legacy.tank` | `gunner` | `crew` | no | no | yes | gunner | parent | parent | attack | anchored-parent | no | remove-with-parent |
| `renaissance.da_vinci_tank` | `pilot` | `crew` | no | no | yes | pilot | parent | parent | none | anchored-parent | no | remove-with-parent |
| `dynasty.hwacha` | `rocketeer` | `crew` | yes | yes | yes | rocketeer | self | parent | attack, move | anchored-parent | no | remove-with-parent |

Notes:
- Tank crews are now internal-only again: they stay hidden, cannot be targeted, and route damage through the parent chassis.
- Exposed operator autonomy remains only on vehicles that visibly expose crew, such as the single rear operator on `dynasty.hwacha`.
- All artillery crew stay anchored to the parent chassis; there is still no detached crew AI or independent pathing.
- Decorative operator stand-ins in the vehicle builders must be suppressed whenever these linked roles are active.
