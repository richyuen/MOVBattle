# Loop ledger (v2): every value the loop has tuned

Rows: `file:identifier | current value | last iter | verdict | earlier values (newest first)`. The identifier carries the unit
(`rosterManifest.ts:tribal.clubber damageMultiplier`, `unitVisuals.ts:tribal.clubber proportions.scale`, `propBuilder.ts:club CLUB_LEN`).
Verdicts: approved, rejected, pending, spent. A row is `spent` after two attempts without approval or when it was listed as
never-retry; it is not pickable as [P]. The critic rejects a [P] gap that reverses or re-nudges a row approved within the last 20
iterations ("ledger reversal"). An [S] gap that replaces the mechanism owning a row may set new values: the worker resets the row to
pending and keeps the old value under earlier values. Stats knobs set by a `loop(N.0): [P] <batch> stats` commit are rows too
(verdict `stats`, never reviewed by the critic, never a ledger reversal). One row per tuning knob a mechanism exposes, not per line;
a value column is at most 80 characters. The worker updates rows at commit time (pending) and after verdicts. Drop rows untouched
for 25 iterations.

## Structural attempts (last 10 iterations; `iter | gap | unit.criterion | verdict`)
341 | bowl cut (f6567f9) | farmer.hay_baler.a | approved
341 | lobbed held bottle (e8afe34) | farmer.potion_seller.c | approved
341 | jacket, vest, shirt V (76bdeb8) | farmer.halfling.a | approved
341 | crow in each fist (6718e9a) | farmer.scarecrow.b | approved
341 | socks and shoes (3c6b4c5) | farmer.farmer.a | approved
342 | flying crow missiles (d8ad061) | farmer.scarecrow.c | approved
342 | knee shorts and buckled belt (439c08e) | farmer.halfling.a | approved
342 | fork across the hips in both fists (8c2de8f +2) | farmer.farmer.b | rejected
342 | green drunk splash (97ea8d4 +1) | farmer.potion_seller.c | approved
342 | low diagonal two-handed scythe, pegs (0c87e29) | farmer.harvester.b | approved
343 | hairy feet (87e37b9) | farmer.halfling.a | approved
343 | umber hair cap, hood dropped (fb5c49e) | farmer.potion_seller.a | approved
343 | stick whack from the ear (a4f19ae) | farmer.hay_baler.c | approved
343 | pegs rooted on the bow, snath and blade colours (0c7f22a) | farmer.harvester.b | approved
344 | plain snath, grip wraps off (651d95a) | farmer.harvester.b | approved
344 | Halfling Jump leap (2cb2be2) | farmer.halfling.c | approved
344 | level stick carry across the front (cbcb6df) | farmer.hay_baler.b | approved
344 | jerkin, undershirt V, laces, buttons, hem (2304369) | farmer.potion_seller.a | approved
344 | T-pose, perched elbow crows (c3ffda9) | farmer.scarecrow.a | approved
345 | dark team hosen, brown cuffed boots (edeb651) | farmer.potion_seller.a | approved
345 | average man, bale fitted to his frame (492545d) | farmer.hay_baler.a | approved
345 | low level sweep + fling (8bd49db +c11f873) | farmer.harvester.c | rejected
345 | T held through the throw, A-pose reload (29f6cf4) | farmer.scarecrow.c | approved
345 | Halfling Grab cling (b0d26ea) | farmer.halfling.c | approved
346 | three crew on the cart (4ecb105) | farmer.wheelbarrow.a | approved
346 | scarecrow clothes (5cd3e3a) | farmer.scarecrow.a | approved
346 | braids to the chest, team bands (909cf43) | farmer.harvester.a | rejected
346 | fork low across front in both fists (e75d76c) | farmer.farmer.b | dropped
346 | level sweep held through the cut + fling (1e4d069) | farmer.harvester.c | approved
347 | braids retry: core plait to mid-chest, band at the end (514b71b) | farmer.harvester.a | approved
347 | bolted team-painted plank tray, hay mound seat (07f763c +1) | farmer.wheelbarrow.a | approved
347 | riders' fork and apple (b2fe249 +1) | farmer.wheelbarrow.b | approved
347 | pitchfork stab, own clock, hit held to the drive (31530f7 +2) | farmer.farmer.c | approved
347 | Big Crow Wings hover, wing beat (f0d8f77) | farmer.scarecrow.c | approved
348 | leaf-cut hem dags, strap belt (84c655b) | farmer.farmer.a | approved
348 | beige collar, rope belt, stitched patches (5824c3f +1) | farmer.harvester.a | approved
348 | cut-log wheel, braces, two legs (adb75af) | farmer.wheelbarrow.a | approved
348 | ram: mammoth charge driven through (10aa302) | farmer.wheelbarrow.c | approved
348 | back-step between stabs (544512e +1) | farmer.farmer.c | approved
349 | [R] two-fisted low carry, both arms solved onto one line (8407342) | farmer.farmer.b | approved
349 | crew dressed: hood, socks, hem, beard, afro, overalls (fb4fe35) | farmer.wheelbarrow.a | approved
349 | riders fight: held-apple throw, fork stab (81f76b1) | farmer.wheelbarrow.c | approved
350 | fork head at hip height: world chord, tines rolled ahead and down (aecb1d9) | farmer.farmer.b | approved
350 | stab aimed down shoulder->chest line, hit at drive end (b0cfd14 +6b93c12) | farmer.wheelbarrow.c | approved
350 | cut-log drum wheel, bark staves (6298fe0) | farmer.wheelbarrow.a | approved

