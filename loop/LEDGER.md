# Loop ledger: every value the loop has tuned

Rows: `file:identifier | current value | last iter | verdict | earlier values (newest first)`.
Verdicts: approved, rejected, pending, spent. A row is `spent` after two attempts without approval
or when it was listed as never-retry; it is not pickable as [P]. The critic rejects a [P] gap that
reverses or re-nudges a row approved within the last 20 iterations ("ledger reversal"). An [S] gap
that replaces the mechanism owning a row may set new values: the worker resets the row to pending
and keeps the old value under earlier values. One row per tuning knob a mechanism exposes, not per
line; a value column is at most 80 characters (name the knobs, not their story). The worker updates
rows at commit time (pending) and after verdicts. Drop rows untouched for 25 iterations.

## Rows

## Structural attempts (last 10 iterations; `iter | gap | criterion | verdict`)
- 265 | evil-lich-branch-crown | unit-look.t | approved
- 265 | tree-club-three-lobe | unit-look.u | approved
- 266 | void-monarch-bone-crown | unit-look.t | approved
- 266 | reaper-crescent-blade | unit-look.p | rejected
- 267 | reaper-high-carry | unit-look.p | approved
- 267 | tree-giant-carry-rebuild [R] | unit-look.u | approved
- 268 | reaper-blade-mount | unit-look.p | approved
- 268 | jouster-flat-drape | unit-look.n | approved
- 269 | tree-giant-hip-carry | unit-look.u | approved
- 269 | renaissance-townhouse-row | maps-light.m | approved
- 270 | renaissance-plaza-paving | maps-light.m | approved
- 270 | meadow-oak-ring | maps-light.i | approved
- 271 | adventure-pool-water | maps-light.j | approved
- 271 | meadow-ruin-pillars | maps-light.i | approved
- 272 | adventure-castle | maps-light.j | approved
- 273 | field-oak-clumps | maps-light.j | approved

## Spent gaps (never retry as [P]; an [S] on the same criterion is allowed)
slam airtime, zeus glow/pulse/skirt, giant healthScale/victory shot, boulders (map), airborne sit, clouds, far ridge, corpses, idle legs/arms, downed bodies, empty hud, witch brim/kink, lineup camera/unit size, spear length, catapult operator, streak length, red skin shade, hoop colour, smoke diameters, fire segments/emissives, result-foreground-club, run-arms-one-splay, crew hoops.

