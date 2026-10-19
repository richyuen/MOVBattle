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

362 | stone slab: faceted columns, seam, round lip, 3 moss (27256cd +d38d4b0) | tribal.protector.b | approved
362 | ragged hide loincloth, large skull (da977ab +20e52ec) | tribal.clubber.a | approved
362 | knapped dark flint head, tan cord X (cf3ff8b) | tribal.spear_thrower.b | approved
362 | one-strap hide dress, slanted bodice, torn skirt (3834142) | tribal.stoner.a | approved
362 | stag rack on the mask: swept knuckled beam, tines (c66c10a) | tribal.bone_mage.a | approved
362 | stag rack on the staff skull, grown 1.4 (42d26c9) | tribal.bone_mage.b | approved
362 | stone axe re-hafted: charcoal, long red haft, X cords (c174af8) | tribal.chieftain.b | approved
363 | beast skull helm: tan brain case, beak, open jaw, googly eyes (03e92ab +e52aaa4) | tribal.chieftain.a | approved
363 | skull helm re-seated: tan dome on brow, sockets, brows, ridge (d6d6c79 +c60ed20) | tribal.protector.a | approved
363 | hung tusks: down from the band to the cheeks, rope turns (09199c4) | tribal.spear_thrower.a | approved
363 | staff skull: mask face plate on low cranium, googly eyes (f270dce) | tribal.bone_mage.b | approved
363 | curved shoulder strap: two ribbons over the shoulder (205e839) | tribal.stoner.a | approved
363 | fur pillar legs: lathes, flush paint, no caps (5d518c2 +7c6a257 +9b9ed17) | tribal.mammoth.a | approved
363 | charge seen: head-down gallop pose, sprite dust at feet (baea514 +d0548b0) | tribal.mammoth.c | approved
364 | [R] legs: breeches past knee stub, shin as stocking (3d7e9c8 +675c79f +ea41917, reverted) | medieval.king.a | rejected
364 | hide wrap on rope, curved hip tusks (61aea7d +85d9e0a) | tribal.chieftain.a | approved
364 | main axe stood upright at his side, arm mirrored (bee41ad) | tribal.chieftain.b | approved
364 | cheek leaves on straps, mask in warm tan (0456062 +23d1047) | tribal.bone_mage.a | approved
364 | staff rack: near-level beams swept back, tan cranium (ad6c3d7 +3600f5d) | tribal.bone_mage.b | approved
364 | trample: dust ring sprites, ground band, earth clods (96d2c06) | tribal.mammoth.c | approved
364 | close skirt: hip band + torn tongues, no kilt (6ebde62, reverted) | tribal.stoner.a | rejected
365 | [R] legs #2: thigh ends at the hinge, shin = slim stocking, low shoe (b1fa1af +09dfc00) | medieval.king.a | approved
365 | barrel body: 13x14 rings, hump, belly, jitter (50ae24c) | tribal.mammoth.a | approved
365 | trunk: fur tube to the ground, flared snout, flat dots (0a02077) | tribal.mammoth.b | approved
365 | upright lanky stance: default pose, longer limbs (6fba04b) | tribal.clubber.a | approved
365 | skirt per thigh: waist band + torn hip-joint panels, no kilt (8db2654) | tribal.stoner.a | approved
365 | worn rack sweep: maskBend, maskLong, mask tan (179ef76, reverted) | tribal.bone_mage.a | rejected
365 | skull helm re-seated level on the crown, eyes top-front (7d98745) | tribal.chieftain.a | approved
366 | tusk paint: matte bone-tan, team tip, tan gap, stripe (ef98856 +ef94f97) | tribal.mammoth.b | approved
366 | skewed hump, haunch flank, domed thigh tops (4bc74c3 +940f9b1) | tribal.mammoth.a | approved
366 | pauldrons: head-wide tan beast skulls, googly eye (0a99945 +d78d6f7 +65e6573) | tribal.chieftain.a | approved
366 | curly mop: 3-piece hooked locks, crown tufts (6ca5eb6) | tribal.clubber.a | approved
366 | strap: solid dark band proud of shoulder, rolled hem (d06e5d0) | tribal.stoner.a | approved
366 | worn rack: near-level beams 1.4x, bare first joint, own tan (1c62590 +8d1905d) | tribal.bone_mage.a | approved
367 | skull face plate: rims, bridge, muzzle (8762812) | tribal.protector.a | approved
367 | loin strips: 5 torn brown strips, tan skull (d0909d5) | tribal.clubber.a | approved
367 | skirt: ring of torn tongues (de2744b +df9a744) | tribal.stoner.a | approved
367 | ears: shaggy flap behind the eye (0d9c3d0 +b40c498) | tribal.mammoth.a | approved
367 | fur hem over leg roots (c69689e +d55dff7) | tribal.mammoth.a | rejected
367 | full beard to the chest (6c66d85) | tribal.chieftain.a | approved
368 | skull jaw, cheeks to it; slab lip 6-sided lit stone (b544fb9) | tribal.protector.a | approved
368 | rear box: pelvis block inside the skirt, in hide (8e46f46) | tribal.stoner.a | approved
368 | sallet: 8-sided bucket, slit + bead eyes, bevor (c52c267) | renaissance.halberd.a | approved
368 | horse: arched 2-segment neck, low head, front eyes, chestnut (f271f4d) | renaissance.jouster.a | approved
368 | jabot: 3 stacked ragged tiers (53e6e78, reverted) | renaissance.painter.a | rejected
368 | morion: tall 6-facet bowl, half-disc comb, brim points (965f103) | renaissance.musketeer.a | approved
369 | step back: hop off his man after the thrust (fbd58e7, rejected-kept; follow-up a285bea reverted) | renaissance.fencer.c | rejected
369 | dash back: hop back from a man inside the pole (e399131) | renaissance.halberd.c | approved
369 | canter charge through the man, lance on contact, trample; leg pivots + 3-beat canter (5ac2a1e) | renaissance.jouster.c | approved
369 | matchlock re-cut: fat pale octagon barrel, dark bands, deep stock, heel butt (828b96d) | renaissance.musketeer.b | approved
369 | balloon arrow in the draw fist, hidden at the loose (1dafd49 +2c4f0d0) | renaissance.balloon_archer.b | approved
369 | jabot under the jaw: 3 tiers below the head, fold rings (9f0bd3c) | renaissance.painter.a | approved
369 | skull backing plate filling the window (a321a18) | tribal.protector.a | approved
370 | candy lance: team band helix half each turn on tan shaft (14e00d6) | renaissance.jouster.b | approved
370 | feather plume: 7 flat stepped-blade feathers, helm + poll (38081d7 +1edcdf2, reverted) | renaissance.jouster.a | rejected
370 | falling collar: tan 8-sided cape on the vest top, 2 tabs (6bc67f7 +62c3f84) | renaissance.musketeer.a | approved
370 | quilted sleeves: packed puffs both arms, flared black cuff (9295c61) | renaissance.halberd.a | approved
370 | puffed beret: band + faceted puff slid aside, team colour (8139915 +afefe3a) | renaissance.painter.a | approved
370 | tan bone ring on the slab behind the window (37d76c7) | tribal.protector.a | approved
370 | step back: committed slide from the land, 1.8 m in .16 s (e2f2190) | renaissance.fencer.c | approved
371 | hose: garter + bow, tan sock tops, orange shoes (e7a49eb) | renaissance.musketeer.a | approved
371 | solid doublet, tan placket + buttons, slashed shoulder puffs (58d2ee9) | renaissance.balloon_archer.a | approved
371 | cavalier hat as one felt lathe, left brim swept up (47ab317 +4b357d0) | renaissance.fencer.a | approved
371 | feather clump: packed rings of fat icos, helm + poll (ae2a04b) | renaissance.jouster.a | approved
371 | Fencer Dodge: sidestep slide as a swing goes up, blow on air (c88c308) | renaissance.fencer.c | approved

