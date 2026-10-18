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
351 | gold heal beam orb to chest, ally gilded (8407591) | medieval.healer.c | approved
351 | catapult arm on a pivot, whips upright on the shot (df37545 +a4cb4c1) | medieval.catapult.c | approved
351 | Knight Charge dash and batter (b806f45) | medieval.knight.c | approved
351 | banjo: pot, fretted neck, headstock, laid across him (e179db7) | medieval.bard.b | approved
351 | Zweihander variant (4c91ec8, reverted) | medieval.king.b | rejected
352 | full gild: every opaque mesh on one shared gold material (9e3fce4 +afcc44c) | medieval.healer.c | approved
352 | faceted grey-brown boulder, bucket and shot (639c5f4 +439f40c) | medieval.catapult.b | approved
352 | brown longbow variant (a8bc13d) | medieval.archer.b | approved
352 | longsword slab cut (4285473) | medieval.squire.b | approved
352 | Zweihander retry on the greatsword mount, no marker (519c8af) | medieval.king.b | approved
353 | two-fisted hilt, off fist onto the grip (7f4b61c) | medieval.squire.b | approved
353 | two-fisted Zweihander, off fist .5 grip below (9e2fd04, reverted c9dd189) | medieval.king.b | rejected
353 | priest staff: banded team orb, cross finial, gold fittings, upright planted hold (03b4e5c) | medieval.healer.b | approved
353 | open armet: grey dome, plates, bevor, team barred visor frame (58cfa04 +4459ae6) | medieval.knight.a | approved
353 | Banjo Walk: lure, then run off round his man (68d8302 +53c3633) | medieval.bard.c | approved
355 | spoon bucket: open flared cup, rim, boulder sunk in it (56a8ab6) | medieval.catapult.b | approved
355 | hip quiver on the off hip, team band, team-fletched arrows (d75f622 +7078d43) | medieval.archer.b | approved
355 | arming sword held out, blade stood up, grey hilt (1574c11) | medieval.knight.b | approved
355 | fitted royal crown: low gold band, 8 points, team gems (0535fe4) | medieval.king.a | approved
355 | tonsure: grey fringe sides/back, grey beard, cap dropped (e5f32a0 +cf8f774) | medieval.healer.a | approved
355 | floppy hat: drooping brown brim, raised crown, leaf feathers (216bf92) | medieval.bard.a | approved
355 | crusader great helm: iron, rivets, gold cross plate, holes, team panel (92256f8) | medieval.squire.a | approved

## Spent (never retry as [P])
(none yet)

