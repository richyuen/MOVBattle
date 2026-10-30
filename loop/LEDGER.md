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
422 | DRAGON_CARRIER two-box arms to fists on the pole at the chest (bf9ce7a9) | dynasty.dragon.b | approved
422 | DRAGON_FORM band on edge, scallop fringe below, fins on top (e7926245) | dynasty.dragon.a | approved
422 | MONKEY_SHORTS puffy shorts, gold cuffs, pointy shoes (8db34616, b9adb0a3) | dynasty.monkey_king.a | approved
422 | MONKEY_ROBE half robe, gold strips, scarf (6ff201bb) | dynasty.monkey_king.a | approved
422 | [R] FRONT_SPLIT + THROWER_SPLIT riders' split, unparked by hand (4c36f7da) | farmer.wheelbarrow.a | approved
423 | PISTOL prop + _aimPistol held out (5b56edc3, caf27b2a) | pirate.flintlock.b | approved
423 | HARPOON_BREECH team block under a carry handle (3f4bf980, 18f56ed9) | pirate.harpooner.b | approved
423 | CANNON_BARREL long lathe barrel proud of the carriage (b1f1f4aa) | pirate.cannon.b | approved
423 | TRICORN_PLATE skull + crossbones on the front wall (f22c1648) | pirate.captain.a | approved
423 | PIRATE_VEST open vest over a bare chest (e6ed0749) | pirate.flintlock.a | approved
423 | PIRATE_VEST on the bomb thrower (9bb121db) | pirate.bomb_thrower.a | approved
424 | MONKEY_CROWN leaf feathers, gold spine (87217f77) | dynasty.monkey_king.a | approved
424 | DRAGON_MUZZLE squared snout, lip rim, diamonds (576ac9b3) | dynasty.dragon.a | approved
424 | FRONT_GRIP orange-red head pole, wrapped grip (8ceb87bb) | dynasty.dragon.b | approved
424 | off-hand pistol, _aimPistol both arms (785cfeb0) | pirate.flintlock.b | approved
424 | PIRATE_PANTS brown pants, turned cuff (87042b0e) | pirate.flintlock.a | approved
424 | PIRATE_SHORTS ripped tan shorts (d95ec795) | pirate.bomb_thrower.a | approved
424 | HARPOON_OFF_GRIP + _gripHarpoon (3f068837) | pirate.harpooner.b | approved

## Spent (never retry as [P])

## Rows
viking 401-403 rows (ICE_ARCHER_MANTLE, ICE_ARCHER_EYE_CLEAR, VIKING_BEARD, JARL_BEARD, HEADBUTTER_KIT, LONGSHIP_SHIP, LONGSHIP_HURL.sink) | compacted 409 | 403 | approved | values: git show 2ccd9f2:loop/LEDGER.md
farmer.halfling done (HALFLING_STANCE, HALFLING_SHORTS + _CLOTH, shinLength 1.95, HALFLING_TUFT, VEST_CUT, COAT, SHAGGY) | compacted 404 | 402 | approved | values: git show 244af97:loop/LEDGER.md
viking 392-409 rows (BEARDED_AXE, JARL_AXE, LEAP_AIR, HEADBUTT, LONGSHIP_*, HEADBUTTER_KIT/BRAID/HAIR/COPPER, ICE_BOW, FROST, BRAWLER_*, JUMP_CHARGE, FLY, VALKYRIE_WINGS) | compacted 411 | 409 | approved | values: git show 186849d:loop/LEDGER.md, 4778c43, cdc71a4
viking a/b/c rows (LONGSHIP_OARS, LONGSHIP_CREW, LONGSHIP_HULL, ICE_ARROW, JARL_PELT) | compacted 403 | 401 | approved | values: git show 73e45c7:loop/LEDGER.md
viking done 403-409 rows (LONGSHIP_OARS/gunwale/SHEER/PLANKS/PROW/STERN, ICE_ARCHER_BAND/SNOWCAP/COAT, ICE_BOW, ICE_UPRIGHT, HEADBUTTER_LEGS/TUNIC, headbutter legLength, JARL_REST) | compacted 424 | 409 | approved | values: git show 3f068837:loop/LEDGER.md
viking done rows (JARL_PELT, JARL_BEARD_RUN, JARL_BELT, JARL_WRAPS, JARL_FLAPS, JARL_CRESCENT, HEADBUTTER_CAP, LONGSHIP_CARRIER) | compacted 416 | 409 | approved | values: git show a312f052:loop/LEDGER.md
viking c/done rows (BERSERKER_ARMPITS, BRAWLER_HELM, DIVE, HEADBUTT + SPRAWL.delay, headbuttSprawl) | compacted 406 | 401 | approved | values: git show 9c743e0:loop/LEDGER.md

