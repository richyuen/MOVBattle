# MOVBattle

TABS (Totally Accurate Battle Simulator) clone as a web app using BabylonJS.

## Tech Stack
- **Engine**: BabylonJS 7.x (3D rendering with custom simulation/impulse logic, not a full rigidbody physics engine)
- **Language**: TypeScript
- **Build**: Vite 5.x
- **UI**: Plain HTML/CSS overlay on canvas

## Project Structure
```
web/                         # Web app root
  src/
    main.ts                  # Entry point, game loop, placement/UI wiring
    campaign/                # Campaign definitions, progression helpers, session state
    core/                    # Game state, budget, battle config
    data/                    # Unit definitions, combat profiles, faction colors
    map/                     # Map builder, hazards, obstacles, placement validation
    ui/                      # Camera controller (mobile + desktop)
    units/                   # Unit system (see below)
    combat/                  # Simulation, projectiles, visual effects
    testing/                 # Deterministic scenarios + gallery validation metadata
  index.html                 # Single-page app with UI overlay
  tsconfig.json
  vite.config.ts
```

## Unit System Architecture
- **unitDefinitions.ts** — stats: HP, damage, speed, range, cost per unit
- **unitVisuals.ts** — visual config: proportions, weapon, hat, shield, special, accent color
- **bodyBuilder.ts** — builds humanoid articulated bodies (joint hierarchy with 16 joints)
- **vehicleBuilder.ts** — builds non-humanoid units (mammoth, catapult, ballista, hwacha, cannon, da vinci tank, wheelbarrow)
- **propBuilder.ts** — builds weapon/hat/shield/special meshes, attaches to body joints
- **unitFactory.ts** — orchestrates spawning: picks body type, blends colors, attaches props
- **proceduralAnimation.ts** — humanoid + quadruped walk/idle/attack animations
- **runtimeUnit.ts** — runtime state: movement, health, knockback, linked actors, obstacle collision
- **simulationSystem.ts** — AI decisions, attacks, status effects, hazards, summons, deterministic battle stepping

## Key Patterns
- Vehicle units use `vehicleBuilder.ts`, everything else uses `bodyBuilder.ts`
- All meshes are procedural (MeshBuilder), no imported models
- Sandbox placement uses side-based team zones; campaign/runtime helpers can also author locked scenario units directly
- State machine: Placement -> Countdown -> Simulation -> Result
- `playAgain()` resets battle keeping placed units; `resetBattle()` full wipe
- Deterministic validation is centered on `web/src/testing/scenarios.ts`, `window.game.runScenarioCheck(...)`, and gallery helpers in `main.ts`
- Campaign mode has the 12 TABS campaigns, each a curated set of 4-6 of its real TABS levels (70 stages) in `web/src/campaign/stages/<campaign>.ts` (map, budget, player units, the enemy army as `[unitId, x, z]`), built from the wiki by `loop/scripts/fetch-stage-cards.mjs` + `scaffold-stages.mjs`. Stages are fought on the 29 TABS maps `map.<id>` (`web/src/map/tabsMaps.ts`); a map's own builder lives in `web/src/map/tabs/<id>.ts`, and one without is built on its older `campaign.*`/sandbox base map. Keep the `campaign.*` maps: the regression scenarios use `campaign.adventure`
- Living crowd physics already includes collision separation/push metrics and now uses topple/recovery states as part of battle-feel work
- The TABS-fidelity improvement loop **v11 (maps and stages; solo mode works one stuck item at a time until it passes, CONFIRM checks a locked blocker list)** lives in `loop/`; its procedure is `loop/ITERATE.md` (files, batches, capture and judging are described there). Earlier phases are archived: units (v4, all 139 done) under `loop/archive/v4/` (tag `loop-units-final`), v1 under `loop/archive/v1/` (tag `loop-v1-final`)
- Terrain height is visual only (`web/src/map/terrain.ts`): a map returns `height` in its MapBuildResult and shapes its ground with `terrainMesh()`; units, missiles and effects are lifted onto it at draw time and put back after, so the simulation stays flat and deterministic (`map/tabs/hill.ts` is the example)
- Per-unit cloth, hair and ornaments go in `web/src/units/<faction>Dress.ts`, not the builder monoliths
- The sandbox map picker's thumbnails in `web/public/maps/thumbs/` are rendered by `loop/scripts/map-thumbs.mjs`; re-run it after changing a map's look
- The **Custom** faction (`custom.*` in `rosterManifest.ts`) holds our own versions of units that differ from TABS on purpose (Void Monarch and Dark Peasant with their Shadow Walker summons). The loop never audits it (`loop/scripts/lib/roster.mjs` skips it, and it is not in STATE's batch list). Its units use their own preset names (`custom_dark_peasant`) and id-keyed visual entries, so a loop change to the TABS originals does not reach them; loop work must not remove or rename those copies
- `rosterManifest.ts` knobs `healthMultiplier`, `damageMultiplier`, `cooldownMultiplier` are the stats script's; `simulation.abilityLog` (beside `hitLog`) records teleports, leaps, heals, summons, volleys, throws and statuses for the capture

## Default action: one loop iteration
When the first message of an empty conversation is just `continue` (or `go`, `next`, or blank), it means: run one improvement-loop iteration. Read `loop/ITERATE.md` and follow it exactly; the current batch is the `Batch:` field of `loop/STATE.md`. This is how `/autoloop on` drives the loop with its default prompt. Mid-conversation, `continue` keeps its ordinary meaning.

## Commands
- **Dev server**: `cd web && npm run dev` (runs on localhost:5173)
- **Type check**: `cd web && npx tsc --noEmit`
- **Build**: `cd web && npm run build`
- **Autoloop (OpenCode TUI)**: `/autoloop on [max] [prompt]` runs one loop iteration per fresh session; `/autoloop off` and `/autoloop status` control it. The plugin lives in `.opencode/plugins/autoloop/`.

## Conventions
- Working directory is `web/` — git paths are relative to repo root, but build commands run from `web/`
- Don't chain bash commands with `&&` or `;` — use separate tool calls
- No need to `cd` before git commands — already in repo root
- Prefer deterministic scenario/state verification before ad hoc browser clicking when validating combat/runtime changes