## Rows
farmer.* (47 knob rows, 339-350; batch done) | compacted 351 | 350 | approved | values: git show b3524d7:loop/LEDGER.md
renaissance.* (51 knob rows, 327-338; batch done) | compacted 340 | 338 | approved | values: git show f525109:loop/LEDGER.md
rosterManifest.ts:medieval cost/hp/dmg/cd (bard, squire, archer, healer) | 60/.79/.58/-, 100/1.26/1.33/-, 140/.4/1.94/3.64, 180/.19/-/- | 351 | stats | 65; -; -; -
rosterManifest.ts:medieval cost/hp/dmg/cd (knight, catapult, king) | 650/.78/.4/.42, 1000/.79/.22/1.67, 1500/1.05/-/.54 | 351 | stats | 320; -; 1200
visualEffects.ts:HEAL_BEAM (core, halo, haloAlpha, fade); simulationSystem HEALER_BEAM_SHARE | .12, .17, .35, .2; .95 | 352 | approved | core .07 (351)
runtimeUnit.ts:GILD (gold, dye, glow, coat, coatGlow) | (1,.78,.2), .85, .45, (.95,.62,.08), .22 | 352 | approved | critic: coat flat mustard, a bit olive
vehicleBuilder.ts:CATAPULT_ARM (pivotY, long, short, cocked, thrown); runtimeUnit CATAPULT_THROW (swing, hold, lower) | 1.62,1,.7,.35,pi/2; .12,.5,.7 | 351 | approved | critic: cocked end only a little below level
simulationSystem.ts:KNIGHT_CHARGE (from, reach, speed, seconds, overrun, contact, damage, fling, lift, cooldown) | .4,2.5,2.6,1,.5,.3,5,6,3.5,5 | 351 | approved | critic: reads as a brisk run
propBuilder.ts:BANJO (pot, deep, head, front, neck, neckWide, frets, headLong, headWide, headTip, pegs) | .19,.28,.86,.05,.36,.032,9,.075,1.7,.25,4 | 351 | approved | -
proceduralAnimation.ts:BANJO_HOLD (out, up, ahead, across, rise, forward); POLE_GRIP.banjoNeck | .2,.1,.32,.72,.66,.12; [.6,.95] | 351 | approved | critic: neck too upright, fists high on the neck
propBuilder.ts:ZWEI SlabCut (long, wide, grip, point, lug, lugAt, seat) | .85, .05, 4.5, .12, .045, .07, 2.5 | 354 | approved | seat - (352); 351 own mesh: .8, .024, .24 H grip (rejected)
propBuilder.ts:LONGSWORD SlabCut (long, wide, grip, point) | .62, .045, 2.6, .14 | 352 | approved | -
propBuilder.ts:BOULDER (facets, lumpy, squat, stone, lit); vehicleBuilder CATAPULT_BOULDER | 1, .2, .82, (.6,.5,.4), .1; .65 | 354 | approved | (.66,.59,.5) .18 (352; critic 354: still cool grey); (.5,.45,.38) lit 0; critic: near white
propBuilder.ts:BROWN_LONGBOW (long, wood, wrap) | 1.4, (.45,.27,.14), (.86,.78,.62) | 353 | approved | long 1.2 (LONGBOW, 352); critic: grip wrap oversized
proceduralAnimation.ts:TWO_FIST_SWORD (longswordFists, zweiFists); FISTS_ON_GRIP (gap, reach, pommel) | .4, .4; .75, .96, .4 | 354 | approved | zweiFists .5 rejected 353; critic: idle/release off fist short of grip
propBuilder.ts:PRIEST_STAFF (long, thick, grip, sleeve, cap, orb, band, finial); PRIEST_HOLD | 1.2,.02,.45,.17,.05,.11,.012,.06 | 353 | approved | critic: orb half a head
propBuilder.ts:ARMET (heads, deep, dome, drop, plate, bevor, rail, bars, proud) | 1.22,1.1,.5,1,.09,.24,.75,5,.05 | 353 | approved | critic: wants rail 1.0, proud .12
simulationSystem.ts:BANJO_WALK (lure, clear, turn, step) | 2.2, 1.5, .85, 1.2 | 353 | approved | turn 1.15 (pre-review); critic: arc gentle
visualEffects.ts:MUSIC_NOTE (size, head, tilt, stem, flag, rise, sway, life, fade, color, glow); simulationSystem BANJO_NOTES (every, first, over, aside, stack) | 1,.13,.45,.26,.12,.45,.08,1.6,.35,(.95,.4,.04),.2; .45,2,.32,.18,.32 | 354 | approved | glow .6, over .15 (pre-review); critic: thin, dim, small
vehicleBuilder.ts:CATAPULT_CREW (z, y, raise, spread, elbow); CREW_DRESS colours | -.74, .5, -2.8, .12, -.2 | 354 | approved | z -.62 raise -2.6 (pre-review); critic: arms frozen up after the shot
unitFactory.ts:HEALER_ROBE (long, hem) | 1.75, 1.5 | 354 | approved | -
vehicleBuilder.ts:CATAPULT_BUCKET (bottom, top, deep, rim, sink, tone) | .4, .68, .28, .06, .45, (.55,.26,.12) | 355 | approved | critic: smooth cup, TABS boxed timber
propBuilder.ts:QUIVER_HIP (long, mouth, foot, top, side, back, tilt, proud, leather, fletch) | .6,.14,.11,.22,.27,.02,.12,.2,(.46,.22,.15),[.07,.1] | 355 | approved | right hip .52/.12/.24/.09 (pre-review, hidden)
proceduralAnimation.ts:ARMING_OUT (raise, out, elbow, tip) | -.35, .85, -.55, [.35,.9,.25] | 355 | approved | critic: blade upright, TABS angled out
propBuilder.ts:ROYAL_CROWN (heads, band, down, points, tall, base, flare, gem, rim, gold) | 1.12,.3,.04,8,.42,.32,.12,.12,.05,(.95,.72,.22) | 355 | approved | critic: points short, crown low
medievalDress.ts:TONSURE (ring, open, y, thick, out, beard wide/down/deep, grey, glow) | 1,.95,.12,.42,1.1; 1,.22,.55; (.66,.64,.62),.15 | 355 | approved | thick .26 out 1.06 (pre-review)
propBuilder.ts:FLOPPY_HAT (brim, thick, droop, dip, cock, crown, taper, tall, pale, felt, leaves) | 2,.07,.24,.12,-.08,1.12,.88,.5,.25,(.55,.3,.19) | 355 | approved | critic: sits low, brim half-hides the eyes
propBuilder.ts:CRUSADER_HELM (iron, gold, band, rivets, brow, browWide, nasal, chin, proud, holes, panel) | (.3,.3,.33),(.86,.66,.3),.1,8,.32,1.9,.24,.42,.07,3,.62 | 355 | approved | critic: iron reads lilac-grey
