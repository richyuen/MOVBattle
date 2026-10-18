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
324-326 | tribal: six dress gaps (batch done) | tribal.* | approved
327 | brim hat (d747d43) | renaissance.balloon_archer.a | approved
327 | short one-handed brush (34e0270 +1) | renaissance.painter.b | approved
327 | cavalier hat (fbe32ce +1) | renaissance.fencer.a | approved
327 | halberd head (547179c +1) | renaissance.halberd.b | approved
327 | black iron morion (affc57f) | renaissance.musketeer.a | approved
328 | no back slab (68ad77a) | renaissance.fencer.b | approved
328 | black sallet (0860943) | renaissance.halberd.a | approved
328 | matchlock musket (9951a96 +1) | renaissance.musketeer.b | approved
328 | kidney palette held up (642eb06) | renaissance.painter.b | approved
328 | spiral-striped lance (4a390e5 +1) | renaissance.jouster.b | approved
329 | two-handed grip (0f6980a +1) | renaissance.halberd.b | approved
329 | two-handed musket carry (f4cff29) | renaissance.musketeer.b | approved
329 | yellow heater shield (fa71e96 +1) | renaissance.jouster.b | approved
329 | longbow (ea71dc1 +1) | renaissance.balloon_archer.b | approved
329 | shattering cannonballs (495e7d1) | renaissance.da_vinci_tank.c | approved
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
proceduralAnimation.ts:pole POLE_GRIP (span from fist), carry pick, settle | hpoint .15-.45, musketFore .3-.7, 0.4, 2 | 329 | approved | -
propBuilder.ts:longbow LONGBOW (long, thick, taper, bow, wrapAt, wrap, grip), GREY | 1.2, .065, .5, .05, .6/.72, .04, .11, (.74,.74,.72) | 330 | approved | long .85, thick .05
propBuilder.ts:heater HEATER (wide, tall, side, rim, thick), YELLOW | .26, .36, .35, .012, .025, (.95,.72,.12) | 329 | approved | -
visualEffects.ts:shatter SHATTER (count, size, speed, up, last), DAVINCI_BALL | 7, .11, 3.2, 3.0, .9; .24 | 329 | approved | -
proceduralAnimation.ts:lunge LUNGE (guardRaise, guardElbow, turn, reach, pitch, front, knee, back, step, retreat, hold) | -.75, -1.35, .4, -1.5, .3, -1.25, 1.35, .85, .45, .2, .16 | 333 | approved | front/knee/back -.85/.6/.5; hold .08
proceduralAnimation.ts:chop CHOP (raised, landed, armUp, elbowUp, armDown, elbowDown, pitch, step, hold) | -.55, 1.95, -2.7, -.9, -1.25, -.15, .35, -.4, .1 | 330 | approved | -
proceduralAnimation.ts:couch COUCH (raise, elbow, dip, across, drive, pitch) | -.35, -1.35, .08, .12, .5, .2 | 330 | approved | -
propBuilder.ts:rapier RAPIER (blade, thick, taper, cup, cupDeep, cupTop, rim, quillon, grip, pommel) | .66, .018, .35, .13, .055, .3, .014, .2, .08, .035 | 330 | approved | -
runtimeUnit.ts:drum DRUM_SPIN (rate, spinUp, spinDown, linger) | 3.5, 12, 1.5, 1.0 | 330 | approved | -
vehicleBuilder.ts:DAVINCI_ROOF (planks, eaveR, topR, capEaveR, drumR) | 16, 1.25, .42, .6, 1.0 | 332 | rejected | 332 [P] x1.4 radii rejected (reversal, flat)
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
unitFactory.ts:HALBERD_DRESS (tabard, wrap, skirt, belt, bands, roll, cuff), HALBERD_CREAM | .55, 1.12, .45, .1, 3, 1.22, 1.5; (.86,.72,.5) | 333 | approved | -
proceduralAnimation.ts:CHOP_ONTO (below, min, max, slide) | .12, .9, 2.1, .6 | 334 | approved | -
proceduralAnimation.ts:HEATER_HOLD (fwd, side, drop, turn); propBuilder HEATER_GRIP_SIZE | .2, .08, .2, .35; 1.3 | 334 | approved | grip size 1.9
propBuilder.ts:HORSE_DRAPE (rings, round, crest, waist, band, merlons, tooth, glow), CREAM | 6, .6, .72, .15, .08, 16, .16, .1; (.86,.66,.4) | 334 | approved | flat deck, bevel .07, 18 dags
unitFactory.ts:FENCER_DRESS (doublet, tabs, tab, wing, band, panes, puff, long), CREAM | 1.08, 8, .2, 1.45, .12, 8, .82, .95; (.84,.66,.42) | 334 | approved | -
unitFactory.ts:PAINTER_CRAVAT (wrap, wrapTall, knot, fall, fallWide, flat, tip, glow), COLOR | 1.3,.28,.36,.3,.5,.35,.3,.3; (.8,.56,.28) | 335 | approved | replaced JABOT 3/.85/.22, RUFF_COLOR
proceduralAnimation.ts:CHOP_DOWN (hold, rise) | .35, .3 | 335 | approved | -
unitFactory.ts:JOUSTER_HELM (wide, brow, chin, tufts, tuft, rise); STEEL, GLOW | 1.2,.5,-.28,5,.95,.42; (.5,.52,.56), .16 | 335 | approved | steel .6 glow .22
unitFactory.ts:JOUSTER_PLATE (breast, fauld, flare, pauldron, lame) | 1.2, .3, 1.3, 2.1, 1.6 | 335 | approved | -
tribalDress.ts:MOUSTACHE (y, span, turn, curl, thick, proud) | -.38, .7, .4, .42, .1, 1.14 | 335 | approved | -
unitFactory.ts:MUSKETEER_DRESS (vest, wing, puff, collar, breech, knee, bands); CREAM, GLOW | 1.1,1.5,1.4,1.25,1.3,1.65,2; (.84,.72,.52), .25 | 335 | approved | -
