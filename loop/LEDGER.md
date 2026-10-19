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
361 | slim stockings: shin recoloured, hose 1.06 (e7c3c5c, reverted) | medieval.king.a | rejected
361 | off-hand Stone Axe stood up in the world (e919c23) | tribal.chieftain.b | approved
361 | dreadlock mop: set-back cap, kinked clumps (a7be412) | tribal.stoner.a | approved
361 | cudgel: knobbly faceted lathe, bulb (6b4a076) | tribal.clubber.b | approved
361 | dreadlock mop over the beard (d59089b) | tribal.clubber.a | approved
361 | deer skull as a face mask, eyes on it (1edd0db +ca5ab06) | tribal.bone_mage.a | approved
361 | slab held square in front, bash shove (fe4efa7) | tribal.protector.b | approved

362 | stone slab: faceted columns, seam, round lip, 3 moss (27256cd +d38d4b0) | tribal.protector.b | approved
362 | ragged hide loincloth, large skull (da977ab +20e52ec) | tribal.clubber.a | approved
362 | knapped dark flint head, tan cord X (cf3ff8b) | tribal.spear_thrower.b | approved
362 | one-strap hide dress, slanted bodice, torn skirt (3834142) | tribal.stoner.a | approved
362 | stag rack on the mask: swept knuckled beam, tines (c66c10a) | tribal.bone_mage.a | approved
362 | stag rack on the staff skull, grown 1.4 (42d26c9) | tribal.bone_mage.b | approved
362 | stone axe re-hafted: charcoal, long red haft, X cords (c174af8) | tribal.chieftain.b | approved

## Spent (never retry as [P])

## Rows
farmer.* (47 knob rows, 339-350; batch done) | compacted 351 | 350 | approved | values: git show b3524d7:loop/LEDG..
renaissance.* (51 knob rows, 327-338; batch done) | compacted 340 | 338 | approved | values: git show f525109:loop/LEDG..
medieval.* bard..catapult (37 knob rows, 351-360; units done) | compacted 361 | 360 | approved | values: git show d1d01df:loop/LEDG..
rosterManifest.ts:medieval cost/hp/dmg/cd (knight, catapult, king) | 650/.78/.4/.42, 1000/.79/.22/1.67, 1500/1.05/-/.54 | 351 | stats | 320; -; 1200
propBuilder.ts:ZWEI SlabCut (long, wide, grip, point, lug, lugAt, seat) | .85, .05, 4.5, .12, .045, .07, 2.5 | 354 | approved | seat - (352); 351 own mesh: .8, .0..
proceduralAnimation.ts:TWO_FIST_SWORD (longswordFists, zweiFists); FISTS_ON_GRIP (gap, reach, pommel) | .4, .4; .75, .96, .4 | 354 | approved | zweiFists .5 rejected 353; critic:..
propBuilder.ts:ROYAL_CROWN (heads, band, down, points, tall, base, flare, gem, rim, gold) | 1.12,.3,.04,8,.42,.32,.12,.12,.05,(.95,.72,.22) | 355 | approved | critic: points short, crown low
medievalDress.ts:KING_BEARD (wide..blonde, glow); KING_HAIR (warm, rough, burn*) | ...,(.88,.62,.28),.12; (.4,.24,.07),1 | 359 | approved | glow unused since kingHair (359)
medievalDress.ts:KING_DRESS (puff..hose..buckle); KING_PANTS (knee, profile peak, band, folds) | 1.55,.7,4,1.5,1.32,..; .8,1.7,1.18,4 | 360 | approved | hose 1.1 (359); critic 360: 1.32 boot-thick
proceduralAnimation.ts:OFF_AXE (out, ahead, face) | .18, .22, [.75,.65] | 361 | approved | critic: stone over the chest in windup
tribalDress.ts:DREAD_MOP (..splay, kink, long, thick, clubber, clubberSplay, clubberColor) | ..,.42,.35,.95,.3,.8,.62,(.34,.2,.12) | 362 | approved | clubber colour .4,.25,.15, splay .42 (361)
propBuilder.ts:CLUB (long, grip, sides, knob, wood, profile peak) | .74, .17, 8, .1, (.4,.25,.16), .124 | 361 | approved | CLUB_LONG .6 tube (before 361)
propBuilder.ts:SLAB_FACETS (deep, rows, front, bevel, seam); SLAB_MOSS (top, hole, bottom) | .06,3,1.0,.7,.006; .17,.12,.1 | 362 | approved | planks (before 362); moss .13,.08
tribalDress.ts:RAGGED_LOIN (strips, wide, long, short, skull, snout, hang, boneAt, hide) | 6,.95,.75,.7,.5,1.3,.55,.42,(.62,.43,.27) | 362 | approved | 5,.62,.62,..,.6 (362 first cut)
propBuilder.ts:JAVELIN_LEAF (shoulder, flank, flankWide, ridge, jitter, glow); HEAD long/wide | .28,.62,.55,.13,.08,.14; .16/.15 | 362 | approved | ball leaf .15/.095 (320)
tribalDress.ts:HIDE_DRESS (sides, top, low, strap, skirt, flare, rag, color) | 8,1.0,.56,.22,.62,1.4,.16,(.52,.3,.22) | 362 | approved | -
propBuilder.ts:DEER_RACK (beam, bend, back, thick, taper, tine, inward, brow, tan, glow, staff) | ..,[1.3,.95,.6,.25],.12,.24,.82,..,(.72,.6,.45),.15,1.4 | 362 | approved | DEER_BEAM/SPLAY (251)
propBuilder.ts:STONE_AXE (long, grip, thick, head, out, over, cord_, tilt) | .58,.2,.06,.31,.22,.25,.022,.55 | 362 | approved | AXE_LONG .4, GRIP .25, HEAD .78 of L
propBuilder.ts:DEER_MASK (top, tip, flat, rise, drop, tilt, out, spread, socket) | .95,.36,.32,.1,.08,.2,.26,1.55,1.4 | 361 | approved | -
proceduralAnimation.ts:SLAB_FRONT (reach, grip, bash) | .2, .08, .22 | 361 | approved | -