dynasty.monk + viking.brawler done (MONK_STAFF + MONK_REST, MONK_SWING, MONK_TROUSERS, MONK_ARM_PLATES, BRAWLER_BEARD, BRAWLER_HATCHET, NORSE_BOARD, FIRST_LUNGE) | compacted 419 | 418 | approved | values: git show f1bce224:loop/LEDGER.md
viking.valkyrie + ancient.zeus done (VALKYRIE_ARMOUR/COLLAR/HELM/SWORD, SWORD_WINGS, ZEUS_TOGA + .boltGap, ZEUS_BEARD, glowLayer group 0 / bolt group 1) | compacted 407 | 406 | approved | values: git show 978f707:loop/LEDGER.md
viking done 410-412 rows (LEG_WRAPS, ICE_ARCHER_QUIVER, ICE_NOCK, ICE_REST + grip seat) | compacted 413 | 412 | approved | values: git show e702238:loop/LEDGER.md
dynasty.ninja done 411-413 rows (NINJA_HOOD, SHURIKEN, NINJA_GI, SHURIKEN_FLIGHT, NINJA_TROUSERS) | compacted 415 | 413 | approved | values: git show 46161b8:loop/LEDGER.md
dynasty.* stats (cost, healthMultiplier, damageMultiplier, cooldownMultiplier, 7 units) | d PASS 7/7 | 411 | stats | values: git show cc4f7de
dynasty.samurai + firework_archer + monk done (KABUTO, KATANA_REST, KATANA_STEEL, SAMURAI_BLOCK + SLASH_ARC, SAMURAI_CUIRASS, SAMURAI_HAKAMA, ARCHER_HAIR, ARCHER_ROBE, ARCHER_LEGS, KASA_GOLD, FIREWORK_BOW/ROCKET/NOCK/BURST/REST, TENGU_MASK) | compacted 422 | 421 | approved | values: git show 268e1355:loop/LEDGER.md
visualEffects.ts:FLAME_JET (blobs, near, far, farPer, swell, lobes, lobe, lobeOff, flicker, fade; white, yellow) + simulationSystem DRAGON_BREATH (seconds, ahead, down, chest) | 12, .4, 1.4, .19, .35, 3, .5, .68, .14, .2; (1,.97,.85), (1,.78,.04); .7, .4, .3, .9 | 421 | approved | cones core .12->.7, shell .25->1.3 alpha .7, 5 puffs .35 (416-420); a lobbed fireball (before 416)
dynastyDress.ts:DRAGON_FORM (skull, headY, headZ, gape, tongue, segs, step, bodyY, bodyTail, sway, tall, taper, thick, scallop, fin, finWide, frillMix) | .62 (size 2 at 417), 1.95, .5, .2, [.2,.36], 9, .33, 1.45, 1.35, .18, .6 (on edge), .44, .05, .16, .13, .14, .4 | 422 | approved | band level wide .75, scallops .05 out on both edges (421); boxes seg [.36,.32,.36], dark cone fin .14, gold belly (416-420); dragon_head mask hat (before 416)
dynasty.hwacha done (HWACHA_RACK, HWACHA_ROCKET, HWACHA_WHEEL, LAUNCH_SMOKE, HWACHA_SHAFT, HWACHA_TIMBER) | compacted 421 | 420 | approved | values: git show 7f580c19:loop/LEDGER.md
dynastyDress.ts:MONKEY_STAFF (long, thick, offset, end, endWide, bands) + MONKEY_TAIL (root, tip, path to 1.08 up) | 1.35, .024, .12, .2, 1.25, 2; .045, .035 | 416 | approved | bo_staff .85 (before 416); no tail
simulationSystem.ts:BO_SHOVE monk; monkey_king (speed, lift) | 4.2, 2.4; 8.5, 5.5 (418) | 417-418 | approved | no throw (before 417)
dynastyDress.ts:DRAGON_CARRIER (every, leg, legLong, trunk, head, arm, grip) | 3, .09, .35 (418; .45 at 417), [.26,.32,.16], .17, .06, .16 | 417 | approved | no carriers (before 417)
dynastyDress.ts:DRAGON_CARRIER.poleColor | (.85,.24,.12) | 418 | approved | team (417)
visualEffects.ts:BODY_FLAMES (tongues, spread, low, high, tall, wide, flicker) + DRAGON_BREATH.burn | 9, .2, .55, 1.35, .42, .17, 13; 3 | 419 | approved | none (before 419)
dynastyDress.ts:DRAGON_FORM.tongue [wide, long] (lies in the mouth) | .2, .36 | 419 | approved | .17, .55 hanging (416)
ancient.minotaur 402-415 rows (MINO_GIRDLE, MINO_SHELL, BULL_HEAD, MINO_STRAP + .clear, MINO_LEGS, MINO_BARREL, MINO_ARMS, BULL_MUZZLE, MINO_LATHE) | compacted 420 | 415 | approved | values: git show a1460c56:loop/LEDGER.md
ancientDress.ts:MINO_STRAP (wide, proud) + MINO_GIRDLE (lo, hi, proudX, proudZ; off MINO_BARREL.profile) + MINO_CAP (inX, atY, radius, squash, droop, rim, swirl) + unitVisuals minotaur scale | .2, .04; -.08, .3, 1.07, 1.09; .98, .94, .72, .55, .4, .14, .6; 1.4 | 420 | approved | strap .44/.32, girdle -.3/.03/1.03/1.1 off the pelvis, MINO_SHELL plank, scale 2.1 (402-419)
dynastyDress.ts:MONKEY_CROWN (feather, featherWide, belly, stem, flat, spine, spineProud, lean) | 2.3, .55, .4, .3, .18, .14, .6, .32 | 424 | approved | rod feathers 2.6 x .2, lean .3 (420-423); torus crown hat (before 420)
dynastyDress.ts:DRAGON_MUZZLE (bevel, tan, rim, rimDeep, diamonds, diamond, diamondAt, diamondStep, diamondUp) + FRONT_GRIP (long, wraps, band, out, twist) | .22, (.72,.54,.32), .05, .06, 2, .11, .45, .25, .25; .24, 5, .022, 1.75, .25 | 424 | approved | icosphere snout; team head pole, grip .18 (before 424)
pirateDress.ts:PIRATE_PANTS (thigh, shin, to, cuff, cuffOut, cuffLight, brown) + PIRATE_SHORTS (out, to, rags, rag, ragWide, short, splay, tan) | 1.6, 1.5, .5, .14, 1.78, 1.3, (.45,.19,.045); 1.65, .72, 7, .2, .16, .6, .12, (.8,.6,.35) | 424 | approved | bare team legs (before 424)
dynastyDress.ts:DRAGON_CARRIER (arm, eye, hairTall, bun, fist, fistAt, poleAhead, elbowOut; arm material, fist material) | .075, .28, .22, .2, .09, .56, .07, .05; trousers, dark | 422 | approved | pole beside the head poleSide .17, fists at .99 h on one straight skin arm each (420-421; [P] 421 arm .1, fist .12 skin rejected as a ledger reversal); arm .06, pole through the head (417-419)
dynastyDress.ts:MONKEY_FACE (plate, chin, sideFrom, brow, muzzle, muzzleTop, muzzleOut, nose, tuft, 8 tufts; dark, tan, blond) | .1, -1.02, .7, .58, 1.1, -.3, .32, .5, .26; (.1,.06,.05), (.72,.54,.32), (.78,.56,.2) | 421 | approved | bare team head (before 421)
dynastyDress.ts:MONKEY_SHORTS (hipOut, puffAt, puff, kneeOut, kneeTo, cuffOut, shoeOut, shoeTall, toe, toeWide, toeLift, anklet, ankletOut) | 1.7, .5, 2.3, 1.45, .14, 1.6, 1.15, .78, 1.2, 1.5, .55, .4, 1.25 | 422 | approved | puff 2.7, hip 1.8, knee 1.5 (422.3, ballooned); slim trouser legs, plain boots (before 422)
dynastyDress.ts:MONKEY_ROBE (out, edge, deep, sleeveOut, sleeveTo, strip, stripLong, stripAt, proud, scarf, scarfThick, bib, bibLong) | 1.14, .12, 1.18, 1.55, .95, .06, .92, [-.62,-.26], .06, .72, .12, .42, .34 | 422 | approved | the tan accent trunk bare all round (before 422)
propBuilder.ts:PISTOL (long, bore, over, tail, bell, mouth, stock, fore, grip, gripRake) + proceduralAnimation PISTOL_AIM (out, ahead, drop, kick) | .28, .13, .17, .14, .16, 2.4, .9, .8, .36, .45; .24, .14, .03, .35 | 423 | approved | a .35 s grey rod with a stock box, the long-gun firearm grip (before 423); long .2 bore .12 mouth 2.3 (423.1)
propBuilder.ts:HARPOON_BREECH (long, wide, flat, hang, nozzle, bore, rings, handle, offGrip) | .2, .19, .86, .9 (on -z), .17, .52, [.25,.55,.85], .07, .42 | 424 | approved | navy canister .24 x .11 with a dark top handle (before 423); hang on +z (423.2)
vehicleBuilder.ts:CANNON_BARREL (axis, breech, sides, bore, boreAt, profile) | .6, -.16, 10, .085, 1.12, breech knob .155 to neck .105 to lip .195 over 1.24 | 423 | approved | cylinder .8 x .22-.28 at y .44 sunk in the cheeks, two bands, knob, muzzle .3 (before 423)
propBuilder.ts:TRICORN_PLATE (skull, at, bone, boneWide, proud, thick, white) + pirate_hat corners [30,150,270] | .5, .08, .95, .1, .12, .06, (.95,.94,.9) unlit | 423 | approved | a .26 W bone sphere + bars inside the front corner's V (before 423)
pirateDress.ts:PIRATE_VEST (out, deep, long, dark, chest, proud, front, lapel, flare, glow) | 1.08, 1.1, 1.08, .4, .36, .03, .3, .06, .08, .12 | 423 | approved | the closed pirate_tar trunk (before 423)
vehicleBuilder.ts:FRONT_SPLIT (hipOut, out, down, ahead, shinOut, shinAhead) + THROWER_SPLIT (out, down, ahead, shinOut, shinAhead) | .05, 1, .1, .12, .45, .1; 1, .3, .35, .6, .15 | 422 | approved | [R] reset: CREW_SEAT frontThigh -1.15/frontSplay .62/frontKnee .45 (Euler, crossed the knees) and THROWER_KNEES chest .55/out .2 targets (unreachable) (380-421); FRONT_SPLIT out .88/down .12/ahead .42 without the hip slide (403, rejected)
