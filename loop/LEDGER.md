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
330 | rapier lunge (841edec +2) | renaissance.fencer.c | approved
330 | halberd vertical chop (04be0ae) | renaissance.halberd.c | approved
330 | couched lance, held level (fa74b0b) | renaissance.jouster.c | approved
330 | cup-hilt rapier (d255f45) | renaissance.fencer.b | approved
330 | spinning drum (7b89341) | renaissance.da_vinci_tank.c | approved
331 | plank roof, drum (e4c2a2f) | renaissance.da_vinci_tank.a | approved
331 | 16 octagonal barrels (da39ed0) | renaissance.da_vinci_tank.b | approved
331 | palette out and face-up (413fb65) | renaissance.painter.b | approved
331 | shouldered aim (0b9f1b9 +2) | renaissance.musketeer.c | approved
331 | point-first rapier (d2b3a7b) | renaissance.fencer.c | approved
332 | musket bullet fling (ac25108) | renaissance.musketeer.c | approved
332 | paint splotches (f7538a3) | renaissance.painter.c | approved
332 | lance on target (062a748) | renaissance.jouster.c | approved
332 | long dark hair (cfb3c57) | renaissance.painter.a | approved
332 | balloon float (c99a50c +1) | renaissance.balloon_archer.c | approved
333 | lunge legs (90d850a) | renaissance.fencer.c | approved
333 | level lance (eea51ad) | renaissance.jouster.c | approved
333 | arrow ball (4e0e02c) | renaissance.balloon_archer.c | approved
333 | jabot (b8f9dd8 +1) | renaissance.painter.a | approved
333 | halberd dress (c23f17c) | renaissance.halberd.a | approved
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

## Spent (never retry as [P])
(none yet)

