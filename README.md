# MOVBattle

MOVBattle is a browser-based battle sandbox inspired by Totally Accurate Battle Simulator.

The active implementation lives in `web/` and currently includes:
- Full 139-unit roster data across 14 factions
- Searchable faction/unit sandbox UI
- Deterministic battle stepping and text-state inspection hooks
- Procedural unit visuals and vehicle builders
- Secret-faction fidelity work, iconic-unit parity work, and anchored composite actors

## Active Project Layout

- `web/src/data`: generated roster data, faction metadata, and combat tuning
- `web/src/combat`: simulation, projectiles, effects, and battle logic
- `web/src/units`: procedural body, prop, vehicle, and runtime unit systems
- `web/src/map`: sandbox map geometry and placement validation
- `web/src/ui`: camera and interface behavior
- `web/src/testing`: deterministic scenario specs used for browser validation

## Run The Web Game

1. Install dependencies in `web/`:
   - `npm install`
2. Start the dev server:
   - `npm run dev`
3. Build production output:
   - `npm run build`

## Deterministic Test Hooks

The browser runtime exposes helpers used by scenario validation:
- `window.game.spawnUnit(...)`
- `window.game.runScenario(...)`
- `window.game.resetBattle()`
- `window.game.playAgain()`
- `window.advanceTime(ms)`
- `window.render_game_to_text()`

Scenario definitions live in `web/src/testing/scenarios.ts`.

## Notes

- Keep visuals original and procedural; do not import proprietary TABS assets.
- Current implementation priority is gameplay readability and battlefield-role fidelity over exact one-to-one physics quirks.
