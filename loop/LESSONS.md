# Lessons (loop v10): facts about the pipeline, the capture and the renderer that outlive one item

Read at step 1; merge near cap. Unit-phase lessons: loop/archive/v4/LESSONS.md.

## Rendering (swiftshader + PBR + SSAO + ACES + glow)
- PBR colours are linear: an sRGB target c needs ~c^2.2 as the code. Pick values off `output/loop/palette.png` (`capture.mjs --palette`).
- Flat colour that survives ACES: an "unlit" material's colour comes from its EMISSIVE only (baseColor alone renders black), excluded from the glow layer (glow.addExcludedMesh). A saturated red needs emissive r > 1 and b near 0.
- ACES lifts mid code values toward pale: an unlit plate keeps a deep value; lit timber wants (.2,.11,.055) with a small self-light.
- "metal" renders near black: use "cloth" with a small emissive. Lit cloth in shade reads grey.
- A world box refreshes only on render: computeWorldMatrix(true) before reading bounds in a per-tick step. bakeCurrentTransformIntoVertices bakes the world matrix: bake, then parent.
- Flat pieces need left-handed winding or closed slabs. execSync eats a caret: sha~1.
- An excluded mesh does not occlude the glow: a dark one out of the pass wears the glow behind it as a pale veil (562, 586). Keep dark solids in.
- IcoSphere subdivisions 0 is falsy (becomes 4): use 1. A half-disc (arc .5) at rotation (PI/2,0,PI/2) faces +-x (595).
- Lit thin-instance wheat reads gold above, brown low: two unlit glow-excluded instance meshes sharing one matrix buffer.
- Full-frame image processing: contrast(gamma(ACES(1.05*c^2.2))); white renders210. simKit untoned() inverts it for skies/clouds (591).
- Sun dir (-.52,-.669,-.53) lights +x-facing slopes; a -x-facing one goes lilac. Bend its flat-shaded normals (after gridUVs) to one shared normal, not an unlit sheet (592).
- A pit below y 0 is lidded by the base slab (islandUnder/islandShelf, y -0.02): hide them (592).

## Capture and probes
- Regression-only replaces summary.json: back up world evidence and keep its smoke summary separately (599).
- capture-world: mulberry32 0x4d4f5642 reseeded each resetBattle, time via advanceTime, setupScale8; re-add body.capture-mode before shots (loads drop it).
- Never capture with a test --iter (pruneOld): use look/. Near-black set pieces vanish in black tree rings (587).
- Capture wipes iter-N unless --add: save reviews after the last capture; audit step5 needs --add. Background step5 (~12min).
- A maroon/blue "ground tint" is the base's zone slabs (campaign_zone_overlay_*/border_*): hide them before recolouring a floor (577). A colour swap under full-width cap slabs never shows (pirate sterns 577).
- Dev probe (5173): import the Babylon resource URL; EngineStore.LastCreatedScene is the live map scene.

