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

424 | MONKEY_CROWN leaf feathers, gold spine (87217f77) | dynasty.monkey_king.a | approved
424 | DRAGON_MUZZLE squared snout, lip rim, diamonds (576ac9b3) | dynasty.dragon.a | approved
424 | FRONT_GRIP orange-red head pole, wrapped grip (8ceb87bb) | dynasty.dragon.b | approved
424 | off-hand pistol, _aimPistol both arms (785cfeb0) | pirate.flintlock.b | approved
424 | PIRATE_PANTS brown pants, turned cuff (87042b0e) | pirate.flintlock.a | approved
424 | PIRATE_SHORTS ripped tan shorts (d95ec795) | pirate.bomb_thrower.a | approved
424 | HARPOON_OFF_GRIP + _gripHarpoon (3f068837) | pirate.harpooner.b | approved
425 | TRICORN_BROWN fitted tricorn (75a4ea7d) | pirate.harpooner.a | approved
425 | HARPOON_REEL reel-in, taut rope (3f3fd30b, 443edc44) | pirate.harpooner.c | approved
425 | GUN_TOSS + disarmToFists (36eb9aaa) | pirate.flintlock.c | approved
425 | BLUNDERBUSS prop + BLUNDERBUSS_AIM (28779788) | pirate.blunderbuss.b | approved
425 | CANNON_WHEEL (5b429ac7, 396cefd1) | pirate.cannon.a | approved
425 | CUTLASS curved blade, queen off hand (e5226412) | pirate.pirate_queen.b | approved
425 | CUTLASS_SLASH (8b450772) | pirate.captain.c | approved
426 | CUTLASS_SLASH for the queen's blow, carried through a step (45024151) | pirate.pirate_queen.c | approved
426 | BLUNDERBUSS_RECOIL shooter thrown off his feet (fb6f0227) | pirate.blunderbuss.c | approved
426 | PISTOL_SHOT bell flash + ball streak (7e83d5a4) | pirate.flintlock.c | approved
426 | CANNON_SIGHT ring crosshair (bd059354) | pirate.cannon.a | approved
426 | BARREL_ARMOUR staves, hoops, straps (c311013a) | pirate.blunderbuss.a | approved
426 | OPEN_COAT team coat, tan lapels, white V (04163e67) | pirate.harpooner.a | approved
426 | [P] BLUNDERBUSS.long .62 -> .9 (d0bc1b09, reverted) | pirate.blunderbuss.b | rejected (ledger reversal)
426 | PIRATE_KICK + PIRATE_KICK_POSE (1ae5476f, 9476aac6) | pirate.harpooner.c | approved
427 | BOMB_SPIN + BOMB_SPIN_POSE, projectile at/flight (4e116860) | pirate.pirate_queen.c | approved
427 | BLUNDERBUSS_BLAST target launch (9afd1177) | pirate.blunderbuss.c | approved
427 | PLANK_HAT (01fa4757) | pirate.blunderbuss.a | approved
427 | LAUNCH.cannonball flat shot (5adcac44) | pirate.cannon.c | approved
427 | DRAGON_PISTOL + lone off-hand hold (e5f2be6b, d63a4705) | pirate.captain.b | approved
427 | QUEEN_BANDANA (2a45e931) | pirate.pirate_queen.a | approved
427 | MONKEY_RUYI staff replaces MONKEY_STAFF (13e19096) | dynasty.monkey_king.b | approved
428 | DRAGON_BLAST pistol shot from the bell, spawnPistolShot blast (29111559) | pirate.captain.c | approved
428 | CAPTAIN_COAT open knee coat, shirt, cravat; no tunic skirt (9fb9986c) | pirate.captain.a | approved
428 | QUEEN_SASH strap + four bombs (72765079, cfa8f57b) | pirate.pirate_queen.a | approved
428 | BARREL_BRACERS stave arm cuffs (d6d8e60a) | pirate.blunderbuss.a | approved
428 | CANNON_HANDLES rider behind the breech on two handles (8009017b, 0a24e9b0) | pirate.cannon.b | approved
428 | CANNON_SHIRT white shell, team bands, striped sleeves (a478d4ce) | pirate.cannon.a | approved
428 | MONKEY_TRUNK slim trunk + shoulders, waist wrap (eea59cc5) | dynasty.monkey_king.a | approved

## Spent (never retry as [P])

## Rows

