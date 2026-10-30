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

418 | FIREWORK_BURST + blast (ceb67f2b, 20d32730) | dynasty.firework_archer.c | approved
418 | FIREWORK_NOCK (e9d4c966, 88c49c12) | dynasty.firework_archer.b | approved
418 | [P] carrier poles (e5fcbad5) | dynasty.dragon.b | approved
418 | block at his blade (073a4c36, 33baf14d) | dynasty.samurai.c | approved
418 | BO_SHOVE monkey_king (0c817d95) | dynasty.monkey_king.c | approved
418 | FIRST_LUNGE (3c3337d0; evidence ff56094b) | viking.brawler.c | approved
418 | HWACHA_WHEEL (914ede94) | dynasty.hwacha.a | approved
419 | LAUNCH_SMOKE (eab9d337) | dynasty.hwacha.c | approved
419 | HWACHA_SHAFT + timber bed (3d8cd05d) | dynasty.hwacha.a | approved
419 | BODY_FLAMES (70c80e29) | dynasty.dragon.c | approved
419 | tongue in the mouth (aff1befb) | dynasty.dragon.a | approved
419 | SAMURAI_CUIRASS (95700a8c) | dynasty.samurai.a | approved
419 | FIREWORK_NOCK rebuilt (efc224ec) | dynasty.firework_archer.b | approved
420 | [R] MINO_STRAP flat, MINO_GIRDLE off the barrel, MINO_CAP, scale 1.4 (637255a6, 4eb34cd7) | ancient.minotaur.a | approved
420 | SAMURAI_HAKAMA (69c590af) | dynasty.samurai.a | approved
420 | DRAWS_BEFORE_LOOSE firework (1cb514fd) | dynasty.firework_archer.c | approved
420 | FIREWORK_REST upright bow (59a5baca) | dynasty.firework_archer.b | approved
420 | MONKEY_CROWN (6c4aff46) | dynasty.monkey_king.a | approved
420 | DRAGON_CARRIER heads + poles beside (0f7dd79c) | dynasty.dragon.a | approved
420 | [P] HWACHA_TIMBER (3d24020e) | dynasty.hwacha.a | approved
421 | FLAME_JET plume of white balls with yellow lobes (ba799e89, 8027d61c) | dynasty.dragon.c | approved
421 | DRAGON_FORM flat band, scallops, pale fins (0a4f9754, 87e08299) | dynasty.dragon.a | approved
421 | [P] DRAGON_CARRIER fists skin .12, arm .1 (91a86b90, reverted) | dynasty.dragon.b | rejected (ledger reversal)
421 | KABUTO hexagon-plate shikoro + maedate (a810cff1) | dynasty.samurai.a | approved
421 | ARCHER_LEGS shin wraps + strapSandals (1801625a) | dynasty.firework_archer.a | approved
421 | MONKEY_FACE baboon face (2dc865d6) | dynasty.monkey_king.a | approved
422 | DRAGON_CARRIER two-box arms to fists on the pole at the chest (bf9ce7a9) | dynasty.dragon.b | pending
422 | DRAGON_FORM band on edge, scallop fringe below, fins on top (e7926245) | dynasty.dragon.a | pending
422 | MONKEY_SHORTS puffy shorts, gold cuffs, pointy shoes (8db34616, b9adb0a3) | dynasty.monkey_king.a | pending
422 | MONKEY_ROBE half robe, gold strips, scarf (6ff201bb) | dynasty.monkey_king.a | pending

## Spent (never retry as [P])

