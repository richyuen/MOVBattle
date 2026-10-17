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
- 303 | stroke-cadence-and-contact-hold [R] | battle-feel.e | rejected
- 304 | press-close-in | battle-feel.e | rejected
- 305 | press-contact-dwell | battle-feel.e | approved
- 305 | hip-led-launch | battle-feel.g | approved
- 306 | kick-above-hip | battle-feel.g | rejected
- 306 | open-melee-strike-clock | battle-feel.e | rejected
- 308 | open-field-strike-stand-off | battle-feel.e | approved
- 309 | drive-through | battle-feel.e | approved
- 310 | grounded-lunge | battle-feel.e | approved
- 311 | struck-man-buckle | battle-feel.e | approved
- 312 | one-blow-per-man [R] | battle-feel.e | approved

## Spent gaps (never retry as [P]; an [S] on the same criterion is allowed)
slam airtime, zeus glow/pulse/skirt, giant healthScale/victory shot, boulders (map), airborne sit, clouds, far ridge, corpses, idle legs/arms, downed bodies, empty hud, witch brim/kink, lineup camera/unit size, spear length, catapult operator, streak length, red skin shade, hoop colour, smoke diameters, fire segments/emissives, result-foreground-club, run-arms-one-splay, crew hoops.

## Rows
proceduralAnimation.ts:_aimBlow overhead + follow (BLOW_LAND,_HOLD,_DROP,_LEAP,_OVERHEAD,_FALL,_STEP; BLOW_FOLLOW,_ARM,_PITCH,_LOW) | overhead .5, fall .95, step .4; landing + follow on _contactOn, pinned live each frame | 300 | approved | follow ends on board top (299, rejected-kept); to BLOW_FOLLOW_LOW .2 (296); onto crown level (289)
runtimeUnit.ts:blow throw (BLOW_THROW_SECONDS,_HOLD,_TRUNK,_SPEED,_LIFT,_MAX,_MIN; hip-led: pitch about the pelvis; x kb x shoveResponse, no topple) | .6 s hold .28 trunk 1.0; min 4.5/5.0, front-half straight back | 305 | approved | pitch 1.3 about the feet, head away (291-304); pitch .5 seat-first (303, reverted); pitch .8 toward striker (sign bug), min 1.6/4.4 (289); no floor (287)
simulationSystem.ts:blow dwell (BLOW_DWELL; _pendingLaunches: the man's push and throw fired after the land step, his knockback withheld till then) | .12 s | 305 | approved | none (thrown on the land step)
simulationSystem.ts:wall lets go of a thrown man (isBlowThrown: no slot snap/bracing; wall line = median depth of men not thrown) | median | 291 | approved | mean depth of all, thrown man snapped back
proceduralAnimation.ts:overhand throw (THROW_COCK, THROW_FOLLOW, THROW_SWING, THROW_LET_GO; THROWS_HELD_PROP javelin, bomb, stone) | cock -2.9/.3/-1.6 turn .4, follow -.35, swing .55, let-go .5 | 283 | approved | javelin, bomb (282); let-go .38, javelin only (281)
proceduralAnimation.ts:board off (BOARD_OFF_SECONDS,_HOLD,_FLING,_BUCKLE; knockBoardOff from staggerFromBlow) | .6 s hold .25; fling out 1.4 back .6; thigh .9 knee 1.6 sink .35 | 284 | approved | none (board stayed in the wall)
proceduralAnimation.ts:thrown pose (THROWN armsOut,armsBack,trunk,head,seat,legTrail,legKick,kneeTrail,kneeKick; hip anchored over the root, thighs as flight-frame angles along a fixed -z; cancels the board-off buckle) | 1.35, .45, .1, .1, seat .92, thighs .7/-1.9, knees .15/1.4 | 306 | rejected | thighs mirrored by the throw's sign (306, reverted); trunk .35 head .45 fixed sweeps legs .75 knee .35 (291-304); curl .35 thighs -2/-1.7 knee 1.2 (303, reverted)
simulationSystem.ts:strike stand-off (STRIKE_STAND past body contact, open field only; flinch held BLOW_DWELL on a dwelling blow) | .45 m | 308 | approved | none (walked into shoulder contact, flinch on the land step)
proceduralAnimation.ts:solved blow arm (BLOW_SOLVE_MARGIN; point: crown under the fist, else shoulder top on his axis PRESS_BOARD_LINE under it) | margin .15 | 308 | approved | fist overhead, head slid down his near face
proceduralAnimation.ts:drive-through (BLOW_DRIVE, BLOW_DRIVE_FALL, BLOW_DRIVE_PITCH, BLOW_DRIVE_LOWEST; solved blows, leap settles) | .3 s; fall .7->1.2; pitch .6->.9; lowest .75 | 309 | approved | arm solved onto the crown, upper fold (308)
simulationSystem.ts:strike lag (STRIKE_LAG x RuntimeUnit.vary(17), first blow after closing; BLOW_DRIVE_VARY per man) | .45 s; drive vary .15 rad | 312 | approved | none (a line struck on one step)
proceduralAnimation.ts:grounded lunge (hip sinks by the BLOW_LUNGE spread; replaces BLOW_LEAP spring; BLOW_DROP gone) | sink = hipRest(1-cos spread cos knee/2) | 310 | approved | leap .5 of height to put the fist BLOW_DROP .25 over his crown
proceduralAnimation.ts:struck-man buckle (BUCKLE_SECONDS,_FADE; BUCKLE thigh,knee,sink,trunk,head,arm,elbow; buckleUnder on a dwelling land; BUCKLE_VARY twist,head,roll,knee,trunk,arm) | .2 s fade .06; .55,1.4,.2,.3,.5,-.35,-.3; vary .35,.5,.18,.3,.4,.5 | 312 | approved | knee 1.1 sink .16 trunk .45, no vary (311); none (flinch held, standing)
proceduralAnimation.ts:contact-gated drop (triggerAttack: a cocked clubber's heavy swing starts at its commit; gate _ready > .5 or in the shove) | none (reverted) | 306 | rejected | commit .45 of the swing (306, reverted)
proceduralAnimation.ts:cast loose/hold (CAST_LOOSE, CAST_HOLD, CAST_LEVEL_TIP; castReleasesIn, fireball pending to the drive) | loose .68 hold .94 tip 0,.1,1 | 287 | approved | fired at cast start, drive .55-.68 out .82-1, tip z+1.1
proceduralAnimation.ts:bone mage overhead cast (CAST_RAISE_UP,_ARM,_TIP; boneStaff id; leaves pend to CAST_LOOSE from staff head) | up .4, arm -2.9/.32/-.12, tip .15,1,.3 | 289 | approved | wizard level drive, leaves from hand at cast start
projectileSystem.ts:fireball (FIREBALL_WIDE,_TAIL,_HEART,_SHELL; flat icospheres, heart-only glow; staffHeadOf origin) | .55 wide, tail .8; heart 1,.92,.55 shell 1,.45,.08 opaque, no bloom | 286 | approved | shell alpha .7 heart bloom (285); team-tinted sphere .25 (wizard flew a bolt)
projectileSystem.ts:harpoon missile (HARPOON_SHAFT_LONG,_WIDE,_HEAD_LONG,_WIDE,_BARBS,_BARB_LONG,_SWEEP; dark iron, streak) | shaft .5 x .05, head .24 x .15 flat, 2 barbs .17 swept .5 | 290 | approved | shared spear mesh, blue tip
propBuilder.ts:harpoon gun (HARPOON_GUN_LONG,_WIDE, HARPOON_MUZZLE; canister colour; rope HARPOON_ROPE_WIDE,_COLOR) | .24 x .11 s, navy .17,.21,.34 lit .12; rope .035 dark | 294 | approved | steel .42,.5,.66 lit .25 (285); held spear
proceduralAnimation.ts:harpoon hip fire (HARPOON_HIP raise,out,elbow,offRaise,offIn,offElbow,kick; rope tied to live muzzle) | .25,.1,-.3,-.55,.4,-1.0, kick .12 | 294 | approved | spear thrust arm, rope tail at release muzzle
projectileSystem.ts:leaf whirl (LEAF_COUNT,_LONG,_WIDE,_WHIRL,_SPREAD,_SPIN,_COLORS; bone mage projectileHint leaves, from right hand) | 11 x .5 x .19, whirl .55 spread 1.2, spin 9 | 286 | approved | crossbow bolt from the waist
propBuilder.ts:flying sword (buildFlyingSword; SWORD_BLADE_LONG,_WIDE,_GUARD_WIDE,_GRIP_LONG,_COLORS; hover SWORD_TURN_IN, size opt) | blade 1.0 x .1, guard .3, grip .22; ring size, turn in .3 s from point-up | 300 | approved | from headTop, hover .7 s, built in projectileSystem (288)
propBuilder.ts:javelin (JAVELIN_LONG,_HEAD_LONG,_HEAD_WIDE,_BARB_LONG,_BARB_SWEEP; dark iron leaf, red binding, grip near butt) | .4 s, head .13 x .09 thin x .45, barbs .06 swept .45 | 291 | approved | shared spear: 1.0 s pole, small steel tip
propBuilder.ts:bomb (BOMB_FISTS,_NECK,_FUSE; BOMB_SEAT_DOWN,_FORWARD,_TURN; offhand bomb kept) | 2.2 fists, neck .22 fuse .32; seat 1.15/.35 turn 1.7 | 293 | approved | one .15 s ball on the throw grip
propBuilder.ts:dynamite (DYNAMITE_COLS,_ROWS,_STICK_WIDE,_LONG,_BAND,_SPARK,_SPARK_RAYS; top at .155 s) | 3x2 .075 x .38 s, bands .17; spark .075 s 6 rays | 296 | approved | no spark (295); 3 sticks in a row .05 x .26 s (284); bomb ball .15 s
propBuilder.ts:lockbox + carry (LOCKBOX_SIZE,_LID,_IRON,_BAND,_PLATE; _lockboxAnchor torso-fixed, NAVEL .35 FRONT .55 of shoulder ht) | .26 x .16 x .16 s, lid .35 | 299 | approved | hands midpoint (295); short hand sword at the hip
propBuilder.ts:sword ring (SWORD_RING_COUNT,_ANGLES,_RADIUS,_BLADE,_GUARD,_STAGGER,_BOB,_REFILL; launchRingSword) | 6 at ±1.05/1.85/2.6, r .55 H, blade .7 H, guard .36 H, bob .025/1.7, refill 1.4 | 300 | approved | none (one sword over the head)
projectileSystem.ts:ring sword rise (SWORD_RISE_IN; SWORD_RISE_OVER in simulationSystem; flies from the risen height) | .45 s to .25 over head | 301 | approved | none (hovered at its ring guard point, shin height)
proceduralAnimation.ts:lockbox arms (LOCKBOX_CARRY IK start; DLS palm (mitt middle) onto box ends, LOCKBOX_PALM_OUT, 8 steps) | .15, out .6, .6, -1.85; palm .35 mitt widths out | 300 | approved | out .32, wrist GRIP .06 (299); fixed pose (298)
proceduralAnimation.ts:in-reach press beat (PRESS_CLUB_COCK, PRESS_AIM_ARM,_ELBOW, PRESS_BOARD_LINE, CONTACT_MIN_FALL,_LOWEST) | cock -1.05; arm 1.0; line .25; head pinned at reach on near face, lowest .6 | 300 | approved | direction only, head overran into turf (299); fixed arc .6-1.25 (297)
proceduralAnimation.ts:press reach lunge (_pressReach; PRESS_REACH_SEAT,_MAX,_PITCH) | none (reverted) | 303 | rejected | seat .9 max .9 H pitch .5 (303)
simulationSystem.ts:press lane retarget + contact-gated press beat (PRESS_LANE_DETOUR; _openLaneEnemy; strike reach = radii + gap + slack) | none (reverted) | 304 | rejected | detour 1.6, gate at contact (304)
proceduralAnimation.ts:press mark held (PRESS_MARK_HOLD; marked heavy_swing winds to PRESS_CLUB_COCK, recover stays landed) | 1.5 s | 298 | approved | mark dropped on the first out-of-reach call; swing to CLUB_COCK
propBuilder.ts:boulder (BOULDER_WIDE,_SQUASH,_COLOR; faceted icosphere, thrown copy flies) | .26 s, y .88 z .94, .34,.31,.28 lit .15 | 292 | approved | head-sized smooth sphere .12 s
proceduralAnimation.ts:two-hand boulder carry + heave (BOULDER_CARRY,_DIP,_HEAVE; rock at hands midpoint) | carry -.6/.42/-.75; dip .25 trunk .55 knee .7; heave -2.4 trunk -.25 | 292 | approved | one-arm overhand throw (THROW_*)

