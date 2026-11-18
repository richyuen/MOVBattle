# Lessons (loop v10): facts about the pipeline, the capture and the renderer that outlive one item

Read at step 1; one fact a line, merge near cap. The unit phase's rig and dress lessons are in `loop/archive/v4/LESSONS.md` (not read by the loop).

## Rendering (swiftshader + PBR + SSAO + ACES + glow)
- PBR colours are linear: an sRGB target c needs ~c^2.2 as the code. Pick values off `output/loop/palette.png` (`capture.mjs --palette`).
- Flat colour that survives ACES: an "unlit" material's colour comes from its EMISSIVE only (baseColor alone renders black), excluded from the glow layer (glow.addExcludedMesh). A saturated red needs emissive r > 1 and b near 0.
- ACES lifts mid code values toward pale: an unlit plate keeps a deep value; lit timber wants (.2,.11,.055) with a small self-light.
- "metal" renders near black: use "cloth" with a small emissive. Lit cloth in shade reads grey.
- A world box refreshes only on render: computeWorldMatrix(true) before reading bounds in a per-tick step. bakeCurrentTransformIntoVertices bakes the world matrix: bake, then parent.
- Flat pieces need correct left-handed winding or closed slabs. execSync eats a caret: write sha~1.
- glow.addExcludedMesh does not make a mesh occlude the glow: a dark mesh left out of the pass wears the glow behind it as a pale veil (farmer_snow mill, 562). Keep dark solids in the pass; exclude bright/self-lit ones. Near-black: lit cloth (.08,.06,.07) self-lit .4 rough 1.
- CreateIcoSphere subdivisions 0 is falsy, so it becomes 4: a smooth navy ball (575). Use 1 for a faceted rock.
- Lit thin-instance wheat can read gold from above and brown at ground level. Two unlit, glow-excluded instance meshes sharing one matrix buffer keep heads and stems distinct in both shots.

