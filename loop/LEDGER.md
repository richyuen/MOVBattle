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
- 284 | board-off-under-blow | battle-feel.e | approved
- 284 | dynamite-stick | vfx.m | approved
- 285 | wizard-fireball | vfx.o | approved
- 285 | harpoon-gun | vfx.j | approved
- 286 | bone-mage-leaf-whirl | vfx.n | approved
- 286 | press-blow-lands | battle-feel.e | rejected
- 287 | press-blow-lands | battle-feel.e | rejected-kept
- 287 | wizard-cast-hold | vfx.o | approved
- 288 | swordcaster-flying-sword | vfx.p | approved
- 289 | bone-mage-staff-raise | vfx.n | approved
- 289 | press-blow-follow-through | battle-feel.e | approved
- 290 | harpoon-head | vfx.j | approved
- 291 | press-blow-off-feet | battle-feel.e | approved
- 291 | short-javelin | vfx.i | approved
- 292 | stoner-two-hand-boulder | vfx.k | approved
- 293 | press-second-rank-blow | battle-feel.e | rejected
- 293 | bomb-pair-fist-size | vfx.l | approved

## Spent gaps (never retry as [P]; an [S] on the same criterion is allowed)
slam airtime, zeus glow/pulse/skirt, giant healthScale/victory shot, boulders (map), airborne sit, clouds, far ridge, corpses, idle legs/arms, downed bodies, empty hud, witch brim/kink, lineup camera/unit size, spear length, catapult operator, streak length, red skin shade, hoop colour, smoke diameters, fire segments/emissives, result-foreground-club, run-arms-one-splay, crew hoops.

## Rows
simulationSystem.ts:pending blow + contact hold (_pendingBlows, blowLandsIn, BLOW_CONTACT_SLACK) | land at the aim's BLOW_LAND, slack .3 | 280 | approved | hit at swing start
proceduralAnimation.ts:_aimBlow overhead + follow (BLOW_LAND,_HOLD,_DROP,_CROWN,_LEAP,_OVERHEAD; BLOW_FOLLOW,_ARM,_PITCH,_LOW) | land .55 hold .6; follow .12 s arm 2.05 pitch +.3 head to .2 stand | 289 | approved | stopped on the crown, arm overhead (282); land at headTop (281)
runtimeUnit.ts:blow throw (BLOW_THROW_SECONDS,_HOLD,_PITCH,_SPEED,_LIFT,_MAX,_MIN; x kb x shoveResponse, no topple) | .6 s hold .28 pitch 1.3 head away (sign fixed); min 4.5/5.0, front-half straight back | 291 | approved | pitch .8 toward striker (sign bug), min 1.6/4.4 (289); no floor (287)
simulationSystem.ts:wall lets go of a thrown man (isBlowThrown: no slot snap/bracing; wall line = median depth of men not thrown) | median | 291 | approved | mean depth of all, thrown man snapped back
proceduralAnimation.ts:overhand throw (THROW_COCK, THROW_FOLLOW, THROW_SWING, THROW_LET_GO; THROWS_HELD_PROP javelin, bomb, stone) | cock -2.9/.3/-1.6 turn .4, follow -.35, swing .55, let-go .5 | 283 | approved | javelin, bomb (282); let-go .38, javelin only (281)
proceduralAnimation.ts:board off (BOARD_OFF_SECONDS,_HOLD,_FLING,_BUCKLE; knockBoardOff from staggerFromBlow) | .6 s hold .25; fling out 1.4 back .6; thigh .9 knee 1.6 sink .35 | 284 | approved | none (board stayed in the wall)
proceduralAnimation.ts:thrown pose (THROWN armsOut,armsBack,trunk,head,legs,knee; throwBack; cancels the board-off buckle) | 1.35, .45, .35, .45, .75, .35 | 287 | rejected-kept | none (knees buckled under the blow)
proceduralAnimation.ts:cast loose/hold (CAST_LOOSE, CAST_HOLD, CAST_LEVEL_TIP; castReleasesIn, fireball pending to the drive) | loose .68 hold .94 tip 0,.1,1 | 287 | approved | fired at cast start, drive .55-.68 out .82-1, tip z+1.1
proceduralAnimation.ts:bone mage overhead cast (CAST_RAISE_UP,_ARM,_TIP; boneStaff id; leaves pend to CAST_LOOSE from staff head) | up .4, arm -2.9/.32/-.12, tip .15,1,.3 | 289 | approved | wizard level drive, leaves from hand at cast start
projectileSystem.ts:fireball (FIREBALL_WIDE,_TAIL,_HEART,_SHELL; flat icospheres, heart-only glow; staffHeadOf origin) | .55 wide, tail .8; heart 1,.92,.55 shell 1,.45,.08 opaque, no bloom | 286 | approved | shell alpha .7 heart bloom (285); team-tinted sphere .25 (wizard flew a bolt)
projectileSystem.ts:harpoon missile (HARPOON_SHAFT_LONG,_WIDE,_HEAD_LONG,_WIDE,_BARBS,_BARB_LONG,_SWEEP; dark iron, streak) | shaft .5 x .05, head .24 x .15 flat, 2 barbs .17 swept .5 | 290 | approved | shared spear mesh, blue tip
propBuilder.ts:harpoon gun (HARPOON_GUN_LONG,_WIDE, HARPOON_MUZZLE; rope HARPOON_ROPE_WIDE,_COLOR) | .24 x .11 s, steel .42,.5,.66 lit .25; rope .035 dark | 285 | approved | held spear (shared spear mesh)
projectileSystem.ts:leaf whirl (LEAF_COUNT,_LONG,_WIDE,_WHIRL,_SPREAD,_SPIN,_COLORS; bone mage projectileHint leaves, from right hand) | 11 x .5 x .19, whirl .55 spread 1.2, spin 9 | 286 | approved | crossbow bolt from the waist
projectileSystem.ts:flying sword (SWORD_BLADE_LONG,_WIDE,_GUARD_WIDE,_GRIP_LONG,_COLORS; SWORD_HOVER, hover opt) | blade 1.0 x .1 white unlit, guard .3, grip .22; hover .7 s over head, speed 16 | 288 | approved | crossbow bolt from the waist
propBuilder.ts:javelin (JAVELIN_LONG,_HEAD_LONG,_HEAD_WIDE,_BARB_LONG,_BARB_SWEEP; dark iron leaf, red binding, grip near butt) | .4 s, head .13 x .09 thin x .45, barbs .06 swept .45 | 291 | approved | shared spear: 1.0 s pole, small steel tip
propBuilder.ts:bomb (BOMB_FISTS,_NECK,_FUSE; BOMB_SEAT_DOWN,_FORWARD,_TURN; offhand bomb kept) | 2.2 fists, neck .22 fuse .32; seat 1.15/.35 turn 1.7 | 293 | approved | one .15 s ball on the throw grip
propBuilder.ts:dynamite (DYNAMITE_STICKS,_STICK_WIDE,_LONG; red .8,.13,.1 bands black, fuse top at .18 s) | 3 sticks .05 x .26 s | 284 | approved | bomb ball .15 s
propBuilder.ts:boulder (BOULDER_WIDE,_SQUASH,_COLOR; faceted icosphere, thrown copy flies) | .26 s, y .88 z .94, .34,.31,.28 lit .15 | 292 | approved | head-sized smooth sphere .12 s
proceduralAnimation.ts:two-hand boulder carry + heave (BOULDER_CARRY,_DIP,_HEAVE; rock at hands midpoint) | carry -.6/.42/-.75; dip .25 trunk .55 knee .7; heave -2.4 trunk -.25 | 292 | approved | one-arm overhand throw (THROW_*)
propBuilder.ts:tree_club [R] (TREE_CLUB_LONG,_GRIP,_THICK,_BEND,_ROOTS,_ROOT_FAN,_CROWN,_LOBE,_LOBES; bent tube, limb, knot) | .6 stand, grip .15, thick .09, bend .12 up, 5 roots, crown .25 T, lobes centred on end | 269 | approved | lobes .3,-.5/1.25,-.35/.8,.7 hung (267); .8 stand, 4 square roots, 3-lobe clover .24 (265)
proceduralAnimation.ts:tree hip carry (TREE_HIP_ARM, TREE_HIP_TIP; bow spin +pi to face up) | arm raise -.9 out .15 elbow -.4; tip .9,.02,.35 | 269 | approved | raise -.35 out .12 elbow -.7, tip y -.02, bend hung under (267)