## Rows
viking 401-403 rows (ICE_ARCHER_MANTLE, ICE_ARCHER_EYE_CLEAR, VIKING_BEARD, JARL_BEARD, HEADBUTTER_KIT, LONGSHIP_SHIP, LONGSHIP_HURL.sink) | compacted 409 | 403 | approved | values: git show 2ccd9f2:loop/LEDGER.md
ancient 379-397 rows (MINO_*, BULL_*, SARISSA_*, SNAKE_*, BALLISTA_*, ZEUS_*, SCUTUM/LORICA/ASPIS/DORY, HOPLITE_*, CORINTH_*, BIG_HEADBUTT) | compacted 412 | 397 | approved | values: git show 8f53efc / fad9e5c / 522cb46 / f31835b :loop/LEDGER.md
farmer.halfling done (HALFLING_STANCE, HALFLING_SHORTS + _CLOTH, shinLength 1.95, HALFLING_TUFT, VEST_CUT, COAT, SHAGGY) | compacted 404 | 402 | approved | values: git show 244af97:loop/LEDGER.md
viking.* stats (cost, healthMultiplier, damageMultiplier, cooldownMultiplier, 7 units) | d PASS 7/7 | 391 | stats | values: git show e5a0cb5
viking 392-409 rows (BEARDED_AXE, JARL_AXE, LEAP_AIR, HEADBUTT, LONGSHIP_*, HEADBUTTER_KIT/BRAID/HAIR/COPPER, ICE_BOW, FROST, BRAWLER_*, JUMP_CHARGE, FLY, VALKYRIE_WINGS) | compacted 411 | 409 | approved | values: git show 186849d:loop/LEDGER.md, 4778c43, cdc71a4
viking a/b/c rows (LONGSHIP_OARS, LONGSHIP_CREW, LONGSHIP_HULL, ICE_ARROW, JARL_PELT) | compacted 403 | 401 | approved | values: git show 73e45c7:loop/LEDGER.md
simulationSystem.ts:LONGSHIP_OARS (reach, damage, push) + vehicleBuilder OAR_CHOP (period, strike, up, down, elbow, spread) | 1.5, 12, 1.2; 1.1, .3, -2.75, -.55, -.3, .14 | 403 | approved | the oars dropped at the crash (396-402)
viking done rows (JARL_PELT, JARL_BEARD_RUN, JARL_BELT, JARL_WRAPS, JARL_FLAPS, JARL_CRESCENT, HEADBUTTER_CAP, LONGSHIP_CARRIER) | compacted 416 | 409 | approved | values: git show a312f052:loop/LEDGER.md
viking c/done rows (BERSERKER_ARMPITS, BRAWLER_HELM, DIVE, HEADBUTT + SPRAWL.delay, headbuttSprawl) | compacted 406 | 401 | approved | values: git show 9c743e0:loop/LEDGER.md