## Spent (never retry as [P])

## Rows
farmer.* (47 knob rows, 339-350; batch done) | compacted 351 | 350 | approved | values: git show b3524d7:loop/LEDG..
medieval.* (43 knob rows incl. stats, 351-365; batch done) | compacted 366 | 365 | approved | values: git show f142d6e:loop/LEDG..
tribal.chieftain (OFF_AXE, MAIN_AXE, CHIEF_LOIN, STONE_AXE, BEAST_SKULL, PAULDRON, CHIEF_BEARD; unit done) | compacted 369 | 367 | approved | values: git show 706894b:loop/LEDGER.md
tribal.clubber (DREAD_MOP, CLUB, RAGGED_LOIN, visuals, CURLY_MOP, RAGGED_STRIPS; unit done) | compacted 369 | 367 | approved | values: git show 706894b:loop/LEDGER.md
propBuilder.ts:SLAB_FACETS (deep, rows, front, bevel, seam); SLAB_MOSS (top, hole, bottom) | .06,3,1.0,.7,.006; .17,.12,.1 | 362 | approved | planks (before 362); moss .13,.08
propBuilder.ts:JAVELIN_LEAF (shoulder, flank, flankWide, ridge, jitter, glow); HEAD long/wide | .28,.62,.55,.13,.08,.14; .16/.15 | 362 | approved | ball leaf .15/.095 (320)
tribal.stoner (HIDE_DRESS, HIDE_SKIRT, HIDE_EDGE, SKIRT_TONGUES; unit done) | compacted 369 | 368 | approved | values: git show 706894b:loop/LEDGER.md
tribal.bone_mage (DEER_RACK, worn, staff, MASK_LEAF, STAFF_SKULL, DEER_MASK; unit done) | compacted 368 | 366 | approved | values: git show 96d1c20:loop/LEDGER.md
renaissance.jouster (BARDED_NECK, JOUSTER_CHARGE, HORSE_GAIT, LANCE_CANDY, FEATHER_CLUMP; unit done) | compacted 371 | 371 | approved | values: git show 58e64cc:loop/LEDGER.md + 371 gap commits
renaissance.musketeer (MORION_CUT, MATCHLOCK, MUSKETEER_COLLAR, MUSKETEER_HOSE; unit done) | compacted 371 | 371 | approved | values: git show 58e64cc:loop/LEDGER.md + 371 gap commits
visualEffects.ts:TRAMPLE_RING (sprites..peak, band, bandPeak, clods, toss, fling, clod) | 12,.25,1,.7,1.8,.4,1.2,.85,.22,.5,8,4.2,2.2,.16 | 364 | approved | -
proceduralAnimation.ts:SLAB_FRONT (reach, grip, bash) | .2, .08, .22 | 361 | approved | -
propBuilder.ts:SKULL_FACETED (heads, tall, under, sink, socket, socketUp, snout, snoutTilt, tan, glow) | 1.12,1.15,.45,.1,.3,.42,.5,.5,(.68,.52,.34),.2 | 363 | approved | 1.45,1.6,.7,-,.3,-,.55 white .18
tribalDress.ts:TUSK_BAND (band, strap, rootOut, rootAhead, drop, bow, hook, thick, turns, tan, glow) | .45,.1,1.06,.2,.78,.16,.55,.34,2,(.78,.66,.48),.22 | 363 | approved | rise .65 bow .22 thick .4 (322)
vehicleBuilder.ts:MAMMOTH_LEG (sides, jitter, proud, thigh, shin) | 9,.035 (thigh only),1.012,dome .14@.46->.37@.06->.3,r .3->.31 | 366 | approved | flat top r .37@.12 (363); drums .6/.56
proceduralAnimation.ts:CHARGE_POSE (ease, headDown, toss, pitch, stride, fold, rock, pace) | 10,.42,.08,.1,.42,.4,.05,9 | 363 | approved | -
simulationSystem.ts:MAMMOTH_DUST (every, size); visualEffects.ts:KICK_DUST (count..peak) | .12, 1.3; 5,.35,.25,.5,1.5,.6,.5,1.1,.75 | 363 | approved | one smoke puff at the start

