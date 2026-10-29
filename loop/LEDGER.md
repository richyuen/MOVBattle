# Loop ledger (v4): every value the loop has tuned

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

400 | shorts hem to just below the knee: thigh tube .99 + a hem tube on each shin (74d90a4) | farmer.halfling.a | approved
400 | emblem at the belt's gold, .boltStand .075, high on the shoulder, unlit code value (6169685 + 9f043da) | ancient.zeus.a | approved
400 | head-first ram: DIVE hip pitch + a 3 m/s leap + a prone sprawl (7c3bc11) | viking.headbutter.c | approved
400 | unlit cream fur + buckle .5 at 1.35 proud, in front of the braids (4c49b9b) | viking.headbutter.a | approved
400 | icicles hanging under the shaft, raked back, spread .6 along it (92f8e5b) | viking.ice_archer.c | approved
400 | her own helm: dark team dome, bronze brow band, crest, temple mounts (715aff5) | viking.valkyrie.a | approved
400 | deep hull: 4 strakes, deck .4, deep timber, bow stem, rolled scroll stern (c0da83d) | viking.longship.a | approved
400 | [R] bear-head hood rebuilt: rounded skull, proud eyes, centred snout, teeth, curtains (f80dd04) | viking.jarl.a | approved
401 | the boat under `ship` at 1.8x, two carriers under the keel, dropped at the hurl (e0fbb2c) | viking.longship.a | approved
401 | pelt curtains to the hips: small head curtains + two torso chest strips + a rounded mantle (fd578de + 9c1b402) | viking.jarl.a | approved
401 | cream feather fans, eye-line bronze band, tall flat crest on her own helm (c0c74ea + cbecbca) | viking.valkyrie.a | approved
401 | the bead flakes out, nine icicles as a comb under the shaft (5509051) | viking.ice_archer.c | approved
401 | ram: reach .75 m, the sprawl .14 s after the blow, both arms swept back (41852fd + fde5dd6) | viking.headbutter.c | approved
401 | bracer fur onto the bracer's top, belt down to the waist (7f8b218) | viking.headbutter.a | approved
401 | a second wider bib over the chest (05ccbb8 + 6f22d10, reverted a1edda8/3d01ac1) | viking.brawler.a | rejected
402 | hull keeps its carried height at the hurl, carriers pinned at the take-off, hull sunk to the keel over .85 of the airtime (4c0305e) | viking.longship.c | approved
402 | JARL_BEARD: narrow jaw between the curtains, bib, moustache, .66 H plait with three ties (03c2cf1) | viking.jarl.a | approved
402 | VALKYRIE_COLLAR: cream fur ring + 9 clumps, the Headbutter's plaits in cream to the belt (498f78d) | viking.valkyrie.a | approved
402 | ICE_ARCHER_MANTLE: pale grey ring, 10 points over the shoulders, 8 snow clumps (911eda0) | viking.ice_archer.a | approved
402 | HEADBUTTER_CREAM lit tan self-lit .42 + HEADBUTTER_BELT broad .44 band with dark rims (688ef22) | viking.headbutter.a | approved
402 | beard splay: 3 locks a side off the jaw, 1.0 W long, .15 up to .75 down (2230052, reverted 77a7b59) | viking.brawler.a | rejected
402 | HALFLING_SHORTS_CLOTH unlit team x .14, out of the glow (06049a1 + e4ec07a) | farmer.halfling.a | approved
402 | [R] bull head low and forward, level horns, short neck; 12-side girdle hugging the hips with half-sunk light scrolls; pauldron scroll on top + front (cdc71a4) | ancient.minotaur.a | approved
403 | [R] FRONT_SPLIT: the Farmer's thighs aimed out in the rig frame, knees outside the boards (06ea4d4, reverted a5b8099) | farmer.wheelbarrow.a | rejected
403 | the landed oarsmen keep their oars and chop two-handed (OAR_CHOP + LONGSHIP_OARS blows) (0d30de1) | viking.longship.c | approved
403 | the bull face upright (tilt .15) with a flat nose plate and level nostrils (a92a9f9) | ancient.minotaur.a | approved
403 | VALKYRIE_ARMOUR: brown belt + gold ring, gold arm bands, dark bracers, brown boots (0ec42c6) | viking.valkyrie.a | approved
403 | JARL_BEARD_RUN: torso-hung bib in front of the mantle into a red-tied plait (76b6c7d) | viking.jarl.a | approved
403 | the ice archer's cap seated off the eye beads' top (7029273) | viking.ice_archer.a | approved
403 | headSize 1.3 + a low HEADBUTTER_CAP dome with a front strip (bcd3eb5) | viking.headbutter.a | approved
404 | VALKYRIE_ARMOUR belt and ring seated off torsoMesh position/scale (670efeb) | viking.valkyrie.a | approved
404 | HEADBUTTER_CAP band seated off the eye beads tops (eyeTopInHead) (47ca693) | viking.headbutter.a | approved
404 | JARL_WRAPS: maroon forearm wraps, 3 dark bands, tan fur roll at the elbow (9e3df06) | viking.jarl.a | approved
404 | gunwale rails in darkWood, body tint from a shield face (e3fd388) | viking.longship.a | approved
404 | brawlerLegs on the ice archer (db12da9) | viking.ice_archer.a | approved
404 | MINO_SHELL a flat wedge plate with a bent lip, rim bar, swirl (3c3a808 + 53b63d0) | ancient.minotaur.a | approved

