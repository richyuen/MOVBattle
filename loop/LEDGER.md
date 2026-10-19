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
351 | gold heal beam orb to chest, ally gilded (8407591) | medieval.healer.c | approved
351 | catapult arm on a pivot, whips upright on (df37545 +a4cb4c1) | medieval.catapult.c | approved
351 | Knight Charge dash and batter (b806f45) | medieval.knight.c | approved
351 | banjo: pot, fretted neck, headstock, laid (e179db7) | medieval.bard.b | approved
351 | Zweihander variant (4c91ec8, reverted) | medieval.king.b | rejected
352 | full gild: every opaque mesh on one shared (9e3fce4 +afcc44c) | medieval.healer.c | approved
352 | faceted grey-brown boulder, bucket and shot (639c5f4 +439f40c) | medieval.catapult.b | approved
352 | brown longbow variant (a8bc13d) | medieval.archer.b | approved
352 | longsword slab cut (4285473) | medieval.squire.b | approved
352 | Zweihander retry on the greatsword mount (519c8af) | medieval.king.b | approved
353 | two-fisted hilt, off fist onto the grip (7f4b61c) | medieval.squire.b | approved
353 | two-fisted Zweihander, off fist .5 grip (9e2fd04, reverted c9dd189) | medieval.king.b | rejected
353 | priest staff: banded team orb, cross (03b4e5c) | medieval.healer.b | approved
353 | open armet: grey dome, plates, bevor, team (58cfa04 +4459ae6) | medieval.knight.a | approved
353 | Banjo Walk: lure, then run off round his man (68d8302 +53c3633) | medieval.bard.c | approved
355 | spoon bucket: open flared cup, rim, boulder (56a8ab6) | medieval.catapult.b | approved
355 | hip quiver on the off hip, team band (d75f622 +7078d43) | medieval.archer.b | approved
355 | arming sword held out, blade stood up, grey (1574c11) | medieval.knight.b | approved
355 | fitted royal crown: low gold band, 8 (0535fe4) | medieval.king.a | approved
355 | tonsure: grey fringe sides/back, grey (e5f32a0 +cf8f774) | medieval.healer.a | approved
355 | floppy hat: drooping brown brim, raised (216bf92) | medieval.bard.a | approved
355 | crusader great helm: iron, rivets, gold (92256f8) | medieval.squire.a | approved
356 | stray chest hilt: tabard cross left off the (cc7912d) | medieval.knight.b | approved
356 | hood: dark team cowl open at the face (e32ac81 +ee64656) | medieval.archer.a | approved
356 | robe trim: gold bands, hem, cuffs, collar (7462491) | medieval.healer.a | approved
356 | peasant vest: torso+yoke shells, V panel (ffdb80c +df7b94b) | medieval.bard.a | approved
356 | tabard: beige cross pattee, hem band (3122a04 +78cf8cc) | medieval.squire.a | approved
356 | beard: faceted dirty-blonde beard, drooping (63043f4) | medieval.king.a | approved
356 | box trestle: rails, crossbeams, caps (4375f6d) | medieval.catapult.a | approved
357 | wheels: small timber drums, grey iron (4c16604) | medieval.catapult.a | approved
357 | cuirass: steel shells of torso+yoke, steel (4604755) | medieval.knight.a | approved
357 | cape: cream cape off the shoulders (377de2a +808aa53) | medieval.king.a | approved
357 | lower legs: grey greaves, knee cops, brown (74fa206) | medieval.squire.a | approved
357 | arms: beige upper sleeves, brown vambraces (825dee2) | medieval.archer.a | approved
357 | collar: gold lapels on chestFrontAt in a V (3ab7173) | medieval.healer.a | approved
357 | tunic: V and a mid-thigh skirt in one tunic (cfd130d) | medieval.bard.a | approved
358 | knight cape: team medievalCape off the (929b00a +d7037c7) | medieval.knight.a | approved
358 | royal dress: puffed sleeves, collar, belt (ededbdd) | medieval.king.a | rejected-kept
358 | arms: beige sleeve shells, couters (56aed0c) | medieval.squire.a | approved
358 | wood: orange timber, team paint streaks on (b246560) | medieval.catapult.a | approved
358 | legs: cream knee socks, brown shoes, team (bef3298) | medieval.bard.a | approved
358 | belt and cuffed knee boots, sleeves tan (dbfaa66) | medieval.archer.a | approved
358 | arrow: red shaft, large black broadhead (f886865) | medieval.archer.c | approved
359 | hood: tight oval, rim, two-sided shell, capelet (cdc15b5 +e8bbf78) | medieval.archer.a | approved
359 | turned collar: solid lapel slabs, stand (1173ec2) | medieval.healer.a | approved
359 | plate legs: cuisses, greaves, cops, sabatons (3dd532f) | medieval.knight.a | approved
359 | dress re-land: lathed pantaloons, stockings (44f8443) | medieval.king.a | approved
359 | sleeves: tan cloth shells (a43c08b, reverted) | medieval.archer.a | rejected
359 | cape cut: shoulder-line top, wrap, no flaps (d2850fe) | medieval.knight.a | approved
359 | beard: own hair material, sideburns (8801b8c) | medieval.king.a | approved
360 | sleeve material: warmCloth amber self-light, unglow (ca82190 +def8b50) | medieval.squire.a | approved
360 | sleeve shells in warmCloth, arm+stub too, unglow (6c6eb29 +3d9f92d) | medieval.archer.a | approved
360 | no skirt: blouse to belt, breeches show; stockings 1.32 warm (774e5c3 +0dd77b3) | medieval.king.a | approved

