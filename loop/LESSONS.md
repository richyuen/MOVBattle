# Lessons (loop v10): facts about the pipeline, the capture and the renderer that outlive one item

Read at step 1; one fact a line, merge near cap. The unit phase's rig and dress lessons are in `loop/archive/v4/LESSONS.md` (not read by the loop).

## Rendering (swiftshader + PBR + SSAO + ACES + glow)
- PBR colours are linear: an sRGB target c needs ~c^2.2 as the code. Pick values off `output/loop/palette.png` (`capture.mjs --palette`).
- SSAO greys a DOUBLESIDE ribbon's inward faces: build shells one-sided facing out (check flipFaces).
- Flat colour that survives ACES: an "unlit" material's colour comes from its EMISSIVE only (baseColor alone renders black), excluded from the glow layer (glow.addExcludedMesh). A saturated red needs emissive r > 1 and b near 0.
- ACES lifts mid code values toward pale: an unlit plate keeps a deep value; lit timber wants (.2,.11,.055) with a small self-light.
- "metal" renders near black: use "cloth" with a small emissive. Lit cloth in shade reads grey.
- Near-black: lit cloth (.08,.06,.07) self-lit .4 rough 1 (unlit/smooth reads plum); by self-lit meshes the glow halo browns it: exclude those from the glow.
- A world box refreshes only on render: computeWorldMatrix(true) before reading bounds in a per-tick step. bakeCurrentTransformIntoVertices bakes the world matrix: bake, then parent.
- Flat pieces are closed slabs (a one-sided disc can face away).

## Capture and probes
- capture-world.mjs boots like capture.mjs: mulberry32 0x4d4f5642 reseeded at every resetBattle, time only through advanceTime, setup renders at 1/8 size (__setupScale 8). It re-adds body.capture-mode before every shot (the game drops it on loads).
- Never run a capture with a test --iter number: pruneOld keeps only summary.json for iterations older than 10 (guarded by STATE's Iteration); test into look/ (no --iter).
- A capture wipes iter-N unless --add: save audit.md / critic.md after the last capture of the step, or rerun the judge after it.
- Probes (loop/scripts/probes/) run from repo root; --build after source changes, --noglow for a swatch. They were written for units: read one before trusting it on a map.
- execSync eats a caret: write sha~1.

## Maps and stages
- The sim's ground is flat (RuntimeUnit puts body.root at y 0): raised ground is dressing; the nav grid and placement come from MapBuildResult zones, obstacles and hazards.
- A TABS map without a builder in web/src/map/tabs/ is its base map (tabsMaps.ts); several maps share a base, so a base edit moves all of them and the regression scenarios on campaign.adventure.
- Stage enemy positions are validated against the map's team-1 zone, hazards and obstacles (game.checkStage): a map change can misplace a stage's army (the checkpoint re-judges every stage on a finished map batch).
