# MOVBattle

MOVBattle is a browser-based battle sandbox inspired by Totally Accurate Battle Simulator.

The active implementation lives in `web/` and currently includes:
- Full 139-unit roster data across 14 factions
- Searchable faction/unit sandbox UI
- Deterministic battle stepping, scenario checks, and text-state inspection hooks
- Procedural unit visuals, articulated bodies, bespoke vehicle builders, and crowd-reactive living physics
- Secret-faction fidelity work, iconic-unit parity work, boss coverage, and composite actors
- TABS-inspired campaign mode with 12 campaign entries, bespoke campaign maps, and gameplay hazards

## Active Project Layout

- `web/src/campaign`: campaign definitions, progression helpers, and session types
- `web/src/data`: generated roster data, faction metadata, and combat tuning
- `web/src/combat`: simulation, projectiles, effects, and battle logic
- `web/src/units`: procedural body, prop, vehicle, and runtime unit systems
- `web/src/map`: sandbox/campaign map geometry, hazards, and placement validation
- `web/src/ui`: camera and interface behavior
- `web/src/testing`: deterministic scenario specs used for browser validation

## Run The Web Game

1. Install dependencies in `web/`:
   - `npm install`
2. Start the dev server:
   - `npm run dev`
3. Build production output:
   - `npm run build`
4. Type-check:
   - `npx tsc --noEmit`

## Deterministic Test Hooks

The browser runtime exposes helpers used by scenario validation:
- `window.game.spawnUnit(...)`
- `window.game.runScenario(...)`
- `window.game.runScenarioCheck(...)`
- `window.game.runScenarioGalleryValidation(...)`
- `window.game.getGalleryManifest()`
- `window.game.resetBattle()`
- `window.game.playAgain()`
- `window.game.listCampaigns()`
- `window.game.loadCampaignScenario(...)`
- `window.game.getCampaignState()`
- `window.advanceTime(ms)`
- `window.render_game_to_text()`

Scenario definitions live in `web/src/testing/scenarios.ts`.
Campaign definitions live in `web/src/campaign/campaignData.ts`.

## Notes

- Keep visuals original and procedural; do not import proprietary TABS assets.
- Current biggest remaining fidelity gap versus TABS is still the battle feel: living-body physics/emergence is improving, but it is still less developed than the roster, visuals, scenarios, and campaign shell.
- Documentation in `web/*.md` is mostly acceptance/reference material; executable validation lives in `web/src/testing/scenarios.ts`.
