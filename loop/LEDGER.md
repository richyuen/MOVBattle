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

371 | hose: garter + bow, tan sock tops, orange shoes (e7a49eb) | renaissance.musketeer.a | approved
371 | solid doublet, tan placket + buttons, slashed shoulder puffs (58d2ee9) | renaissance.balloon_archer.a | approved
371 | cavalier hat as one felt lathe, left brim swept up (47ab317 +4b357d0) | renaissance.fencer.a | approved
371 | feather clump: packed rings of fat icos, helm + poll (ae2a04b) | renaissance.jouster.a | approved
371 | Fencer Dodge: sidestep slide as a swing goes up, blow on air (c88c308) | renaissance.fencer.c | approved
372 | sleeve slashes laid flat: tan panes on the puff skin, tips down (25a752d) | renaissance.balloon_archer.a | approved
372 | cavalier hat re-seated, cocked, rounded crown, team feather clump (a8b654e) | renaissance.fencer.a | approved
372 | chunky tusks: full girth, blunt point, root knob over the band (e59b231) | tribal.spear_thrower.a | approved
372 | jabot as a front bib: 3 half-round flared panels, last to a point (0a0238a) | renaissance.painter.a | approved
372 | tapering legs, separate flared foot lathe (721d839) | tribal.mammoth.a | approved
372 | sallet bevor as a chin cup (512e743, reverted) | renaissance.halberd.a | dropped
373 | flat-topped wide-brim hat, cherry-pick of 401d70e (23dc915) | renaissance.balloon_archer.a | approved
373 | rolled wings + tan band, belt, flared skirt of tabs (909da65 +a7d213f +8669b5c) | renaissance.fencer.a | approved
373 | own loincloth: rope coils, narrow flap, skull + crossed bones, no kilt (cd8403d +bdad788 +483efeb) | tribal.spear_thrower.a | approved
373 | beret as lumpy lathe tam, dark team (6b5ac3c) | renaissance.painter.a | approved
373 | halberd at rest upright, fists belly + collar (a10c9e5) | renaissance.halberd.a | approved
373 | solid bone face plate in the window, own eyes + nose (41cba1a) | tribal.protector.a | approved
373 | Painter Dodge: sidestep off a missile, it lands on air (89dc959) | renaissance.painter.c | approved
374 | low leather shoes, turned cuff, dark stocking (b46132a) | renaissance.halberd.a | approved
374 | upright stance for a javelin man, lankier body (9fcac3a) | tribal.spear_thrower.a | approved
374 | sweater ends at hip in a ribbed band, legs 1.2x (0ee7192) | renaissance.painter.a | approved
374 | tabs bent near-straight, thigh rolls dropped (0118f84) | renaissance.fencer.a | approved
374 | hull lower half squared as a skirt; hull winding flipped outward (79f4083 +6910ac7) | tribal.mammoth.a | approved
375 | breeches: 3 quilted team puffs hip to knee, tan slashes (a74b9af) | renaissance.halberd.a | approved
375 | hay planks fanning above the shoulders, skirt of flat tongues (d822dce) | farmer.hay_baler.a | approved
375 | sweep carried through a step in the press (setState _afterSweep) (3a94e9e) | farmer.harvester.c | approved
375 | chunky faceted flask: bulb, shoulder, neck, lip, cork (5af9646) | farmer.potion_seller.b | approved
375 | mop of hanging locks in two tiers to jaw and nape (d04eef6) | farmer.halfling.a | approved
375 | crow wings: 3 layered feather rows, team wedge on the leading edge (730ae01) | farmer.scarecrow.a | approved
375 | round belly between the legs, skirt dropped, fur collar per leg (4ee59f9) | tribal.mammoth.a | approved
376 | square upright stance in a sallet, legs 1.18 (d66db47) | renaissance.halberd.a | approved
376 | two braids hung from the torso down the chest, team bands (ca0eef1) | farmer.harvester.a | approved
376 | perched crow as its own upright wingless bird (a5e59c1) | farmer.scarecrow.a | approved
376 | open coat: back/side walls, hinged fronts, lapels, vest, V, belt (e8d2448) | farmer.halfling.a | approved
376 | fitted 8-sided jerkin as the trunk, skirt band, lean build (bfd2385) | farmer.potion_seller.a | approved
376 | tall hood: one lathe shoulders to cone, oval face window (5162e03) | farmer.farmer.a | approved
376 | riders on the tray: Farmer on the lip legs forward, Thrower astride (78a73b0) | farmer.wheelbarrow.a | approved
377 | sallet visor: team eye-slot under iron brow + breath-slot (8f7c74f) | renaissance.halberd.a | approved
377 | sack as a rounded lumpy lathe hood, seam, tan collar (5e14f8f) | farmer.scarecrow.a | approved
377 | brown felt hat: creased pinched crown, closed drooping brim (84980cf) | farmer.harvester.a | approved
377 | flask by the neck in a holder; both arms hang at the hips (eeb43aa) | farmer.potion_seller.b | approved
377 | round head, umber cap on its curve (ccd37ad) | farmer.potion_seller.a | approved
377 | liripipe: thick blunt tail bent over and down (9f5019c) | farmer.farmer.a | approved
377 | narrow tray .2, flat hay bed, Thrower on the rim, knees rolled (aa835d7 +4f65905) | farmer.wheelbarrow.a | approved
378 | topline: hull slope .45 to a lower, smaller rump, hump forward (ad41648 +d33b7c6) | tribal.mammoth.a | approved
378 | mane as one near-black crest of 6 chunks, brow to nape (97b036e) | tribal.mammoth.a | approved
378 | flask neck seated on the hand's mitt, in the fist through the windup (c1e205c) | farmer.potion_seller.b | approved
378 | short tray .5, riders bunched, Farmer reclined into the Thrower (9ea4314) | farmer.wheelbarrow.a | approved
378 | brown fur body, team belt + pauldron, sash + buckle (87155bc +8ac5a35) | ancient.minotaur.a | approved
378 | Minotaur Charge: head-down run, butts the man aside (241b811) | ancient.minotaur.c | approved
378 | curved scutum upright before him via the slab hold, no sword (2940691) | ancient.shield_bearer.b | approved
379 | bare fists out at the flanks, grab then punch, no hammer (4f9553c +c54ed63 +f07a183 +88e0d0a) | ancient.minotaur.b | approved
379 | aspis on the trunk upright, notch, rim, swirls (66de83f) | ancient.hoplite.b | approved
379 | pike levelled in both fists at the hip, no disc (0311c85) | ancient.sarissa.b | approved
379 | scutum .5 chin to shin, leafy laurels, trim lit .06 (de5279a +3fd5e08, reverted) | ancient.shield_bearer.b | rejected
379 | blond bolt beard + locks, temple leaves (f708157) | ancient.zeus.a | approved
379 | head a great dome on a skull node, eyes up (28bde95) | tribal.mammoth.a | approved
379 | flasks hung bulb-down by _hangFlasks, bulb .085, glass re-tinted (3535a13, reverted) | farmer.potion_seller.b | rejected
380 | flasks hung bulb-down by the neck, bulb .085, re-land of 3535a13 minus glass (e6efab4) | farmer.potion_seller.b | approved
380 | scutum chin to shin: hold reads holeUp (unitFactory wiped it), laurels, trim (f87fef0) | ancient.shield_bearer.b | approved
380 | dory carried low at the weapon hip outside the aspis, point down (41000a8 +dcff49a) | ancient.hoplite.b | approved
380 | crest laid on the dome's skin brow to nape, no cap (61181b3) | tribal.mammoth.a | approved
380 | low rim (one board), seats on the tray middle, Thrower splayed (fe764b2 +f78cb48) | farmer.wheelbarrow.a | approved
380 | jacket shell + yoke from the shoulders, sleeves to the wrist, hem .1 (b0e0351 +b52f817) | farmer.halfling.a | approved
380 | backs up to keep pike distance inside .85 of reach, logged backstep (9789cbd) | ancient.sarissa.c | approved

