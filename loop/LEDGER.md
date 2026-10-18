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
323 | loincloth (914ddb9) | tribal.clubber.a | approved
323 | fang necklace (eae473f) | tribal.spear_thrower.a | approved
323 | chestnut beard (a743b12) | tribal.chieftain.a | approved
323 | fur hide (85c87e9 + 11b021e) | tribal.mammoth.a | approved
323 | Mammoth Charge (7d01e90) | tribal.mammoth.c | approved
324 | hide cape (74de196) | tribal.chieftain.a | approved
324 | tusk necklace (54f0b6b) | tribal.clubber.a | approved
324 | mane (6d8c95a) | tribal.mammoth.a | approved
325 | ankle bands (0207b28) | tribal.mammoth.a | approved
325 | bracelets (e8a2cc0) | tribal.clubber.a | approved
326 | face marking (edf1fdb +4) | tribal.mammoth.a | approved
327 | brim hat (d747d43) | renaissance.balloon_archer.a | approved
327 | short one-handed brush (34e0270 + 362af93) | renaissance.painter.b | approved
327 | cavalier hat (fbe32ce + 0acead3) | renaissance.fencer.a | approved
327 | halberd head (547179c + bc80d12) | renaissance.halberd.b | approved
327 | black iron morion (affc57f) | renaissance.musketeer.a | approved
328 | no back slab (68ad77a) | renaissance.fencer.b | approved
328 | black sallet (0860943) | renaissance.halberd.a | approved
328 | matchlock musket (9951a96 + 418ba56) | renaissance.musketeer.b | approved
328 | kidney palette held up (642eb06) | renaissance.painter.b | approved
328 | spiral-striped lance (4a390e5 + b5ed844) | renaissance.jouster.b | approved
329 | two-handed grip (0f6980a + db2d934) | renaissance.halberd.b | approved
329 | two-handed musket carry (f4cff29) | renaissance.musketeer.b | approved
329 | yellow heater shield (fa71e96 + 9cb619c) | renaissance.jouster.b | approved
329 | longbow (ea71dc1 + c2aff34) | renaissance.balloon_archer.b | approved
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

## Spent (never retry as [P])
(none yet)

