Deterministic socket/firing scenarios live in [scenarios.ts](/C:/Git/MOVBattle/web/src/testing/scenarios.ts).

Primary scenarios for this phase:

- `war_machine_tank_origin`
  - `legacy.tank` should emit one shell from the barrel muzzle with smoke at the barrel and an explosive impact.
- `iconic_artillery_compare`
  - `legacy.tank`, `renaissance.da_vinci_tank`, and `dynasty.hwacha` should remain visually and behaviorally distinct after socket adoption.
- `war_machine_cannon_compare`
  - `pirate.cannon` and `secret.bomb_cannon` should both fire from the barrel muzzle, with `bomb_cannon` reading heavier and more explosive.
- `war_machine_ballista_catapult`
  - `ancient.ballista` should launch from the bolt track; `medieval.catapult` and `spooky.pumpkin_catapult` should launch from the bucket.
- `war_machine_wheelbarrow_compare`
  - `farmer.wheelbarrow` should retain cart/charge read while `secret.wheelbarrow_dragon` remains a composite cart plus dragon-head unit.