## Spent (never retry as [P])
(none yet)

## Rows
tribal.* (42 knob rows, 316-326; batch done) | compacted 334 | 326 | approved | values: git show b4b44b1:loop/LEDGER.md
renaissance.* (51 knob rows, 327-338; batch done) | compacted 340 | 338 | approved | values: git show f525109:loop/LEDGER.md
proceduralAnimation.ts:pole POLE_GRIP (span from fist), carry pick, settle | hpoint .15-.45, musketFore .3-.7, forkBar .2-.5; pick .4 (fork, hayStick .9), 2 | 340 | approved | 329: no forkBar
rosterManifest.ts:farmer cost/hp/dmg/cd (halfling, farmer, hay_baler, potion_seller) | 50/3.46/.17/1.5, 80/.6/.42/-, 140/.34/.37/.29, 340/.25/.04/1.59 | 339 | stats | 65, 80, 110, 180
rosterManifest.ts:farmer cost/hp/dmg/cd (harvester, wheelbarrow, scarecrow) | 500/.98/.5/-, 1000/1.06/-/-, 1200/.11/2.72/5 | 339 | stats | 260, 520, 1000 (cd .88)
propBuilder.ts:pitchfork FORK (long, grip, thick, bar, tine, tineThick, curl, links, glow) | .85, .3, .03, .2, .22, .045, 1.1, 4, .18 | 339 | approved | replaced .7s shaft, straight tines
propBuilder.ts:potion POTION (ball, squash, neck, neckLong, cork, seat, glow), GLASS | .065,.92,.026,.026,.016,.035,.22; (.55,.74,.82) | 339 | approved | ball .15 (339 first)
unitFactory.ts:HAY_BALE (knee, top, bottom, deep of shoulder span; blades, blade, hems, hem, flare); scale/bulk | .12,1.95,2.15,1.45,10,.62,12,.5,.5; 1/1 | 345 | approved | of chest: drop .55, 1.6,1.75,1.7; scale 1.25 bulk 1.6
propBuilder.ts:CROW_WINGS (span, raise, sweep, feathers, wrist, glow) | 2.7, .55, .22, 9, .32, .06 | 339 | approved | -
propBuilder.ts:stick STICK (long, grip, thick, tip, kinks, bend, glow), WOOD | .75, .12, .085, .8, 5, .035, .18; (.68,.4,.26) | 341 | approved | thick .045
propBuilder.ts:pointed_cowl LIRIPIPE (snug, root, end, path 7 pts, yoke, yokeDeep, dags, dag, dagWide, flare) | 1.18,.62,.14,-,1.5,.22,9,.32,.36,.25 | 340 | approved | replaced COWL_* cone
tribalDress.ts:SHAGGY (cap, locks, long, front, thick, splay), COLOR | 1.32, 26, .5, .5, .3, .55; (.38,.21,.12) | 340 | approved | -
propBuilder.ts:sun_hat FLOPPY (brim..root, braid, plaits, thick, fall, flare, core, overlap, bandTall) | ..,.05,1.95,8,.42,.3,.08,.62,1.45,.14 | 347 | approved | 346 rej braid 2.8 (hip); 340: braid 1.6, plaits 5
propBuilder.ts:SACK (wide, top, tall, crown, dome, button, eyes, eyeDrop, neck, glow), BROWN | 1.22,1.12,1.12,.06,.12,.24,.22,.1,1,.2; (.56,.36,.22) | 340 | approved | -
tribalDress.ts:BOWL (dome, crown, fringe, hang, flare, face), COLOR | 1.3, .78, .5, .4, 1.08, .36; (.45,.22,.15) | 341 | approved | -
unitFactory.ts:HALFLING_DRESS (jacket, drop, vest, proud, vee, veeDeep, lapel, vestLight, jacketShade) | 1.14,.12,.56,.03,.42,.42,.34,.5,.8 | 341 | approved | -
propBuilder.ts:HELD_CROW (long, wide, tall, head, beak, wing, tail, fan, seat, glow) | .24,.11,.12,.085,.06,.17,.11,.1,.03,.12 | 341 | approved | -
unitFactory.ts:FARMER_SOCK (sock, long, cuff, cuffTall, collar, collarTall, glow), SHOE | 1.14,.9,1.3,.12,1.36,.13,.22; (.5,.29,.18) | 341 | approved | -
projectileSystem.ts:FLYING_CROW (long, wide, tall, head, beak, span, chord, flat, fingers, feather, tail, fan, glow, beat, lift, rate) | .34,.17,.17,.13,.08,.34,.2,.12,4,.1,.16,.16,.12,.28,.04,15 | 343 | approved | beat .6, lift .15 (342); fallout only, never re-nudge
unitFactory.ts:HALFLING_SHORTS (seat, seatTall, leg, flare, long, belt, buckle, dark, glow), BELT | 1.04,.3,1.3,1.12,.92,.1,.14,.45,.14; (.3,.18,.11) | 342 | approved | -
projectileSystem.ts:DRUNK_SPLASH (radius, puffs, size, life, push, seconds) | 2.2, 14, .9, 1.6, .15, 6 | 342 | approved | replaced bomb blast for potion_seller
runtimeUnit.ts:DRUNK (dye, glow, roll, rate, slow); simulationSystem DRUNK_WANDER (reach, swing) | .8, .35, .22, 4.5, .55; 2.5, .9 | 342 | approved | -
proceduralAnimation.ts:SCYTHE_LOW (raise, out, elbow, tip, spin); POLE_GRIP.snathPeg | -.3,.12,-.75,(-.8,.5,.3),pi/2; [.28,.32] | 342 | approved | -
unitFactory.ts:SNATH_PEG (low, high, long, thick, sink), SNATH_WOOD, SNATH_STEEL | -.15,.15,.09,.03,.2; (.5,.24,.17); (.5,.51,.53) | 343 | approved | pegs on the chord z 0
proceduralAnimation.ts:FORK_CARRY / FORK_LOW | reverted | 346 | rejected | 342: -.4,.04,-.55,(-.7,-.6,.72); 346 dropped at look (forkShaft turned, fists off the shaft)
unitFactory.ts:HALFLING_FEET (clump, clumpTall, rise, tufts, long, thick, splay, glow), HALFLING_FUR | 1.35,1.1,.9,9,.55,.28,1,.22; (.38,.21,.12) | 343 | approved | -
tribalDress.ts:HAIR_CAP (dome, crown, fringe, hang, flare, face), HAIR_CAP_COLOR | 1.14,.62,.62,-.12,1.02,.42; (.36,.25,.17) | 343 | approved | -
proceduralAnimation.ts:STICK_WHACK (cock,out,fold,twist,cockArc,hit,reach,pitch,hitArc,land,hold,offSwing) | -2.1,.55,-1.75,.4,-.9,-1.25,-.15,.3,1.9,.35,.6,.6 | 343 | approved | -
simulationSystem.ts:HALFLING_JUMP (from, reach, cooldown, rise, short) | .6, 4, 8, 6.5, .3 | 344 | approved | -
proceduralAnimation.ts:HAY_CARRY (raise, out, elbow, tip) | -.6, .1, -.85, (-.95,.02,.32) | 344 | approved | replaced fork low carry (pick .9) for hayStick
unitFactory.ts:POTION_JERKIN (shell, dark, vee, veeDeep, laces, button, hem, light, glow), UNDERSHIRT, LACE, COPPER | 1.12,.42,.4,.62,3,.13,.14,.62,.16; (.66,.3,.24); (.88,.58,.34); (.86,.5,.26) | 344 | approved | -
proceduralAnimation.ts:TPOSE (lift, ahead, rate, perch, a, after) | .04, .12, 8, .07, .5, .6 | 345 | approved | perch .035
unitFactory.ts:POTION_BOOT (shaft, long, cuff, cuffTall, band, dark, glow), BROWN, BAND | 1.24,.46,1.62,.16,.035,.42,.18; (.52,.3,.2); (.26,.14,.1) | 345 | approved | -
simulationSystem.ts:HALFLING_CLING (round, off, up, afterDeath) | .55, .85, .32, 2.5 | 345 | approved | -
vehicleBuilder.ts:WHEELBARROW (scale, trayY, trayWide, trayLong, trayZ, frontSeat, backSeat, pushZ, lean) | 2.2,.36,.44,.78,.08,.32,-.06,-.62,.28 | 346 | approved | replaced the .4 m cart and lone .46 pusher
unitFactory.ts:SCARECROW_DRESS (strap, apart, button, patch, tufts, tuft, splay, glow), BROWN, STRAP, STRAW, ROPE | .13,.46,.14,.85,7,.3,.6,.22; (.5,.31,.2); (.42,.25,.16); (.86,.68,.3); (.72,.58,.36) | 346 | approved | no tunic skirt
proceduralAnimation.ts:SCYTHE_SWEEP (roll,twist,cock,end,low,arm,crouch,through,hitAt,hold); SCYTHE_FLING (across,speed,lift) | pi/2,.75,2,-1.1,.12,-.55,.25,.55,.55,.75; .6,3.2,5 | 346 | approved | 345 rejected as is (a flinch tipped it up)
vehicleBuilder.ts:TRAY_PLANK (planks, sideTall, seam, thick, bolt, heap, heapWide, glow), TRAY_WOOD, TRAY_STRAW | 3,.13,.008,.03,.016,.09,.92,.12; (.6,.34,.24); (.82,.62,.3) | 347 | approved | wood (.62,.4,.28) glow .22 read cream
vehicleBuilder.ts:CREW_FORK (long, butt, thick, tines, tine, spread, curl, dir), CREW_APPLE (r, lift) | .72,.2,.013,3,.2,.055,.4,(-.42,.12,.9); .05,.035 | 347 | approved | tine .13 spread .035 too small
proceduralAnimation.ts:FORK_STAB (land, commit, back, cock, dip, turn, drawRaise, drawElbow, reach, offReach, pitch, step, front, knee) | .7,.62,.3,.18,-.08,.35,-.25,-1.45,-1.3,-1.2,.28,.3,-.7,.55 | 347 | approved | -
proceduralAnimation.ts:HOVER (lift, bob, rate, beat, rateIn) | .13, .025, 2.4, .28, 3 | 347 | approved | critic: lift small, legs stride while hovering
unitFactory.ts:FARMER_SHIRT (dags, dag, dagLong, tilt, shade, strap, strapProud, tongue, glow), STRAP | 10,1.25,.24,.32,.82,.1,1.1,.22,.2; (.5,.27,.17) | 348 | approved | critic: tilt reads spiky
unitFactory.ts:HARVESTER_TRIM (collar..glow), BEIGE, ROPE | 1.42,.26,.56,.3,.055,.42,.3,.45,3,.2; (.86,.76,.6); (.8,.66,.46) | 348 | approved | collar 1.22,.2,.5 (look); critic: collar near-white, wide
vehicleBuilder.ts:LOG_WHEEL (d, thick, bark, ring, hub, brace.., staves, staveShade) | .34,.36,.02,.55,.05,.022..; 12, .78 | 350 | approved | thick .08 (348); critic: drum a bit narrow
simulationSystem.ts:WHEELBARROW_RAM (from, reach, speed, seconds, overrun, contact, damage, fling, lift, cooldown) | .6,16,1.7,3,4,.35,6,4.5,4,2.2 | 348 | approved | critic: speed reads ~2x walk
simulationSystem.ts:FARMER_BACKSTEP (after, pace, margin) | .95, .5, .15 | 348 | approved | -
proceduralAnimation.ts:FORK_HOLD (out, drop, ahead, across, up, forward, reach, curlAhead, curlDown) | .16,-.1,.22,.78,.04,.55,1.5,.6,.8 | 350 | approved | 349: dir (-.72,-.08,.68); fallout .up .12
unitFactory.ts:WHEELBARROW_OVERALLS (..); tribalDress AFRO (wide,tall,deep,up,back,jitter) | as 349; 2.0,1.1,1.5,.32,.18,.1 | 350 | approved | 1.6,..,.42,.3; critic: ~2/3 render size
simulationSystem.ts:WHEELBARROW_CREW (..stabReach..); CREW_FIGHT (turn, drawBack, drawFold) | as 349; .9,.55,-1.5, hit at draw+drive | 350 | approved | hit at draw end (349)