## Rows
propBuilder.ts:club CLUB_LONG (of height), CLUB_GRIP, CLUB_HEAD | 0.6, 0.2, 0.22 | 316 | approved | -
propBuilder.ts:stone_axe AXE_LONG (of height), AXE_GRIP | 0.4, 0.25 | 316 | approved | -
propBuilder.ts:stone_axe AXE_HEAD (stone length, of AXE_LONG) | 0.78 | 318 | approved | -
propBuilder.ts:stone_axe AXE_HEAD_SQUASH (height, thickness of the length) | 0.62, 0.5 | 318 | approved | -
propBuilder.ts:stone_axe AXE_LASH (strip wide, thick, proud, tilt, at, bed) | 0.055, 0.06, 0.012, 0.5, 0.1, 0.35 | 319 | approved | -
propBuilder.ts:slab SLAB_MOSS (top, bottom chunk size, proud of the face) | 0.13, 0.08, 0.03 | 318 | approved | -
proceduralAnimation.ts:throw JAVELIN_COCK (raise, out, elbow) | -2.8, 0.12, -0.1 | 319 | approved | -
proceduralAnimation.ts:throw JAVELIN_UNTURN (share of the whip where the stood shaft starts turning back) | 0.2 | 319 | approved | -
propBuilder.ts:slab SLAB_WIDE, SLAB_TALL, SLAB_EYE, SLAB_EYE_UP | 0.34, 0.71, 0.12, 0.22 | 316 | approved | wide 0.25
propBuilder.ts:bone_staff BONE_STAFF_LONG, _GRIP, _SKULL | 0.62, 0.4, 0.1 | 316 | approved | -
projectileSystem.ts:LAUNCH.spear (speed, gravity, throw force) | 20, 9.8, 220 | 317 | approved | -
proceduralAnimation.ts:club OFFHAND_GRIP_UP (of the club's length) | 0.11 | 317 | approved | -
proceduralAnimation.ts:bone_staff BONE_HOLD (raise, out, elbow) | -0.2, 0.18, -0.5 | 317 | approved | -
visualEffects.ts:boneSpikes BONE_SPIKE_NEAR..FAR (m) | 0.45, 1.35 | 317 | approved | -
visualEffects.ts:boneSpikes BONE_SPIKE_GIRTH (base, grow, m) | 0.32, 0.22 | 318 | approved | -
projectileSystem.ts:LAUNCH.stone speed, gravity (held only) | 18, 9.8 | 318 | approved | -
simulationSystem.ts:LEAF_ROW (lift, at, arc per metre) | 0.6, 0.7, 0.03 | 318 | approved | -
projectileSystem.ts:SPIKE_LOFT (up, along m/s) | 10, 2.5 | 319 | approved | -
propBuilder.ts:stone BOULDER_WIDE, BOULDER_JITTER, BOULDER_CHUNKS (3), BOULDER_COLOR | 0.3, 0.16, r 0.42/0.34/0.3, (0.2, 0.18, 0.16) e0.1 | 321 | approved | -
proceduralAnimation.ts:boulder BOULDER_CARRY (raise, inward, elbow), BOULDER_HOLD | -0.75, 0.2, -0.6, 1.0 | 319 | approved | -
propBuilder.ts:bone_mask SKULL_FACETED (heads, tall, under, jitter, socket, snout) | 1.45, 1.6, 0.7, 0.09, 0.3, 0.55 | 320 | approved | -
propBuilder.ts:javelin JAVELIN_HEAD_LONG, JAVELIN_HEAD_WIDE | 0.15, 0.095 | 320 | approved | -
propBuilder.ts:javelin JAVELIN_LEAF (thick, waist, root, jitter, wraps), JAVELIN_STONE | 0.3, 0.35, 0.4, 0.14, 3, (0.44, 0.43, 0.41) e0.15 | 320 | approved | -
unitFactory.ts:tunic TUNIC (top, skirt, flare, tatters, strap), TUNIC_COLOR | 0.88, 0.6, 1.25, 5, 0.22, (0.5, 0.29, 0.18) e0.15 | 320 | approved | -
unitFactory.ts:cape HIDE_CAPE (wide, thick, tilt, jitter, points, drop), COLOR | 1.25, 0.35, 0.12, 0.12, 4, 0.55, (0.38, 0.23, 0.14) e0.16 | 324 | approved | -
tribalDress.ts:necklace CRITTER_NECKLACE (skull, spread, drop, lift, strap) | 0.5, 0.55, 0.2, 0.05, 0.03 | 321 | approved | -
tribalDress.ts:hair LONG_HAIR (strands, face, fringe, long, thick), COLOR | 17, 0.8, 4, 1.05, 0.32, (0.3, 0.18, 0.1) e0.18 | 321 | approved | -
tribalDress.ts:tusks TUSK_BAND (band, strap, rise, bow, thick) | 0.45, 0.1, 0.65, 0.22, 0.4 | 322 | approved | -
tribalDress.ts:loincloth LOINCLOTH (ropes, flap, skull, bone, boneAt), FLAP_COLOR | 2, 0.85, 0.42, 0.62, 0.95, (0.5, 0.3, 0.18) e0.15 | 321 | approved | -
tribalDress.ts:necklace BONE_NECKLACE (drop, bone, middle, thick, gap, strap, off) | 0.16, 0.55, 1.25, 0.13, 2.4, 0.03, 0.14 | 322 | approved | -
tribalDress.ts:bracelets BRACELET (at, apart, bones, long, thick, proud) | 0.76, 0.16, 6, 0.3, 0.28, 0.18 | 325 | approved | -
tribalDress.ts:pauldrons PAULDRON (wide, long, top, out) | 1.9, 0.95, 0.12, 0.55 | 322 | approved | -
tribalDress.ts:beard BEARD (down, wide, deep, locks, lockLong, jitter), CLUBBER_HAIR_COLOR | 0.32, 1.0, 0.5, 5, 0.3, 0.15, (0.4, 0.25, 0.15) e0.18 | 322 | approved | -
tribalDress.ts:necklace FANG_NECKLACE (drop, long, thick, curl, strap, off) | 0.34, 0.8, 0.2, 0.3, 0.03, 0.14 | 323 | approved | -
tribalDress.ts:beard CHESTNUT (chieftain's beard colour) | (0.52, 0.27, 0.14) e0.18 | 323 | approved | -
vehicleBuilder.ts:mammoth MAMMOTH_HIDE, MAMMOTH_FUR (jitter, glow, shag) | (0.34, 0.17, 0.1); 0.06, 0.1, 0.25 | 323 | approved | -
simulationSystem.ts:MAMMOTH_CHARGE (from, reach, speed, seconds, overrun, contact, damage, fling, lift, cooldown) | 2, 14, 2.2, 2.5, 3, 0.5, 30, 5, 6, 6 | 323 | approved | -
unitVisuals.ts:tribal.chieftain proportions.scale | 1.15 | 324 | approved | 1.35
tribalDress.ts:necklace TUSK_NECKLACE (drop, long, side, thick, gap, curl, strap, off) | 0.3, 0.5, 0.8, 0.17, 0.3, 0.3, 0.03, 0.16 | 324 | approved | -
vehicleBuilder.ts:mammoth MAMMOTH_MANE (jitter, locks, long, glow), COLOR | 0.2, 7, 0.42, 0.12, (0.2, 0.1, 0.06) | 324 | approved | -
vehicleBuilder.ts:mammoth ANKLE_BAND (stripes, tall, wide, dots, dotAt, dot, dotOut, dotFlat) | -.17/-.25, .035, .61, 8, -.33, .11, .29, .2 | 326 | approved | -
vehicleBuilder.ts:mammoth FACE_PAINT (path yaw/pitch, steps, wide, taper, thick, trunkDots, dot) | .95/.56 .57/.37 .5/-.05 .42/-.3, 3, 0.17, 0.3, 0.03, 1/3/5, 0.12 | 326 | approved | -
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
proceduralAnimation.ts:lunge LUNGE (guardRaise, guardElbow, turn, reach, pitch, front, knee, back, step, retreat, hold) | -.75, -1.35, .4, -1.5, .3, -.85, .6, .5, .45, .2, .16 | 331 | approved | hold .08
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
proceduralAnimation.ts:LANCE_AIM (hold, rate, maxDip); sim LANCE_AIM_REACH, LANCE_CHEST | .6, 4, .5; 5, .62 | 332 | approved | -
tribalDress.ts:hair PAINTER_HAIR (long_dark, no fringe) | (.17, .11, .08) | 332 | approved | -
runtimeUnit.ts:BALLOON_FLOAT (seconds, rise, top, per, most, size, string, swell) | 3, 1.4, 3.2, 3, 9, .42, .55, .12 | 332 | approved | -
rosterManifest.ts:renaissance cost/hp/dmg/cd (painter, fencer, archer, musketeer) | 50/.94/.17/.35, 150/.46/.67/-, 200/.56/.36/1.36, 250/.54/-/3.33 | 327 | stats | 80, 160, 180, 220
rosterManifest.ts:renaissance cost/hp/dmg/cd (halberd, jouster, da_vinci_tank) | 400/1.19/.58/.77, 1000/.47/-/-, 4000/3.65/.53/1.59 | 327 | stats | 200, 500, 1800 (cd .86)
