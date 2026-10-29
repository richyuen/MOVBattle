# Loop ledger (v4): every value the loop has tuned

Rows: `file:identifier | current value | last iter | verdict | earlier values (newest first)`. The identifier carries the unit
(`rosterManifest.ts:tribal.clubber damageMultiplier`, `unitVisuals.ts:tribal.clubber proportions.scale`, `propBuilder.ts:club CLUB_LEN`).
Verdicts: approved, rejected, approved, spent. A row is `spent` after two attempts without approval or when it was listed as
never-retry; it is not pickable as [P]. The critic rejects a [P] gap that reverses or re-nudges a row approved within the last 20
iterations ("ledger reversal"). An [S] gap that replaces the mechanism owning a row may set new values: the worker resets the row to
approved and keeps the old value under earlier values. Stats knobs set by a `loop(N.0): [P] <batch> stats` commit are rows too
(verdict `stats`, never reviewed by the critic, never a ledger reversal). One row per tuning knob a mechanism exposes, not per line;
a value column is at most 80 characters. The worker updates rows at commit time (approved) and after verdicts. Drop rows untouched
for 25 iterations.

## Structural attempts (last 5 iterations; `iter | gap | unit.criterion | verdict`)

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
405 | brawlerLegs on the jarl (a3fb035) | viking.jarl.a | approved
405 | ICE_ARCHER_BAND: the brim a dark leather band with 8 rivet studs (99ac4de) | viking.ice_archer.a | approved
405 | brawlerLegs on the headbutter, the kit's knee cuffs/boots off (db2616f) | viking.headbutter.a | approved
405 | VALKYRIE_SWORD slab cut: blade .98 of her height in both fists (2e4602e) | viking.valkyrie.b | approved
405 | longship shields: whole team face, 3 dark plank seams, dark boss; the dark half gone (1bd1f2d) | viking.longship.a | approved
405 | MINO_STRAP: the sash a wide proud slab to the right hip, buckle on its lower run (946334f) | ancient.minotaur.a | approved
405 | zeus emblem in render group 1, glowLayer.renderingGroupId 0: drawn over the bloom (7738aea) | ancient.zeus.a | approved
406 | bull head up on a tall neck (drop -.4, face .86, neck 1.0) + dewlap (73bf52a) | ancient.minotaur.a | approved
406 | JARL_BELT: leather belt + round buckle; no mantle, no tunicSkirt (293835c) | viking.jarl.a | approved
406 | standSquare: the halberd's square stance on the headbutter, legLength 1.22 (e25bd21) | viking.headbutter.a | rejected (reverted)
406 | SWORD_WINGS: winged gold hilt, 3 feather slabs a side, gold grip/pommel (4d48164) | viking.valkyrie.b | approved
406 | ICE_BOW recut: slender recurve, flake crust, no fringe/snowball (8dbee1a) | viking.ice_archer.b | approved
406 | SHEER: curved strakes, rails, deck; shields on the curve (b38c4d7) | viking.longship.a | approved
406 | zeusBeardFootInTorso: emblem top .boltGap under the beard's foot (31197fe) | ancient.zeus.a | approved

## Spent (never retry as [P])