## Rows
tribal.* (42 knob rows, 316-326; batch done) | compacted 334 | 326 | approved | values: git show b4b44b1:loop/LEDGER.md
propBuilder.ts:brim_hat BRIM_HAT (brim, crown, drop, tall), FELT | 1.75, 1.12, 0.16, 0.42, (0.11, 0.1, 0.12) | 327 | approved | -
propBuilder.ts:paintbrush BRUSH (long, grip, butt, neck, ferrule, collar, tuft, swell) | 0.34, 0.16, 0.08, 0.12, 0.6, 0.1, 0.22, 0.1 | 328 | approved | -
propBuilder.ts:cavalier_hat CAVALIER (brim, flap, lift, crown, tall, shade, feather, wide, pale, rake) | 2.25, .3, 1.25, 1.1, .55, .75, 2.3, .55, .4, 1.15 | 327 | approved | -
propBuilder.ts:halberd HALBERD (long, grip, thick, socket, point, axe, axeTall, axeRoot, spike), STEEL | 1.3, .3, .02, .1, .13, .13, .16, .07, .07, (.2,.21,.24) | 327 | approved | -
propBuilder.ts:morion MORION (dome, tall, comb, combThick, brimX, brimZ, peak), IRON | 1.18, .3, .22, .1, 1.5, 2.05, .3, (.12,.12,.14) | 327 | approved | -
propBuilder.ts:sallet SALLET (heads, deep, crown, dome, drop, flare, slit, slitDown, slitWide, tail, dip) | 1.3, 1.12, .12, .45, 1.05, 1.08, .07, .04, .78, .5, .45 | 328 | approved | -
propBuilder.ts:musket MUSKET (long, grip, bore, fore, stock, butt, ring) | 1.05, .27, .034, .8, .02, .085, 1.45 | 328 | approved | 328 first: bore .026
propBuilder.ts:lance LANCE (long, grip, thick, taper, pitch, stripe, vamp, vampLong, prongs, prong) | 1.75, .14, .045, .45, .075, .55, .1, .07, 3, .03 | 328 | approved | -
propBuilder.ts:palette PALETTE_WIDE, PALETTE (deep, notch, hole, daub, proud, thick) | .34; .74, .42, .15, .27, .012, .016 | 328 | approved | wide .24
proceduralAnimation.ts:palette PALETTE_HOLD (raise, out, elbow, sway) | -1.0, -0.55, -1.2, 0.05 | 329 | rejected | 329 [P] out -1.2 rejected
proceduralAnimation.ts:pole POLE_GRIP (span from fist), carry pick, settle | hpoint .15-.45, musketFore .3-.7, forkBar .2-.5; pick .4 (fork .9), 2 | 339 | approved | 329: no forkBar
propBuilder.ts:longbow LONGBOW (long, thick, taper, bow, wrapAt, wrap, grip), GREY | 1.2, .065, .5, .05, .6/.72, .04, .11, (.74,.74,.72) | 330 | approved | long .85, thick .05
propBuilder.ts:heater HEATER (wide, tall, side, rim, thick), YELLOW | .26, .36, .35, .012, .025, (.95,.72,.12) | 329 | approved | -
visualEffects.ts:shatter SHATTER (count, size, speed, up, last), DAVINCI_BALL | 7, .11, 3.2, 3.0, .9; .24 | 329 | approved | -
proceduralAnimation.ts:lunge LUNGE (guardRaise, guardElbow, turn, reach, pitch, front, knee, back, step, retreat, hold) | -.75, -1.35, .4, -1.5, .3, -1.25, 1.35, .85, .45, .2, .16 | 333 | approved | front/knee/back -.85/.6/.5; hold .08
proceduralAnimation.ts:chop CHOP (raised, landed, armUp, elbowUp, armDown, elbowDown, pitch, step, hold) | -.55, 1.95, -2.7, -.9, -1.25, -.15, .35, -.4, .1 | 330 | approved | -
proceduralAnimation.ts:couch COUCH (raise, elbow, dip, across, drive, pitch) | -.35, -1.35, .08, .12, .5, .2 | 330 | approved | -
propBuilder.ts:rapier RAPIER (blade, thick, taper, cup, cupDeep, cupTop, rim, quillon, grip, pommel) | .66, .018, .35, .13, .055, .3, .014, .2, .08, .035 | 330 | approved | -
runtimeUnit.ts:drum DRUM_SPIN (rate, spinUp, spinDown, linger) | 3.5, 12, 1.5, 1.0 | 330 | approved | -
vehicleBuilder.ts:DAVINCI_ROOF (planks, eaveR, topR, capEaveR, capTopR, capTop, drumR) | 16, 1.25, .42, .6, .2, 1.3, 1.0 | 337 | approved | capApex 1.38 spike; 332 [P] x1.4 radii rejected
vehicleBuilder.ts:DAVINCI_CANNON (count, out, bore, ringWide) | 16, 1.62, .2, 1.3 | 332 | rejected | 332 [P] out 2.27 rejected
proceduralAnimation.ts:PALETTE_OUT (side, fwd, drop, tip) | .24, .1, .07, .35 | 331 | approved | -
proceduralAnimation.ts:MUSKET_AIM (ahead, inward, drop, kick) | .17, .03, .03, .25 | 331 | approved | -
proceduralAnimation.ts:RAPIER_POINT guard | 0.3 | 331 | approved | -
simulationSystem.ts:GUN_FLING musket (speed, lift; deadeye shares) | 4.5, 5.5 | 332 | approved | -
visualEffects.ts:PAINT_SPLOTCH (count, size, speed, spread, up, last) | 5, .09, 3.4, 1.6, 2.2, 1.0 | 332 | approved | -
proceduralAnimation.ts:LANCE_AIM (hold, rate; yaw only); sim LANCE_AIM_REACH, LANCE_CHEST | .6, 4; 5, .62 | 333 | approved | maxDip .5
tribalDress.ts:hair PAINTER_HAIR (long_dark, no fringe) | (.17, .11, .08) | 332 | approved | -
runtimeUnit.ts:BALLOON_FLOAT (seconds, rise, top, per, most, size, string, swell) | 3, 1.4, 3.2, 3, 9, .42, .55, .12 | 332 | approved | -
rosterManifest.ts:renaissance cost/hp/dmg/cd (painter, fencer, archer, musketeer) | 50/.94/.17/.35, 150/.46/.67/-, 200/.56/.36/1.36, 250/.54/-/3.33 | 327 | stats | 80, 160, 180, 220
rosterManifest.ts:renaissance cost/hp/dmg/cd (halberd, jouster, da_vinci_tank) | 400/1.19/.58/.77, 1000/.47/-/-, 4000/3.65/.53/1.59 | 327 | stats | 200, 500, 1800 (cd .86)

