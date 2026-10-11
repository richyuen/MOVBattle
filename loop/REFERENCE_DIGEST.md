# TABS reference digest

What Totally Accurate Battle Simulator looks and feels like, distilled once from `reference/`
(9 store screenshots, 3 trailers, 16 min of gameplay). Paths: `reference/small/tabs_screenshot_NN.jpg`
(960px), `reference/frames/*_sheet_NN.jpg` (3x3 tiles, r=row c=col from top-left). The 16-min video
is mostly unit possession (first-person), so its sheets matter for HUD and map framing, not combat.
Read-only during the loop. The gap list in STATE.md is derived from this.

## 1. Battle feel and physics
- Units are floppy ragdolls that never stop moving: arms windmill, torsos lean into runs, heads bob. Idle units sway; nothing stands rigid.
- Melee is a shoving contest. Front lines collide and compress, bodies pile up two deep, shields overlap into a solid wall. Dead units lie where they fell and stay in the scene as obstacles.
- Big impacts send bodies flying in arcs: a mammoth charge or a hammer hit launches 3-6 units at once (trailer_3_sheet_01 r1c2 shows a whole line airborne). Hit units spin end over end.
- Attacks are telegraphed: wide windup, then a committed swing that visibly connects. Spears thrust from behind shield lines; axes come over the top.
- Deaths are physical, not animated: the body goes limp mid-pose and drops. Skeleton units fall apart into loose bones (tabs_screenshot_09).
- Crowd density is the spectacle: 20-60 units a side, dense enough to hide the ground.
- Reference: trailer_3_sheet_01 (r1c1 melee shove, r1c2 launch), trailer_2_sheet_02 r1c1 (clash with debris), tabs_screenshot_01 (mammoth charge with bodies underfoot).

## 2. Unit look and silhouettes
- Low-poly faceted bodies, matte flat shading, no outlines. Faces are two black bead eyes on a plain head; mouths rare.
- Team color is the skin: blue team has blue skin and blue-tinted gear, red team has red skin and red gear. Faction identity comes from hats, weapons, cloth shapes, and accent colors layered on top.
- Props are oversized and readable at distance: shields are round and shoulder-wide, clubs are thick, spears longer than the unit is tall, hats exaggerated (knight bucket helm, wizard cone).
- Proportions: long thin limbs, small head, hands are mitts. Giants (mammoth, trees) are 4-8x human height with the same faceting.
- Cloth and fur are solid chunks, not flowing: a viking's fur collar is a faceted ring; a cape is a rigid wedge that sways.
- Reference: tabs_screenshot_06 (shield wall, valkyries), tabs_screenshot_02 (hero scale), trailer_3_sheet_02 r1c1 (knights, musketeers, tank crew), tabs_screenshot_04 (unit creator stats panel).

## 3. Maps, lighting and color
- Every map is a small floating island or arena with a visible edge, ringed by trees or walls, with a clear flat fighting field in the middle and a faint center line splitting the two placement halves.
- Strong, warm, directional sun with soft long shadows. Sky is a flat pastel gradient with a few puffy low-poly clouds. Slight bloom and vignette, colors desaturated toward pastel.
- Each biome has one dominant palette: autumn tribal (orange grass, red trees, teal sky), farm (yellow wheat, hedgerows, barn), medieval (green meadow, grey castle), winter (ice blue, snow pines), pirate (sand, palms, ship), spooky (navy night, pink glow), heaven (white marble, clouds), dynasty (pink cherry trees, pagoda, canals).
- Terrain is faceted low-poly with gentle hills, scattered boulders, tufts of grass as tiny flat cards. Props like barrels, fences, wheat rows, ruins add set dressing.
- Reference: tabs_screenshot_03 (dynasty castle map), tabs_screenshot_05 (western sunset grading), gameplay_sheet_01 r3c2 (farm arena top-down), trailer_1_sheet_01 r1c1 (floating island).

## 4. UI, HUD and placement flow
- Placement HUD: top center has a big "Start" pill with "Clear" beside it; top right has "Levels". Bottom center is a wide arc tray of faction unit icons with names, framed by a thin ornamental border. Bottom left shows the team budget counter plus unit count with small icons.
- Unit tray icons are white line-art silhouettes on dark tiles; the selected faction tab sits above the tray. Everything is thin white text, small, with lots of empty screen.
- Placement view is a high oblique top-down of the whole arena with the center line visible; units placed as small figures. Ghost preview follows the cursor.
- Victory: full-width dark band at top and bottom, "VICTORY!" in white caps, "PRESS [TAB] TO CONTINUE" at the bottom, over a slow cinematic shot of the survivors.
- Campaign select is a level list on a map; sandbox has faction tabs. No health bars over units.
- Reference: gameplay_sheet_02 r1c3 (placement HUD), gameplay_sheet_02 r1c2 (victory band), gameplay_sheet_03 r3c2 (tray with budget), tabs_screenshot_04 (menu typography).

## 5. Camera and framing
- Default battle camera is low and close: eye level with the units, slightly above, a few body lengths back, so the front line fills the frame and the sky takes the top third.
- Spectator shots in trailers push even lower, nearly ground level looking up at giants and launches.
- Placement camera is high and oblique, showing the whole island. The switch from placement to battle is a swoop down into the action.
- Free camera orbits, zooms close enough to see faces. Possession camera is over the shoulder.
- Reference: tabs_screenshot_01 and 06 (low battle angle), tabs_screenshot_08 (ground-level cannon line), gameplay_sheet_01 r3c3 (placement oblique).

## 6. VFX and projectiles
- Arrows and spears are long thin sticks that leave a brief white streak; they stick into bodies and the ground and stay there.
- Cannon and musket fire: a fat white smoke puff at the muzzle, a visible black ball, a dust burst and bodies flung on hit (trailer_3_sheet_03 r2c1 fireball, r3c1 arc of cannon shots).
- Magic is bold and graphic: solid-color rings, glowing shapes, pink domes, lightning as jagged white polygons (trailer_2_sheet_03 r1c2, r3c2).
- Blood is minimal: a few dark red chunks. Debris is chunky low-poly bits, not particles.
- Hit flashes are rare; impact is sold by motion (ragdoll launch) rather than sparkles.
- Reference: trailer_3_sheet_03 (cannon, arrows, hands), tabs_screenshot_09 (magic dome), trailer_2_sheet_02 r1c2 (debris and shields).