## Rows
ancient done units (SARISSA_CAPE/MANTLE, SNAKE_CAP/WRAP/UPRIGHT, BALLISTA_WOOD/PLATES/BOLT/FRAME/STOCK, LOADED_BOLTS) | compacted 397 | 397 | approved | values: git show 8f53efc:loop/LEDGER.md
farmer.halfling done (HALFLING_STANCE, HALFLING_SHORTS + _CLOTH, shinLength 1.95, HALFLING_TUFT, VEST_CUT, COAT, SHAGGY) | compacted 404 | 402 | approved | values: git show 244af97:loop/LEDGER.md
viking.* stats (cost, healthMultiplier, damageMultiplier, cooldownMultiplier, 7 units) | d PASS 7/7 | 391 | stats | values: git show e5a0cb5
ancient.* 379-386 rows (MINO_*, BULL_*, PIKE_LEVEL, CORINTH_*, SNAKE_*, SARISSA_KEEP/KIT, ZEUS_REARM/TOGA/SANDAL/CHAIN, BOLT_SPARK, BALLISTA_*, SB_SANDAL, HOPLITE_CREST, MINO_SHELL/SCROLL) | compacted 387 | 386 | approved | values: git show fad9e5c:loop/LEDGER.md
ancient.shield_bearer + hoplite done (SCUTUM*, LEGION_HELM, LORICA, ASPIS*, DORY_*, HOPLITE_LEGS) | compacted 385 | 384 | approved | values: git show 522cb46:loop/LEDGER.md
ancient.* 387-388 rows (ZEUS_BEARD/LOCKS/HAIR, SNAKE_LIVE, BIG_HEADBUTT, SARISSA_FOLD, BALLISTA_CREW/HELM, GROUND_SNAKE, SNAKE_QUIVER, MINO_SASH_FOOT rej) | compacted 389 | 388 | approved | values: git show f31835b:loop/LEDGER.md
viking.* 392-394 rows (BEARDED_AXE + _CARRY, JARL_AXE, LEAP_AIR, HEADBUTT, LONGSHIP_TIMBER/SHIELDS, HEADBUTTER_KIT/BRAID, BERSERKER_BELT, ICE_ARCHER_CAP, CHOP_JARL, LONGSHIP_HURL, FROST, BRAWLER_LEGS, PAIR_AXE_FACE, OFF_AXE, BRAWLER_HELM, JARL_PELT, VALKYRIE_WINGS_LAYERED, Brawler board) | compacted 398 | 397 | approved | values: git show 4778c43:loop/LEDGER.md
viking 393 rows (JUMP_CHARGE, FLY, ICE_BOW; valkyrie c and ice_archer b passed) | compacted 402 | 393 | approved | values: git show cdc71a4:loop/LEDGER.md
viking a/b/c rows (LONGSHIP_OARS, LONGSHIP_CREW, LONGSHIP_HULL, ICE_ARROW, JARL_PELT) | compacted 403 | 401 | approved | values: git show 73e45c7:loop/LEDGER.md
ancientDress.ts:MINO_GIRDLE (lo, hi, proudX, proudZ, flare, sides, rimGrow, light, sunk) on the hip joint | -.3, .03, 1.03, 1.1, 1.04, 12, 1.02, .72, .5 | 402 | approved | 1.1, 1.22, 1.12, 8 sides, rims 1.05, outlined scrolls .55 light proud 1.4 (389); 386 band round the trunk base (MINO_SCROLL tall .24 at .04)
ancientDress.ts:MINO_SHELL wedge plate (inX, atY, long, lip, lipBend, thick, rootDeep, tipDeep, faceUp, droop, swirl) | .85, .86, .85, .3, .45, .14, .7, .95, .3, .18, .3 | 404 | approved | .78/.84/.5/.22/.12/.62/.82/.22 (404.6); curved shell + scrolls .3 at 1.3, .24 at .95 (385-403)
propBuilder.ts:BULL_HEAD (drop, forward, face, tilt, neck/neckTop/neckBottom/neckLean, dewlap) | -.4, .12, .86, .12, 1.0/1.0/1.55/.22, .22 | 406 | approved | .72, .28, 1.0, .15, .42/1.0/1.6/.3 (403); tilt .72 (402, muzzle at the ground); no drop/forward, tilt .5, neck .9/.9/1.5/.35 (382)
simulationSystem.ts:LONGSHIP_OARS (reach, damage, push) + vehicleBuilder OAR_CHOP (period, strike, up, down, elbow, spread) | 1.5, 12, 1.2; 1.1, .3, -2.75, -.55, -.3, .14 | 403 | approved | the oars dropped at the crash (396-402)
vikingDress.ts:VALKYRIE_ARMOUR (beltTall, beltAt, beltOut, rim, ring, ringProud; bands, bracers, boots) | .3, -.42, 1.3, .18, .3, 1.42 now off torsoMesh mid/half; .3-.5 x1.3, .12-.9 x1.22, .5- x1.2 | 404 | approved | same values in the torso node frame (403)
vikingDress.ts:JARL_BEARD_RUN (ahead, top, bibDrop, bibWide, bibTip, bibDeep, plaitLong, plait, ties) | .82, .04, .36, .5, .55, .14, .36, .13, 2 | 403 | approved | the head cut's bib + .66 braid (402)
vikingDress.ts:ICE_ARCHER_EYE_CLEAR (rim over the eye beads' top, head heights) | .03 | 403 | approved | cap rise .12 fixed (396-402)
vikingDress.ts:HEADBUTTER_CAP (dome, tall, strip, stripProud, eyeClear) + unitVisuals headSize | 1.1, .72, .2, .04, .03 off eyeTopInHead; 1.3 | 404 | approved | rise .16 fixed (403); 1.16, 1.04, no strip; headSize 1.8 (392-402)
viking c/done rows (BERSERKER_ARMPITS, BRAWLER_HELM, DIVE, HEADBUTT + SPRAWL.delay, headbuttSprawl) | compacted 406 | 401 | approved | values: git show 9c743e0:loop/LEDGER.md
vikingDress.ts:VIKING_BEARD (burnTop, burn, jaw, jawY, jawZ, locks, lockLong, braidLong, band, tuft; per cut jaw/jawY/jawZ, stacheLow/stacheZ, burns, braidLong) | .2, .22, 1.2/.6/.62, .66, .6, 5, .26, .3, .09, .16; brawler 1.5/.95/.8 at 1.0 z .55, stache .62/1.25, no burns | 402 | approved | the brawler's splay 3 locks/1.0 W/.15 up/.75 down rejected and reverted at 402 (a spiked ruff); his bib2 rejected and reverted at 401; brawler 1.38/.74/.82 at 1.06 z .78 (396); berserker cut .9 wide 1.12 tip .48 braid
vikingDress.ts:JARL_BEARD (color, glow, down, wide, tip, jaw, jawY, jawZ, stacheLow, stacheZ, braidLong) | (.5,.28,.14), .2, .72, .78, .6, .9/.78/.72, .78, .62, .3, 1.1, .66 | 402 | approved | no beard (393-401); critic 402: a short chin mass, the plait hidden by the hands
vikingDress.ts:VALKYRIE_COLLAR (wide, thick, lumps, lift, ahead, braidThick, footDrop, footOut; cream, tie) | .62, .32, 9, .02, .08, .42, 1.5, .6; (.86,.74,.5) unlit, (.3,.16,.1) | 402 | approved | bare chest (391-401)
vikingDress.ts:ICE_ARCHER_MANTLE (wide, thick, sink, ahead, flat, points, point, shoulderLong, lean, lumps, lump; snow) | .8, .3, .05, .04, .82, 10, .32, .5, .6, 8, .52; (.74,.76,.8) unlit | 402 | approved | none (396-401)
ancientDress.ts:ZEUS_TOGA (boltTop, boltTr, boltX, boltOut, boltWide, boltStand; boltGold unlit emissive = colour; rings, ring, beltAt, ringProud; gold) | .98, .3, .66, .98, .15, .075; (.62,.26,.03); 3, .075, .06, 1.14, (.88,.58,.1) .85 | 400 | approved | 399 boltTop .72, (1,.55,.1) at .55 lit, links .075 proud (rejected, reverted aa36ed2/9849d90); 398 .9/.34/.62/.95/.11, (.95,.22,.03) self-lit .55; 389-391 unlit 1.25/.72/.2 bolt, rings .045 at 1.12 (391)
ancient.zeus 398 rows (ZEUS_BEARD foot -1.95, zeusSkirt unlit white) | compacted 402 | 398 | approved | values: git show cdc71a4:loop/LEDGER.md
vikingDress.ts:HEADBUTTER_KIT (fur cut; buckle w share, buckleProud; beltTall, beltAt, beltOut, beltRim; belt colour/rim; furFrom/furOut/furThick) | HEADBUTTER_CREAM lit (0.8,0.6,0.35) self-lit .42, .5, 1.35; .44, -.4, 1.3, .16; (.5,.3,.15)/(.26,.15,.08) glow .2; .16, 1.62, .26 | 402 | approved | unlit fur (0.78,0.58,0.34) emissive = colour, belt .3 tall at -.42 in leather (.3,.17,.09) (400-401); furFrom -.06 furOut 1.54 thick .22 (400); lit cloth fur, buckle .22 at 1.24 (396)
vikingDress.ts:VALKYRIE_HELM (domeWide, domeTall, domeRise, slice; band, bandProud, eyeTop; crestTall, crestWide, crestRise, crestFlat; mountWide, mountTall, mountOut, mountUp, mountBack, mountCant; feathers, featherLen, featherWide, featherFlat, featherSpread, featherFan, featherBack, featherSweep, featherUp) | 1.16, .72, .46, .55; .14, 1.07, .56; .95, .2, 1.12, .55; .16, .6, 1.04, .36, .12, .3; 5, 2.1, .3, .34, .24, .78, .08, .42, .5 | 401 | approved | crest .58/.15 no feathers, band eyeTop .42, mounts .1/.5 (400); shared plume_helmet (before 400)
vehicleBuilder.ts:LONGSHIP_SHIP (`ship` scale, carrier z, carrier scale, carrier raise/spread/elbow) | 1.8, +-.98, .98, -2.62/.2/-.1 | 401 | approved | the hull and crew were root children at scale 1 (400); no carriers
simulationSystem.ts:LONGSHIP_HURL.sink (share of the airtime over which the hull sinks from the carriers' hands to the keel; carriers pinned at the take-off, hidden at the crash) | .85 | 402 | approved | hull dropped to y 0 and the carriers hidden at the hurl tick (401)

vikingDress.ts:JARL_WRAPS (from, to, out, bands, band, bandOut, furAt, furOut, furThick, lumps; maroon, dark) | .1, .94, 1.24, 3, .05, 1.3, .1, 1.42, .34, 7; (.3,.06,.07), (.16,.03,.04) glow .25 | 404 | approved | bare forearms (before 404)
vehicleBuilder.ts:LONGSHIP gunwale material + wrapAsBody source | darkWood; first longshipShield face | 404 | approved | teamPrimary rails as the body source (392-403)
vikingDress.ts:ICE_ARCHER_BAND (leather, rivet, glow, rivets, rivetSize, rivetProud) | (.26,.12,.06), (.5,.48,.44), .14, 8, .42, .8 | 405 | approved | the brim a pale fur roll ICE_ARCHER_FUR (396-404)
ancientDress.ts:MINO_STRAP (wide, proud, footX, footY, buckleAt) | .44, .32, .95, .06, .3 | 405 | approved | MINO_SASH .3 wide .03 thick flat on the chest, foot .85/.12, buckle at .68 (383-404)
propBuilder.ts:VALKYRIE_SWORD (long, wide, grip, point) | .98, .04, 1.9, .12 | 405 | approved | the plain slab sword .46 of her height (391-404)
propBuilder.ts:SWORD_WINGS (wingFeathers, wingLong, wingSweep, gold, glow) | 3, 3.4 fists, .32, (.88,.58,.1), .5 | 406 | approved | the dark "metal" bar guard (391-405)
propBuilder.ts:ICE_BOW (thick, taper, bow, recurve, crust, flake, flakeLift, tip) | .04, .5, .1, .035, 4, .07, .22, .06 | 406 | approved | thick .062 taper .45 bow .06, fringe 6 x .15, crowns 4 x .16, snow .105 (392-405)
vehicleBuilder.ts:longship SHEER (half, pinch, pow, rise, bow, segs) | 1.3, .8, 3, .34, 1.25, 12 | 406 | approved | straight strakes 2.56-.16r, straight rails 2.42, flat deck .82 x 2.34 (392-405)
vikingDress.ts:JARL_BELT (tall, at, out, rim, ring, ringThick, proud; leather, rimDark, metal) | .24, -.74, 1.2, .2, .24, .3, 1.08; (.24,.13,.07), (.13,.07,.04), (.55,.52,.48) | 406 | approved | jarlPeltMantle .86/.24/.68/.94 over the chest + tunicSkirt (401-405)
unitVisuals.ts:viking.headbutter legLength + proceduralAnimation standSquare | .92 default, hip-shot idle (reverted) | 406 | rejected | 1.22 + HALBERD_SQUARE stance rejected 406: upright but belt-to-sole unmoved (41%)
ancientDress.ts:ZEUS_TOGA.boltGap (emblem top under the measured beard foot, trunk heights) | .08 | 406 | approved | the fixed boltTop .98 only (398-405)
vehicleBuilder.ts:longship PLANKS (count, wide) + shieldDark/shieldBoss | 3, .035; (.14,.08,.05)/(.2,.13,.08) | 405 | approved | a dark half disc (.1,.11,.16), boss (.56,.36,.15) (395-404)
main.ts:glowLayer.renderingGroupId + zeusTogaBolt renderingGroupId | 0; 1 | 405 | approved | -1 (merged at the camera's end); 0
