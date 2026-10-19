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
386 | bare team legs, strapSandals + 2 ankle laces (fd8eb0f) | ancient.zeus.a | approved
386 | lightning chain: 3 hops within 2.2 m, arcs + burst stay .6 s (ff36ed0) | ancient.zeus.c | approved
386 | eyes apart x1.45, .85 size, proud nose guard brow to plates (041521a) | ancient.sarissa.a | approved
386 | girdle .24 tall, foot rim, outlined ram's-horn scrolls; no tunic skirt (20a8ed6 +ab2eb1a) | ancient.minotaur.a | approved
386 | baldric, belt + gold buckle, knee boots over strap sandals (915b7e7) | ancient.snake_archer.a | approved
386 | belt a dark ring under the coat .17 tall, dark-grey buckle right, keeper (08cf903) | farmer.halfling.a | approved
387 | live snake on landing: slithers in an S, lunges, 2 bites / 30 s (c513c8f) | ancient.snake_archer.c | approved
387 | Big Headbutt: stop, head down, 4.5 m burst flings men, 5 s cd (72be3fb +720dffe) | ancient.minotaur.c | approved
387 | beard: jaw + bib masses under 6x7 flat zig-zag slabs (de591d4) | ancient.zeus.a | approved
387 | crewman crouched beside the trough, arms up, iron helmet (3b71139, reverted) | ancient.ballista.a | rejected
387 | collar fold: shoulder bulk, two chest drape folds, gold brooch (35cf884) | ancient.sarissa.a | approved
387 | stance: square on straight wide legs, arms hung (fb699af) | farmer.halfling.a | approved
387 | Thrower perched on the rear quarter on a hay tuft, knees outside the boards (51b7c67) | farmer.wheelbarrow.a | approved
388 | ground snake: own 2 m thin banded build in a travelling S, head on a neck (3afbc34) | ancient.snake_archer.c | approved
388 | toga fill to the belt, bigger unlit bolt, no cape, unlit white, no solar fx (cdf9011 +4 follow-ups) | ancient.zeus.a | approved
388 | sash foot raised to the right flank + side wrap, off the girdle (8b1943a, reverted 55b56d1) | ancient.minotaur.a | rejected
388 | Thrower's knee targets off the Farmer's trunk, .55 hip to shoulder, outside it (450e263) | farmer.wheelbarrow.a | approved
388 | crewman standing behind the trough's end, arms aimed at the winch handles, iron helmet (44de2f1) | ancient.ballista.a | approved
388 | vest cut in a deep V: lower block + two shoulder panels, team x .97 (ad8de9a +e1a75a4 +c549a26) | farmer.halfling.a | approved
388 | quiver high on the back, mouth over the left shoulder, arrows; no hip quiver (2f31243) | ancient.snake_archer.a | approved
389 | toga drape one-sided facing out (SSAO read the inward double faces), body torus belt hidden (fdab7e5) | ancient.zeus.a | approved
389 | girdle rebuilt round the pelvis on the hip joint, navel to crotch, flared, scrolls on its face (f835112) | ancient.minotaur.a | approved
389 | chest drape one bent chunk (flat closed tube) from the shoulder bulk across the chest (9c2d24b) | ancient.sarissa.a | approved
389 | hood one rounded superellipsoid shell, blunt nub, wrap narrowing to the chin (d561c70 +0390b63) | ancient.snake_archer.a | approved
389 | foot fur a compact dark tuft of lumps + short shards inside the foot, farmerDress (cd0bed8 +b505810) | farmer.halfling.a | approved
389 | timber terracotta in linear space, plates two rows of four on the plank edges (532010f) | ancient.ballista.a | approved
389 | loaded bolt: thick tapered shaft, socket, long flat black leaf head .75 past the front (246a014) | ancient.ballista.b | approved

## Spent (never retry as [P])