projectileSystem.ts:BALLOON_BALL (size, at, long) | .2, .27, 1.15 | 333 | approved | -
unitFactory.ts:HALBERD_DRESS (tabard, wrap, skirt, bands, roll, cuff); TAN, GLOW; BELT_FIT (proud, tall, buckle) | .55,1.12,.45,3,1.22,1.5; (.8,.56,.28),.3; 1.14,.14,.2 | 336 | approved | CREAM (.86,.72,.5) unlit, belt .1
proceduralAnimation.ts:CHOP_ONTO (below, min, max, slide) | .12, .9, 2.1, .6 | 334 | approved | -
proceduralAnimation.ts:HEATER_HOLD (fwd, side, drop, turn); propBuilder HEATER_GRIP_SIZE | .2, .08, .2, .35; 1.3 | 334 | approved | grip size 1.9
propBuilder.ts:HORSE_DRAPE (rings, round, crest, waist, band, merlons, tooth, glow), CREAM | 6, .6, .72, .15, .08, 16, .16, .1; (.86,.66,.4) | 334 | approved | flat deck, bevel .07, 18 dags
unitFactory.ts:FENCER_DRESS (doublet, tabs, tab, wing, band, panes, puff, long), CREAM | 1.08, 8, .2, 1.45, .12, 8, .82, .95; (.84,.66,.42) | 334 | approved | -
unitFactory.ts:PAINTER_CRAVAT (wrap, wrapTall, knot, fall, fallWide, flat, tip, glow), COLOR | 1.3,.28,.36,.3,.5,.35,.3,.3; (.8,.56,.28) | 335 | approved | replaced JABOT 3/.85/.22, RUFF_COLOR
proceduralAnimation.ts:CHOP_DOWN (hold, rise) | .35, .3 | 335 | approved | -
unitFactory.ts:JOUSTER_HELM (wide, brow, chin, tufts, tuft, rise); STEEL, GLOW | 1.2,.5,-.28,5,.95,.42; (.5,.52,.56), .16 | 335 | approved | steel .6 glow .22
unitFactory.ts:JOUSTER_PLATE (breast, fauld, flare, pauldron, lame) | 1.2, .3, 1.3, 2.1, 1.6 | 335 | approved | -
tribalDress.ts:MOUSTACHE (y, span, turn, curl, thick, proud) | -.38, .7, .4, .42, .1, 1.14 | 335 | approved | -
unitFactory.ts:MUSKETEER_DRESS (vest, wing, puff, collar, breech, knee, bands); CREAM, GLOW | 1.1,1.5,1.4,1.25,1.3,1.65,2; (.8,.6,.36), .15 | 336 | approved | (.84,.72,.52), .25
propBuilder.ts:CHANFRON (long, wide, narrow, flat, eye, eyeAt, ear, tufts, tuft, glow), STEEL | .7,.38,.27,.88,.075,.3,.3,4,.11,.2; (.5,.52,.56) | 336 | approved | plank box, ear .18
tribalDress.ts:GOATEE (wide, down, proud, tip) | .42, .55, .86, .35 | 336 | approved | -
unitFactory.ts:FENCER_BOOTS (shaft, cuff, cuffLong), FENCER_BOOT | 1.3, 1.85, .36; (.42,.17,.12) | 336 | approved | -
unitFactory.ts:ARCHER_DRESS (doublet, stripes, stripe, puff, slashes, belt, breech); TAN, GLOW | 1.1,3,.09,1.6,4,.12,1.45; (.8,.56,.28),.3 | 336 | approved | -
vehicleBuilder.ts:DAVINCI_SCALE (whole machine; pilot offset, lineup lastApart follow) | 2.3 | 338 | approved | 1.9 (337), 1 (unscaled)
vehicleBuilder.ts:DAVINCI_HAT (collar, collarR, lip, proud) | .16, .34, .08, .05 | 338 | approved | -
unitFactory.ts:FENCER_ROLL (panes, long, swell, end, apart); FENCER_CREAM, GLOW | 8, .68, 2.1, 1.3, .9; (.8,.56,.28), .3 | 337 | approved | replaced panes/puff/long 8/.82/.95, cream (.84,.66,.42) unlit
unitFactory.ts:MUSKETEER_VEST (shade, hem, flare, belt, beltOut, breech) | .95, .2, 1.28, .07, 1.06, .6 | 337 | approved | vest/breech .82
propBuilder.ts:HORSE_CAPARISON (fore, aft, plan, tuck, tuckLong, strap, strapAt, strapArc) | .55, 1.12, 2.6, .1, .06, .07, .1, 1.15 | 337 | approved | CAP_LONG 1.32, END .55, SQUARE .35
rosterManifest.ts:farmer cost/hp/dmg/cd (halfling, farmer, hay_baler, potion_seller) | 50/3.46/.17/1.5, 80/.6/.42/-, 140/.34/.37/.29, 340/.25/.04/1.59 | 339 | stats | 65, 80, 110, 180
rosterManifest.ts:farmer cost/hp/dmg/cd (harvester, wheelbarrow, scarecrow) | 500/.98/.5/-, 1000/1.06/-/-, 1200/.11/2.72/5 | 339 | stats | 260, 520, 1000 (cd .88)
propBuilder.ts:pitchfork FORK (long, grip, thick, bar, tine, tineThick, curl, links, glow) | .85, .3, .03, .2, .22, .045, 1.1, 4, .18 | 339 | approved | replaced .7s shaft, straight tines
propBuilder.ts:potion POTION (ball, squash, neck, neckLong, cork, seat, glow), GLASS | .065,.92,.026,.026,.016,.035,.22; (.55,.74,.82) | 339 | approved | ball .15 (339 first)
unitFactory.ts:HAY_BALE (drop, top, bottom, deep, blades, blade, hems, hem, flare); HAY_TAN, GLOW | .55,1.25,1.4,1.7,10,.62,12,.5,.5; (.7,.46,.22),.2 | 339 | approved | tan (.84,.6,.32) glow .3
propBuilder.ts:CROW_WINGS (span, raise, sweep, feathers, wrist, glow) | 2.7, .55, .22, 9, .32, .06 | 339 | approved | -
