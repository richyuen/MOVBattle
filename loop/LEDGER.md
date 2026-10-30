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

414 | [P] KABUTO lames opening to the front, arc .55 (981199b; evidence 0434511) | dynasty.samurai.a | approved
414 | KATANA_REST + _restKatana: katana upright in both fists (1b007b1) | dynasty.samurai.b | approved
414 | MONK_TROUSERS: wide trousers, gold-banded greaves (a6bbc47) | dynasty.monk.a | approved
414 | BRAWLER_HATCHET: bearded axe cut to .6, dark iron (cf3af41) | viking.brawler.b | approved
415 | MINO_LATHE: lathed tapered legs, no hem step (57ec2652) | ancient.minotaur.a | approved
415 | katana along the forearm in the swing; rest settle .8 s, edge-forward (44749436) | dynasty.samurai.b | approved
415 | MONK_ARM_PLATES: team lamellar rows, gold rims (4db0bf1d) | dynasty.monk.a | approved
415 | NORSE_BOARD + _restNorseBoard: board plumb before him (b8bdfcee) | viking.brawler.b | approved
415 | [P] BRAWLER_HATCHET.haft .67 (2d2156d4) | viking.brawler.b | approved
416 | FLAME_JET + DRAGON_BREATH: held flame jet from the mouth (799cefaa) | dynasty.dragon.c | approved
416 | DRAGON_FORM: paper head on a pole, body ribbon (3ac0c32c) | dynasty.dragon.a | approved
416 | HWACHA_RACK: upright 10x6 lattice (50d2eac3) | dynasty.hwacha.a | approved
416 | HWACHA_ROCKET: banded tube, flame trail (65915a61) | dynasty.hwacha.c | approved
416 | MONKEY_STAFF: long team staff, gold ends (10e4da35) | dynasty.monkey_king.b | approved
416 | MONKEY_TAIL: tail over the head (f97d38f2) | dynasty.monkey_king.a | approved
416 | [P] KATANA_STEEL light blade (52fa1771) | dynasty.samurai.b | approved
417 | BO_SHOVE: bo throws the man back (be4cf01d) | dynasty.monk.c | approved
417 | jump_charge leap (adc7786a) | dynasty.monkey_king.c | approved
417 | ARCHER_ROBE: lapel robe, sash (55118a80) | dynasty.firework_archer.a | approved
417 | [P] DRAGON_FORM.size 2 (eaed1d92) | dynasty.dragon.a | approved
417 | DRAGON_CARRIER (1f9d50d6) | dynasty.dragon.b | approved
417 | SAMURAI_BLOCK + SLASH_ARC (e7f66440; evidence 101e6c62) | dynasty.samurai.c | approved

## Spent (never retry as [P])

