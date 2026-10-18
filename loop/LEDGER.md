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
propBuilder.ts:ZWEI SlabCut (long, wide, grip, point, lug, lugAt) | .85, .05, 4.5, .12, .045, .07 | 352 | approved | 351 own mesh: .8, .024, .24 H grip (rejected)
propBuilder.ts:LONGSWORD SlabCut (long, wide, grip, point) | .62, .045, 2.6, .14 | 352 | approved | -
propBuilder.ts:BOULDER (facets, lumpy, squat, stone, lit); vehicleBuilder CATAPULT_BOULDER | 1, .2, .82, (.66,.59,.5), .18; .65 | 352 | approved | (.5,.45,.38) lit 0; critic: near white
propBuilder.ts:BROWN_LONGBOW (wood, wrap) | (.45,.27,.14), (.86,.78,.62) | 352 | approved | critic: .8 of his height, wants long 1.4