## Capture and probes
- capture-world.mjs boots like capture.mjs: mulberry32 0x4d4f5642 reseeded at every resetBattle, time only through advanceTime, setup renders at 1/8 size (__setupScale 8). It re-adds body.capture-mode before every shot (the game drops it on loads).
- Never run a capture with a test --iter number: pruneOld keeps only summary.json for iterations older than 10 (guarded by STATE's Iteration); test into look/ (no --iter).
- A capture wipes iter-N unless --add: save audit/critic files after the step's last capture; an audit iteration's step 5 runs with --add (555). A step-5 capture (~80 shots) takes ~12 min: background it.
- A maroon/blue "ground tint" is the base's zone slabs (campaign_zone_overlay_*/border_*): hide them before recolouring a floor (577). A colour swap under full-width cap slabs never shows (pirate sterns 577).
- Probes (loop/scripts/probes/, --build after source changes) were written for units: read one before trusting it on a map.
- In-page probe on the dev server (5173): import the @babylonjs_core.js?v=... URL from performance.getEntriesByType("resource"); its EngineStore.LastCreatedScene is the live scene after game.loadMapForCapture(id).

## Maps and stages
- The sim's ground is flat (body.root at y 0); terrain.ts lifts every dynamic root node by MapBuildResult.height at draw time and recomputes its world matrices after, so battles are identical with or without height (checked on Hill). Map meshes are marked static by trackMapBuild: a map builder seats its own props at groundHeightAt(). Nav and placement still come from zones, obstacles and hazards. An effect whose root sits at the origin with world-placed children is lifted by the height at the origin: give such roots their own position.
- terrainMesh winds its grid to face +y; skirts are double-sided. The placement centre line and zone overlays stay flat (they are map meshes).
- A TABS map without a builder in web/src/map/tabs/ is its base map (tabsMaps.ts); several maps share a base, so a base edit moves all of them and the regression scenarios on campaign.adventure.
- Clear base props by name after base(), removing only their colliders (ring trees have them too). Keep builders self-contained so reverts never conflict.
- A set piece inside a merged tree belt needs a clearing before the trees merge; adding walls behind it can leave them invisible (580).
- Base crowns read pale because CanopyAerialPlugin and scene fog mix them toward sky-white: fresh crown materials made after base() (diffuse = emissive = c*0.55), applyFog false, out of the glow, stay saturated (tribal_1 556).
- Every material a map build makes is disposed with the build (trackMapBuild), so a builder may recolour base materials by name ("grass", "groundMat", blades) without leaking to other maps; hide blades by mesh name fieldBlades_*/grassTuft. Base theme props are named `<displayName>_cyl|_box|_totem_top` with colliders at the same x,z.
- Dense crops: thinInstanceSetBuffer (2000+ tufts) costs nothing; keep crops under waist height or armies vanish in them (556).
- Scene lights (hemi, dir) are not reset by a map build (clearColor and fogColor are, by the theme): a builder that changes them saves and restores them in its MapBuildResult.dispose, chained to the base's (farmer_snow 557). The far range and second slab are base meshes mountainBase/Cap/Root, clouds are "cloud": hide them by name.
- The map ground pose (alpha pi, target x 12) looks +x from x -29 across z ~0: props in a front or back corner never show in it; name the top shot for those.
- The translucent box framing maps in the top shot is those zone slabs too (createPlacementGuides), a map mesh. Island underside = islandUnder + islandShelf + islandCliff (merged crags); farmer_1's earthBowl replaces them. MeshBuilder.CreatePolygon needs earcut (absent): fan a ribbon to a hub instead.
- The island shot (capture-world island pose; ArcRotate upperRadiusLimit clamps it to radius 120, elevation ~16 deg) foreshortens the underside hard: an underside must be ~0.3-0.4 of the island width deep (tribal tiers 16/13/10 m) or it reads as a thin band; farmer_1's 22 m bowl shows only ~7 m (559).
- A `*/` inside a doc comment (e.g. "overlay_*/border_*") closes it: tsc then fails with parse errors.
- Round island (560): base lawn ("ground", "centerGrass") and underside follow islandRim (superellipse 54 x 48, power 3); remap vertices radially. hazeTreeline is one merged mesh: hide it whole. Base trunks are unparented (crowns are children); skip disabled trunks.
- Scene fog is linear and re-keyed every frame by main.ts (fogStart/End from the camera radius): a map's fogDensity does nothing. Draw haze instead (inside-facing translucent mist walls, viking 572).
- Farmer base ring trees are oaks ("oakCrown" lumps on oakLeaves/oakLeavesDark): recolour those, not canopy (561). A raised drawn-only set piece can carry units via MapBuildResult.height (farmer_1 bridgeHeight).
- A ribbon's facing follows its path order (SSAO greys a DOUBLESIDE one's inward faces): a down-facing deck renders black; check the first normal after convertToFlatShadedMesh and flipFaces(true) when wrong (561; viking bankFace 574 went near black). An underside facing away from the sun needs self-light ~1x its colour or it reads near black.
- Read stage armies from the stage files, not from Notes: tribal_2's "team 1 at x <= 40" was really x <= 24.4 (563), which freed 15 m for the massif. The campaign.challenge base's placement zones reach x +-61, past the 54 m rim: a builder that walls the field clips placementZones (centre/size) inside it.
- Upright tessellation-5/6 cylinders with flat tops read as basalt columns or a palisade (563): a rock mass wants heaped faceted boulders or tilted slabs, few and large, of unequal size (spooky_1 583: equal rocks read as an even band).
- Stage enemy positions are validated against the map's team-1 zone, hazards and obstacles (game.checkStage): a map change can misplace a stage's army (the checkpoint re-judges every stage on a finished map batch).
- campaign.challenge base dressing: "wallStone", "boulder", "hayBale", "hill", "stump", pit hazards (campaign_hazard_box_pit) and "<displayName>_box|_cyl|_totem_top" junk. loadMapForCapture needs the "map." prefix. Probe what is near a spot before claiming it gone (564).
- Static base meshes need setVerticesData to upload reshaped geometry (573-574).
- The shared skyDome covers clearColor. A map can hide/restore it and draw its own fog-free, unlit sky sphere (Legacy 582).
- Night snow under blue moonlight: warm the diffuse to cancel the light's tint, carry the pale tone in self-light, and drop the field from the glow (farmer_snow 573, CONFIRM passed).
- Turf caps on cliff columns flicker when their top faces share a plane with the cliff or meadow. Set the cap slightly below the meadow and the shaft top inside the cap (Medieval 1, 567).
- The sandboxed shell blocks the capture's loopback to Vite: run captures unsandboxed.
- Grass: thin-instance fans of six thin blades with up-facing normals read as grass (legacy 583); flattened IcoSpheres read fuzzy from afar but as paving stones from a stage's low camera (spooky_1 583), upright ones as stones; leaf cards as beige flags (571).
- Mesh.MergeMeshes returns null past 65536 vertices unless allow32BitsIndices is passed, leaving every part unmerged on the default white material: use (parts, true, true) for big merges (spooky_1's white trees, 582).
- A boulder heap receiving shadows shadows itself near black: receiveShadows false, self-light 0.6 (pirate 583).
- Back cliff ledges with a skirt or sky shows below; where blocks leave gaps the skirt reads as a flat band (584).
- Buildings near a stage's line hide its army (Ancient 1; wild_west 583): the stage camera sits ~24 m west of the army.
- Hazards a builder adds get no overlay: draw them (578). A self-lit floor in the glow pass blooms white: exclude it (wild_west 584).
- Recess a descent before merging cliff columns (579). A concave bank needs longitudinal strips: a hub fan can cross the recess and invert triangles (581).
- Embers under a grate show only between flat bars (4 cm proud): 0.2 m bars hid the bed from every camera (579, 584).