## Rows
viking 401-403 rows (ICE_ARCHER_MANTLE, ICE_ARCHER_EYE_CLEAR, VIKING_BEARD, JARL_BEARD, HEADBUTTER_KIT, LONGSHIP_SHIP, LONGSHIP_HURL.sink) | compacted 409 | 403 | approved | values: git show 2ccd9f2:loop/LEDGER.md
ancient 379-397 rows (MINO_*, BULL_*, SARISSA_*, SNAKE_*, BALLISTA_*, ZEUS_*, SCUTUM/LORICA/ASPIS/DORY, HOPLITE_*, CORINTH_*, BIG_HEADBUTT) | compacted 412 | 397 | approved | values: git show 8f53efc / fad9e5c / 522cb46 / f31835b :loop/LEDGER.md
farmer.halfling done (HALFLING_STANCE, HALFLING_SHORTS + _CLOTH, shinLength 1.95, HALFLING_TUFT, VEST_CUT, COAT, SHAGGY) | compacted 404 | 402 | approved | values: git show 244af97:loop/LEDGER.md
viking.* stats (cost, healthMultiplier, damageMultiplier, cooldownMultiplier, 7 units) | d PASS 7/7 | 391 | stats | values: git show e5a0cb5
viking 392-409 rows (BEARDED_AXE, JARL_AXE, LEAP_AIR, HEADBUTT, LONGSHIP_*, HEADBUTTER_KIT/BRAID/HAIR/COPPER, ICE_BOW, FROST, BRAWLER_*, JUMP_CHARGE, FLY, VALKYRIE_WINGS) | compacted 411 | 409 | approved | values: git show 186849d:loop/LEDGER.md, 4778c43, cdc71a4
viking a/b/c rows (LONGSHIP_OARS, LONGSHIP_CREW, LONGSHIP_HULL, ICE_ARROW, JARL_PELT) | compacted 403 | 401 | approved | values: git show 73e45c7:loop/LEDGER.md
ancientDress.ts:MINO_GIRDLE (lo, hi, proudX, proudZ, flare, sides, rimGrow, light, sunk) on the hip joint | -.3, .03, 1.03, 1.1, 1.04, 12, 1.02, .72, .5 | 402 | approved | 1.1, 1.22, 1.12, 8 sides, rims 1.05, outlined scrolls .55 light proud 1.4 (389); 386 band round the trunk base (MINO_SCROLL tall .24 at .04)
ancientDress.ts:MINO_SHELL wedge plate (inX, atY, long, lip, lipBend, thick, rootDeep, tipDeep, faceUp, droop, swirl) | .85, .86, .85, .3, .45, .14, .7, .95, .3, .18, .3 | 404 | approved | .78/.84/.5/.22/.12/.62/.82/.22 (404.6); curved shell + scrolls .3 at 1.3, .24 at .95 (385-403)
propBuilder.ts:BULL_HEAD (drop, forward, face, tilt, neck/neckTop/neckBottom/neckLean, dewlap) | -.4, .12, .86, .12, 1.0/1.0/1.55/.22, .22 | 406 | approved | .72, .28, 1.0, .15, .42/1.0/1.6/.3 (403); tilt .72 (402, muzzle at the ground); no drop/forward, tilt .5, neck .9/.9/1.5/.35 (382)
simulationSystem.ts:LONGSHIP_OARS (reach, damage, push) + vehicleBuilder OAR_CHOP (period, strike, up, down, elbow, spread) | 1.5, 12, 1.2; 1.1, .3, -2.75, -.55, -.3, .14 | 403 | approved | the oars dropped at the crash (396-402)
viking done rows (JARL_PELT, JARL_BEARD_RUN, JARL_BELT, JARL_WRAPS, JARL_FLAPS, JARL_CRESCENT, HEADBUTTER_CAP, LONGSHIP_CARRIER) | compacted 416 | 409 | approved | values: git show a312f052:loop/LEDGER.md
viking c/done rows (BERSERKER_ARMPITS, BRAWLER_HELM, DIVE, HEADBUTT + SPRAWL.delay, headbuttSprawl) | compacted 406 | 401 | approved | values: git show 9c743e0:loop/LEDGER.md

