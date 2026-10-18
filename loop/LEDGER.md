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
334 | chop onto the man (b6a163f) | renaissance.halberd.c | approved
334 | heater held upright (69073a5) | renaissance.jouster.b | approved
334 | domed drape, crenellated hem (73fd09c +1) | renaissance.jouster.a | approved
334 | taller roof by tier pitch (519d913 +1) | renaissance.da_vinci_tank.a | rejected
334 | doublet and paned breeches (c58861e) | renaissance.fencer.a | approved
335 | blow held down, own clock (8899946) | renaissance.halberd.c | approved
335 | plate rider, close helm (909f200 +1) | renaissance.jouster.a | approved
335 | self-lit cravat (15c41f6 +1) | renaissance.painter.a | approved
335 | hair and curled moustache (370f635) | renaissance.fencer.a | approved
335 | vest and blouse (f5030a9) | renaissance.musketeer.a | approved
336 | chanfron (493017a) | renaissance.jouster.a | approved
336 | moustache and goatee (3ce4ab9) | renaissance.musketeer.a | approved
336 | cuffed knee boots (0267ef9) | renaissance.fencer.a | approved
336 | tan tabard, proud belt (500f5e0) | renaissance.halberd.a | approved
336 | striped doublet (921719c) | renaissance.balloon_archer.a | approved
337 | paned thigh rolls (d8407ce +1) | renaissance.fencer.a | approved
337 | vest hem at the waist (780101e) | renaissance.musketeer.a | approved
337 | caparison following the barrel (f277bbf) | renaissance.jouster.a | approved
337 | whole-machine scale, flat cap (412d16c) | renaissance.da_vinci_tank.a | approved
338 | upper tier as its own hat (60fa561) | renaissance.da_vinci_tank.a | approved
339 | empty mitt hands (697a9c6) | farmer.halfling.b | approved
339 | two-handed pitchfork carried low (151102b) | farmer.farmer.b | approved
339 | potion bottle in each hand (a682e21 +1) | farmer.potion_seller.b | approved
339 | hay-bale armour worn (5acc99a +1) | farmer.hay_baler.a | approved
339 | big black crow wings (185ca19) | farmer.scarecrow.a | approved
340 | crooked stick, one-handed low carry (cef515a +4) | farmer.hay_baler.b | approved
340 | liripipe hood, leaf collar (4ccaced) | farmer.farmer.a | approved
340 | shaggy brown mop (9ccfb6c) | farmer.halfling.a | approved
340 | floppy hat and side braids (e4fd698) | farmer.harvester.a | approved
340 | full-head sack mask (44d5b86) | farmer.scarecrow.a | approved
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
unitFactory.ts:HAY_BALE (drop, top, bottom, deep, blades, blade, hems, hem, flare); HAY_TAN, GLOW | .55,1.6,1.75,1.7,10,.62,12,.5,.5; (.7,.46,.22),.2 | 340 | approved | top/bottom 1.25/1.4; tan (.84,.6,.32) glow .3
propBuilder.ts:CROW_WINGS (span, raise, sweep, feathers, wrist, glow) | 2.7, .55, .22, 9, .32, .06 | 339 | approved | -
propBuilder.ts:stick STICK (long, grip, thick, tip, kinks, bend, glow), WOOD | .75, .12, .085, .8, 5, .035, .18; (.68,.4,.26) | 341 | approved | thick .045
propBuilder.ts:pointed_cowl LIRIPIPE (snug, root, end, path 7 pts, yoke, yokeDeep, dags, dag, dagWide, flare) | 1.18,.62,.14,-,1.5,.22,9,.32,.36,.25 | 340 | approved | replaced COWL_* cone
tribalDress.ts:SHAGGY (cap, locks, long, front, thick, splay), COLOR | 1.32, 26, .5, .5, .3, .55; (.38,.21,.12) | 340 | approved | -
propBuilder.ts:sun_hat FLOPPY (brim, droop, lift, tip, crown, crownTall, apart, ahead, root, braid, plaits, thick) | 2.25,.28,.12,.12,1.12,.42,.68,.08,.05,1.6,5,.42 | 342 | approved | 340: apart .6, braid 1.15, thick .26
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
proceduralAnimation.ts:FORK_CARRY (raise, out, elbow, tip) | reverted | 342 | rejected | -.4,.04,-.55,(-.7,-.6,.72)
unitFactory.ts:HALFLING_FEET (clump, clumpTall, rise, tufts, long, thick, splay, glow), HALFLING_FUR | 1.35,1.1,.9,9,.55,.28,1,.22; (.38,.21,.12) | 343 | approved | -
tribalDress.ts:HAIR_CAP (dome, crown, fringe, hang, flare, face), HAIR_CAP_COLOR | 1.14,.62,.62,-.12,1.02,.42; (.36,.25,.17) | 343 | approved | -
proceduralAnimation.ts:STICK_WHACK (cock,out,fold,twist,cockArc,hit,reach,pitch,hitArc,land,hold,offSwing) | -2.1,.55,-1.75,.4,-.9,-1.25,-.15,.3,1.9,.35,.6,.6 | 343 | approved | -
