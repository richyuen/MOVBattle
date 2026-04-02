| Scenario | Executable id | Expected distinction |
| --- | --- | --- |
| Legacy Tank linked-role check | `nonsecret_legacy_tank_roles` | Text state should expose distinct driver and gunner crew roles with gunner-owned artillery emission |
| Da Vinci Tank linked-role check | `nonsecret_da_vinci_tank_roles` | Text state should expose a single pilot role owning the vehicle's firing rhythm without duplicated stand-ins |
| Hwacha linked-role check | `nonsecret_hwacha_roles` | Text state should expose a single rear rocketeer role that owns both control and volley emission |
| Legacy Tank internal-crew routing check | `operator_legacy_tank_gunner_loss` | Internal gunner damage should route to the parent tank body rather than exposing a separate killable operator |
| Da Vinci Tank internal-crew routing check | `operator_da_vinci_tank_pilot_loss` | Internal pilot damage should route to the parent tank body rather than exposing a separate killable operator |
| Hwacha operator-loss check | `operator_hwacha_rocketeer_loss` | Killing the rear rocketeer should disable both movement and volley fire on the parent chassis |
| Tank vs Da Vinci Tank vs Hwacha comparison | `iconic_artillery_compare` | All three artillery units should remain structurally inspectable and visually distinct after linked-role adoption |