propBuilder.ts:fitted tricorn/pirate_hat (TRICORN_DOME, _CROWN, _BRIM, _WALL, _LEAN, _SKULL; crew bandana accents) | dome 1.12, crown 0.16, brim 2.3, wall 0.42 lean 0.3, skull 0.26 | 250 | approved | box on a flat triangle (stovepipe)
unitFactory.ts:dressSkeleton (SKELETON_BONE, _LIMB, _SPINE, _RIBS, _RIB_TOP/_LOW, _SKIRT, _HEM, _TATTERS, _CLOTH; yoke hidden) | bone 1,0.86,0.6; limb 0.42, spine 0.16, 4 ribs 0.86-0.42, skirt 0.7 hem 1.45, 6 tatters | 250 | approved | fleshed body, secret_bone preset
unitFactory.ts:dressReaper (REAPER_HOOD, _OPEN, _FORWARD, _JAW, _JAW_LONG, _SKIRT, _HEM, _TATTERS; cowl gap on the face) | open 0.46 fwd -0.24, jaw 0.5 x 0.5; skirt 0.85, rags 0.13-0.25 | 252 | approved | open 0.4 fwd -0.06 gap at back, skirt 1.55 (251)
propBuilder.ts:scythe (SCYTHE_SNATH,_BLADE,_SEGS,_CURL,_LEVEL,_HEEL,_SPINE,_BOW,_GRIP; ramped curl, socket+tang) | 1.25 s, .8 in 14, curl 1.3 ramped, level -.6, heel .17, bow .05, grip .15 | 268 | approved | curl 1.75 even, rise .35 (267); 6 box segs (252)
propBuilder.ts:antler_skull (DEER_MUZZLE, _DIP, _BEAM, _SPLAY, _TINE, _ANTLER; on bone_mask cap) | muzzle 0.95 dip 0.7; beam 1.05+0.9 H, splay 0.95/0.4, tine 0.58, antler 0.66,0.5,0.33 | 251 | approved | bone_mask
mapBuilder.ts:addShip galleon (SHIP_LONG, _BEAM, _HULL, _CASTLE, _MASTS, _YARD, _BRACE; sail emissive 0.4) | 17 m, beam 0.26, hull 0.15, castle 0.24, masts .62/.74/.55, yard 1.45, brace 0.55 | 252 | approved | olive box + slab sail
mapBuilder.ts:palmRing + seaRim (PALM_LEAN, _BANDS, _FRONDS, _FROND, _ARCH; SEA_RIM, _SHORE, _GLOW; pirate palms share) | lean .22-.5, 4 bands, 6-8 fronds .5 H, arch .35/-.25/-.85; rim 5 m, shore 1.2, glow .3; .72 | 253 | approved | puffball ring, 0.42-alpha hazard tint
propBuilder.ts:tree_club [R] (TREE_CLUB_LONG,_GRIP,_THICK,_BEND,_ROOTS,_ROOT_FAN,_CROWN,_LOBE,_LOBES; bent tube, limb, knot) | .6 stand, grip .15, thick .09, bend .12 up, 5 roots, crown .25 T, lobes centred on end | 269 | approved | lobes .3,-.5/1.25,-.35/.8,.7 hung (267); .8 stand, 4 square roots, 3-lobe clover .24 (265)
proceduralAnimation.ts:tree hip carry (TREE_HIP_ARM, TREE_HIP_TIP; bow spin +pi to face up) | arm raise -.9 out .15 elbow -.4; tip .9,.02,.35 | 269 | approved | raise -.35 out .12 elbow -.7, tip y -.02, bend hung under (267)
proceduralAnimation.ts:scythe high carry (SCYTHE_HIGH_ARM, SCYTHE_HIGH_TIP, SCYTHE_SPIN; fixed, carryTurn 1) | arm raise -.95 out .22 elbow -1.05; tip .6,.78,.15; spin pi/2 | 267 | approved | rode the arm (no carry)
propBuilder.ts:buildHorse drape (HORSE_CAP_LONG,_END,_SQUARE,_BEVEL,_HEM_SHARE,_UPPER_SHOW; flat deck) | hem .5, end .55 square .35, bevel .07, long 1.32, show .32 | 268 | approved | domed profile, end .7, long 1.15 (262); lathe sack (260)
unitFactory.ts:dressTreeGiant (TREE_GIANT_HOOD, _OPEN, _BEARD, _BEARD_WIDE, _SKIRT, _HEM, _TATTERS; tunic/hair/rags) | hood 1.32 open .42, beard 1.05 x .85, skirt .85 hem 1.3, 8 rags; hair .42,.15,.17 team .1 glow .18 | 265 | approved | hair .3,.15,.12 team .35 (253)
unitFactory.ts:dressPainter + palette (PAINTER_DOUBLET, _BERET, _HOSE, _RUFF, _RUFF_TIERS; PALETTE_WIDE, _TIP, _TURN) | doublet .6, beret .42, hose .92,.6,.3, ruff 1.25 x2; palette .24, tip -1, turn .4 | 255 | approved | plain team body, no palette
unitFactory.ts:dressCactus (CACTUS_ROBE, _LONG, _HOOD, _HOOD_OPEN, _SLEEVE, _SPINES, _SPINE; flowers) | hem 1.55 W, .86 leg, hood 1.6 open .26, sleeve 1.4, 34+3/arm+6, spine .4 heads | 256 | approved | cactus_body trunk + 10 spines
mapBuilder.ts:broadleafBush in palmRing (BUSH_LUMPS, _TALL, _WIDE, _LEAVES, _GREEN; non-palm ring trees) | 3-5 lumps, tall .3 H, wide .42 H, 5-7 leaves, green .16,.36,.15 | 255 | approved | pale-sage puffball crown