## Spent (never retry as [P])

## Rows
tribal.spear_thrower (JAVELIN_LEAF, TUSK_BAND, SPEAR_LOIN hide (.5,.38,.26) glow .08 rope (.58,.24,.13), JAVELIN_UPRIGHT; unit done) | compacted 374 | 374 | approved | values: git show e35255b:loop/LEDGER.md + 374 gap commits
renaissance.* (painter, fencer, jouster, musketeer, balloon_archer, halberd rows; units done) | compacted 378 | 377 | approved | values: git show edb1692:loop/LEDGER.md
medieval.* (43 knob rows incl. stats, 351-365; batch done) | compacted 366 | 365 | approved | values: git show f142d6e:loop/LEDG..
tribal.chieftain (OFF_AXE, MAIN_AXE, CHIEF_LOIN, STONE_AXE, BEAST_SKULL, PAULDRON, CHIEF_BEARD; unit done) | compacted 369 | 367 | approved | values: git show 706894b:loop/LEDGER.md
tribal.clubber (DREAD_MOP, CLUB, RAGGED_LOIN, visuals, CURLY_MOP, RAGGED_STRIPS; unit done) | compacted 369 | 367 | approved | values: git show 706894b:loop/LEDGER.md
tribal.stoner (HIDE_DRESS, HIDE_SKIRT, HIDE_EDGE, SKIRT_TONGUES; unit done) | compacted 369 | 368 | approved | values: git show 706894b:loop/LEDGER.md
tribal.bone_mage (DEER_RACK, worn, staff, MASK_LEAF, STAFF_SKULL, DEER_MASK; unit done) | compacted 368 | 366 | approved | values: git show 96d1c20:loop/LEDGER.md
tribal.protector (SLAB_FACETS, SKULL_FACE, SLAB_LIP, SLAB_WINDOW_BONE, SKULL_BACK, SLAB_WINDOW_FACE, SLAB_FRONT, SKULL_FACETED; unit done) | compacted 376 | 373 | approved | values: git show b0e9788:loop/LEDGER.md
farmer.hay_baler (HAY_BALE, HAY_PLANK; unit done) | compacted 376 | 375 | approved | values: git show b0e9788:loop/LEDGER.md
tribal.mammoth c (TRAMPLE_RING, CHARGE_POSE, MAMMOTH_DUST, KICK_DUST; c PASS 364) | compacted 376 | 364 | approved | values: git show b0e9788:loop/LEDGER.md
vehicleBuilder.ts:MAMMOTH_LEG (thigh, shin, foot) | r .31->.245, .245->.205, foot lathe .205->.255 | 372 | approved | thigh .37->.3, shin .28-.31 (366); radius-only change now = reversal
vehicleBuilder.ts:MAMMOTH_BARREL (hump, humpAt, humpFront, humpBack, slope, slopeWide; round, winding out) | .2,.5,.25,.8,.45,.15 | 378 | approved | .34,.22,.22,.75,-,- (375)
tribal.mammoth a (MAMMOTH_TRUNK, MAMMOTH_TUSK, MAMMOTH_EAR; MAMMOTH_HEM rejected 367) | compacted 379 | 367 | approved | values: git show d9e7ad6:loop/LEDGER.md
vehicleBuilder.ts:MAMMOTH_LEG collar ([r,y] foot..top, collarJitter) | [.28,-.36],[.35,-.3],[.37,-.2],[.33,-.1], .045 | 375 | approved | -
tribalDress.ts:SHAGGY (cap, locks, long, front, fringeArc, thick, splay, locks2, long2, splay2, rootY2) | 1.3,22,.95,.32,.6,.42,.16,14,.5,.5,.85 | 375 | approved | 1.32,26,.5,.5,-,.3,.55 (340)
farmerDress.ts:HALFLING_COAT (fronts, lapel, vest, vee, belt; drop), HALFLING_SLEEVED (arc, flare, yoke, puff, cuff) | drop .1; .72,1.12,.14,1.45,1.2 | 380 | approved | box walls, drop .32
vehicleBuilder.ts:CREW_SEAT (lipUp, front thigh/splay/knee, astrideUp, backThigh, backSplay, backKnee, backRoll), LOW_RIM | .03,-1.15,.62,.45,.04,-1.1,.85,1,-.5; rim .06 seats .06,-.11 | 380 | approved | back -.3,1.3,.2 (377)
vehicleBuilder.ts:WHEELBARROW (trayWide, trayLong), LOG_WHEEL thick, HAY_BED fill | .2,.5, .196, .92 | 378 | approved | backSeat .1 replaced by LOW_RIM 380
farmer.scarecrow (CROW_LAYERS, PERCH_CROW, SACK_HOOD; unit done) | compacted 377 | 377 | approved | values: git show 2903f04:loop/LEDGER.md + 5e14f8f
farmer.harvester (CHEST_BRAID, FELT_HAT; unit done) | compacted 377 | 377 | approved | values: git show 2903f04:loop/LEDGER.md + 84980cf
farmer.farmer (TALL_HOOD rings to .86, LIRIPIPE_TAIL; unit done) | compacted 377 | 377 | approved | values: git show 2903f04:loop/LEDGER.md + 9f5019c

