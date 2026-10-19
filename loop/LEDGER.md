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
381 | tail rooted on the rump's back face, 4 tapering pieces, near-black tuft (dff7370) | tribal.mammoth.a | approved
381 | teal liquid cap in the bulb under a level surface (acfb585 +7af06ac) | farmer.potion_seller.b | approved
381 | Thrower's thighs solved to knee targets outside the Farmer's hips (fd3d2e2) | farmer.wheelbarrow.a | approved
381 | dark team belt, grey square-frame cloth buckle + pin (8cb455f) | farmer.halfling.a | approved
381 | scutum trim on a flat unlit material out of the glow layer (0550f5d +a2d3543) | ancient.shield_bearer.b | approved
381 | dory thrust: level line, drawn at the blow, driven out by .22 (52a1b5c +512e06f) | ancient.hoplite.c | approved
381 | Corinthian helm enclosing the head, 9-slab crest on the bowl (bf11d67) | ancient.sarissa.a | approved
382 | crest as 4 stacked bands of short blocks along the bowl (bc537dc +5dcf082 +f61cdaa) | ancient.sarissa.a | approved
382 | dory carry aimed at a ground point ahead and out (e3ebcbd) | ancient.hoplite.b | approved
382 | legionary helm: iron bowl, orange band, neck guard, edged cheek guards (c7d3111) | ancient.shield_bearer.a | approved
382 | bushy mop of 46 flat splayed locks on a cap (1a97f99 +fd22501) | farmer.halfling.a | approved
382 | bull head: cranium, long face, muzzle, curved horns, ears, neck (4c7d9fb) | ancient.minotaur.a | approved
382 | team hood: cap + peak, face wrap, collar + point, cord (7a7a3fb) | ancient.snake_archer.a | approved
382 | hay mound on the rear quarter, Thrower on it .2 higher (ed5a3b5, reverted) | farmer.wheelbarrow.a | rejected

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
tribal.mammoth (LEG, collar, BARREL, CREST, DOME, TAIL; trunk, tusk, ear, c knobs; unit done) | compacted 381 | 381 | approved | values: git show 0d6efb0:loop/LEDGER.md + dff7370
farmer.halfling (SHAGGY, no longer his; HALFLING_COAT, _SLEEVED, _BELT up .08 tall .13 buckle .3) | compacted 382 | 381 | approved | values: git show b359959:loop/LEDGER.md
farmer.wheelbarrow (CREW_SEAT, LOW_RIM, THROWER_LEGS seat -.08, WHEELBARROW, LOG_WHEEL, HAY_BED, BUNCHED_CREW) | compacted 382 | 381 | approved | values: git show b359959:loop/LEDGER.md
farmer.scarecrow (CROW_LAYERS, PERCH_CROW, SACK_HOOD; unit done) | compacted 377 | 377 | approved | values: git show 2903f04:loop/LEDGER.md + 5e14f8f
farmer.harvester (CHEST_BRAID, FELT_HAT; unit done) | compacted 377 | 377 | approved | values: git show 2903f04:loop/LEDGER.md + 84980cf
farmer.farmer (TALL_HOOD rings to .86, LIRIPIPE_TAIL; unit done) | compacted 377 | 377 | approved | values: git show 2903f04:loop/LEDGER.md + 9f5019c

farmer.potion_seller (POTION, POTION_GLASS, FLASK_HANG, POTION_LIQUID over 1.04 fill .5 (.2,.48,.56) glow .12; unit done) | compacted 381 | 381 | approved | git show edb1692:loop/LEDGER.md + 7af06ac
ancient.* stats (cost, healthMultiplier, damageMultiplier, cooldownMultiplier, 7 units) | d PASS 7/7 | 378 | stats | values: git show 5715b05
ancientDress.ts:MINO_FUR, MINO_BELT, MINO_PAULDRON, MINO_SASH | (.42,.24,.17) glow .16; belt .16 tall; pauldron .42 wide | 378 | approved | -
ancient.minotaur b,c (MINOTAUR_CHARGE, BULL_CHARGE, BULL_FISTS) | compacted 382 | 379 | approved | values: git show b359959:loop/LEDGER.md
propBuilder.ts:SCUTUM (tall, wide, curve, chin), SCUTUM_TRIM, SCUTUM_TRIM_FLAT (unlit emissive), SCUTUM_LAUREL | .5,.36,.06,.06; (.9,.45,.16); (1.5,.35,0) | 381 | approved | trim lit cloth .06 (380)
propBuilder.ts:ASPIS (radius, notch, notchAt, rim, swirlR, swirlAt, mount x,y,z) | .36,.42,.64,.025,.2,.52; -.04,.12,.24 | 379 | approved | round disc on the hand
proceduralAnimation.ts:PIKE_LEVEL (ahead, out, up, tilt, fistAt, offAhead, draw, stroke) | .7,.35,.2,.05,.3,.6,.3,.9 | 379 | approved | one-handed thrust grip
ancientDress.ts:ZEUS_BEARD, ZEUS_LOCKS, ZEUS_HAIR | 13 strands .15 thick .75 long; 16 locks .2, 1.05; (.62,.48,.3) .16 | 379 | approved | -
propBuilder.ts:CORINTH_HELM (wide, deep, brow, rise, arc, jaw, underEye, slit) | .62,.68,.26,.24,.76,1,.62,.1 | 381 | approved | dome + cheek boxes + crest on a stalk (244)
propBuilder.ts:CORINTH_CREST (bands, band, wide, fill, sink, lean, shorten, segs) | 4,.19,.32,.95,.6,.06,.16,12 | 382 | approved | band .13/.16, wide .14/.28; 9 slabs (381)
propBuilder.ts:LEGION_HELM (wide, deep, rise, neckArc, neckDrop, neckFlare, cheekWide, cheekTall, cheekTurn) | .6,.64,.12,.42,.16,1.3,.3,.46,.45 | 382 | approved | grey "helmet" dome
propBuilder.ts:BULL_HEAD (skull, skullTall, face, tilt, snout, horn1, hornGirth, ear, neck, neckBottom) | .62,.5,1,.5,1,.9,.3,.36,.9,1.5 | 382 | approved | BULL_SHELL 1.15 etc. (243)
farmerDress.ts:HALFLING_MOP (locks, hang, droop, spread, wild, top, side, root, flat) | 46,1.6,.35,.8,.35,.4,.95,.42,.38 | 382 | approved | hang 1.25, no spread/droop (382.4)
ancientDress.ts:SNAKE_HOOD (cap, capFoot, wrapTop, wrapFoot, collar, collarOut, point, shade) | 1.14,.3,-.16,-1.12,.42,1.08,.5,.82 | 382 | approved | pharaoh hat
proceduralAnimation.ts:DORY_AIM (ahead, out, above) | 1.8,1.9,.1 | 382 | approved | DORY_CARRY fwd/side/down .8,.25,.4

proceduralAnimation.ts:DORY_CARRY (ahead, out, up, fwd, side, down, fistAt) | .25,.9,-.3,.8,.25,.4,.15 | 380 | approved | level thrust grip
proceduralAnimation.ts:DORY_THRUST (ahead, out, up, tilt, reach, draw, driven, held, home, blendOut) | .35,.6,-.05,-.06,.75,.45,.22,.5,.85,.15 | 381 | approved | -
simulationSystem.ts:SARISSA_KEEP (near, pace) | .85, .7 | 380 | approved | -