vehicleBuilder.ts:LONGSHIP gunwale material + wrapAsBody source | darkWood; first longshipShield face | 404 | approved | teamPrimary rails as the body source (392-403)
vikingDress.ts:ICE_ARCHER_BAND (leather, rivet, glow, rivets, rivetSize, rivetProud) | (.26,.12,.06), (.5,.48,.44), .14, 8, .42, .8 | 405 | approved | the brim a pale fur roll ICE_ARCHER_FUR (396-404)
propBuilder.ts:ICE_BOW (thick, taper, bow, recurve, crust, flake, flakeLift, tip) | .04, .5, .1, .035, 4, .07, .22, .06 | 406 | approved | thick .062 taper .45 bow .06, fringe 6 x .15, crowns 4 x .16, snow .105 (392-405)
vehicleBuilder.ts:longship SHEER (half, pinch, pow, rise, bow, segs) | 1.3, .8, 3, .34, 1.25, 12 | 406 | approved | straight strakes 2.56-.16r, straight rails 2.42, flat deck .82 x 2.34 (392-405)
unitVisuals.ts:viking.headbutter legLength + proceduralAnimation standSquare | .92 default, hip-shot idle (reverted) | 406 | rejected | 1.22 + HALBERD_SQUARE stance rejected 406: upright but belt-to-sole unmoved (41%)
vehicleBuilder.ts:longship PLANKS (count, wide) + shieldDark/shieldBoss | 3, .035; (.14,.08,.05)/(.2,.13,.08) | 405 | approved | a dark half disc (.1,.11,.16), boss (.56,.36,.15) (395-404)
dynasty.monk + viking.brawler done (MONK_STAFF + MONK_REST, MONK_SWING, MONK_TROUSERS, MONK_ARM_PLATES, BRAWLER_BEARD, BRAWLER_HATCHET, NORSE_BOARD, FIRST_LUNGE) | compacted 419 | 418 | approved | values: git show f1bce224:loop/LEDGER.md
vikingDress.ts:HEADBUTTER_LEGS + unitVisuals headbutter shinLength/torsoLength | hemTo .62, hemOut 1.44, cuff .58-.76, bootFrom .74; 1.75, .82 | 407 | approved | the BRAWLER_LEGS cut, shin 1, torso 1 (405-406)
proceduralAnimation.ts:ICE_UPRIGHT (raise, out, elbow, tip, yaw, stagger, give) | -.85, -.2, -1.3, [.16,1,.06], .12, .06, .02 | 407 | approved | the hashed bowman hold (before 407); tip [-.42,1,.12] raise -.7 (407.5)
viking.valkyrie + ancient.zeus done (VALKYRIE_ARMOUR/COLLAR/HELM/SWORD, SWORD_WINGS, ZEUS_TOGA + .boltGap, ZEUS_BEARD, glowLayer group 0 / bolt group 1) | compacted 407 | 406 | approved | values: git show 978f707:loop/LEDGER.md
vikingDress.ts:HEADBUTTER_TUNIC (out, deep, sleeve, sleeveOut, glow) | 1.05, 1.08, .42, 1.2, .12 | 408 | approved | the viking_fur-tinted trunk + body-material tunicSkirt (before 408)
vikingDress.ts:ICE_ARCHER_SNOWCAP (lumps, out, big, small, spread, sit, squash) | 4, .4, .2, [.7,.6,.55], .09, .05, .75 | 408 | approved | ICE_ARCHER_MANTLE ring + 10 points + 8 lumps (402-407)
proceduralAnimation.ts:JARL_REST (ahead, inward, drop, across, forward) | .12, .02, .36, .95, .2 | 408 | approved | HALBERD_REST upright .05 tilt (392-407)
vehicleBuilder.ts:LONGSHIP_PROW (lift, root, tip, eye, path) | .75, .11, .085, .2, S from (.95,1.3) to (2.0,1.38) | 408 | approved | neck box .18x.66 at y .9, bead eyes .1 (392-407)
vehicleBuilder.ts:LONGSHIP_STERN (post, r0, r1, turns, root, mid, tip) | [y,z] (.45,-1.26)..(1.5,-1.52), .2, .05, 1.25, .12, .08, .04 | 409 | approved | stern post cylinder .82 + two scroll cylinders at y 1.0 (400-408)
vikingDress.ts:ICE_ARCHER_COAT (out, deep, sleeveOut, cuffTo, belt, beltAt, beltOut, skirt, flare, glow; leather) | 1.06, 1.1, 1.15, .88, .11, .08, 1.08, .8, 1.4, .12; (.26,.12,.06) | 409 | approved | the viking_fur trunk + body tunicSkirt .45/1.5 (before 409)
viking done 410-412 rows (LEG_WRAPS, ICE_ARCHER_QUIVER, ICE_NOCK, ICE_REST + grip seat) | compacted 413 | 412 | approved | values: git show e702238:loop/LEDGER.md
dynasty.ninja done 411-413 rows (NINJA_HOOD, SHURIKEN, NINJA_GI, SHURIKEN_FLIGHT, NINJA_TROUSERS) | compacted 415 | 413 | approved | values: git show 46161b8:loop/LEDGER.md
dynasty.* stats (cost, healthMultiplier, damageMultiplier, cooldownMultiplier, 7 units) | d PASS 7/7 | 411 | stats | values: git show cc4f7de
dynastyDress.ts:TENGU_MASK (plate, chin, shade, brow, browTall, scowl, nose, noseOut, noseWide, mouth, mouthY, fang) | 1.04, -.92, .72, .62, .16, .38, .42, .3, .3, .9, -.6, .2 | 412 | approved | bare face (before 412)
dynastyDress.ts:ARCHER_HAIR (clear, top, out, capDeep, fall, fallOut, side, sideDrop, sideFrom, bun) | .08, 1.14, 1.1, 2.1, 2.6, .22, .2, -.85, .35, .42 | 412 | approved | conical_hat (before 412)
propBuilder.ts:KASA_GOLD + kasa cone team colour | (.86,.62,.18) | 413 | approved | accent cone, accent x.55 band (before 413)
propBuilder.ts:FIREWORK_BOW (long, cap, capColor) | 1.15, .12, (.92,.5,.12) | 413 | approved | plain bow (before 413)
projectileSystem.ts:FIREWORK_ROCKET (long, wide, bands, head, flame, arc) | .5, .13, 3, .14, .32, .1 | 413 | approved | .3x.04 stick, arc .25 (before 413)
dynastyDress.ts:KABUTO (clear, top, bowlFoot, bowlTop, peak, tiers, facets, lame, step, flareTop, shoulder, rim, maedate, maedateFoot, maedateTop, maedateLean) | .04, 1.3, 2.3, 1.4, .42, 4, 4, .42, .36, 2.4, 1.0, .09, 1.0, .3, .95, .18 | 421 | approved | 3 arc lames .32/.3, flare 2.3->2.75, arc .55 turn pi(.5-arc), disc crest .42 (414-420); arc .64 (413); samurai_helmet (before 413)
proceduralAnimation.ts:KATANA_REST (ahead, drop, lean, under, settle) | .16, .24, .12, .9, .8; flat to his side, swing along the forearm | 415 | approved | flat facing him, no settle (414); one-hand shoulder carry (before 414)
visualEffects.ts:FLAME_JET (blobs, near, far, farPer, swell, lobes, lobe, lobeOff, flicker, fade; white, yellow) + simulationSystem DRAGON_BREATH (seconds, ahead, down, chest) | 12, .4, 1.4, .19, .35, 3, .5, .68, .14, .2; (1,.97,.85), (1,.78,.04); .7, .4, .3, .9 | 421 | approved | cones core .12->.7, shell .25->1.3 alpha .7, 5 puffs .35 (416-420); a lobbed fireball (before 416)
dynastyDress.ts:DRAGON_FORM (skull, headY, headZ, gape, tongue, segs, step, bodyY, bodyTail, sway, tall, taper, thick, scallop, fin, finWide, frillMix) | .62 (size 2 at 417), 1.95, .5, .2, [.2,.36], 9, .33, 1.45, 1.35, .18, .6 (on edge), .44, .05, .16, .13, .14, .4 | 422 | pending | band level wide .75, scallops .05 out on both edges (421); boxes seg [.36,.32,.36], dark cone fin .14, gold belly (416-420); dragon_head mask hat (before 416)
dynasty.hwacha done (HWACHA_RACK, HWACHA_ROCKET, HWACHA_WHEEL, LAUNCH_SMOKE, HWACHA_SHAFT, HWACHA_TIMBER) | compacted 421 | 420 | approved | values: git show 7f580c19:loop/LEDGER.md
dynastyDress.ts:MONKEY_STAFF (long, thick, offset, end, endWide, bands) + MONKEY_TAIL (root, tip, path to 1.08 up) | 1.35, .024, .12, .2, 1.25, 2; .045, .035 | 416 | approved | bo_staff .85 (before 416); no tail
propBuilder.ts:KATANA_STEEL | (.62,.64,.68) glow .12 | 416 | approved | (.9,.9,.95) metal preset (rendered near-black)
simulationSystem.ts:BO_SHOVE monk; monkey_king (speed, lift) | 4.2, 2.4; 8.5, 5.5 (418) | 417-418 | approved | no throw (before 417)
dynastyDress.ts:ARCHER_ROBE (out, deep, lapel, cross, sash, sashAt, skirt, skirtTop, skirtFoot, sashColor) | 1.14, 1.2, .13, .5, .14, .1, .95, 1.4, 1.65, (.72,.4,.16) | 417 | approved | tunic box (before 417)
dynastyDress.ts:DRAGON_CARRIER (every, leg, legLong, trunk, head, arm, grip) | 3, .09, .35 (418; .45 at 417), [.26,.32,.16], .17, .06, .16 | 417 | approved | no carriers (before 417)
simulationSystem.ts:SAMURAI_BLOCK (warn, reach, ahead, chest, flick, cooldown) + visualEffects SLASH_ARC (arc, radius, band, tilt, sweep, seconds) | .5, 1.3, .6, 1.0, .3, .5 (418; warn .12 at 417); 2.2, .75, .16, .6, .7, .3 | 418 | approved | no block (before 417)
dynastyDress.ts:DRAGON_CARRIER.poleColor | (.85,.24,.12) | 418 | approved | team (417)
visualEffects.ts:FIREWORK_BURST (sparks, radius, grow, seconds, lift) + projectileSystem FIREWORK_BLAST (radius, share) | 26, 1.25, .45, .65, .9; 2.5, 1 | 418 | approved | no burst (before 418)
propBuilder.ts:FIREWORK_NOCK (long, wide, side, back, ring, head, shaft, nock) | .3, .08, .05, .02, 1.3, .1, .012, .12 | 419 | approved | .22, .045 (418.2b); .36, .075 (418.2)
visualEffects.ts:BODY_FLAMES (tongues, spread, low, high, tall, wide, flicker) + DRAGON_BREATH.burn | 9, .2, .55, 1.35, .42, .17, 13; 3 | 419 | approved | none (before 419)
dynastyDress.ts:DRAGON_FORM.tongue [wide, long] (lies in the mouth) | .2, .36 | 419 | approved | .17, .55 hanging (416)
dynastyDress.ts:SAMURAI_CUIRASS (out, deep, rows, row, rowsFrom, rowsTo, rim, sode, sodeOut) | 1.12, 1.18, 4, .035, .3, .85, .09, .5, 1.75 | 419 | approved | tunic box (before 419)
ancient.minotaur 402-415 rows (MINO_GIRDLE, MINO_SHELL, BULL_HEAD, MINO_STRAP + .clear, MINO_LEGS, MINO_BARREL, MINO_ARMS, BULL_MUZZLE, MINO_LATHE) | compacted 420 | 415 | approved | values: git show a1460c56:loop/LEDGER.md
ancientDress.ts:MINO_STRAP (wide, proud) + MINO_GIRDLE (lo, hi, proudX, proudZ; off MINO_BARREL.profile) + MINO_CAP (inX, atY, radius, squash, droop, rim, swirl) + unitVisuals minotaur scale | .2, .04; -.08, .3, 1.07, 1.09; .98, .94, .72, .55, .4, .14, .6; 1.4 | 420 | approved | strap .44/.32, girdle -.3/.03/1.03/1.1 off the pelvis, MINO_SHELL plank, scale 2.1 (402-419)
dynastyDress.ts:SAMURAI_HAKAMA (hipOut, kneeOut, kneeTo, greave, rim, bands, band, bandOut) | 1.9, 2.6, .28, 1.4, .08, 2, .06, 1.5 | 420 | approved | bare legs (before 420)
proceduralAnimation.ts:FIREWORK_REST (across, forward) | .16, .1 | 420 | approved | ICE_REST .42/.12 never applied to her (no split string) (413-419)
dynastyDress.ts:MONKEY_CROWN (band, at, thick, swirl, side, feather, featherWide, lean, back, bead) | 1.1, .72, .1, .32, .78, 2.6, .2, .3, .12, .14 | 420 | approved | torus crown hat (before 420)
dynastyDress.ts:DRAGON_CARRIER (arm, eye, hairTall, bun, fist, fistAt, poleAhead, elbowOut; arm material, fist material) | .075, .28, .22, .2, .09, .56, .07, .05; trousers, dark | 422 | pending | pole beside the head poleSide .17, fists at .99 h on one straight skin arm each (420-421; [P] 421 arm .1, fist .12 skin rejected as a ledger reversal); arm .06, pole through the head (417-419)
dynastyDress.ts:ARCHER_LEGS (from, wrap, bands, band, bandOut, shade, bandShade, sandal) | .04, 1.28, 5, .09, 1.44, .8, .66, (.62,.3,.1) | 421 | approved | plain legs and boots (before 421)
dynastyDress.ts:MONKEY_FACE (plate, chin, sideFrom, brow, muzzle, muzzleTop, muzzleOut, nose, tuft, 8 tufts; dark, tan, blond) | .1, -1.02, .7, .58, 1.1, -.3, .32, .5, .26; (.1,.06,.05), (.72,.54,.32), (.78,.56,.2) | 421 | approved | bare team head (before 421)
dynastyDress.ts:MONKEY_SHORTS (hipOut, puffAt, puff, kneeOut, kneeTo, cuffOut, shoeOut, shoeTall, toe, toeWide, toeLift, anklet, ankletOut) | 1.7, .5, 2.3, 1.45, .14, 1.6, 1.15, .78, 1.2, 1.5, .55, .4, 1.25 | 422 | pending | puff 2.7, hip 1.8, knee 1.5 (422.3, ballooned); slim trouser legs, plain boots (before 422)
dynastyDress.ts:MONKEY_ROBE (out, edge, deep, sleeveOut, sleeveTo, strip, stripLong, stripAt, proud, scarf, scarfThick, bib, bibLong) | 1.14, .12, 1.18, 1.55, .95, .06, .92, [-.62,-.26], .06, .72, .12, .42, .34 | 422 | pending | the tan accent trunk bare all round (before 422)