## Maps and stages
- Stage scenery is drawn per stage id in stagePresentation.ts, no colliders; may move a map mesh if restored. [id,x,z,yaw] turns a unit. Scenery on a rank's -x sight line hides it in _army (614).
- Inherited placement zones can omit clear streets or inner ice. Append valid side-specific strips, keeping the original skirmish zone first (599).
- The sim ground is flat (root y 0); terrain.ts lifts dynamic roots by MapBuildResult.height at draw time and recomputes world matrices after, so battles are identical with or without height (Hill). Map meshes are static (trackMapBuild): a builder seats props at groundHeightAt(). Nav/placement come from zones, obstacles, hazards. An effect rooted at the origin with world-placed children is lifted by the origin height: give such roots their own position.
- terrainMesh winds its grid to face +y; skirts are double-sided. The placement centre line and zone overlays stay flat (they are map meshes).
- A TABS map without a builder in web/src/map/tabs/ is its base map (tabsMaps.ts); several maps share a base, so a base edit moves all of them and the regression scenarios on campaign.adventure.
- Clear base props by name after base(), removing only their colliders (ring trees have them too). Keep builders self-contained so reverts never conflict. Base "hill" mounds and odd ground discs are base meshes: hide by name (587).
- A set piece inside a merged tree belt needs a clearing before the trees merge (580).
- Base crowns read pale because CanopyAerialPlugin and scene fog mix them toward sky-white: fresh crown materials made after base() (diffuse = emissive = c*0.55), applyFog false, out of the glow, stay saturated (tribal_1 556).
- A map build disposes every material it makes (trackMapBuild), so a builder may recolour base materials by name ("grass", "groundMat", blades); hide blades by name fieldBlades_*/grassTuft. Base props are `<displayName>_cyl|_box|_totem_top`, colliders at the same x,z.
- Dense crops: thin instances; keep them under waist height or armies vanish (556). Static base meshes need setVerticesData to upload reshaped geometry (573).
- A map build does not reset scene lights (hemi, dir); a builder that changes them restores them in its MapBuildResult.dispose, chained to the base's (557). The far range and second slab are base meshes mountainBase/Cap/Root, clouds are "cloud": hide them by name.
- Ground pose (from x -30 looking +x) frames |z| < ~20 at x 0: place set pieces there or name the top shot. A face pointing +-x (a stern) shows in no shot (594).
- The translucent box framing maps in the top shot is those zone slabs too (createPlacementGuides), a map mesh. Island underside = islandUnder + islandShelf + islandCliff (merged crags); farmer_1's earthBowl replaces them. MeshBuilder.CreatePolygon needs earcut (absent): fan a ribbon to a hub instead.
- The island shot (radius 120, elevation ~16 deg) foreshortens the underside hard: make it ~0.3-0.4 of the island width deep or it reads as a thin band (farmer_1's 22 m bowl shows ~7 m, 559).
- Round island (560): base lawn ("ground", "centerGrass") and underside follow islandRim (superellipse 54x48, power 3); remap radially. hazeTreeline (merged grey balls at |z| 37.5-40.5) reads as a boulder chain: hide it whole (pirate 585). Base trunks are unparented.
- Scene fog is linear and re-keyed every frame by main.ts (fogStart/End from the camera radius): a map's fogDensity does nothing. Draw haze instead (inside-facing translucent mist walls, viking 572).
- Farmer base ring trees are oaks ("oakCrown" lumps on oakLeaves/oakLeavesDark): recolour those, not canopy (561). A raised drawn-only set piece can carry units via MapBuildResult.height (farmer_1 bridgeHeight).
- A ribbon faces by path order (SSAO greys a DOUBLESIDE one inside): a down-facing deck renders black; check the first normal after convertToFlatShadedMesh, flipFaces(true) if wrong (561, 574). An underside away from the sun needs self-light ~1x its colour.
- Read stage armies from the stage files, not Notes (tribal_2 563). campaign.challenge zones reach x +-61, past the 54 m rim: a builder that walls the field clips placementZones inside it.
- Upright tessellation-5/6 cylinders with flat tops read as basalt columns or a palisade (563): a rock mass wants heaped faceted boulders or tilted slabs, few and large, of unequal size (spooky_1 583: equal rocks read as an even band).
- Stage enemies are validated vs team-1 zone, hazards, obstacles (game.checkStage); a map change can misplace them. Check a re-lay before committing: dynasty zone is x>=29, canal spur ~(31.5,7.9) (611).
- campaign.challenge dressing: wallStone, boulder, hayBale, hill, stump, pits, "<name>_box|_cyl". loadMapForCapture needs "map." (564).
- The shared skyDome covers clearColor: hide/restore it and draw a fog-free unlit sky sphere (Legacy 582); a vertex-colour gradient needs emissive white, diffuse black (unlit colour = emissive x vertex colour; 586).
- capture-world builds a production snapshot first: source edits after its "starting vite preview" line do not reach that run (586).
- Night snow under blue light: warm the diffuse, carry the pale tone in self-light, field out of the glow (farmer_snow 573).
- Turf caps on cliff columns flicker if coplanar with cliff or meadow: cap slightly below the meadow, shaft top inside the cap (567).
- Run captures unsandboxed. Island cam sky band: z~200, y -25..35.
- Moving a set piece can put a fixed pose inside it (pirate 602: ground cam x -30 in a hull): view every shot after. Turn/scale one: build local, bakeTransformIntoVertices.
- Sim-family maps (588): tabs/simKit.ts (grid blocks, bareField, voidAround). setPlacementGuidesVisible re-enables every mesh named "border": rename a base one to hide it. terrainMesh skirts carry both windings: give them a backFaceCulling material.
- Grass: thin-instance fans of six blades, normals up (583); flattened IcoSpheres read as paving from low cameras, leaf cards as beige flags (571).
- MergeMeshes: null past 65536 verts unless (parts,true,true); throws on mixed attributes (VertexData needs uvs); a throwing build leaks into later maps (593).
- A boulder heap receiving shadows goes near black: receiveShadows off, self .6 (583); slate (.09) vanishes on a void sky (595). Back cliff ledges with a skirt (584).
- Builder hazards get no overlay: draw them (578). Self-lit/pale meshes in the glow bloom white and veil nearby water: exclude them (584-608).
- Water from a structure is credited only as one run visible in the named shot (source face, channel, cascade); loose pieces read as tiles (608).
- Stage _army: camera west of the line, -z on the right; roofs can hide ranks. Use a high view for street armies (583,599).
- HeightField lifts passers-by onto roofs: actor-only seats need paired render observers, restored transforms before simulation and cleanup on reset (598,601).
- The island cam never sees under the slab: a backdrop or rock mass must rise above the deck behind the rim (fantasy_evil 596). Notches: ~8 m hide under trees/rocks; pushing radial floor verts to a cut's nearest edge bevels it (596, 598).
- Recess a descent before merging cliff columns (579). A concave bank: lengthwise strips, no hub fan (581).