## Spent (never retry as [P])

## Rows
ancient done units (SARISSA_CAPE/MANTLE, SNAKE_CAP/WRAP/UPRIGHT, BALLISTA_WOOD/PLATES/BOLT/FRAME/STOCK, LOADED_BOLTS) | compacted 397 | 397 | approved | values: git show 8f53efc:loop/LEDGER.md
tribal.* (7 units' rows: JAVELIN, CHIEF, CLUB, HIDE, DEER, SLAB/SKULL, mammoth body; units done) | compacted 383 | 381 | approved | values: git show 6496b2e:loop/LEDGER.md
renaissance.* (painter, fencer, jouster, musketeer, balloon_archer, halberd rows; units done) | compacted 378 | 377 | approved | values: git show edb1692:loop/LEDGER.md
farmer.* done (hay_baler, scarecrow, harvester, farmer, potion_seller rows) | compacted 383 | 381 | approved | values: git show 6496b2e:loop/LEDGER.md
farmer.halfling done (HALFLING_STANCE, HALFLING_SHORTS + _CLOTH, shinLength 1.95, HALFLING_TUFT, VEST_CUT, COAT, SHAGGY) | compacted 404 | 402 | approved | values: git show 244af97:loop/LEDGER.md
farmer.wheelbarrow (CREW_SEAT, LOW_RIM, THROWER_LEGS seat -.08, WHEELBARROW, LOG_WHEEL, HAY_BED, BUNCHED_CREW) | compacted 382 | 381 | approved | values: git show b359959:loop/LEDGER.md
ancient.* stats (cost, healthMultiplier, damageMultiplier, cooldownMultiplier, 7 units) | d PASS 7/7 | 378 | stats | values: git show 5715b05
viking.* stats (cost, healthMultiplier, damageMultiplier, cooldownMultiplier, 7 units) | d PASS 7/7 | 391 | stats | values: git show e5a0cb5
ancient.* 379-386 rows (MINO_*, BULL_*, PIKE_LEVEL, CORINTH_*, SNAKE_*, SARISSA_KEEP/KIT, ZEUS_REARM/TOGA/SANDAL/CHAIN, BOLT_SPARK, BALLISTA_*, SB_SANDAL, HOPLITE_CREST, MINO_SHELL/SCROLL) | compacted 387 | 386 | approved | values: git show fad9e5c:loop/LEDGER.md
ancient.shield_bearer + hoplite done (SCUTUM*, LEGION_HELM, LORICA, ASPIS*, DORY_*, HOPLITE_LEGS) | compacted 385 | 384 | approved | values: git show 522cb46:loop/LEDGER.md
ancient.* 387-388 rows (ZEUS_BEARD/LOCKS/HAIR, SNAKE_LIVE, BIG_HEADBUTT, SARISSA_FOLD, BALLISTA_CREW/HELM, GROUND_SNAKE, SNAKE_QUIVER, MINO_SASH_FOOT rej) | compacted 389 | 388 | approved | values: git show f31835b:loop/LEDGER.md
viking.* 392-394 rows (BEARDED_AXE + _CARRY, JARL_AXE, LEAP_AIR, HEADBUTT, LONGSHIP_TIMBER/SHIELDS, HEADBUTTER_KIT/BRAID, BERSERKER_BELT, ICE_ARCHER_CAP, CHOP_JARL, LONGSHIP_HURL, FROST, BRAWLER_LEGS, PAIR_AXE_FACE, OFF_AXE, BRAWLER_HELM, JARL_PELT, VALKYRIE_WINGS_LAYERED, Brawler board) | compacted 398 | 397 | approved | values: git show 4778c43:loop/LEDGER.md
viking 393 rows (JUMP_CHARGE, FLY, ICE_BOW; valkyrie c and ice_archer b passed) | compacted 402 | 393 | approved | values: git show cdc71a4:loop/LEDGER.md
viking a/b/c rows (LONGSHIP_OARS, LONGSHIP_CREW, LONGSHIP_HULL, ICE_ARROW, JARL_PELT) | compacted 403 | 401 | approved | values: git show 73e45c7:loop/LEDGER.md
ancientDress.ts:MINO_GIRDLE (lo, hi, proudX, proudZ, flare, sides, rimGrow, light, sunk) on the hip joint | -.3, .03, 1.03, 1.1, 1.04, 12, 1.02, .72, .5 | 402 | approved | 1.1, 1.22, 1.12, 8 sides, rims 1.05, outlined scrolls .55 light proud 1.4 (389); 386 band round the trunk base (MINO_SCROLL tall .24 at .04)
ancientDress.ts:MINO_SHELL wedge plate (inX, atY, long, lip, lipBend, thick, rootDeep, tipDeep, faceUp, droop, swirl) | .85, .86, .85, .3, .45, .14, .7, .95, .3, .18, .3 | 404 | approved | .78/.84/.5/.22/.12/.62/.82/.22 (404.6); curved shell + scrolls .3 at 1.3, .24 at .95 (385-403)
propBuilder.ts:BULL_HEAD (drop, forward, tilt, hornBends y, neck/neckTop/neckBottom/neckLean; nose plate) | .72, .28, .15, .05/.3/.8, .42/1.0/1.6/.3; plate .82 W x 1.3 pad | 403 | approved | tilt .72 (402, muzzle at the ground); no drop/forward, tilt .5, bends up, neck .9/.9/1.5/.35 (382)
simulationSystem.ts:LONGSHIP_OARS (reach, damage, push) + vehicleBuilder OAR_CHOP (period, strike, up, down, elbow, spread) | 1.5, 12, 1.2; 1.1, .3, -2.75, -.55, -.3, .14 | 403 | approved | the oars dropped at the crash (396-402)
vikingDress.ts:VALKYRIE_ARMOUR (beltTall, beltAt, beltOut, rim, ring, ringProud; bands, bracers, boots) | .3, -.42, 1.3, .18, .3, 1.42 now off torsoMesh mid/half; .3-.5 x1.3, .12-.9 x1.22, .5- x1.2 | 404 | approved | same values in the torso node frame (403)
vikingDress.ts:JARL_BEARD_RUN (ahead, top, bibDrop, bibWide, bibTip, bibDeep, plaitLong, plait, ties) | .82, .04, .36, .5, .55, .14, .36, .13, 2 | 403 | approved | the head cut's bib + .66 braid (402)
vikingDress.ts:ICE_ARCHER_EYE_CLEAR (rim over the eye beads' top, head heights) | .03 | 403 | approved | cap rise .12 fixed (396-402)
vikingDress.ts:HEADBUTTER_CAP (dome, tall, strip, stripProud, eyeClear) + unitVisuals headSize | 1.1, .72, .2, .04, .03 off eyeTopInHead; 1.3 | 404 | approved | rise .16 fixed (403); 1.16, 1.04, no strip; headSize 1.8 (392-402)
vikingDress.ts:BERSERKER_ARMPITS (in, across, drop, arc, front, tufts, len, wide, lean, splay, glow) | .95, .16, .02, .12, .95, 6, .52, .26, .3, .5, .24 | 398 | approved | .82, -.16, .99 on the trunk's front face (397)
vikingDress.ts:VIKING_BEARD (burnTop, burn, jaw, jawY, jawZ, locks, lockLong, braidLong, band, tuft; per cut jaw/jawY/jawZ, stacheLow/stacheZ, burns, braidLong) | .2, .22, 1.2/.6/.62, .66, .6, 5, .26, .3, .09, .16; brawler 1.5/.95/.8 at 1.0 z .55, stache .62/1.25, no burns | 402 | approved | the brawler's splay 3 locks/1.0 W/.15 up/.75 down rejected and reverted at 402 (a spiked ruff); his bib2 rejected and reverted at 401; brawler 1.38/.74/.82 at 1.06 z .78 (396); berserker cut .9 wide 1.12 tip .48 braid
vikingDress.ts:JARL_BEARD (color, glow, down, wide, tip, jaw, jawY, jawZ, stacheLow, stacheZ, braidLong) | (.5,.28,.14), .2, .72, .78, .6, .9/.78/.72, .78, .62, .3, 1.1, .66 | 402 | approved | no beard (393-401); critic 402: a short chin mass, the plait hidden by the hands
vikingDress.ts:VALKYRIE_COLLAR (wide, thick, lumps, lift, ahead, braidThick, footDrop, footOut; cream, tie) | .62, .32, 9, .02, .08, .42, 1.5, .6; (.86,.74,.5) unlit, (.3,.16,.1) | 402 | approved | bare chest (391-401)
vikingDress.ts:ICE_ARCHER_MANTLE (wide, thick, sink, ahead, flat, points, point, shoulderLong, lean, lumps, lump; snow) | .8, .3, .05, .04, .82, 10, .32, .5, .6, 8, .52; (.74,.76,.8) unlit | 402 | approved | none (396-401)
vikingDress.ts:BRAWLER_HELM (dome, band, mask, cheek, nasal knobs) | values in the const (398) | 398 | approved | maskBottom -1.02 (394)
ancientDress.ts:ZEUS_TOGA (boltTop, boltTr, boltX, boltOut, boltWide, boltStand; boltGold unlit emissive = colour; rings, ring, beltAt, ringProud; gold) | .98, .3, .66, .98, .15, .075; (.62,.26,.03); 3, .075, .06, 1.14, (.88,.58,.1) .85 | 400 | approved | 399 boltTop .72, (1,.55,.1) at .55 lit, links .075 proud (rejected, reverted aa36ed2/9849d90); 398 .9/.34/.62/.95/.11, (.95,.22,.03) self-lit .55; 389-391 unlit 1.25/.72/.2 bolt, rings .045 at 1.12 (391)
ancient.zeus 398 rows (ZEUS_BEARD foot -1.95, zeusSkirt unlit white) | compacted 402 | 398 | approved | values: git show cdc71a4:loop/LEDGER.md
proceduralAnimation.ts:DIVE (tip, trunk, head, arms, elbow, knee, in, out) | 1.22, .16, .62, 2.3, .35, .18, 18, 26 | 401 | approved | 1.22,.16,.62,.45,.5,.18,18,26 (400); new (400, the ram was the BULL_CHARGE lean until then)
simulationSystem.ts:HEADBUTT (within, windup, recover, ahead, radius, damage, fling, lift, edge, lunge, dive, reach) + HEADBUTT_SPRAWL.delay | .55, .28, .5, .5, 1.15, 18, 5, 4.5, .5, .5, 3.0, .75; .14 s | 401 | approved | .5 reach with the sprawl at the blow (400); lunge .5 with no dive (394)
runtimeUnit.ts:headbuttSprawl (flat s, downed s, recovering s) | .36, .22, .5 | 400 | approved | the light profile's topple+down+recover ~2.6 s (before 400)
vikingDress.ts:HEADBUTTER_KIT (fur cut; buckle w share, buckleProud; beltTall, beltAt, beltOut, beltRim; belt colour/rim; furFrom/furOut/furThick) | HEADBUTTER_CREAM lit (0.8,0.6,0.35) self-lit .42, .5, 1.35; .44, -.4, 1.3, .16; (.5,.3,.15)/(.26,.15,.08) glow .2; .16, 1.62, .26 | 402 | approved | unlit fur (0.78,0.58,0.34) emissive = colour, belt .3 tall at -.42 in leather (.3,.17,.09) (400-401); furFrom -.06 furOut 1.54 thick .22 (400); lit cloth fur, buckle .22 at 1.24 (396)
vikingDress.ts:VALKYRIE_HELM (domeWide, domeTall, domeRise, slice; band, bandProud, eyeTop; crestTall, crestWide, crestRise, crestFlat; mountWide, mountTall, mountOut, mountUp, mountBack, mountCant; feathers, featherLen, featherWide, featherFlat, featherSpread, featherFan, featherBack, featherSweep, featherUp) | 1.16, .72, .46, .55; .14, 1.07, .56; .95, .2, 1.12, .55; .16, .6, 1.04, .36, .12, .3; 5, 2.1, .3, .34, .24, .78, .08, .42, .5 | 401 | approved | crest .58/.15 no feathers, band eyeTop .42, mounts .1/.5 (400); shared plume_helmet (before 400)
vehicleBuilder.ts:LONGSHIP_SHIP (`ship` scale, carrier z, carrier scale, carrier raise/spread/elbow) | 1.8, +-.98, .98, -2.62/.2/-.1 | 401 | approved | the hull and crew were root children at scale 1 (400); no carriers
simulationSystem.ts:LONGSHIP_HURL.sink (share of the airtime over which the hull sinks from the carriers' hands to the keel; carriers pinned at the take-off, hidden at the crash) | .85 | 402 | approved | hull dropped to y 0 and the carriers hidden at the hurl tick (401)

vikingDress.ts:JARL_WRAPS (from, to, out, bands, band, bandOut, furAt, furOut, furThick, lumps; maroon, dark) | .1, .94, 1.24, 3, .05, 1.3, .1, 1.42, .34, 7; (.3,.06,.07), (.16,.03,.04) glow .25 | 404 | approved | bare forearms (before 404)
vehicleBuilder.ts:LONGSHIP gunwale material + wrapAsBody source | darkWood; first longshipShield face | 404 | approved | teamPrimary rails as the body source (392-403)