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
- Campaign mode is active and currently uses 12 campaign entries with one authored scenario each
- Living crowd physics already includes collision separation/push metrics and now uses topple/recovery states as part of battle-feel work

## Commands
- **Dev server**: `cd web && npm run dev` (runs on localhost:5173)
- **Type check**: `cd web && npx tsc --noEmit`
- **Build**: `cd web && npm run build`

## Conventions
- Working directory is `web/` — git paths are relative to repo root, but build commands run from `web/`
- Don't chain bash commands with `&&` or `;` — use separate tool calls
- No need to `cd` before git commands — already in repo root
- Prefer deterministic scenario/state verification before ad hoc browser clicking when validating combat/runtime changes
