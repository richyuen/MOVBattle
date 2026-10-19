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
383 | crest bands each one solid strip swept along the bowl's top, wide .42 (376288d) | ancient.hoplite.a | approved
383 | aspis rim on flat unlit trim; three big tapered wave swirls (0c3eee8) | ancient.hoplite.b | approved
383 | gear: angular pauldron on his left, broad tan sash, frame buckle, scrolled belt (9779a54) | ancient.minotaur.a | approved
383 | dark team cape shoulders to calves, folded collar (3fd1971) | ancient.sarissa.a | approved
383 | lorica: 5 hoop bands, layered leather shoulder plates (a4076de, reverted) | ancient.shield_bearer.a | rejected
383 | shorts end in a cuff at .78 of the thigh, foot fur low (d9365dd) | farmer.halfling.a | approved
383 | Zeus bolt: one glowing zig-zag hand to chest, small burst (c0d24d5) | ancient.zeus.c | approved
384 | held bolt leaves the fist at the throw, back .6 of the cooldown on (1eb7af4) | ancient.zeus.c | approved
384 | small zig-zag sparks on a cyan rim in each fist, off hand too (d6d2a01) | ancient.zeus.b | approved
384 | box frame, housings + team coil caps, bound arms, trough, 4 spoked wheels (2fe1946 +0b8f457) | ancient.ballista.a | approved
384 | snake bow: green, white belly panels, snake head at the tip, stood up (cdddba0 +91a781d) | ancient.snake_archer.b | approved
384 | dark brown greaves + rim, team foot in a brown sandal (d611ead) | ancient.hoplite.a | approved
384 | brown belt round the body ring, dagger, bracers (b635f94 +5c01360) | ancient.sarissa.a | approved
384 | lorica re-land: 4 fitted hoops at 1.05 + seams, flat deltoid strips (89b02e6 +8c5060d) | ancient.shield_bearer.a | approved
385 | sandals: strapSandals on bare team feet + 3 shin laces, no boots (9c57271) | ancient.shield_bearer.a | approved
385 | crest: one flat-topped box on a stalk, own hat hoplite_helm (f6b09dd +79ce333) | ancient.hoplite.a | approved
385 | eye slots: temple plates + slanted brow bars over each eye (fd2a912) | ancient.sarissa.a | approved
385 | nocked snake in the draw fist, flies as the same snake (100ea4a) | ancient.snake_archer.b | approved
385 | pauldron one curved shell on the deltoid, flush rim, scroll; spiky tuft (3131dbb +ac045b2) | ancient.minotaur.a | approved
385 | toga: bare trunk, white diagonal drape, gold bolt, triple gold belt (3d11834) | ancient.zeus.a | approved

## Spent (never retry as [P])

