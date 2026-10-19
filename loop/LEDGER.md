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

## Spent (never retry as [P])

## Rows
farmer.* (47 knob rows, 339-350; batch done) | compacted 351 | 350 | approved | values: git show b3524d7:loop/LEDG..
medieval.* (43 knob rows incl. stats, 351-365; batch done) | compacted 366 | 365 | approved | values: git show f142d6e:loop/LEDG..
proceduralAnimation.ts:OFF_AXE (out, ahead, face) | .18, .22, [.75,.65] | 361 | approved | critic: stone over the chest in windup
tribalDress.ts:DREAD_MOP (..splay, kink, long, thick, clubber, clubberSplay, clubberColor) | ..,.42,.35,.95,.3,.8,.62,(.34,.2,.12) | 362 | approved | clubber colour .4,.25,.15, splay .42 (361)
propBuilder.ts:CLUB (long, grip, sides, knob, wood, profile peak) | .74, .17, 8, .1, (.4,.25,.16), .124 | 361 | approved | CLUB_LONG .6 tube (before 361)
propBuilder.ts:SLAB_FACETS (deep, rows, front, bevel, seam); SLAB_MOSS (top, hole, bottom) | .06,3,1.0,.7,.006; .17,.12,.1 | 362 | approved | planks (before 362); moss .13,.08
tribalDress.ts:RAGGED_LOIN (strips, wide, long, short, skull, snout, hang, boneAt, hide) | 6,.95,.75,.7,.5,1.3,.55,.42,(.62,.43,.27) | 362 | approved | 5,.62,.62,..,.6 (362 first cut)
propBuilder.ts:JAVELIN_LEAF (shoulder, flank, flankWide, ridge, jitter, glow); HEAD long/wide | .28,.62,.55,.13,.08,.14; .16/.15 | 362 | approved | ball leaf .15/.095 (320)
tribalDress.ts:HIDE_DRESS (sides,top,low,strapAt,strapWide,strapRise,skirt,flare,rag,color) | 8,1.0,.56,.55,.13,.45,.62,1.4,.16,(.52,.3,.22) | 363 | approved | strap box .22 (362)
propBuilder.ts:DEER_RACK (beam, bend, back, thick, taper, tine, inward, brow, tan, glow, staff) | ..,[1.3,.95,.6,.25],.12,.24,.82,..,(.72,.6,.45),.15,1.4 | 363 | approved | [P] tan .62,.46,.3 glow .22 rejected 363 (reversal)
propBuilder.ts:DEER_RACK (staffBend, staffBack) | [1.52,1.35,1.0,.55], .35 | 364 | approved | staff used bend/back
propBuilder.ts:MASK_LEAF (long, wide, x, ahead, top, lean, color, glow, tan, tanGlow) | .52,.3,.46,.62,.32,.25,(.8,.38,.12),.25,(.76,.56,.34),.22 | 364 | approved | look: .42,.17,.36,.5
tribalDress.ts:CHIEF_LOIN (tongues, out, long, back, hide, tusk, thick, tuskAt, curl, tan, glow) | 9,1.1,.62,.45,(.58,.4,.22),.72,.24,1.35,1.7,(.8,.66,.46),.22 | 364 | approved | hide .66,.5,.32 (look)
proceduralAnimation.ts:MAIN_AXE (ease) | 8 | 364 | approved | -
visualEffects.ts:TRAMPLE_RING (sprites..peak, band, bandPeak, clods, toss, fling, clod) | 12,.25,1,.7,1.8,.4,1.2,.85,.22,.5,8,4.2,2.2,.16 | 364 | approved | -
propBuilder.ts:STONE_AXE (long, grip, thick, head, out, over, cord_, tilt) | .58,.2,.06,.31,.22,.25,.022,.55 | 362 | approved | AXE_LONG .4, GRIP .25, HEAD .78 of L
propBuilder.ts:DEER_MASK (top, tip, flat, rise, drop, tilt, out, spread, socket) | .95,.36,.32,.1,.08,.2,.26,1.55,1.4 | 361 | approved | -
proceduralAnimation.ts:SLAB_FRONT (reach, grip, bash) | .2, .08, .22 | 361 | approved | -
propBuilder.ts:BEAST_SKULL (sink, beakDip, gape, eye, eyeTurn, eyeUp, eyeOut, eyeTilt) | .08,.04,.18,.32,.28,.42,.48,.35 | 365 | approved | lift .08 pitch .12 dip .12 gape .35 turn .55 (363)
propBuilder.ts:SKULL_FACETED (heads, tall, under, sink, socket, socketUp, snout, snoutTilt, tan, glow) | 1.12,1.15,.45,.1,.3,.42,.5,.5,(.68,.52,.34),.2 | 363 | approved | 1.45,1.6,.7,-,.3,-,.55 white .18
tribalDress.ts:TUSK_BAND (band, strap, rootOut, rootAhead, drop, bow, hook, thick, turns, tan, glow) | .45,.1,1.06,.2,.78,.16,.55,.34,2,(.78,.66,.48),.22 | 363 | approved | rise .65 bow .22 thick .4 (322)
propBuilder.ts:STAFF_SKULL (crown, chin, eye, eyeAhead) | .85, .9, .24, .66 | 363 | approved | sphere W across, muzzle cone
vehicleBuilder.ts:MAMMOTH_LEG (sides, jitter, proud, thigh, shin) | 9,.035 (thigh only),1.012,dome .14@.46->.37@.06->.3,r .3->.31 | 366 | approved | flat top r .37@.12 (363); drums .6/.56
proceduralAnimation.ts:CHARGE_POSE (ease, headDown, toss, pitch, stride, fold, rock, pace) | 10,.42,.08,.1,.42,.4,.05,9 | 363 | approved | -
simulationSystem.ts:MAMMOTH_DUST (every, size); visualEffects.ts:KICK_DUST (count..peak) | .12, 1.3; 5,.35,.25,.5,1.5,.6,.5,1.1,.75 | 363 | approved | one smoke puff at the start

