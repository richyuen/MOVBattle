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

## Structural attempts (last 5 iterations; `iter | gap | unit.criterion | verdict`)

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
390 | frame top 1.7 m, trough/bolt/arms through the box at mid height on cross beams (0c52227) | ancient.ballista.a | approved
390 | flying bolt a copy of the loaded node, loaded one hidden half the reload; upright leaf copy (cf436a3 +1d34d1a) | ancient.ballista.c | approved
390 | vest V to the belt, one-sided faceFront panels and V, vest .3 toward white (66faf9b, reverted) | farmer.halfling.a | rejected
390 | stance upright on straight legs, bow across him, found by the nocked snake (73c3474) | ancient.snake_archer.a | approved
390 | face wrap one rounded shell tucked under the rim, narrowing, dark cord + knot (ee39078) | ancient.snake_archer.a | approved
390 | [R] mantle: one dark wedge over the left shoulder onto the chest, rolled edge, gold ring; collar/bulk/chunk retired (5c44ced) | ancient.sarissa.a | approved
391 | idle camera high rear-side, loaded leaf head past the frame front, crewman at the winch (03a5bdc) | ancient.ballista.b | approved
391 | vest one light panel + closed white V slab to the belt, team .3 toward white (6eefbb3) | farmer.halfling.a | approved
391 | foot fur rooted on the toe top face, spread over the instep (bef7e5f) | farmer.halfling.a | approved
391 | off hand a second Valkyrie sword, shield off (54ae174) | viking.valkyrie.b | approved
391 | [R] toga trim: three waist bands + flat gold bolt + white skirt (e30be40, reverted 86c09ff) | ancient.zeus.a | rejected
392 | spiked team cap: dome, studded brow band, ear flaps, one tall spike (fb91bba) | viking.headbutter.a | approved
392 | ice bow: body-height pale-ice limbs, snowball nock (dd3caf1) | viking.ice_archer.b | approved
392 | bearded axe: dark haft, grey crescent, poll; up beside the board in idle (8bcbb27 +8289d53) | viking.brawler.b | approved
392 | Jarl poleaxe: long haft, dark crescent, bronze collar, two fists (0b6bed2 +92c5442) | viking.jarl.b | approved
392 | Super Jump: throw arc logged "leap" + live-air pose (af3f259 +bd48ae1) | viking.berserker.c | approved
392 | flight: hover .34 H + swoop before the strike (ee733ae, reverted cd88c7e) | viking.valkyrie.c | rejected
392 | clinker hull: keel, 3 lapstrakes a side, stems, dragon head, curled stern (b90ffb3) | viking.longship.a | approved
393 | braids: two tan plaits from the ear flaps onto the chest, dark tie and tuft (52066c2) | viking.headbutter.a | approved
393 | own round board: light/dark halves, big faceted boss, brown rim (b76e2fe) | viking.brawler.b | approved
393 | bearded crescents on both hafts at .78 size (6cfe8b5 + 671a758) | viking.berserker.b | approved
393 | icicle fringe down both limbs, bigger tip crowns (1e0549d) | viking.ice_archer.b | approved
393 | rig: sail out, short bare mast, yard, sheets (fe36dfc + 9980e94, reverted 62d09d2/c7c8c0a) | viking.longship.a | rejected
393 | bear-head hood and fur drape, horned helm off (b7b4463 + 1df50c9) | viking.jarl.a | approved
393 | flight: hover full weight from spawn + wall clamp, swoop gated to flying_melee (455eece) | viking.valkyrie.c | approved

## Spent (never retry as [P])

