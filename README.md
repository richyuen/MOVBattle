# MOVBattle

MOVBattle is now a browser-based battle sandbox prototype inspired by Totally Accurate Battle Simulator.

Current web implementation includes:
- Offline sandbox battle loop (placement -> simulation -> result)
- One-map arena workflow
- Core faction roster definitions (simple base-faction style units)
- Data-driven unit stats in a single roster table
- Lightweight simulation architecture (targeting + movement + cooldown-based attacks)
- Team budget cap with live red/blue spend tracking
- Battle utility controls (speed multiplier, pause/resume, mirror red lineup to blue)
- Utility workflows: random team fill and save/load formations with local storage slots

## Web App Quick Start (No Unity Required)

1. From repository root, start a static server:
   - Python: `python3 -m http.server 4173`
   - Node (optional): `npx serve .`
2. Open `http://localhost:4173/web/`.
3. Use the panel controls to select team + unit type and click in the arena to place units.
4. Click **Start Battle**.

### Web Controls

- Desktop: left click to place selected unit, right click to remove nearest unit
- Mobile: choose **Tap Action** (place/remove), then tap arena
- Set per-team budget with **Team Budget**
- Use **Simulation Speed** and **Pause** to inspect battles
- Use **Mirror Red Team to Blue** for quick symmetric test setups
- Use **Random Fill Active Team** for instant budget-based army generation
- Use **Formation Slot + Save/Load** to persist and reload setups in your browser
- **Start Battle**: begin simulation
- **Reset**: reset all units and battle state

## Project Layout

- `web/index.html`: single-page app markup and controls
- `web/styles.css`: UI layout + arena styling
- `web/app.js`: battle loop, roster definitions, and rendering
- `Assets/` + `ProjectSettings/`: legacy Unity prototype (kept for reference)

## Legacy Unity Prototype (Optional)

If you still want to open the older Unity prototype, it remains in this repository under `Assets/` and `ProjectSettings/`.

Legacy requirements:
- Unity 2022 LTS or newer
- iOS build support module installed
- iOS target: 17.0+
- Orientation: Landscape

## Notes

- All assets should be original lookalike content; do not copy proprietary assets.
- The web version is intentionally lightweight and can run from a static file server.