mapBuilder.ts:sandSpits shoreline [R] (SPIT_*; wet band only over water via overWater; dry = lawn mat, SPIT_SAND_GLOW; pirate ground/grass sand) | wet .7 band, glow .12; ground .84,.72,.5 grass .8,.68,.46 | 258 | approved | wet fan under every lobe, sea-mat dry (257); olive field
mapBuilder.ts:barePlane (theme.bare; BARE_PLANE, BARE_KEEP; simulation ground/fog) | 1600 m, keep ground+lawn, no obstacles/props; plane .86,.85,.82 fog .9,.89,.86 | 260 | approved | purple-grey island with ring, crystals, columns
unitFactory.ts:dressPaladin (PALADIN_WHITE, _GOLD, _GLOW, _GOLD_GLOW, _BELT, _KNEE, _HELM_BAND; helm comb, shield rim/cross gold) | white .93,.94,.96 glow .2; gold .95,.52,.06 glow .22; knee 1.15 | 259 | approved | plain good_gold team body
propBuilder.ts:buildHorse pinto style (PINTO_COAT, _CREAM, _PINK, _GLOW, _PATCHES, _PATCH, _RAGGED, _EYE, _EAR, _LOOP; wildwest_leather) | coat .95,.42,.1, glow .18, 6 patches dot .83, eye .075, ear .3, loop .42 | 258 | approved | barded horse
mapBuilder.ts:bareCentreLine (theme.bare; BARE_LINE_WIDE, BARE_LINE_RED; replaces zone fills/borders, named border) | 0.16 m x 1600 m, red .78,.22,.3 self-lit | 261 | approved | tinted zone fills + borders, 10 m untinted gap
vehicleBuilder.ts:buildSacredElephant (ELEPHANT_HIDE,_GOLD,_GEM; TUSK_RING_PIECE; BLANKET_RADII/_AT; THRONE_SEAT,_BACK_TALL; RIDER_SCALE) | hide .74,.75,.76; ring piece 4; blanket .92x.8x.74 at z-.46; seat .9; rider 2.4 | 261 | approved | buried shrine posts/canopy/halo on mammoth
unitFactory.ts:dressVoidCultist (VOID_ROBE,_GLOW,_BAND_GLOW,_SKIRT,_HEM,_WHEEL,_SPOKES,_BEARD,_STRANDS,_SHIELD,_STUDS) | robe .3,.15,.12 glow .12; band .3; skirt 1.75 hem 1.6; wheel 2.1 x10; shield 1.5 x8 | 262 | approved | hood + cape
unitFactory.ts:dressHornedEvil (HORNED_EVIL horns, EVIL_*; MONARCH_SPIKES, _PAULDRON, _THICK) | root .24 H, spike .32; lich 7 tines 2.4 H; monarch spike 1.5 H, pauldron .62/.17 | 266 | approved | no monarch (crown hat); plain hood
unitFactory.ts:dressSuperPeasant (STRAW_COLOR,_GLOW,_LOCKS,_LOCK,_SWEEP; SACK_COLOR,_GLOW,_SKIRT,_ROPE) | straw .92,.66,.24 glow .2, 16 locks 1.1 heads sweep .75; sack .9,.88,.82 skirt .62 | 263 | approved | laurel + hair cap
vehicleBuilder.ts:buildChariot (CHARIOT_HORSE, HORSE_BARREL, _GALLOP, _CAR_Z, _FLOOR, _RIM, _WHEEL, _SPOKES, _DRIVER; hide) | horse y1.22 barrel .6x.72x1.7; rim 1.2, wheel .92 x6, driver 2.3; hide .74,.5,.4 | 264 | approved | team-box horse + cart, operator 0.46
propBuilder.ts:feather_hat (FEATHER_HAT_BRIM, _DIP, _COCK, _CROWN, _TALL, _TEAM, _STRAW; FEATHER_LONG, _PIECES, _WIDE, _RAKE, _CURL) | brim 2.05 dip .14 cock .2; straw .8,.54,.3 team .06; feather 1.9 H x4, wide .42 | 264 | approved | purple beret
mapBuilder.ts:townRing (TOWN_INSET,_WIDE,_DEEP,_STOREY,_FLOORS,_NEAR,_WALLS,_ROOF; ring trees + haze hidden) | inset 5, wide 7.5-10.5, deep 7, storey 3.2 x3-4, near wall z<-30 | 269 | approved | puffball ring + 2 grey house boxes
propBuilder.ts:scythe steel (blade material; matte stone kind, self-light) | .81,.83,.84 emissive .15 stone | 269 | approved | .72,.73,.78 emissive .05 default
mapBuilder.ts:townPlaza (PLAZA_STONE, _JOINT, _TONES, _BASIN, _DRESSING; lawn hidden, grout .5,.47,.43; fountain) | 2.6 m, joint .28, tones ~.84,.8,.72 lit .15, basin 7 | 270 | approved | sage lawn, boulders/columns/trees
mapBuilder.ts:oakRing (OAK_SCALE, _LEAN, _BOLE, _LIMBS, _CROWN, _SQUASH, _SKIRT; introduction ring palette) | 1.35, lean .18-.4, bole .34, 2 limbs, crown .62 sq .5, 3 skirt; leaf .32,.52,.2 | 270 | approved | sage puffball ring
mapBuilder.ts:lagoonPools (LAGOON_ROUND,_SIDES,_RAGGED,_SHORE,_DEEP; theme.lagoon water/deep/shore) | power 2.6, 30 sides, ragged .08, shore 1.3, deep .58; water .26,.78,.66 deep .1,.56,.56 | 271 | approved | flat .42-alpha blue hazard box
mapBuilder.ts:meadowRuins (RUIN_FAR,_TOWER,_TOWER_SIDES,_TOWER_TALL,_PILLARS,_BLOCKS,_STONE; boulders+walls hidden) | far 28, tower 6.4 x9 sides 10 m, 5 pillars 1.8-6.8, 9 blocks; stone .76,.73,.64 lit .4 | 271 | approved | sandbox boulders + rubble walls
mapBuilder.ts:meadowCastle (CASTLE_X,_Z,_WIDE,_DEEP,_WALL,_CORNER,_KEEP,_KEEP_TALL,_TOWER,_TOWER_TALL,_STONE,_ROOF) | x -10 z 31, 26x10 wall 5, corner 3.8, keep 11x11, tower 4.6 to 17; roof .36,.42,.82 | 272 | approved | sandbox boulders/walls/bales + ruin prop
mapBuilder.ts:oakClump (theme.fieldOaks; OAK_CLUMP, _SPREAD, _TALL, _SHRINK, _LEAF, _DARK; growOak shared with oakRing) | 3-4 oaks, spread 2.6, tall 7, shrink .16; leaf .46,.64,.22 dark .3,.48,.17 | 273 | approved | ball on stalk, canopy grass x.8