## Rows
ancientDress.ts:SARISSA_CAPE (arc, hem, shade, glow) | .56, .72, .45, .06 | 384 | approved | shade .62 glow .12 (383)
unitFactory.ts:HALFLING_SHORTS long, cuff + HALFLING_FEET clumpTall, rise | .78, .14; .7, .45 | 383 | approved | .92; 1.1, .9
tribal.* (7 units' rows: JAVELIN, CHIEF, CLUB, HIDE, DEER, SLAB/SKULL, mammoth body; units done) | compacted 383 | 381 | approved | values: git show 6496b2e:loop/LEDGER.md
renaissance.* (painter, fencer, jouster, musketeer, balloon_archer, halberd rows; units done) | compacted 378 | 377 | approved | values: git show edb1692:loop/LEDGER.md
medieval.* (43 knob rows incl. stats, 351-365; batch done) | compacted 366 | 365 | approved | values: git show f142d6e:loop/LEDG..
farmer.* done (hay_baler, scarecrow, harvester, farmer, potion_seller rows) | compacted 383 | 381 | approved | values: git show 6496b2e:loop/LEDGER.md
farmer.halfling (SHAGGY, no longer his; HALFLING_COAT, _SLEEVED, _BELT up .08 tall .13 buckle .3) | compacted 382 | 381 | approved | values: git show b359959:loop/LEDGER.md
farmer.wheelbarrow (CREW_SEAT, LOW_RIM, THROWER_LEGS seat -.08, WHEELBARROW, LOG_WHEEL, HAY_BED, BUNCHED_CREW) | compacted 382 | 381 | approved | values: git show b359959:loop/LEDGER.md

ancient.* stats (cost, healthMultiplier, damageMultiplier, cooldownMultiplier, 7 units) | d PASS 7/7 | 378 | stats | values: git show 5715b05
ancientDress.ts:MINO_FUR, MINO_BELT, MINO_GEAR (pad, flap, rim, curls, buckle), MINO_SASH .3 | glow .16; pad 1.25x.18, flap .6; buckle .3 | 383 | approved | sash .16, dome pauldron +x
ancient.minotaur b,c (MINOTAUR_CHARGE, BULL_CHARGE, BULL_FISTS) | compacted 382 | 379 | approved | values: git show b359959:loop/LEDGER.md
proceduralAnimation.ts:PIKE_LEVEL (ahead, out, up, tilt, fistAt, offAhead, draw, stroke) | .7,.35,.2,.05,.3,.6,.3,.9 | 379 | approved | one-handed thrust grip
ancientDress.ts:ZEUS_BEARD, ZEUS_LOCKS, ZEUS_HAIR | 13 strands .15 thick .75 long; 16 locks .2, 1.05; (.62,.48,.3) .16 | 379 | approved | -
propBuilder.ts:CORINTH_HELM (wide, deep, brow, rise, arc, jaw, underEye, slit) | .62,.68,.26,.24,.76,1,.62,.1 | 381 | approved | dome + cheek boxes + crest on a stalk (244)
propBuilder.ts:CORINTH_CREST (bands, band, wide, fill, sink, lean, shorten, segs) | 4,.19,.42,.95,.6,.06,.16,12 swept strips | 383 | approved | wide .32; blocks (382)
propBuilder.ts:BULL_HEAD (skull, skullTall, face, tilt, snout, horn1, hornGirth, ear, neck, neckBottom) | .62,.5,1,.5,1,.9,.3,.36,.9,1.5 | 382 | approved | BULL_SHELL 1.15 etc. (243)
farmerDress.ts:HALFLING_MOP (locks, hang, droop, spread, wild, top, side, root, flat) | 46,1.6,.55,.8,.35,.24,.57,.63,.38 | 383 | approved | .35,.4,.95,.42 (382)
ancientDress.ts:SNAKE_HOOD (cap, capFoot, wrapTop, wrapFoot, collar, collarOut, point, shade) | 1.14,.3,-.16,-1.12,.42,1.08,.5,.82 | 382 | approved | pharaoh hat

simulationSystem.ts:SARISSA_KEEP (near, pace) | .85, .7 | 380 | approved | -
simulationSystem.ts:ZEUS_REARM | .6 of the cooldown | 384 | approved | - (bolt stayed in the fist)
propBuilder.ts:BOLT_SPARK (branches, long, short, kinks, zig, core, rim) | 200/150/250/20, .14, .09, 3, .55, .022, 1.7 | 384 | approved | 5-joint shard bolt .68 s tall
vehicleBuilder.ts:BALLISTA_FRAME/HOUSING/ARMS/STOCK/WHEEL, BALLISTA_WOOD | wide 1.5 top 1.02; wood (.62,.3,.2) glow .14 | 384 | approved | team slab deck .8x1.2
propBuilder.ts:SNAKE_BOW (long, thick, bow, panel, head, hold) | .95, .06, .07, .8, .075, 1.1 | 384 | approved | plain short bow
ancientDress.ts:SARISSA_KIT (tall, proud, band, hipOut, ahead, sheath, out) | .2, 1.1, .35, .92, .55, .42, 1.6 | 384 | approved | out 1.32, belt in trunkBand (hidden)
ancient.shield_bearer + hoplite done (SCUTUM*, LEGION_HELM, LORICA, ASPIS*, DORY_*, HOPLITE_LEGS) | compacted 385 | 384 | approved | values: git show 522cb46:loop/LEDGER.md
ancientDress.ts:SB_SANDAL (laces, lace, out) + propBuilder.ts:HOPLITE_CREST (stalk, tall, wide, deep) | .7/.82/.93,.045,1.12; .12,.9,.3,1 | 385 | approved | -
propBuilder.ts:CORINTH_SLOTS (edge, back, browLong, browTall, browDrop, browTilt) | .35,.01,1.05,.08,.02,.32 | 385 | approved | open band
ancientDress.ts:SNAKE (bands, head, neck, held, nock) + projectileSystem FLYING_SNAKE_LONG | 8,.22,.72,.48,.42; 1.1 m | 385 | approved | plain arrow
ancientDress.ts:MINO_SHELL (radius, deep, low, over, thick, inX, atY, scroll) | .78,1.35,.55,.25,.1,.82,.86,.2 | 385 | approved | MINO_GEAR slab+flap
ancientDress.ts:ZEUS_TOGA (proud, high, low, wide, top, rings, ring, beltAt) | 1.07,.9,.12,.5,1.04,3,.045,.05 | 385 | approved | grey vest + brown sash