vehicleBuilder.ts:MAMMOTH_BARREL (..hump, humpAt, humpFront, humpBack, belly, haunch, legAt, legSpread) | ..,.34,.22,.22,.75,.14,.26,.44,.32 | 366 | approved | hump .24 at .42 spread .4 (365)
vehicleBuilder.ts:MAMMOTH_TRUNK (pitch, piece, rootR, tipR, flare, hole) | [.75..0.9] x8, .21, .25, .13, .16, .62 | 365 | approved | 8 dark pieces .2, .5->.22 diam
vehicleBuilder.ts:MAMMOTH_TUSK (tan, glow, tip, gap, stripe, proud) | (.8,.6,.36),.14,3,1,.45,1.08 cloth | 366 | approved | bone ivory (1,.82,.58) glow .22, 2-piece tip
propBuilder.ts:SKULL_FACE (eyeY, face, eyeX, rim, muzzle, muzzleY, cheek, jaw, jawY, jawTall); SLAB_LIP | ..,.6,.93,.26; 6 sides,1.0,.2 | 368 | approved | 16-side lip .8 shade
vehicleBuilder.ts:MAMMOTH_EAR (tall, long, thick, z, flare) | .48,.42,.15,.3,1.05 | 367 | approved | edge-on fan
vehicleBuilder.ts:MAMMOTH_HEM (row, c, size, drop, skirt, ring, skirtY) | 9,-.55,[.08,.2,.22],.12,5,.36,-.42 | 367 | rejected (reverted) | -
propBuilder.ts:SALLET_FACETED (sides, heads, taper, deep, drop, slit, slitWide, eye, bevor, bevorFlare) | 8,1.24,.9,1.08,1.0,.13,.84,.15,.34,1.3 | 368 | approved | SALLET ball
renaissanceDress.ts:PAINTER_JABOT (tiers, gap, below, across, grow, lip, flat, ahead, under, glow) | 3,.04,.12,.95,.25,.6,1.3,.12,(.46,.3,.16) .3 .9,.14 | 369 | approved | 368 cut over .3 (reverted)