farmer.potion_seller (POTION ball .085 shoulder .032 neck .034 cork .022 glow .12, POTION_GLASS (.64,.75,.72), FLASK_HANG 1,.3) | compacted 380 | 380 | approved | git show edb1692:loop/LEDGER.md
vehicleBuilder.ts:MAMMOTH_CREST (on the skin: head .7,.56, sink .35, 7 chunks phi -.7..1.65), MAMMOTH_MANE_COLOR | (.09,.055,.04) | 380 | approved | 6 balls .62-.92 up (378)
vehicleBuilder.ts:BUNCHED_CREW (recline, nod) | -.5, .3 | 378 | approved | -
ancient.* stats (cost, healthMultiplier, damageMultiplier, cooldownMultiplier, 7 units) | d PASS 7/7 | 378 | stats | values: git show 5715b05
ancientDress.ts:MINO_FUR, MINO_BELT, MINO_PAULDRON, MINO_SASH | (.42,.24,.17) glow .16; belt .16 tall; pauldron .42 wide | 378 | approved | -
simulationSystem.ts:MINOTAUR_CHARGE; proceduralAnimation.ts:BULL_CHARGE | from 1.5 reach 14 speed 2.3 fling 7; lean .6 head .35 | 378 | approved | -
propBuilder.ts:SCUTUM (tall, wide, curve, chin), SCUTUM_TRIM, SCUTUM_LAUREL | .5,.36,.06,.06; (.9,.45,.16) lit .06; leafy sprays | 380 | approved | .74,.42,.08,.05; (.93,.6,.3) .15
proceduralAnimation.ts:BULL_FISTS (carryAhead, carryOut of half shoulder span, carryUp; grab, punch) | .5, 1.1, .3; .35, .62 | 379 | approved | -
propBuilder.ts:ASPIS (radius, notch, notchAt, rim, swirlR, swirlAt, mount x,y,z) | .36,.42,.64,.025,.2,.52; -.04,.12,.24 | 379 | approved | round disc on the hand
proceduralAnimation.ts:PIKE_LEVEL (ahead, out, up, tilt, fistAt, offAhead, draw, stroke) | .7,.35,.2,.05,.3,.6,.3,.9 | 379 | approved | one-handed thrust grip
ancientDress.ts:ZEUS_BEARD, ZEUS_LOCKS, ZEUS_HAIR | 13 strands .15 thick .75 long; 16 locks .2, 1.05; (.62,.48,.3) .16 | 379 | approved | -
vehicleBuilder.ts:MAMMOTH_DOME (lift, grow, eyeUp, eyeOut) | .32, 1.28, .12, .03 | 379 | approved | head on the neck, sphere 1.4

proceduralAnimation.ts:DORY_CARRY (ahead, out, up, fwd, side, down, fistAt) | .25,.9,-.3,.8,.25,.4,.15 | 380 | approved | level thrust grip
simulationSystem.ts:SARISSA_KEEP (near, pace) | .85, .7 | 380 | approved | -