viking 401-403 rows (ICE_ARCHER_MANTLE, ICE_ARCHER_EYE_CLEAR, VIKING_BEARD, JARL_BEARD, HEADBUTTER_KIT, LONGSHIP_SHIP, LONGSHIP_HURL.sink) | compacted 409 | 403 | approved | values: git show 2ccd9f2:loop/LEDGER.md
viking 392-409 rows (BEARDED_AXE, JARL_AXE, LEAP_AIR, HEADBUTT, LONGSHIP_*, HEADBUTTER_KIT/BRAID/HAIR/COPPER, ICE_BOW, FROST, BRAWLER_*, JUMP_CHARGE, FLY, VALKYRIE_WINGS) | compacted 411 | 409 | approved | values: git show 186849d:loop/LEDGER.md, 4778c43, cdc71a4
viking done 403-409 rows (LONGSHIP_OARS/gunwale/SHEER/PLANKS/PROW/STERN, ICE_ARCHER_BAND/SNOWCAP/COAT, ICE_BOW, ICE_UPRIGHT, HEADBUTTER_LEGS/TUNIC, headbutter legLength, JARL_REST) | compacted 424 | 409 | approved | values: git show 3f068837:loop/LEDGER.md
viking done rows (JARL_PELT, JARL_BEARD_RUN, JARL_BELT, JARL_WRAPS, JARL_FLAPS, JARL_CRESCENT, HEADBUTTER_CAP, LONGSHIP_CARRIER) | compacted 416 | 409 | approved | values: git show a312f052:loop/LEDGER.md
dynasty.monk + viking.brawler done (MONK_STAFF + MONK_REST, MONK_SWING, MONK_TROUSERS, MONK_ARM_PLATES, BRAWLER_BEARD, BRAWLER_HATCHET, NORSE_BOARD, FIRST_LUNGE) | compacted 419 | 418 | approved | values: git show f1bce224:loop/LEDGER.md
viking.valkyrie + ancient.zeus done (VALKYRIE_ARMOUR/COLLAR/HELM/SWORD, SWORD_WINGS, ZEUS_TOGA + .boltGap, ZEUS_BEARD, glowLayer group 0 / bolt group 1) | compacted 407 | 406 | approved | values: git show 978f707:loop/LEDGER.md
viking done 410-412 rows (LEG_WRAPS, ICE_ARCHER_QUIVER, ICE_NOCK, ICE_REST + grip seat) | compacted 413 | 412 | approved | values: git show e702238:loop/LEDGER.md
dynasty.ninja done 411-413 rows (NINJA_HOOD, SHURIKEN, NINJA_GI, SHURIKEN_FLIGHT, NINJA_TROUSERS) | compacted 415 | 413 | approved | values: git show 46161b8:loop/LEDGER.md
dynasty.* stats (cost, healthMultiplier, damageMultiplier, cooldownMultiplier, 7 units) | d PASS 7/7 | 411 | stats | values: git show cc4f7de
dynasty.samurai + firework_archer + monk done (KABUTO, KATANA_REST, KATANA_STEEL, SAMURAI_BLOCK + SLASH_ARC, SAMURAI_CUIRASS, SAMURAI_HAKAMA, ARCHER_HAIR, ARCHER_ROBE, ARCHER_LEGS, KASA_GOLD, FIREWORK_BOW/ROCKET/NOCK/BURST/REST, TENGU_MASK) | compacted 422 | 421 | approved | values: git show 268e1355:loop/LEDGER.md
visualEffects.ts:FLAME_JET (blobs, near, far, farPer, swell, lobes, lobe, lobeOff, flicker, fade; white, yellow) + simulationSystem DRAGON_BREATH (seconds, ahead, down, chest) | 12, .4, 1.4, .19, .35, 3, .5, .68, .14, .2; (1,.97,.85), (1,.78,.04); .7, .4, .3, .9 | 421 | approved | cones core .12->.7, shell .25->1.3 alpha .7, 5 puffs .35 (416-420); a lobbed fireball (before 416)
dynastyDress.ts:DRAGON_FORM (skull, headY, headZ, gape, tongue, segs, step, bodyY, bodyTail, sway, tall, taper, thick, scallop, fin, finWide, frillMix) | .62 (size 2 at 417), 1.95, .5, .2, [.2,.36], 9, .33, 1.45, 1.35, .18, .6 (on edge), .44, .05, .16, .13, .14, .4 | 422 | approved | band level wide .75, scallops .05 out on both edges (421); boxes seg [.36,.32,.36], dark cone fin .14, gold belly (416-420); dragon_head mask hat (before 416)
dynasty.hwacha done (HWACHA_RACK, HWACHA_ROCKET, HWACHA_WHEEL, LAUNCH_SMOKE, HWACHA_SHAFT, HWACHA_TIMBER) | compacted 421 | 420 | approved | values: git show 7f580c19:loop/LEDGER.md
dynastyDress.ts:MONKEY_RUYI (long, thick, centre, sleeve, sleeveWide, cap) + MONKEY_TAIL (root, tip) | 1.7, .017, .16, .25, 1.3, .05; .045, .035 | 427 | approved | MONKEY_STAFF 1.35, .024, offset .12 L, ends .2 (416-426); bo_staff .85 (before 416)
simulationSystem.ts:BO_SHOVE monk; monkey_king (speed, lift) | 4.2, 2.4; 8.5, 5.5 (418) | 417-418 | approved | no throw (before 417)
dynastyDress.ts:DRAGON_CARRIER (every, leg, legLong, trunk, head, arm, grip) | 3, .09, .35 (418; .45 at 417), [.26,.32,.16], .17, .06, .16 | 417 | approved | no carriers (before 417)
dynastyDress.ts:DRAGON_CARRIER.poleColor | (.85,.24,.12) | 418 | approved | team (417)
visualEffects.ts:BODY_FLAMES (tongues, spread, low, high, tall, wide, flicker) + DRAGON_BREATH.burn | 9, .2, .55, 1.35, .42, .17, 13; 3 | 419 | approved | none (before 419)
dynastyDress.ts:DRAGON_FORM.tongue [wide, long] (lies in the mouth) | .2, .36 | 419 | approved | .17, .55 hanging (416)
ancient.minotaur 402-415 rows (MINO_GIRDLE, MINO_SHELL, BULL_HEAD, MINO_STRAP + .clear, MINO_LEGS, MINO_BARREL, MINO_ARMS, BULL_MUZZLE, MINO_LATHE) | compacted 420 | 415 | approved | values: git show a1460c56:loop/LEDGER.md
ancientDress.ts:MINO_STRAP (wide, proud) + MINO_GIRDLE (lo, hi, proudX, proudZ; off MINO_BARREL.profile) + MINO_CAP (inX, atY, radius, squash, droop, rim, swirl) + unitVisuals minotaur scale | .2, .04; -.08, .3, 1.07, 1.09; .98, .94, .72, .55, .4, .14, .6; 1.4 | 420 | approved | strap .44/.32, girdle -.3/.03/1.03/1.1 off the pelvis, MINO_SHELL plank, scale 2.1 (402-419)
dynastyDress.ts:MONKEY_CROWN (feather, featherWide, belly, stem, flat, spine, spineProud, lean) | 2.3, .55, .4, .3, .18, .14, .6, .32 | 424 | approved | rod feathers 2.6 x .2, lean .3 (420-423); torus crown hat (before 420)
dynastyDress.ts:DRAGON_MUZZLE (bevel, tan, rim, rimDeep, diamonds, diamond, diamondAt, diamondStep, diamondUp) + FRONT_GRIP (long, wraps, band, out, twist) | .22, (.72,.54,.32), .05, .06, 2, .11, .45, .25, .25; .24, 5, .022, 1.75, .25 | 424 | approved | icosphere snout; team head pole, grip .18 (before 424)
dynastyDress.ts:DRAGON_CARRIER (arm, eye, hairTall, bun, fist, fistAt, poleAhead, elbowOut; arm material, fist material) | .075, .28, .22, .2, .09, .56, .07, .05; trousers, dark | 422 | approved | pole beside the head poleSide .17, fists at .99 h on one straight skin arm each (420-421; [P] 421 arm .1, fist .12 skin rejected as a ledger reversal); arm .06, pole through the head (417-419)
dynastyDress.ts:MONKEY_FACE (plate, chin, sideFrom, brow, muzzle, muzzleTop, muzzleOut, nose, tuft, 8 tufts; dark, tan, blond) | .1, -1.02, .7, .58, 1.1, -.3, .32, .5, .26; (.1,.06,.05), (.72,.54,.32), (.78,.56,.2) | 421 | approved | bare team head (before 421)
dynastyDress.ts:MONKEY_SHORTS (hipOut, puffAt, puff, kneeOut, kneeTo, cuffOut, shoeOut, shoeTall, toe, toeWide, toeLift, anklet, ankletOut) | 1.7, .5, 2.3, 1.45, .14, 1.6, 1.15, .78, 1.2, 1.5, .55, .4, 1.25 | 422 | approved | puff 2.7, hip 1.8, knee 1.5 (422.3, ballooned); slim trouser legs, plain boots (before 422)
dynastyDress.ts:MONKEY_ROBE (out, edge, deep, sleeveOut, sleeveTo, strip, stripLong, stripAt, proud, scarf, scarfThick, bib, bibLong) | 1.14, .12, 1.18, 1.55, .95, .06, .92, [-.62,-.26], .06, .72, .12, .42, .34 | 422 | approved | the tan accent trunk bare all round (before 422)
vehicleBuilder.ts:FRONT_SPLIT (hipOut, out, down, ahead, shinOut, shinAhead) + THROWER_SPLIT (out, down, ahead, shinOut, shinAhead) | .05, 1, .1, .12, .45, .1; 1, .3, .35, .6, .15 | 422 | approved | [R] reset: CREW_SEAT frontThigh -1.15/frontSplay .62/frontKnee .45 (Euler, crossed the knees) and THROWER_KNEES chest .55/out .2 targets (unreachable) (380-421); FRONT_SPLIT out .88/down .12/ahead .42 without the hip slide (403, rejected)
pirate 425-426 rows (TRICORN_BROWN, HARPOON_REEL, GUN_TOSS, BLUNDERBUSS + _AIM, CANNON_WHEEL, CUTLASS, CUTLASS_SLASH, PIRATE_KICK, BLUNDERBUSS_RECOIL, PISTOL_SHOT, BARREL_ARMOUR, OPEN_COAT, CANNON_SIGHT) | compacted 428 | 426 | approved | values: git show 0445ba6b:loop/LEDGER.md
pirate 423-424 rows (PISTOL + PISTOL_AIM, HARPOON_BREECH, CANNON_BARREL, TRICORN_PLATE, PIRATE_VEST, PIRATE_PANTS + PIRATE_SHORTS) | compacted 427 | 424 | approved | values: git show 613ba5b9:loop/LEDGER.md
simulationSystem.ts:BOMB_SPIN (within, crowd, cooldown, rate, drop, after, count, out, flight, splash, damage, rise) + BOMB_SPIN_POSE (out, head, tuck) | 3, 3, 8, 16, .3, .7, 7, 2.6, .55, 3.5, .67, 9; 1.45, .25, .35 | 427 | approved | no spin (before 427)
simulationSystem.ts:BLUNDERBUSS_BLAST (fling, lift) | 6, 7 | 427 | approved | pellets only (before 427)
pirateDress.ts:PLANK_HAT (boards, wide, deep, thick, gap, sit, tilt, batten; brown) | 3, 2.5, 1.6, .17, .03, .06, .1, 1.1; (.4,.22,.12) | 427 | approved | bandana cap (before 427)
projectileSystem.ts:LAUNCH.cannonball (speed, gravity) | 45, 9.8 | 427 | approved | fixed lob speed 10, arc .4 of range (before 427)
propBuilder.ts:DRAGON_PISTOL (long, bore, bell, mouth; rest PISTOL) | .36, .12, .26, 4.2 | 427 | approved | no off-hand gun (before 427)
pirateDress.ts:QUEEN_BANDANA (out, brow, top, sink, flap, below, proud, slant, knot, tail, splay) | 1.1, .06, 1.14, .04, .95, .12, .1, .32, .36, .75, .35 | 427 | approved | black pirate_hat (before 427)
simulationSystem.ts:DRAGON_BLAST (range, cooldown, warmup, damage, fling, lift, flash) + projectileSystem spawnPistolShot blast | 3, 2, .4, .42, 7, 3.5, 2.4 | 428 | approved | no shot (before 428)
pirateDress.ts:CAPTAIN_COAT (out, deep, shirt, proud, cravat, cravatLong, cravatProud, edge, back, front, long, flare, thick, hem) | 1.12, 1.22, .36, .04, .24, .26, .1, .07, 1.2, .42, 1.35, .1, .12, .07 | 428 | approved | pirate_tar tunic + tunicSkirt (before 428)
pirateDress.ts:QUEEN_SASH (wide, thick, fromX, over, toX, toY, proud, bomb, at, seat; brown, black) | .17, .08, .72, .04, -.86, -.92, .03, .2, [.14,.36,.58,.8], .75; (.24,.13,.065), (.035,.035,.04) | 428 | approved | none (before 428)
pirateDress.ts:BARREL_BRACERS (staves, out, from, to, upFrom, upTo, wide, thick, strap, strapAt, strapOut) | 8, 1.5, .12, .92, .2, .8, 1.12, .22, .13, [.2,.8], .12 | 428 | approved | bare arms (before 428)
vehicleBuilder.ts:CANNON_HANDLES (rider, x, y, z, lean, hipBack, hipFwd, knee, grip, gripWide, knob, blockTop) | .66, .24, .72, -.36, .2, .25, -.3, .3, .1, .035, .05, .5 | 428 | approved | y .57 x .2 (428.5); rider .46 shoving the wheel rim (before 428)
pirateDress.ts:CANNON_SHIRT (top, under, out, sleeve, sleeveTo, band, bandAt; white) | .9, 1, 1.06, 1.4, .55, .22, .28; (.9,.88,.84) | 428 | approved | tan crewHoop bands on team (before 428)
dynastyDress.ts:MONKEY_TRUNK (narrow, wraps, wrap, wrapOut, deep, step, tilt) | .7, 2, .11, 1.18, 1.25, .94, .08 | 428 | approved | full-width trunk (before 428)
