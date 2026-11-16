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
- glow.addExcludedMesh does not make a mesh occlude the glow: a dark mesh left out of the glow pass wears the glow of bright emissive ground behind it as a pale veil (farmer_snow mill read white, 562). Keep dark solids in the pass; exclude only bright/self-lit ones.

## Capture and probes
- capture-world.mjs boots like capture.mjs: mulberry32 0x4d4f5642 reseeded at every resetBattle, time only through advanceTime, setup renders at 1/8 size (__setupScale 8). It re-adds body.capture-mode before every shot (the game drops it on loads).
- Never run a capture with a test --iter number: pruneOld keeps only summary.json for iterations older than 10 (guarded by STATE's Iteration); test into look/ (no --iter).
- A capture wipes iter-N unless --add: save audit.md / critic.md after the last capture of the step, or rerun the judge after it. Step 5's capture of an audit iteration also wipes the audit files: run it with --add (555 lost audit.md/audit2.md this way).
- A step-5 capture of 6 maps + 17 stages runs past the 10 min Bash cap: run it in the background (75 shots took ~12 min).
- Map StandardMaterial greys read lavender-blue in the shots even at (0.6,0.54,0.52) (critic 555 on tribal rocks and farmer walls): a warm grey needs r well over b; check palette.png first.
- Probes (loop/scripts/probes/) run from repo root; --build after source changes, --noglow for a swatch. They were written for units: read one before trusting it on a map.
- execSync eats a caret: write sha~1.
- In-page probe on the dev server (5173): `const B = await import('<the @babylonjs_core.js?v=... URL from performance.getEntriesByType("resource")>'); B.EngineStore.LastCreatedScene` gives the live scene (meshes, materials, multiPickWithRay) after game.loadMapForCapture(id).

## Maps and stages
- The sim's ground is flat (body.root at y 0); terrain.ts lifts every dynamic root node by MapBuildResult.height at draw time and recomputes its world matrices after, so battles are identical with or without height (checked on Hill). Map meshes are marked static by trackMapBuild: a map builder seats its own props at groundHeightAt(). Nav and placement still come from zones, obstacles and hazards. An effect whose root sits at the origin with world-placed children is lifted by the height at the origin: give such roots their own position.
- terrainMesh winds its grid to face +y; skirts are double-sided. The placement centre line and zone overlays stay flat (they are map meshes).
- A TABS map without a builder in web/src/map/tabs/ is its base map (tabsMaps.ts); several maps share a base, so a base edit moves all of them and the regression scenarios on campaign.adventure.
- A TABS map builder clears base props by disposing meshes by name after base() and dropping only the colliders sitting exactly at a disposed mesh's spot (trees in the ring have colliders too). Keep each map's builder self-contained (no imports from another map's builder) so a revert never conflicts.
- The tribal crowns read pale pink because CanopyAerialPlugin mixes them toward sky-white with distance and scene fog does too: fresh crown materials made after base() (diffuse = emissive = c*0.55, deep linear c) with mesh.applyFog = false and out of the glow stay saturated (tribal_1 556).
- Every material a map build makes is disposed with the build (trackMapBuild), so a builder may recolour base materials by name ("grass", "groundMat", blades) without leaking to other maps; hide blades by mesh name fieldBlades_*/grassTuft. Base theme props are named `<displayName>_cyl|_box|_totem_top` with colliders at the same x,z.
- Dense crops: one tuft mesh drawn with thinInstanceSetBuffer (2000+ tufts) costs nothing; keep crops under waist height or armies standing in them vanish (farmer_2 556).
- Scene lights (hemi, dir) are not reset by a map build (clearColor and fogColor are, by the theme): a builder that changes them saves and restores them in its MapBuildResult.dispose, chained to the base's (farmer_snow 557). The far range and second slab are base meshes mountainBase/Cap/Root, clouds are "cloud": hide them by name.
- The map ground pose (alpha pi, target x 12) looks +x from x -29 across z ~0: props in a front or back corner never show in it; name the top shot for those.
- The translucent box framing farmer maps in the top shot is the base's placement guide (campaign_zone_overlay_*/campaign_zone_border_*, mapBuilder createPlacementGuides), a map mesh, not a capture overlay. Island underside = islandUnder + islandShelf + islandCliff (merged crags); farmer_1's earthBowl replaces them. MeshBuilder.CreatePolygon needs earcut (absent): fan a ribbon to a hub instead.
- The island shot (capture-world island pose; ArcRotate upperRadiusLimit clamps it to radius 120, elevation ~16 deg) foreshortens the underside hard: an underside must be ~0.3-0.4 of the island width deep (tribal tiers 16/13/10 m) or it reads as a thin band; farmer_1's 22 m bowl shows only ~7 m (559).
- A `*/` inside a doc comment (e.g. "overlay_*/border_*") closes it: tsc then fails with dozens of parse errors.
- Round island (560): the base lawn ("ground", "centerGrass") and underside slabs follow islandRim (superellipse 54 x 48, power 3); remap their vertices radially by newR/oldR per angle. fieldBlades_* are plain vertex meshes (4 vertices per blade, not thin instances): collapse a quad past the rim onto its first vertex. hazeTreeline is one merged mesh on straight bands at z +-37..41 (position at origin): hide it whole. Base tree trunks are unparented; a disabled trunk must be skipped by any crown builder.
- Farmer base ring trees are oaks (mapBuilder oakRing: "canopy" disabled, crowns are "oakCrown" lumps on oakLeaves/oakLeavesDark): recolour those, not canopy (561). A raised drawn-only set piece (bridge hump) can carry units via MapBuildResult.height (farmer_1 bridgeHeight).
- A ribbon's facing follows its path order: with backFaceCulling off a down-facing deck renders black; check the first normal after convertToFlatShadedMesh and flipFaces(true) when wrong (561). An underside facing away from the sun needs self-light ~1x its colour or it reads near black.
- Read stage armies from the stage files, not from Notes: tribal_2's "team 1 at x <= 40" was really x <= 24.4 (563), which freed 15 m for the massif. The campaign.challenge base's placement zones reach x +-61, past the 54 m rim: a builder that walls the field clips placementZones (centre/size) inside it.
- Upright tessellation-5/6 cylinders with flat tops read as basalt columns / a palisade from the top shot (tribal_2 massif, viking_sandbox wall, 563 critic+CONFIRM): a rock mass wants heaped faceted boulders or tilted slabs with few flat tops.
- Stage enemy positions are validated against the map's team-1 zone, hazards and obstacles (game.checkStage): a map change can misplace a stage's army (the checkpoint re-judges every stage on a finished map batch).
- The campaign.challenge base's remaining field dressing is "wallStone" (the dark block row), "boulder" (navy), "hayBale", "hill", "stump" and two pit hazards (campaign_hazard_box_pit overlays); 565 named them with a scratch probe (game.loadMapForCapture("map.<id>") needs the "map." prefix, else it loads sandbox.tribal). Drop the pit hazards with their overlays.
- Base field junk is "<displayName>_box|_cyl|_totem_top" meshes (mapBuilder addBoxObstacle/addCylinderObstacle/addTotem): hiding those on the campaign.challenge base cleared the ruin and totem but the critic still saw a dark block row in the battle shot (viking/ancient_sandbox 564); list the built set's names near the spot before claiming the slabs gone.
