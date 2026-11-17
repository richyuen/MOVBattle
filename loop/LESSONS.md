# Lessons (loop v10): facts about the pipeline, the capture and the renderer that outlive one item

Read at step 1; one fact a line, merge near cap. The unit phase's rig and dress lessons are in `loop/archive/v4/LESSONS.md` (not read by the loop).

## Rendering (swiftshader + PBR + SSAO + ACES + glow)
- PBR colours are linear: an sRGB target c needs ~c^2.2 as the code. Pick values off `output/loop/palette.png` (`capture.mjs --palette`).
- Flat colour that survives ACES: an "unlit" material's colour comes from its EMISSIVE only (baseColor alone renders black), excluded from the glow layer (glow.addExcludedMesh). A saturated red needs emissive r > 1 and b near 0.
- ACES lifts mid code values toward pale: an unlit plate keeps a deep value; lit timber wants (.2,.11,.055) with a small self-light.
- "metal" renders near black: use "cloth" with a small emissive. Lit cloth in shade reads grey.
- A world box refreshes only on render: computeWorldMatrix(true) before reading bounds in a per-tick step. bakeCurrentTransformIntoVertices bakes the world matrix: bake, then parent.
- Flat pieces are closed slabs (a one-sided disc can face away). execSync eats a caret: write sha~1.
- glow.addExcludedMesh does not make a mesh occlude the glow: a dark mesh left out of the pass wears the glow behind it as a pale veil (farmer_snow mill, 562). Keep dark solids in the pass; exclude bright/self-lit ones. Near-black: lit cloth (.08,.06,.07) self-lit .4 rough 1.
- CreateIcoSphere subdivisions 0 is falsy, so it becomes 4: a smooth navy ball (575). Use 1 for a faceted rock.
- Lit thin-instance wheat can read gold from above and brown at ground level. Two unlit, glow-excluded instance meshes sharing one matrix buffer keep heads and stems distinct in both shots.

## Capture and probes
- capture-world.mjs boots like capture.mjs: mulberry32 0x4d4f5642 reseeded at every resetBattle, time only through advanceTime, setup renders at 1/8 size (__setupScale 8). It re-adds body.capture-mode before every shot (the game drops it on loads).
- Never run a capture with a test --iter number: pruneOld keeps only summary.json for iterations older than 10 (guarded by STATE's Iteration); test into look/ (no --iter).
- A capture wipes iter-N unless --add: save audit.md / critic.md after the last capture of the step, or rerun the judge after it. Step 5's capture of an audit iteration also wipes the audit files: run it with --add (555 lost audit.md/audit2.md this way).
- A step-5 capture (75-82 shots) takes ~12 min: run it in the background.
- Map StandardMaterial greys read lavender-blue in the shots even at (0.6,0.54,0.52) (critic 555 on tribal rocks and farmer walls): a warm grey needs r well over b; check palette.png first.
- Probes (loop/scripts/probes/) run from repo root; --build after source changes, --noglow for a swatch. They were written for units: read one before trusting it on a map.
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
- Round island (560): base lawn ("ground", "centerGrass") and underside slabs follow islandRim (superellipse 54 x 48, power 3); remap vertices radially by newR/oldR. fieldBlades_* are plain vertex meshes (4 per blade): collapse a quad past the rim onto its first vertex. hazeTreeline is one merged mesh: hide it whole. Base trunks are unparented (crowns are their children); skip disabled trunks.
- Scene fog is linear and re-keyed every frame by main.ts (fogStart/End from the camera radius): a map's fogDensity does nothing. Draw haze instead (inside-facing translucent mist walls, viking 572).
- Farmer base ring trees are oaks (mapBuilder oakRing: "canopy" disabled, crowns are "oakCrown" lumps on oakLeaves/oakLeavesDark): recolour those, not canopy (561). A raised drawn-only set piece (bridge hump) can carry units via MapBuildResult.height (farmer_1 bridgeHeight).
- A ribbon's facing follows its path order (SSAO greys a DOUBLESIDE one's inward faces): a down-facing deck renders black; check the first normal after convertToFlatShadedMesh and flipFaces(true) when wrong (561; viking bankFace 574 went near black). An underside facing away from the sun needs self-light ~1x its colour or it reads near black.
- Read stage armies from the stage files, not from Notes: tribal_2's "team 1 at x <= 40" was really x <= 24.4 (563), which freed 15 m for the massif. The campaign.challenge base's placement zones reach x +-61, past the 54 m rim: a builder that walls the field clips placementZones (centre/size) inside it.
- Upright tessellation-5/6 cylinders with flat tops read as basalt columns / a palisade from the top shot (tribal_2 massif, viking_sandbox wall, 563 critic+CONFIRM): a rock mass wants heaped faceted boulders or tilted slabs with few flat tops.
- Stage enemy positions are validated against the map's team-1 zone, hazards and obstacles (game.checkStage): a map change can misplace a stage's army (the checkpoint re-judges every stage on a finished map batch).
- campaign.challenge base dressing: "wallStone" (dark block row), "boulder", "hayBale", "hill", "stump", pit hazards (campaign_hazard_box_pit overlays) and "<displayName>_box|_cyl|_totem_top" junk. loadMapForCapture needs the "map." prefix. Name what is near a spot with a probe before claiming it gone (564, 565).
- Base meshes have static buffers: updateVerticesData changes only the CPU copy (rays see the new shape, the GPU draws the old). Reshape with setVerticesData (ancient_2 apron, 573-574).
- Night snow under blue moonlight: warm the diffuse to cancel the light's tint, carry the pale tone in self-light, and drop the field from the glow (farmer_snow 573, CONFIRM passed).
- Turf caps on cliff columns flicker when their top faces share a plane with the cliff or meadow. Set the cap slightly below the meadow and the shaft top inside the cap (Medieval 1, 567).
- The sandboxed shell blocks the capture's loopback calls to Vite: run captures with local network access.
- Bushy grass: flattened subdivision-1 IcoSpheres as thin instances on a ~0.8 m grid read as fuzzy cover; leaf cards read as beige flags (571).
- Varied-height cliff buttresses can leave sky below continuous ledges. Back the ledges with a skirt down to the adjoining tier and check the ground shot.
- Rooftops can hide a stage's army in a low camera; an elevated player-side diagonal shows it (Ancient 1).
- Base props: roots `<displayName>_<kind>` with child parts, collider at root x,z. Faces toward the island camera want self-light ~0.7.