vehicleBuilder.ts:MAMMOTH_BARREL (..hump, humpAt, humpFront, humpBack, belly, haunch, legAt, legSpread) | ..,.34,.22,.22,.75,.14,.26,.44,.32 | 366 | approved | hump .24 at .42 spread .4 (365)
vehicleBuilder.ts:MAMMOTH_TRUNK (pitch, piece, rootR, tipR, flare, hole) | [.75..0.9] x8, .21, .25, .13, .16, .62 | 365 | approved | 8 dark pieces .2, .5->.22 diam
unitVisuals.ts:tribal.clubber (scale, bulk, headSize, legLength, armLength, pose) | .95,.8,1.0,1.08,1.1, default | 365 | approved | .9,.9,1.1,-,-, brute
tribalDress.ts:HIDE_SKIRT (bandDrop, panelOut, panelFlare, sides) | .16, 1.45, 1.12, 7 | 365 | approved | trunk sleeve flare 1.4 (362)
vehicleBuilder.ts:MAMMOTH_TUSK (tan, glow, tip, gap, stripe, proud) | (.8,.6,.36),.14,3,1,.45,1.08 cloth | 366 | approved | bone ivory (1,.82,.58) glow .22, 2-piece tip
tribalDress.ts:PAULDRON (wide, deep, long, top, out, snout, eye, look, tan, glow) | 1.0,.62,1.08,.16,.42,.45,.42,.45,(.68,.52,.34),.2 | 366 | approved | boneSkull 1.9 arm widths, long .95
tribalDress.ts:CURLY_MOP (cap, locks, face, out, curl, long, thick, crown) | (1.4,.72,1.36),22,.72,1.05,.75,.78,.27,9 | 366 | approved | DREAD_MOP.clubber/.clubberSplay now unused
tribalDress.ts:HIDE_EDGE (color, wide, thick, lift, rimPoints) | (.34,.19,.12),.2,.05,.12,24 | 366 | approved | HIDE_DRESS.strapWide .13 ribbons (363)
propBuilder.ts:DEER_RACK worn (wornBend, wornLong, wornBack, wornBare, wornLean, wornTan, wornGlow) | [1.62,1.52,1.12,.6],1.4,.05,1,.3,(.56,.37,.2) cloth,.14 | 366 | approved | shared bend [1.3,.95,.6,.25] (363)