## Spent (never retry as [P])

## Rows
farmer.* (47 knob rows, 339-350; batch done) | compacted 351 | 350 | approved | values: git show b3524d7:loop/LEDG..
renaissance.* (51 knob rows, 327-338; batch done) | compacted 340 | 338 | approved | values: git show f525109:loop/LEDG..
rosterManifest.ts:medieval cost/hp/dmg/cd (bard, squire, archer, healer) | 60/.79/.58/-, 100/1.26/1.33/-, 140/.4/1.94/3.64, 180/.19/-/- | 351 | stats | 65; -; -; -
rosterManifest.ts:medieval cost/hp/dmg/cd (knight, catapult, king) | 650/.78/.4/.42, 1000/.79/.22/1.67, 1500/1.05/-/.54 | 351 | stats | 320; -; 1200
visualEffects.ts:HEAL_BEAM (core, halo, haloAlpha, fade); simulationSystem HEALER_BEAM_SHARE | .12, .17, .35, .2; .95 | 352 | approved | core .07 (351)
runtimeUnit.ts:GILD (gold, dye, glow, coat, coatGlow) | (1,.78,.2), .85, .45, (.95,.62,.08), .22 | 352 | approved | critic: coat flat mustard, a bit o..
vehicleBuilder.ts:CATAPULT_ARM (pivotY, long, short, cocked, thrown); runtimeUnit CATAPULT_THROW (swing, hold, lower) | 1.62,1,.7,.35,pi/2; .12,.5,.7 | 351 | approved | critic: cocked end only a little b..
simulationSystem.ts:KNIGHT_CHARGE (from, reach, speed, seconds, overrun, contact, damage, fling, lift, cooldown) | .4,2.5,2.6,1,.5,.3,5,6,3.5,5 | 351 | approved | critic: reads as a brisk run
propBuilder.ts:BANJO (pot, deep, head, front, neck, neckWide, frets, headLong, headWide, headTip, pegs) | .19,.28,.86,.05,.36,.032,9,.075,1.7,.25,4 | 351 | approved | -
proceduralAnimation.ts:BANJO_HOLD (out, up, ahead, across, rise, forward); POLE_GRIP.banjoNeck | .2,.1,.32,.72,.66,.12; [.6,.95] | 351 | approved | critic: neck too upright, fists hi..
propBuilder.ts:ZWEI SlabCut (long, wide, grip, point, lug, lugAt, seat) | .85, .05, 4.5, .12, .045, .07, 2.5 | 354 | approved | seat - (352); 351 own mesh: .8, .0..
propBuilder.ts:LONGSWORD SlabCut (long, wide, grip, point) | .62, .045, 2.6, .14 | 352 | approved | -
propBuilder.ts:BOULDER (facets, lumpy, squat, stone, lit); vehicleBuilder CATAPULT_BOULDER | 1, .2, .82, (.6,.5,.4), .1; .65 | 354 | approved | (.66,.59,.5) .18 (352; critic 354:..
propBuilder.ts:BROWN_LONGBOW (long, wood, wrap) | 1.4, (.45,.27,.14), (.86,.78,.62) | 353 | approved | long 1.2 (LONGBOW, 352); critic: g..
proceduralAnimation.ts:TWO_FIST_SWORD (longswordFists, zweiFists); FISTS_ON_GRIP (gap, reach, pommel) | .4, .4; .75, .96, .4 | 354 | approved | zweiFists .5 rejected 353; critic:..
propBuilder.ts:PRIEST_STAFF (long, thick, grip, sleeve, cap, orb, band, finial); PRIEST_HOLD | 1.2,.02,.45,.17,.05,.11,.012,.06 | 353 | approved | critic: orb half a head
propBuilder.ts:ARMET (heads, deep, dome, drop, plate, bevor, rail, bars, proud) | 1.22,1.1,.5,1,.09,.24,.75,5,.05 | 353 | approved | critic: wants rail 1.0, proud .12
simulationSystem.ts:BANJO_WALK (lure, clear, turn, step) | 2.2, 1.5, .85, 1.2 | 353 | approved | turn 1.15 (pre-review); critic: ar..
visualEffects.ts:MUSIC_NOTE (size, head, tilt, stem, flag, rise, sway, life, fade, color, glow); simulationSystem BANJO_NOTES (every, first, over, aside, stack) | 1,.13,.45,.26,.12,.45,.08,1.6,.35,(.95,.4,.04),.2; .45,2,.32,.18,.32 | 354 | approved | glow .6, over .15 (pre-review); cr..
vehicleBuilder.ts:CATAPULT_CREW (z, y, raise, spread, elbow); CREW_DRESS colours | -.74, .5, -2.8, .12, -.2 | 354 | approved | z -.62 raise -2.6 (pre-review); cr..
unitFactory.ts:HEALER_ROBE (long, hem) | 1.75, 1.5 | 354 | approved | -
vehicleBuilder.ts:CATAPULT_BUCKET (bottom, top, deep, rim, sink, tone) | .4, .68, .28, .06, .45, (.55,.26,.12) | 355 | approved | critic: smooth cup, TABS boxed timber
propBuilder.ts:QUIVER_HIP (long, mouth, foot, top, side, back, tilt, proud, leather, fletch) | .6,.14,.11,.22,.27,.02,.12,.2,(.46,.22,.15),[.07,.1] | 355 | approved | right hip .52/.12/.24/.09 (pre-review, hidden)
proceduralAnimation.ts:ARMING_OUT (raise, out, elbow, tip) | -.35, .85, -.55, [.35,.9,.25] | 355 | approved | critic: blade upright, TABS angled out
propBuilder.ts:ROYAL_CROWN (heads, band, down, points, tall, base, flare, gem, rim, gold) | 1.12,.3,.04,8,.42,.32,.12,.12,.05,(.95,.72,.22) | 355 | approved | critic: points short, crown low
medievalDress.ts:TONSURE (ring, open, y, thick, out, beard wide/down/deep, grey, glow) | 1,.95,.12,.42,1.1; 1,.22,.55; (.66,.64,.62),.15 | 355 | approved | thick .26 out 1.06 (pre-review)
propBuilder.ts:FLOPPY_HAT (brim, thick, droop, dip, cock, crown, taper, tall, pale, felt, leaves) | 2,.07,.24,.12,-.08,1.12,.88,.5,.25,(.55,.3,.19) | 355 | approved | critic: sits low, brim half-hides the eyes
propBuilder.ts:CRUSADER_HELM (iron, gold, band, rivets, brow, browWide, nasal, chin, proud, holes, panel) | (.3,.3,.33),(.86,.66,.3),.1,8,.32,1.9,.24,.42,.07,3,.62 | 355 | approved | critic: iron reads lilac-grey
medievalDress.ts:ARCHER_HOOD (out, peak, chin, open, brow, jaw, rim, cape hemTall/hemShade, shade, glow) | 1.38,.4,1.12,.56,.38,-.8,.1; .22,.2; .3,.02 | 359 | approved | open .62 brow .58 shade .5 (356)
medievalDress.ts:HEALER_TRIM (band..collar); HEALER_FOLD (inner, outer, stand, flare, neck, from) | ...,.95,...; .05,.14,.2,1.25,.42,1 | 359 | approved | flat lapels (358)
medievalDress.ts:BARD_VEST (wide, deep, long, shade, v, down, laces, toggle, proud, tunicPale, tunicGlow) | 1.05,1.12,1,.5,.62,.62,2,.22,.06,.04,.16 | 357 | approved | toggle .16 pale .12 glow .3 (356); critic 357: toggles pale grey
medievalDress.ts:SQUIRE_TABARD (span, up, down, waist, end, hem, edge, proud, beige) | .86,.85,.75,.14,.42,.12,.3,.015,(.88,.8,.62) | 356 | approved | waist .1 end .34 (pre-review); critic: cross pale grey
medievalDress.ts:KING_BEARD (wide..blonde, glow); KING_HAIR (warm, rough, burn*) | ...,(.88,.62,.28),.12; (.4,.24,.07),1 | 359 | approved | glow unused since kingHair (359)
vehicleBuilder.ts:CATAPULT_FRAME (long, half, railY, beam, cap, spread, bolt, deck) | 1.6,.42,.42,.16,.24,.55,.09,.5 | 356 | approved | slab bed + 2 posts (before 356)
vehicleBuilder.ts:CATAPULT_WHEEL (across, face, tyreWide, proud, hub, facets, tone, iron) | .56,.8,.13,.015,.22,10,(.6,.3,.13),(.42,.43,.46) | 357 | approved | .7 dark-rimmed wheels at x .58 (before 357)
medievalDress.ts:KNIGHT_PLATE (wide, deep, lames, proud, rim, steel, edge); unitFactory KNIGHT_FAULD (long, flare) | 1.07,1.1,2,1.05,.12; .42,1.4 | 357 | approved | critic: cuirass boxy, a skin wide
medievalDress.ts:MEDIEVAL_CAPE (top, hem, drop, off, wrap, flap, button, cream, glow) | 1.2,1.75,.6,.35,1.45,.5,.24,(.95,.88,.7),.28 | 357 | approved | 1.12/1.4/1.3 glow .12 (pre-review); critic: collar flap a flat board
medievalDress.ts:SQUIRE_LEGS (out, from, cop, ahead); ARCHER_ARMS (out, from, to) | 1.32,.06,1.25,.55; 1.3,.08,.94 | 360 | approved | ARCHER_ARMS.beige unread since 360 (warmCloth); no [P]
medievalDress.ts:BARD_TUNIC (long, hem, hemShade) | 1.45, .16, .62 | 357 | approved | -
medievalDress.ts:KNIGHT_CAPE; KNIGHT_CAPE_CUT (rise, wrap); KNIGHT_LEGS (cuisse, greave, from, cop) | ..; 1,1.75; 1.2,1.28,.05,1.3 | 359 | approved | -
medievalDress.ts:SQUIRE_ARMS (sleeve, gauntlet, couter); WARM_CLOTH (tan, warm) + unglow | 1.16,1.4,1.5; (.92,.74,.46),(.6,.36,.08) | 360 | approved | beige (.82,.72,.52) glow .1 (359, spent)
medievalDress.ts:KING_DRESS (puff..hose..buckle); KING_PANTS (knee, profile peak, band, folds) | 1.55,.7,4,1.5,1.32,..; .8,1.7,1.18,4 | 360 | approved | hose 1.1 (359); critic 360: 1.32 boot-thick
vehicleBuilder.ts:CATAPULT_PAINT (wood, woodGlow, paintGlow, long, short, strip, shift) | (.66,.32,.14),.16,.12,.62,.4,.5,.14 | 358 | approved | wood (.36,.13,.09)
medievalDress.ts:BARD_LEGS (out, from, bow, bowShade, sock); ARCHER_KIT (belt, boot, from, cuff) | 1.16,.04,.55,.85,(.88,.84,.7); .15,1.24,.22,1.45 | 358 | approved | -
projectileSystem.ts:BROADHEAD (wide, long, thick, shaft, iron) | .17,.2,.3,(.62,.16,.1),(.08,.08,.09) | 358 | approved | -