vehicleBuilder.ts:LONGSHIP gunwale material + wrapAsBody source | darkWood; first longshipShield face | 404 | approved | teamPrimary rails as the body source (392-403)
vikingDress.ts:ICE_ARCHER_BAND (leather, rivet, glow, rivets, rivetSize, rivetProud) | (.26,.12,.06), (.5,.48,.44), .14, 8, .42, .8 | 405 | approved | the brim a pale fur roll ICE_ARCHER_FUR (396-404)
ancientDress.ts:MINO_STRAP (wide, proud, footX, footY, buckleAt) | .44, .32, .95, .06, .3 | 405 | approved | MINO_SASH .3 wide .03 thick flat on the chest, foot .85/.12, buckle at .68 (383-404)
propBuilder.ts:ICE_BOW (thick, taper, bow, recurve, crust, flake, flakeLift, tip) | .04, .5, .1, .035, 4, .07, .22, .06 | 406 | approved | thick .062 taper .45 bow .06, fringe 6 x .15, crowns 4 x .16, snow .105 (392-405)
vehicleBuilder.ts:longship SHEER (half, pinch, pow, rise, bow, segs) | 1.3, .8, 3, .34, 1.25, 12 | 406 | approved | straight strakes 2.56-.16r, straight rails 2.42, flat deck .82 x 2.34 (392-405)
unitVisuals.ts:viking.headbutter legLength + proceduralAnimation standSquare | .92 default, hip-shot idle (reverted) | 406 | rejected | 1.22 + HALBERD_SQUARE stance rejected 406: upright but belt-to-sole unmoved (41%)
vehicleBuilder.ts:longship PLANKS (count, wide) + shieldDark/shieldBoss | 3, .035; (.14,.08,.05)/(.2,.13,.08) | 405 | approved | a dark half disc (.1,.11,.16), boss (.56,.36,.15) (395-404)
vikingDress.ts:BRAWLER_BEARD (jaw, jawY, jawZ; bibDrop, bibWide, bibTip, bibLean; spillFrom/To, spillWide; colour) | [1.5,.95,.8], 1.0, .55; .28, .6, .72, .08; (.085,.15)/(.12,-.05), .11; (.13,.065,.045) | 407 | approved | the VIKING_BEARD brawler cut (0.32,.15,.11) glow .22 (396-406)
vikingDress.ts:HEADBUTTER_LEGS + unitVisuals headbutter shinLength/torsoLength | hemTo .62, hemOut 1.44, cuff .58-.76, bootFrom .74; 1.75, .82 | 407 | approved | the BRAWLER_LEGS cut, shin 1, torso 1 (405-406)
proceduralAnimation.ts:ICE_UPRIGHT (raise, out, elbow, tip, yaw, stagger, give) | -.85, -.2, -1.3, [.16,1,.06], .12, .06, .02 | 407 | approved | the hashed bowman hold (before 407); tip [-.42,1,.12] raise -.7 (407.5)
ancientDress.ts:MINO_LEGS (thigh, shin, toeWide, toeTall, toeDeep, cleft, toeAhead, toeSlope, pastern, hockUp, hockBack, hock) + thighShell/calfShell/calfTo | .7, .58, ... (407 values); 1.95, 2.0, .6 | 410 | approved | no sleeves (407-409)
viking.valkyrie + ancient.zeus done (VALKYRIE_ARMOUR/COLLAR/HELM/SWORD, SWORD_WINGS, ZEUS_TOGA + .boltGap, ZEUS_BEARD, glowLayer group 0 / bolt group 1) | compacted 407 | 406 | approved | values: git show 978f707:loop/LEDGER.md
vikingDress.ts:HEADBUTTER_TUNIC (out, deep, sleeve, sleeveOut, glow) | 1.05, 1.08, .42, 1.2, .12 | 408 | approved | the viking_fur-tinted trunk + body-material tunicSkirt (before 408)
vikingDress.ts:ICE_ARCHER_SNOWCAP (lumps, out, big, small, spread, sit, squash) | 4, .4, .2, [.7,.6,.55], .09, .05, .75 | 408 | approved | ICE_ARCHER_MANTLE ring + 10 points + 8 lumps (402-407)
ancientDress.ts:MINO_STRAP.clear (foot over the girdle's measured top, trunk heights) | .03 | 408 | approved | footY .06 fixed (405-407)
proceduralAnimation.ts:JARL_REST (ahead, inward, drop, across, forward) | .12, .02, .36, .95, .2 | 408 | approved | HALBERD_REST upright .05 tilt (392-407)
vehicleBuilder.ts:LONGSHIP_PROW (lift, root, tip, eye, path) | .75, .11, .085, .2, S from (.95,1.3) to (2.0,1.38) | 408 | approved | neck box .18x.66 at y .9, bead eyes .1 (392-407)
vehicleBuilder.ts:LONGSHIP_STERN (post, r0, r1, turns, root, mid, tip) | [y,z] (.45,-1.26)..(1.5,-1.52), .2, .05, 1.25, .12, .08, .04 | 409 | approved | stern post cylinder .82 + two scroll cylinders at y 1.0 (400-408)
ancientDress.ts:MINO_BARREL (wide, deep, ahead, profile, hump, humpY, neckFrom/To, neckBottom/Top, neckLean) | 1.35, 1.8, .08, 7 pts .8-1.02-.3, [.95,.24,.7], .98, .92/1.3, .95/.62, .25 | 409 | approved | the body's trunk box (before 409)
vikingDress.ts:ICE_ARCHER_COAT (out, deep, sleeveOut, cuffTo, belt, beltAt, beltOut, skirt, flare, glow; leather) | 1.06, 1.1, 1.15, .88, .11, .08, 1.08, .8, 1.4, .12; (.26,.12,.06) | 409 | approved | the viking_fur trunk + body tunicSkirt .45/1.5 (before 409)
ancientDress.ts:MINO_ARMS (upper, fore, fist) | 1.6, 1.85, 1.75 | 410 | approved | bare limb boxes (before 410)
viking done 410-412 rows (LEG_WRAPS, ICE_ARCHER_QUIVER, ICE_NOCK, ICE_REST + grip seat) | compacted 413 | 412 | approved | values: git show e702238:loop/LEDGER.md
propBuilder.ts:BULL_MUZZLE (wide, tall, deep, drop, ahead, tilt; horns) | .95, .42, .62, .36, .3, .25 | 411 | approved | BULL_HEAD face .86 tilt .12 + hornBends (406-410)
dynastyDress.ts:MONK_STAFF (long, thick, offset, cap, capWide, band) + MONK_REST (ahead, inward, drop, tilt) | 1.2, .022, .2, .08, 1.45, .025; .14, .08, .16, .06 | 411 | approved | no staff (before 411)
dynasty.ninja done 411-413 rows (NINJA_HOOD, SHURIKEN, NINJA_GI, SHURIKEN_FLIGHT, NINJA_TROUSERS) | compacted 415 | 413 | approved | values: git show 46161b8:loop/LEDGER.md
dynasty.* stats (cost, healthMultiplier, damageMultiplier, cooldownMultiplier, 7 units) | d PASS 7/7 | 411 | stats | values: git show cc4f7de
dynastyDress.ts:TENGU_MASK (plate, chin, shade, brow, browTall, scowl, nose, noseOut, noseWide, mouth, mouthY, fang) | 1.04, -.92, .72, .62, .16, .38, .42, .3, .3, .9, -.6, .2 | 412 | approved | bare face (before 412)
proceduralAnimation.ts:MONK_SWING (back, through, cock, hit, reach, raise, dip) | .9, 1.35, .3, .5, .08, 1.3, .35 | 412 | approved | unarmed shove (before 412)
dynastyDress.ts:ARCHER_HAIR (clear, top, out, capDeep, fall, fallOut, side, sideDrop, sideFrom, bun) | .08, 1.14, 1.1, 2.1, 2.6, .22, .2, -.85, .35, .42 | 412 | approved | conical_hat (before 412)
propBuilder.ts:KASA_GOLD + kasa cone team colour | (.86,.62,.18) | 413 | approved | accent cone, accent x.55 band (before 413)
propBuilder.ts:FIREWORK_BOW (long, cap, capColor) | 1.15, .12, (.92,.5,.12) | 413 | approved | plain bow (before 413)
projectileSystem.ts:FIREWORK_ROCKET (long, wide, bands, head, flame, arc) | .5, .13, 3, .14, .32, .1 | 413 | approved | .3x.04 stick, arc .25 (before 413)
dynastyDress.ts:KABUTO (clear, top, bowlFoot, bowlTop, peak, tiers, lame, step, flareTop, flareFoot, arc, rim, crest) | .04, 1.3, 2.3, 1.4, .42, 3, .32, .3, 2.3, 2.75, .55, .07, .42; turn pi(.5-arc) | 414 | approved | arc .64 turn pi(.5+arc) (413); samurai_helmet (before 413)
proceduralAnimation.ts:KATANA_REST (ahead, drop, lean, under, settle) | .16, .24, .12, .9, .8; flat to his side, swing along the forearm | 415 | approved | flat facing him, no settle (414); one-hand shoulder carry (before 414)
dynastyDress.ts:MONK_TROUSERS (thigh, kneeTo, greave, bands, band, bandOut) | 2.0, .22, 1.35, 3, .07, 1.45 | 414 | approved | bare legs (before 414)
propBuilder.ts:BRAWLER_HATCHET (scale, steel, haft) | .6, (.11,.11,.12), .67 | 415 | approved | haft 1 (414); bearded_axe at 1, steel (.46,.47,.52) (392-413)
ancientDress.ts:MINO_LATHE (thigh, shin profiles; radius, facets) | thigh .92/1.04/.96/.8/.66, shin .74/.8/.64/.46/.38; 1.4, 7 | 415 | approved | limbShell sleeves thigh 1.95, calf 2.0 to .6 (410)
dynastyDress.ts:MONK_ARM_PLATES (rows, out, overlap, rim, rimOut, shade) | 3, 1.5, .08, .05, 1.62, .9 | 415 | approved | bare arms (before 415)
proceduralAnimation.ts:NORSE_BOARD (ahead, drop, inward) | .06, .05, .6 | 415 | approved | the hand-carried tray board (before 415)
visualEffects.ts:FLAME_JET (core, coreFar, shell, shellFar, shellAlpha, flicker, puffs, puff) + simulationSystem DRAGON_BREATH (seconds, ahead, down, chest) | .12, .7, .25, 1.3, .7, .18, 5, .35; .7, .4, .3, .9 | 416 | approved | a lobbed fireball (before 416)
dynastyDress.ts:DRAGON_FORM (skull, headY, headZ, gape, tongue, segs, seg, bodyY, bodyTail, sway, fin) | .62 (size 2 at 417), 1.95, .5, .2, [.17,.55], 9, [.36,.32,.36], 1.3, .85, .18, .14 | 417 | approved | size 1, headY 1.45, headZ .45 (416); dragon_head mask hat (before 416)
vehicleBuilder.ts:HWACHA_RACK (cols, rows, cell, post, lath, depth, seatY, seatZ, lean, headSize, headLong, wood) | 10, 6, .11, .06, .018, .22, .5, .12, .22, .36, 1.3, (.72,.45,.24) | 416 | approved | team box, 6x5 tubes, tilt 1.15 (before 416)
projectileSystem.ts:HWACHA_ROCKET (long, shaft, tube, wide, bands, head, flame) | .7, .025, .24, .07, 3, .09, .42 | 416 | approved | .4 shaft, flame ball (before 416)
dynastyDress.ts:MONKEY_STAFF (long, thick, offset, end, endWide, bands) + MONKEY_TAIL (root, tip, path to 1.08 up) | 1.35, .024, .12, .2, 1.25, 2; .045, .035 | 416 | approved | bo_staff .85 (before 416); no tail
propBuilder.ts:KATANA_STEEL | (.62,.64,.68) glow .12 | 416 | approved | (.9,.9,.95) metal preset (rendered near-black)
simulationSystem.ts:BO_SHOVE dynasty.monk (speed, lift) | 4.2, 2.4 | 417 | approved | no throw (before 417)
dynastyDress.ts:ARCHER_ROBE (out, deep, lapel, cross, sash, sashAt, skirt, skirtTop, skirtFoot, sashColor) | 1.14, 1.2, .13, .5, .14, .1, .95, 1.4, 1.65, (.72,.4,.16) | 417 | approved | tunic box (before 417)
dynastyDress.ts:DRAGON_CARRIER (every, leg, legLong, trunk, head, arm, grip) | 3, .09, .45, [.26,.32,.16], .17, .06, .16 | 417 | approved | no carriers (before 417)
simulationSystem.ts:SAMURAI_BLOCK (warn, cooldown) + visualEffects SLASH_ARC (arc, radius, band, tilt, sweep, seconds) | .12, .5; 2.2, .75, .16, .6, .7, .3 | 417 | approved | no block (before 417)
