# Loop ledger: every value the loop has tuned

Rows: `file:identifier | current value | last iter | verdict | earlier values (newest first)`.
Verdicts: approved, rejected, pending, spent. A row is `spent` after two attempts without approval
or when it was listed as never-retry; it is not pickable as [P]. The critic rejects a [P] gap that
reverses or re-nudges a row approved within the last 20 iterations ("ledger reversal"). An [S] gap
that replaces the mechanism owning a row may set new values: the worker resets the row to pending
and keeps the old value under earlier values. One row per tuning knob a mechanism exposes, not per
line; a value column is at most 80 characters (name the knobs, not their story). The worker updates
rows at commit time (pending) and after verdicts. Drop rows untouched for 25 iterations.

## Structural attempts (last 10 iterations; `iter | gap | criterion | verdict`)
- 276 | landed-blow-on-hit | battle-feel.e | rejected
- 277 | target-aimed-blow [R] | battle-feel.e | rejected
- 278 | aimed-blow-final-layer [R] | battle-feel.e | rejected
- 279 | overhead-blow | battle-feel.e | rejected
- 280 | overhead-blow | battle-feel.e | approved
- 281 | overhead-blow-stagger | battle-feel.e | approved
- 281 | held-prop-release | vfx.i | approved
- 282 | overhead-blow-crown | battle-feel.e | approved
- 282 | held-bomb-release | vfx.l | approved
- 283 | head-snap-under-crown | battle-feel.e | rejected
- 283 | stoner-held-rock-release | vfx.k | approved
- 284 | board-off-under-blow | battle-feel.e | approved
- 284 | dynamite-stick | vfx.m | approved
- 285 | wizard-fireball | vfx.o | approved
- 285 | harpoon-gun | vfx.j | approved

## Spent gaps (never retry as [P]; an [S] on the same criterion is allowed)
slam airtime, zeus glow/pulse/skirt, giant healthScale/victory shot, boulders (map), airborne sit, clouds, far ridge, corpses, idle legs/arms, downed bodies, empty hud, witch brim/kink, lineup camera/unit size, spear length, catapult operator, streak length, red skin shade, hoop colour, smoke diameters, fire segments/emissives, result-foreground-club, run-arms-one-splay, crew hoops.

## Rows
simulationSystem.ts:pending blow + contact hold (_pendingBlows, blowLandsIn, BLOW_CONTACT_SLACK) | land at the aim's BLOW_LAND, slack .3 | 280 | approved | hit at swing start
proceduralAnimation.ts:_aimBlow overhead (BLOW_LAND,_AIM_FROM,_HOLD,_ELBOW,_PITCH,_OVERHEAD,_DROP,_CROWN,_LUNGE,_LEAP; _crownOf; FLINCH_*) | crown = hat shell top, leap up to .5 stand; land .55 hold .6, drop .25, flinch .12 .85/.9 | 282 | approved | land at headTop (281); fist at grip of 35deg line (279)
runtimeUnit.ts:blow stagger (BLOW_STAGGER_SECONDS,_HOLD,_PITCH,_STEP; from _landMeleeBlow on every heavy_swing hit) | .35 s, hold .12, pitch .38, step .3 | 282 | approved | pending blows only (281); neck flinch only
proceduralAnimation.ts:overhand throw (THROW_COCK, THROW_FOLLOW, THROW_SWING, THROW_LET_GO; THROWS_HELD_PROP javelin, bomb, stone) | cock -2.9/.3/-1.6 turn .4, follow -.35, swing .55, let-go .5 | 283 | approved | javelin, bomb (282); let-go .38, javelin only (281)
proceduralAnimation.ts:board off (BOARD_OFF_SECONDS,_HOLD,_FLING,_BUCKLE; knockBoardOff from staggerFromBlow) | .6 s hold .25; fling out 1.4 back .6; thigh .9 knee 1.6 sink .35 | 284 | approved | none (board stayed in the wall)
projectileSystem.ts:fireball (FIREBALL_WIDE,_TAIL,_HEART,_SHELL; flat icospheres, heart-only glow; staffHeadOf origin) | .55 wide, tail .8; heart 1,.92,.55 shell 1,.45,.08 | 285 | approved | team-tinted sphere .25 (wizard flew a bolt)
propBuilder.ts:harpoon gun (HARPOON_GUN_LONG,_WIDE, HARPOON_MUZZLE; rope HARPOON_ROPE_WIDE,_COLOR) | .24 x .11 s, steel .42,.5,.66 lit .25; rope .035 dark | 285 | approved | held spear (shared spear mesh)
propBuilder.ts:dynamite (DYNAMITE_STICKS,_STICK_WIDE,_LONG; red .8,.13,.1 bands black, fuse top at .18 s) | 3 sticks .05 x .26 s | 284 | approved | bomb ball .15 s
propBuilder.ts:scythe (SCYTHE_SNATH,_BLADE,_SEGS,_CURL,_LEVEL,_HEEL,_SPINE,_BOW,_GRIP; ramped curl, socket+tang) | 1.25 s, .8 in 14, curl 1.3 ramped, level -.6, heel .17, bow .05, grip .15 | 268 | approved | curl 1.75 even, rise .35 (267); 6 box segs (252)
propBuilder.ts:tree_club [R] (TREE_CLUB_LONG,_GRIP,_THICK,_BEND,_ROOTS,_ROOT_FAN,_CROWN,_LOBE,_LOBES; bent tube, limb, knot) | .6 stand, grip .15, thick .09, bend .12 up, 5 roots, crown .25 T, lobes centred on end | 269 | approved | lobes .3,-.5/1.25,-.35/.8,.7 hung (267); .8 stand, 4 square roots, 3-lobe clover .24 (265)
proceduralAnimation.ts:tree hip carry (TREE_HIP_ARM, TREE_HIP_TIP; bow spin +pi to face up) | arm raise -.9 out .15 elbow -.4; tip .9,.02,.35 | 269 | approved | raise -.35 out .12 elbow -.7, tip y -.02, bend hung under (267)
proceduralAnimation.ts:scythe high carry (SCYTHE_HIGH_ARM, SCYTHE_HIGH_TIP, SCYTHE_SPIN; fixed, carryTurn 1) | arm raise -.95 out .22 elbow -1.05; tip .6,.78,.15; spin pi/2 | 267 | approved | rode the arm (no carry)
propBuilder.ts:buildHorse drape (HORSE_CAP_LONG,_END,_SQUARE,_BEVEL,_HEM_SHARE,_UPPER_SHOW; flat deck) | hem .5, end .55 square .35, bevel .07, long 1.32, show .32 | 268 | approved | domed profile, end .7, long 1.15 (262); lathe sack (260)
unitFactory.ts:dressTreeGiant (TREE_GIANT_HOOD, _OPEN, _BEARD, _BEARD_WIDE, _SKIRT, _HEM, _TATTERS; tunic/hair/rags) | hood 1.32 open .42, beard 1.05 x .85, skirt .85 hem 1.3, 8 rags; hair .42,.15,.17 team .1 glow .18 | 265 | approved | hair .3,.15,.12 team .35 (253)

mapBuilder.ts:barePlane (theme.bare; BARE_PLANE, BARE_KEEP; simulation ground/fog) | 1600 m, keep ground+lawn, no obstacles/props; plane .86,.85,.82 fog .9,.89,.86 | 260 | approved | purple-grey island with ring, crystals, columns
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