simulationSystem.ts:HOP_BACK (halberd close, dist, rise, cd) | .75,1.9,2.6,3 | 370 | approved | fencer row removed 370 (was .12,1.5,3.2,1.5)
simulationSystem.ts:FENCER_RECOVER (dist, seconds) | 1.8, .16 | 370 | approved | HOP_BACK fencer leap (369)
simulationSystem.ts:FENCER_DODGE (dist, back, seconds, cooldown) | 2.2,1.0,.22,2.5 | 371 | approved | -
unitFactory.ts:HALBERD_QUILT (upper, lower, swell, tall, glow, cuffLong, cuffFlare) | 5,3,1.6,1.25,.12,.48,1.75 | 370 | approved | 3 rolls 1.22, cuff 1.5
propBuilder.ts:BERET_PUFF (band, bandTall, puff, deep, puffTall, sit, slide, ahead, tilt, dip, glow) | 1.04,.1,1.45,.95,.5,.35,.16,.1,.32,.15,.12 | 370 | approved | disc 2.0/.32 tilt .22
propBuilder.ts:SLAB_WINDOW_BONE (outer, inner, thick, behind, glow) | 1.15,.62,.012,.006,.2 | 370 | approved | -
renaissanceDress.ts:HELD_BALLOON_ARROW (long, shaft, grip, head, ball, squash, glow) | .42,.018,.3,.06,.13,1.15,.25 | 369 | approved | ball .1 glow .12, along forearm
propBuilder.ts:SKULL_BACK (wide, tall, top, thick, behind) | 1.2,.86,.24,.05,.09 | 369 | approved | -
renaissanceDress.ts:ARCHER_FRONT (band, gap, buttons, puff, puffTall, points, point, pointWide) | .08,.09,4,2.5,.55,7,.85,.8 | 371 | approved | stripes; puff 1.6
propBuilder.ts:CAVALIER_FELT (crown, shoulder, tall, lift, spread, shade, glow, wide, pale) | 1.08,.84,.62,1.1,.55,.32,.04,.85,.08 | 371 | approved | CAVALIER flap