## Rows
ancientDress.ts:SARISSA_CAPE (arc, hem, shade, glow) collar/roll retired 390 | .56, .72, .45, .06 | 390 | approved | shade .62 glow .12 (383); collar .16 neck .42 out 1.12 roll .06
unitFactory.ts:HALFLING_SHORTS long, cuff + HALFLING_FEET clumpTall, rise | .78, .14; .7, .45 | 383 | approved | .92; 1.1, .9
tribal.* (7 units' rows: JAVELIN, CHIEF, CLUB, HIDE, DEER, SLAB/SKULL, mammoth body; units done) | compacted 383 | 381 | approved | values: git show 6496b2e:loop/LEDGER.md
renaissance.* (painter, fencer, jouster, musketeer, balloon_archer, halberd rows; units done) | compacted 378 | 377 | approved | values: git show edb1692:loop/LEDGER.md
farmer.* done (hay_baler, scarecrow, harvester, farmer, potion_seller rows) | compacted 383 | 381 | approved | values: git show 6496b2e:loop/LEDGER.md
farmer.halfling (SHAGGY, no longer his; HALFLING_COAT, _SLEEVED) | compacted 382 | 381 | approved | values: git show b359959:loop/LEDGER.md
farmer.wheelbarrow (CREW_SEAT, LOW_RIM, THROWER_LEGS seat -.08, WHEELBARROW, LOG_WHEEL, HAY_BED, BUNCHED_CREW) | compacted 382 | 381 | approved | values: git show b359959:loop/LEDGER.md

ancient.* stats (cost, healthMultiplier, damageMultiplier, cooldownMultiplier, 7 units) | d PASS 7/7 | 378 | stats | values: git show 5715b05
viking.* stats (cost, healthMultiplier, damageMultiplier, cooldownMultiplier, 7 units) | d PASS 7/7 | 391 | stats | values: git show e5a0cb5
ancient.* 379-386 rows (MINO_*, BULL_*, PIKE_LEVEL, CORINTH_*, SNAKE_*, SARISSA_KEEP/KIT, ZEUS_REARM/TOGA/SANDAL/CHAIN, BOLT_SPARK, BALLISTA_*, SB_SANDAL, HOPLITE_CREST, MINO_SHELL/SCROLL) | compacted 387 | 386 | approved | values: git show fad9e5c:loop/LEDGER.md
ancient.shield_bearer + hoplite done (SCUTUM*, LEGION_HELM, LORICA, ASPIS*, DORY_*, HOPLITE_LEGS) | compacted 385 | 384 | approved | values: git show 522cb46:loop/LEDGER.md
ancient.* 387-388 rows (ZEUS_BEARD/LOCKS/HAIR, SNAKE_LIVE, BIG_HEADBUTT, SARISSA_FOLD, BALLISTA_CREW/HELM, GROUND_SNAKE, SNAKE_QUIVER, MINO_SASH_FOOT rej) | compacted 389 | 388 | approved | values: git show f31835b:loop/LEDGER.md
proceduralAnimation.ts:HALFLING_STANCE (tilt, stride, lean, spread, knee) | .02, .05, .03, .22, .04 | 387 | approved | hashed idle stance (sunk)
farmerDress.ts:HALFLING_MOP (locks, hang, droop, spread, wild, top, side, root, flat) | 46,1.6,.55,.8,.35,.24,.57,.63,.38 | 383 | approved | .35,.4,.95,.42 (382)
farmerDress.ts:HALFLING_BELT (tall, up, buckle, bar, buckleDeep, ringOut, side) | .17,.16,.34,.14,.12,1.08,.07 | 387 | approved | bar .24 (386); box .13 at .08 (381)
vehicleBuilder.ts:THROWER_PERCH (seat, up, tuftDeep, lumps, wide, kneeUp) | -.15, .09, .13, .18, .09, .05 | 387 | approved | THROWER_LEGS seat -.08 (retired 388)

ancientDress.ts:ZEUS_TOGA (foot, edgeHigh, edgeLow, boltLong, boltWide, boltX, boltGold, whiteGlow) one-sided, body belt hidden | 0, 1.45, .24, .36, .5, .62, (1.25,.72,.2), 1 unlit | 389 | approved | 388 double-sided; high .9 low .12 wide .5 band (385); cape, solar fx
vehicleBuilder.ts:THROWER_KNEES (chest, out, shinOut, shinDown, shinAhead) | .55, .2, .6, 1, .15 | 389 | approved | out .07 shinOut .35 (388); knee targets at the Farmer's hips (THROWER_LEGS kneeOut .07, shinOut .45, shinAhead .35)
farmerDress.ts:HALFLING_VEST_CUT (light, shade, glow) | .3, 1, .1 | 391 | approved | 0,.97,.04 (390); .3,1,.1 + veeDeep .6 vee .3 [S] 390 rejected (one-sided V vanished); vest box, vestLight .45
ancientDress.ts:MINO_GIRDLE (lo, hi, proudX, proudZ, flare) on the hip joint | -.3, .03, 1.1, 1.22, 1.12 | 389 | approved | 386 band round the trunk base (MINO_SCROLL tall .24 at .04)
ancientDress.ts:SARISSA_MANTLE (top/foot 6-pt edges, rows, bulge, roll, rollOut, brooch, shade) | 4, .025, .045, .02, .08, .7 | 390 | approved | [R] replaced SARISSA_CHUNK (wide .3 thick .11 tip .45) + SARISSA_FOLD bulk
ancientDress.ts:SNAKE_CAP (cy, rx, ry, rz, pow, nub, nubLean, wrapTaper) | 0, 1.22, 1.22, 1.22, 3, .26, .55, .86 | 389 | approved | half dome cap 1.14 + back cylinder, peak .42 lean .5, wrap flare 1.12
farmerDress.ts:HALFLING_TUFT (clumps, clump, from, to, sink, inX, spikes, spike, spikeWide, lean) | 5,.62,-.5,.3,.22,.55,10,.42,.2,.55 | 391 | approved | rooted at c.y on the toe top (391); 5,.6,-.5,.3,.22,.45 (390 rejected [P]); HALFLING_FEET clump 1.35 tufts 9
vehicleBuilder.ts:BALLISTA_WOOD + BALLISTA_PLATES (cols, edge, wide, deep, iron) | (.55,.15,.075); .2/.83, .08, .075, .12, .08 | 389 | approved | wood (.62,.3,.2); plates grid H.plates 8 (2 shown)
vehicleBuilder.ts:BALLISTA_BOLT (shaft, thick, tail, head, past, wide, waist, flat) one node + upright leaf copy | 1.45, .1, .7, .62, .75, .24, .3, .3 | 390 | approved | rod 1.5 x .05, head .3 x .13
vehicleBuilder.ts:BALLISTA_FRAME (top, beam) + BALLISTA_STOCK y | 1.7, .12; 1.0 | 390 | approved | top 1.02, stock on the top plank
simulationSystem.ts:LOADED_BOLTS (ballista: ballistaLoadedBolt flies, hidden cooldown x .5) | 1 entry | 390 | approved | projectile "bolt" rod .4 x .04
proceduralAnimation.ts:SNAKE_UPRIGHT (yaw, stagger, give, lean, tilt, raise, out, elbow, tip, left) | .12,.06,.02,.04,.03,-.75,-.22,-1.35 | 390 | approved | bowman ready: yaw .6-.95, stagger .4-.6
ancientDress.ts:SNAKE_WRAP (tuck, r, narrowFrom, chin, cordAt, thick, knot, loop, end) | .12,1.19,-.75,.72,-.36,.09,.2,.22,.22 | 390 | approved | 10-sided wrap cylinder 1.1, taper .86
propBuilder.ts:BEARDED_AXE (long, butt, head, wide) | .8, .2, .28, .22 | 392 | approved | .8, .12, .34, .19 (392)
proceduralAnimation.ts:BEARDED_AXE_CARRY (raise, out, elbow, tip x) | -.2, .55, -1.45, .42 | 392 | approved | hanging hashed carry (391)
propBuilder.ts:JARL_AXE (long, grip, wide, tall) | .95, .3, .24, .21 | 392 | approved | .95, .22, .3, .42 (392)
simulationSystem.ts:JUMP_CHARGE (rise, swoopRise) | 8, 4.5 | 393 | pending | swoopRise retired with the valkyrie revert (392); teleport (391)
proceduralAnimation.ts:FLY (lift, bob, rate, beat, thigh, knee) | .34, .02, 2, .34, .5, 1.0 | 393 | pending | 392 weight eased up from 0 (rejected)
propBuilder.ts:ICE_BOW (long, thick, taper, shards, shard, crown, fringe, fringeLen) | 1, .062, .45, 4, .16, 2.6, 6, .15 | 393 | pending | 3, .085, 1.9, no fringe (392)
vikingDress.ts:HEADBUTTER_BRAID (apart, rootUp, footOut, footDrop, plaits, thick, band, tuft) | .52, .1, .64, 1.02, 5, .34, .13, .22 | 393 | pending
vikingDress.ts:JARL_PELT (skull, muzzleLong, eyeOut, drape, drapeDeep, glow) | 1.1, 1.8, .5, .12, .55, .2 | 393 | pending | 1.04, 1.15, .28, .26, .9, .16 (393 first cut)
propBuilder.ts:Brawler board (face, rim, boss) | .36, .43, .17 | 393 | pending
proceduralAnimation.ts:LEAP_AIR (thigh, knee, armOut, armBack) | .8, 1.15, 1.0, .35 | 392 | approved | flung sprawl only (limp gate, 391)
vehicleBuilder.ts:LONGSHIP_TIMBER (wood, dark) | .62/.42/.25, .44/.29/.17 | 392 | approved | .46/.3/.16, .3/.18/.1 (392)