mapBuilder.ts:townRing (TOWN_INSET,_WIDE,_DEEP,_STOREY,_FLOORS,_NEAR,_WALLS,_ROOF; ring trees + haze hidden) | inset 5, wide 7.5-10.5, deep 7, storey 3.2 x3-4, near wall z<-30 | 269 | approved | puffball ring + 2 grey house boxes
propBuilder.ts:scythe steel (blade material; matte stone kind, self-light) | .81,.83,.84 emissive .15 stone | 269 | approved | .72,.73,.78 emissive .05 default
mapBuilder.ts:townPlaza (PLAZA_STONE, _JOINT, _TONES, _BASIN, _DRESSING; lawn hidden, grout .5,.47,.43; fountain) | 2.6 m, joint .28, tones ~.84,.8,.72 lit .15, basin 7 | 270 | approved | sage lawn, boulders/columns/trees
mapBuilder.ts:oakRing (OAK_SCALE, _LEAN, _BOLE, _LIMBS, _CROWN, _SQUASH, _SKIRT; introduction ring palette) | 1.35, lean .18-.4, bole .34, 2 limbs, crown .62 sq .5, 3 skirt; leaf .32,.52,.2 | 270 | approved | sage puffball ring
mapBuilder.ts:lagoonPools (LAGOON_ROUND,_SIDES,_RAGGED,_SHORE,_DEEP; theme.lagoon water/deep/shore) | power 2.6, 30 sides, ragged .08, shore 1.3, deep .58; water .26,.78,.66 deep .1,.56,.56 | 271 | approved | flat .42-alpha blue hazard box
mapBuilder.ts:meadowRuins (RUIN_FAR,_TOWER,_TOWER_SIDES,_TOWER_TALL,_PILLARS,_BLOCKS,_STONE; boulders+walls hidden) | far 28, tower 6.4 x9 sides 10 m, 5 pillars 1.8-6.8, 9 blocks; stone .76,.73,.64 lit .4 | 271 | approved | sandbox boulders + rubble walls
mapBuilder.ts:meadowCastle (CASTLE_X,_Z,_WIDE,_DEEP,_WALL,_CORNER,_KEEP,_KEEP_TALL,_TOWER,_TOWER_TALL,_STONE,_ROOF) | x -10 z 31, 26x10 wall 5, corner 3.8, keep 11x11, tower 4.6 to 17; roof .36,.42,.82 | 272 | approved | sandbox boulders/walls/bales + ruin prop
mapBuilder.ts:oakClump (theme.fieldOaks; OAK_CLUMP, _SPREAD, _TALL, _SHRINK, _LEAF, _DARK; growOak shared with oakRing) | 3-4 oaks, spread 2.6, tall 7, shrink .16; leaf .46,.64,.22 dark .3,.48,.17 | 273 | approved | ball on stalk, canopy grass x.8