## Rows
ancientDress.ts:SARISSA_CAPE (arc, hem, shade, glow) | .56, .72, .45, .06 | 384 | approved | shade .62 glow .12 (383)
unitFactory.ts:HALFLING_SHORTS long, cuff + HALFLING_FEET clumpTall, rise | .78, .14; .7, .45 | 383 | approved | .92; 1.1, .9
tribal.* (7 units' rows: JAVELIN, CHIEF, CLUB, HIDE, DEER, SLAB/SKULL, mammoth body; units done) | compacted 383 | 381 | approved | values: git show 6496b2e:loop/LEDGER.md
renaissance.* (painter, fencer, jouster, musketeer, balloon_archer, halberd rows; units done) | compacted 378 | 377 | approved | values: git show edb1692:loop/LEDGER.md
medieval.* (43 knob rows incl. stats, 351-365; batch done) | compacted 366 | 365 | approved | values: git show f142d6e:loop/LEDG..
farmer.* done (hay_baler, scarecrow, harvester, farmer, potion_seller rows) | compacted 383 | 381 | approved | values: git show 6496b2e:loop/LEDGER.md
farmer.halfling (SHAGGY, no longer his; HALFLING_COAT, _SLEEVED) | compacted 382 | 381 | approved | values: git show b359959:loop/LEDGER.md
farmer.wheelbarrow (CREW_SEAT, LOW_RIM, THROWER_LEGS seat -.08, WHEELBARROW, LOG_WHEEL, HAY_BED, BUNCHED_CREW) | compacted 382 | 381 | approved | values: git show b359959:loop/LEDGER.md

ancient.* stats (cost, healthMultiplier, damageMultiplier, cooldownMultiplier, 7 units) | d PASS 7/7 | 378 | stats | values: git show 5715b05
ancient.* 379-386 rows (MINO_*, BULL_*, PIKE_LEVEL, CORINTH_*, SNAKE_*, SARISSA_KEEP/KIT, ZEUS_REARM/TOGA/SANDAL/CHAIN, BOLT_SPARK, BALLISTA_*, SB_SANDAL, HOPLITE_CREST, MINO_SHELL/SCROLL) | compacted 387 | 386 | approved | values: git show fad9e5c:loop/LEDGER.md
ancient.shield_bearer + hoplite done (SCUTUM*, LEGION_HELM, LORICA, ASPIS*, DORY_*, HOPLITE_LEGS) | compacted 385 | 384 | approved | values: git show 522cb46:loop/LEDGER.md
ancient.* 387-388 rows (ZEUS_BEARD/LOCKS/HAIR, SNAKE_LIVE, BIG_HEADBUTT, SARISSA_FOLD, BALLISTA_CREW/HELM, GROUND_SNAKE, SNAKE_QUIVER, MINO_SASH_FOOT rej) | compacted 389 | 388 | approved | values: git show f31835b:loop/LEDGER.md
proceduralAnimation.ts:HALFLING_STANCE (tilt, stride, lean, spread, knee) | .02, .05, .03, .22, .04 | 387 | approved | hashed idle stance (sunk)
farmerDress.ts:HALFLING_MOP (locks, hang, droop, spread, wild, top, side, root, flat) | 46,1.6,.55,.8,.35,.24,.57,.63,.38 | 383 | approved | .35,.4,.95,.42 (382)
farmerDress.ts:HALFLING_BELT (tall, up, buckle, bar, buckleDeep, ringOut, side) | .17,.16,.34,.14,.12,1.08,.07 | 387 | approved | bar .24 (386); box .13 at .08 (381)
vehicleBuilder.ts:THROWER_PERCH (seat, up, tuftDeep, lumps, wide, kneeUp) | -.15, .09, .13, .18, .09, .05 | 387 | approved | THROWER_LEGS seat -.08 (retired 388)

ancientDress.ts:ZEUS_TOGA (foot, edgeHigh, edgeLow, boltLong, boltWide, boltX, boltGold, whiteGlow) one-sided, body belt hidden | 0, 1.45, .24, .36, .5, .62, (1.25,.72,.2), 1 unlit | 389 | approved | 388 double-sided; high .9 low .12 wide .5 band (385); cape, solar fx
vehicleBuilder.ts:THROWER_KNEES (chest, out, shinOut, shinDown, shinAhead) | .55, .2, .6, 1, .15 | 389 | approved | out .07 shinOut .35 (388); knee targets at the Farmer's hips (THROWER_LEGS kneeOut .07, shinOut .45, shinAhead .35)
farmerDress.ts:HALFLING_VEST_CUT (light, shade, glow) | 0, .97, .04 | 388 | approved | vest box, HALFLING_COAT.vestLight .45; .18/.12; 0/.08
ancientDress.ts:MINO_GIRDLE (lo, hi, proudX, proudZ, flare) on the hip joint | -.3, .03, 1.1, 1.22, 1.12 | 389 | approved | 386 band round the trunk base (MINO_SCROLL tall .24 at .04)
ancientDress.ts:SARISSA_CHUNK (path 6 pts, wide, thick, tip) | wide .3 thick .11 tip .45 | 389 | approved | SARISSA_FOLD folds 2 drapeLong .72 tall .22 tilt .6 (boxes)
ancientDress.ts:SNAKE_CAP (cy, rx, ry, rz, pow, nub, nubLean, wrapTaper) | 0, 1.22, 1.22, 1.22, 3, .26, .55, .86 | 389 | approved | half dome cap 1.14 + back cylinder, peak .42 lean .5, wrap flare 1.12
farmerDress.ts:HALFLING_TUFT (clumps, clump, from, to, sink, inX, spikes, spike, spikeWide, lean) | 5,.6,-.5,.3,.22,.45,10,.42,.2,.55 | 389 | approved | unitFactory HALFLING_FEET clump 1.35 tufts 9 long .55 splay 1
vehicleBuilder.ts:BALLISTA_WOOD + BALLISTA_PLATES (cols, edge, wide, deep, iron) | (.55,.15,.075); .2/.83, .08, .075, .12, .08 | 389 | approved | wood (.62,.3,.2); plates grid H.plates 8 (2 shown)
vehicleBuilder.ts:BALLISTA_BOLT (shaft, thick, tail, head, past, wide, waist, flat) | 1.45, .1, .7, .62, .75, .24, .3, .3 | 389 | approved | rod 1.5 x .05, head .3 x .13
