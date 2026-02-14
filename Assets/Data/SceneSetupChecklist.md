# Scene Setup Checklist (AncientSandboxLike)

1. Terrain and Map
- Build one map with Ancient Sandbox-style geometry.
- Add colliders to terrain and ruins.
- Create and bake a NavMesh.

2. Scriptable Objects
- `BattleConfig`: set budgets and max units (default max 100 per team).
- `MapDefinition`: configure Team A and Team B placement zones.
- `CombatCatalog`: use defaults unless overriding.
- `UnitCatalog`: use defaults unless overriding.

3. Runtime Objects
- Add a `GameObject` with:
  - `GameStateMachine`
  - `SimulationSystem`
  - `VictorySystem`
  - `BattleBootstrap`
- Add `UnitFactory` and assign optional team materials.
- Add UI object with `PlacementHUDController`.
- Add result panel with `ResultScreenController` + `CanvasGroup`.
- Add `TouchCameraController` to the camera rig.

4. Validation
- Verify both team zones are valid and non-overlapping.
- Place units from both teams and start battle.
- Confirm result panel appears and reset returns to placement mode.
