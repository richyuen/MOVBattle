# MOVBattle

MOVBattle is a Unity iOS battle sandbox inspired by Totally Accurate Battle Simulator.

Current implementation includes:
- Offline sandbox battle loop (placement -> countdown -> simulation -> result)
- One-map workflow intended for an Ancient Sandbox style environment
- Core faction roster definitions (standard base-faction style units)
- Data-driven unit/combat catalogs
- Hybrid simulation architecture (AI + simplified physics impacts + ragdoll hooks)
- Touch-first camera and placement controllers for iPhone landscape play

## Project Layout

- `Assets/Scripts/Core`: game states, bootstrap, budget, and victory logic
- `Assets/Scripts/Combat`: attack/AI/ragdoll profile definitions and combat catalog
- `Assets/Scripts/Units`: unit definitions, runtime unit logic, factory, roster defaults
- `Assets/Scripts/Map`: map definition and placement validation
- `Assets/Scripts/UI`: touch camera and basic HUD/result controllers
- `Assets/Scripts/Pooling`: lightweight reusable object pool utility
- `Assets/Tests/EditMode`: edit-mode unit tests for key systems

## Unity Requirements

- Unity 2022 LTS or newer
- iOS build support module installed
- iOS target: 17.0+
- Orientation: Landscape

## Quick Setup

1. Create/open a Unity project in this repository root.
2. Recommended: run `MOVBattle -> Quick Setup Active Scene` from the Unity top menu to auto-wire a playable test scene.
3. Create ScriptableObject assets:
   - `BattleConfig`
   - `CombatCatalog` (optional custom overrides)
   - `UnitCatalog` (optional custom overrides)
   - `MapDefinition` for the Ancient Sandbox-like map
4. In a scene, add:
   - `BattleBootstrap`
   - `GameStateMachine`
   - `SimulationSystem`
   - `VictorySystem`
   - `UnitFactory`
   - `PlacementHUDController`
   - `UnitCardListBuilder` (optional dynamic card generation)
   - `TouchCameraController`
   - `ResultScreenController`
   - `AncientSandboxMapBuilder` (optional quick-map generator)
5. Wire references in the inspector.
6. Build to iOS and deploy through Xcode/TestFlight.

### Editor Test Controls

- Left click: place selected unit in the active team zone
- Right click: remove your team unit under cursor
- `Tab`: switch active placement team
- `N` / `B`: select next / previous unit type from roster
- `Space`: start battle
- `R`: reset battle

## Notes

- All assets should be original lookalike content; do not copy proprietary assets.
- Roster defaults are code-defined to speed iteration while assets are still in progress.
