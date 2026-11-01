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

445 | REVOLVER long dark revolver, drum, hammer, raked grip + pistolBell mark (4a52867e, e2029795) | wild_west.gunslinger.b | approved
445 | BOWLER wildWestDress dark team bowler, dome crown, curled brim (6e54d4ad, b5e033d5) | wild_west.gunslinger.a | approved
445 | off hand emptied, one gun (58b22c60) | wild_west.quick_draw.b | approved
445 | painter dodge extended to quick_draw (094a18a8) | wild_west.quick_draw.c | rejected
445 | LASSO_DRAG rope + loop to the chest, haul in, trample (cbd214cd, 7db56d0f) | wild_west.lasso.c | approved
445 | CACTUS_EXPLOSION needle burst when hurt + CACTUS_NEEDLES (9ab466fa) | wild_west.cactus.c | approved
445 | MINER_PICK long haft, thin dark drooping pick head (47f7fe76) | wild_west.miner.b | approved
446 | painter dodge on quick_draw resubmitted on the held-camera pair (70728e04) | wild_west.quick_draw.c | approved
446 | weaponVariant revolver for the quick draw (dc21c4c6) | wild_west.quick_draw.b | approved
446 | REVOLVER pair: twin revolver per fist, own muzzle, no pistolBell (39b50bf9) | wild_west.gunslinger.b | approved
446 | GUNSLINGER_JACKET sleeves, cuffs, shirt V, lapels, skirt to mid-thigh (75a14901) | wild_west.gunslinger.a | approved
446 | PINTO_HEAD rounded skull, cream muzzle + nostrils, leaf ears, big eyes (2a2551a9) | wild_west.lasso.a | approved
446 | LASSO_COIL rope at the ready in the fist, flank ring gone, hidden while thrown (39f31f9f, 467a8f23) | wild_west.lasso.b | approved
446 | POLE_GRIP.minerHaft off fist on the pick haft (83e52a4f) | wild_west.miner.b | approved
447 | QUICK_FAN six single revolver shots .2 s apart, small flash, quickdraw_smoke dropped (df90098f) | wild_west.quick_draw.c | approved
447 | FLAT_HAT wildWestDress team flat-crown wide-brim hat, black band (8440b9e4) | wild_west.quick_draw.a | approved
447 | MINER_CAP wildWestDress team cap, dome over the head, front peak (e7018233, b579c896) | wild_west.miner.a | approved
447 | MINER_BLAST landed pick blows up, rock clods, splash 2.5 (1796e237) | wild_west.miner.c | approved
447 | GUNSLINGER_TIE violet knot + blade down the shirt V (28aec26d) | wild_west.gunslinger.a | approved
447 | PINTO_HEAD pinched-leaf ears, flush blaze lens, shorter fatter skull (1db23f8a) | wild_west.lasso.a | approved
447 | CACTUS_SLEEVE fat spiked mitten sleeves over the forearms (f263e7a6) | wild_west.cactus.a | approved
448 | FLAT_HAT on the Lasso rider (fac00c2d) | wild_west.lasso.a | approved
448 | GUNSLINGER_SIDEBURNS black bushy lumps down both cheeks (7082f6e9) | wild_west.gunslinger.a | approved
448 | CACTUS_LONG .5 + CACTUS_BOOTS fat dark boots (2f5a4704) | wild_west.cactus.a | rejected-kept
448 | WINCHESTER dark lever-action rifle, lever loop, short stock (2d87dded) | wild_west.deadeye.b | approved
448 | QUICK_DRAW_SHIRT beige sleeves rolled past the elbow, collar V (3ca4f7f6) | wild_west.quick_draw.a | approved
448 | MINER_OVERALLS lighter shirt, dark braces, waist band, no skirt (dbef099f) | wild_west.miner.a | approved
449 | [R] QUEEN_LEGLINE pelvis cut .5, front hem rise, wrap flap at the side (b27052fd) | pirate.pirate_queen.a | rejected (a parked)
450 | [R] QUEEN_LEGLINE hip .5, hem to mid-thigh slanting to her right, slim pale legs, slim knee boots, no tunicSkirt, fists at the hips (e97878d5, b5bd76ed) | pirate.pirate_queen.a | approved (a PASS)
449 | DYNAMITE_WIRES black two-leg wire per stick (3adeea7c) | wild_west.dynamite_thrower.b | approved
449 | PEAK_HAT team peaked hat, lampshade brim (33c4d5f0) | wild_west.deadeye.a | approved
449 | PEAK_HAT on the Dynamite Thrower (221f3f5a) | wild_west.dynamite_thrower.a | approved
449 | CACTUS_BOOTS slim resubmit out 1.15 cuff 1.35 from .55 (a4b9b357) | wild_west.cactus.a | rejected
449 | no wildwest_leather + GUNSLINGER_SUIT team cloth on trunk, sleeves, coat skirts (b52941b5, 129f319c) | wild_west.gunslinger.a | approved
449 | MINER_MOUSTACHE black handlebar under the eyes (85c21cb8) | wild_west.miner.a | approved

## Spent (never retry as [P])

## Rows

dynasty.dragon done 416-431 rows (FLAME_JET + DRAGON_BREATH, DRAGON_FORM [R], DRAGON_CARRIER + poleColor + arm/fist, BODY_FLAMES, DRAGON_TRIM, DRAGON_HOLD) | compacted 432 | 431 | approved | values: git show 67890443:loop/LEDGER.md
dynasty.monkey_king + monk + crew split, ancient.minotaur strap/girdle, pirate beard done rows (MONKEY_RUYI/TAIL, BO_SHOVE, MONKEY_CROWN/FACE/SHORTS/ROBE/TRUNK/HAIR, FRONT_SPLIT, MINO_STRAP/GIRDLE/CAP, PIRATE_BEARD) | compacted 437 | 433 | approved | values: git show 3c42103f:loop/LEDGER.md
pirate 425-426 rows (TRICORN_BROWN, HARPOON_REEL, GUN_TOSS, BLUNDERBUSS + _AIM, CANNON_WHEEL, CUTLASS, CUTLASS_SLASH, PIRATE_KICK, BLUNDERBUSS_RECOIL, PISTOL_SHOT, BARREL_ARMOUR, OPEN_COAT, CANNON_SIGHT) | compacted 428 | 426 | approved | values: git show 0445ba6b:loop/LEDGER.md
pirate 423-424 rows (PISTOL + PISTOL_AIM, HARPOON_BREECH, CANNON_BARREL, TRICORN_PLATE, PIRATE_VEST, PIRATE_PANTS + PIRATE_SHORTS) | compacted 427 | 424 | approved | values: git show 613ba5b9:loop/LEDGER.md
pirate 427-428 rows (BOMB_SPIN + _POSE, BLUNDERBUSS_BLAST, PLANK_HAT, LAUNCH.cannonball, DRAGON_PISTOL, QUEEN_BANDANA, DRAGON_BLAST, CAPTAIN_COAT, QUEEN_SASH, BARREL_BRACERS, CANNON_HANDLES, CANNON_SHIRT) | compacted 430 | 428 | approved | values: git show 28adb4e4:loop/LEDGER.md
pirate.bomb_thrower done 429-431 rows (PIRATE_SOCKS, BOMB_SASH, PIRATE_BELT) | compacted 432 | 431 | approved | values: git show 67890443:loop/LEDGER.md
pirate.flintlock + blunderbuss + captain done 429-433 rows (PIRATE_HAIR, FLINTLOCK_LOCKS, PLAIN_SOCKS, CANNON_BANDANNA, BLUNDERBUSS_HAIR, BLUNDERBUSS, BARREL_GREAVES, CAPTAIN_PARROTS/BEARD/LEGS/TRICORN/FRONT) | compacted 435 | 433 | approved | values: git show b90a44ee:loop/LEDGER.md
pirate.harpooner done 431-438 rows (HARPOON_BAYONET, scale 1.3, HARPOONER_PANTS, HARPOONER_SHOES, HARPOON_REST, HARPOON_BREECH [R]) | compacted 439 | 438 | approved | values: git show eb4676ee:loop/LEDGER.md
pirateDress.ts:QUEEN_DREADS (wrap, rootY, spray, thick, rise, lean, tip, droop, falls, drop, splay, bead) | .42, 1, 7, .2, 1.05, .8, .75, 1, 3, -1.9, .12, .26 | 434 | approved | QUEEN_HAIR pirateHair slabs + curl lumps side .36 drop -2 (430-433)
propBuilder.ts:QUEEN_CUTLASS (long, wide, taper, curve, segs, cup) | .66, .1, .5, .24, 7, 4.2 | 430 | approved | CUTLASS .5, .05, .55, .13, 6, 3.4 (425-429); CUTLASS bowl .38, rim .32 (431, bowl guard replaces the frustum cup)
pirateDress.ts:QUEEN_SKIRT [R] 450 (top, knee, out, flare, deep, slant, frontRise, beads, bead, pale; flapWide, flapFoot, flapX, flapLong, flapProud, flapLean) | .06, .5, 1.04, 1.22, 1.1, .2 (to her right), .42, 7, .11, .3; .5, .12, .8, 1.45, .06, .12 | 450 | approved | top .14 knee 1.08 slant .6 (to her left) frontDrop .4 pale .18 flap .6/.22/-.25/1.3 (435-449); out 1.06 flare 1.45 deep 1.25 (433-434)
proceduralAnimation.ts:QUEEN_GUARD (out, ahead, drop, cross, lean, stagger) | .05, .14, .22, .6, .2, .04 | 450 | approved | drop .3 (431-449); blades held point-first, end-on (before 431)
pirateDress.ts:QUEEN_SHIRT (shoulderOut, puff, puffAt, to, cuffOut, vee, veeLong, laces) | 1.2, 1.6, .3, .62, 1.1, .28, .34, 2 | 435 | approved | 1.45, 1.95, cuff 1.25 (433-434); bare arms (before 433)

wild_west.* stats (cost, healthMultiplier, damageMultiplier, cooldownMultiplier, 7 units) | d PASS 7/7 | 444 | stats | values: git show 7aee94dc
spooky done 435-444 rows (REAPER_TENDRILS/BURST/LEGS/ROBE/IMPALE, STIFFY_GREAVES/UPRIGHT, BOOT_SHAFT, SKELETON_BONE, PUMPKIN_TIMBER/POSTS, VAMPIRE_VEST/BEARD/LATCH; spooky all D 444) | compacted 447 | 444 | approved | values: git show cbd79d83:loop/LEDGER.md
simulationSystem.ts:BULLET_RAIN (hold, raise, up, fall, count, every, spread, splash, blast) + GUNS_UP (reach, out) | 1.1, .3, 22, .55, 3, .4, .9, 2.5, .6; .95, .2 | 444 | approved | level burst (before 444)
propBuilder.ts:REVOLVER (long, bore, drum, drumLong, tail, over, hammer, grip, gripRake; pairSide, pairDrop, pairBack, pairSplay) | .36, .075, .2, .18, .1, .15, .1, .36, .55; .22, .08, .1, .12 | 446 | approved | one per fist (445); flintlock PISTOL (before 445)
wildWestDress.ts:BOWLER (crown, flare, tall, dome, brim, thick, curl, band, shade, bandShade) | 1.14, 1.06, .18, .32, 1.62, .035, .12, .08, .25, .12 | 445 | approved | shade .42 (445.4); cowboy_hat (before 445)
simulationSystem.ts:LASSO_DRAG (low, pull, first, every, under, most, trample, throwUp, throwOut) + LASSO_ROPE (thick, loop) | .12, 1.4, .3, .35, .6, 2.4, 1.5, 5, 4; .045, .62 | 445 | approved | jab (before 445)
simulationSystem.ts:CACTUS_EXPLOSION (cooldown, radius, damage, push) + visualEffects CACTUS_NEEDLES (count, long, thick, speed, life, rise, color) | 1.2, 3, 20, 3; 26, .42, .05, 8, .55, .45, (.5,.33,.17) glow .12 | 446 | approved | (.95,.78,.42) glow .6 (445); none (before 445)
propBuilder.ts:MINER_PICK (long, thick, grip, head, bar, droop, collar) | .82, .035, .22, .5, .05, .22, .08 | 445 | approved | short pickaxe (before 445)
wildWestDress.ts:GUNSLINGER_JACKET (upperOut, lowerOut, lowerTo, cuff, cuffOut, skirt, skirtFlare, vee, veeLong, lapel, lapelLong, lean, lapelShade) | 1.4, 1.35, .86, .14, 1.25, .78, 1.35, .34, .4, .13, .46, .32, .62 | 446 | approved | bare arms, tunic skirt .45 (before 446)
propBuilder.ts:PINTO_HEAD (wide, long, deep, muzzle, muzzleAt, nostril, earWide, earFlat, earSplay, earPinch, blaze) + PINTO_EYE | .46, .66, .4, .4, .78, .09, .3, .6, .35, .8, .36; .14 | 447 | approved | .36, .92, .34, .32, .9, .08, .18, .45 cone ears, box blaze, eye .11 (446)
wildWestDress.ts:LASSO_COIL (rise, loop, loopThick, tip, coils, coil, coilThick, coilStep) | .14, .3, .026, .35, 3, .15, .022, .025 | 446 | approved | loop .62 x1.25 (446.6, too big); whip + PINTO_LOOP flank ring (before 446)
proceduralAnimation.ts:POLE_GRIP.minerHaft | [-.14, -.06] | 446 | approved | one-handed (before 446)
simulationSystem.ts:QUICK_FAN (shots, every, flash, damage, push) | 6, .2, .6, 1.18, 1.2 | 447 | approved | one-tick _fireBurst of 6 stacked muzzle clouds (before 447)
wildWestDress.ts:FLAT_HAT (crown, flare, tall, brim, thick, band, shade, glow; quick_draw + lasso) | 1.12, .94, .24, 2.15, .04, .1, .85, .12 | 448 | approved | captain_hat / cowboy_hat (before 447-448)
wildWestDress.ts:MINER_CAP (wall, dome, rise, peak, peakLong, thick, tip, shade) | 1.42, 1.38, .72, 1, .55, .05, .22, .9 | 447 | approved | rise .29 wall 1.34 (447.3); miner_hat top hat + lamp (before 447)
simulationSystem.ts:MINER_BLAST (radius, scale) | 2.5, .5 | 448 | approved | scale .85 (447; whited out _flight); none (before 447)
wildWestDress.ts:GUNSLINGER_TIE (knot, knotTall, top, foot, long, proud, color) | .17, .07, .15, .24, .32, .06, (.42,.14,.63) | 447 | approved | none (before 447)
wildWestDress.ts:CACTUS_SLEEVE (out, from, to, cap, rows, ring, spike) | 2.2, .04, 1.32, .95, 4, 5, .42 | 447 | approved | arm scale 1.4 + 3 spines (before 447)
wildWestDress.ts:GUNSLINGER_SIDEBURNS (lumps, lump, top, foot, out, ahead, jag) | 4, .42, .35, -.75, .12, .18, .12 | 448 | approved | none (before 448)
wildWestDress.ts:CACTUS_BOOTS + unitFactory CACTUS_LONG (from, to, out, cuffFrom, cuff, toe; long) | .42, 1.04, 2.1, .34, 2.5, .85; .5 | 449 | rejected-kept | slim .55/1.15/.5/1.35 rejected 449 (a [P] in effect); long .86, no boots (before 448)
propBuilder.ts:WINCHESTER (long, grip, bore, tube, rcv, rcvDeep, loop, fore, butt, tilt) | 1.12, .3, .03, .75, .14, 2.2, 2.6, .32, .12, -.2 | 448 | approved | MATCHLOCK musket (before 448)
wildWestDress.ts:QUICK_DRAW_SHIRT (upperOut, lowerOut, lowerTo, cuffFrom, cuffOut, vee, veeLong, color) | 1.45, 1.4, .28, .16, 1.75, .4, .34, (.8,.68,.45) | 448 | approved | bare arms (before 448)
wildWestDress.ts:MINER_OVERALLS (lift, strap, apart, proud, waist, over) | .35, .1, .22, .04, .22, 1.06 | 448 | approved | leather vest block + tunic skirt (before 448)
wildWestDress.ts:PEAK_HAT (sides, crown, brim, slope, peak, tall, shade; deadeye + dynamite_thrower) | 8, 1.12, 2.25, .3, .22, .6, .9 | 449 | approved | cowboy_hat (before 449)
propBuilder.ts:DYNAMITE_WIRES (thick, rise, lean, bend, curl, tail) | .012, .08, .35, .06, 1.1, .09 | 449 | approved | one tan fuse (before 449)
wildWestDress.ts:GUNSLINGER_SUIT (shade, glow) + unitVisuals gunslinger materialPreset | .8, .12; none | 449 | approved | body.bodyMaterial + wildwest_leather (before 449)
wildWestDress.ts:MINER_MOUSTACHE (long, thick, droop, at, proud, tip, tipDrop) | .8, .28, .32, -.38, .08, .22, .16 | 449 | approved | long .62 thick .2 tip .17 (449 look); none (before 449)
spooky.* stats (cost, healthMultiplier, damageMultiplier, cooldownMultiplier, 7 units) | d PASS 7/7 | 434 | stats | values: git show 33bb56af
spooky b props 434-436 rows (VAMPIRE_CLAWS, STIFFY_SHIELD, STIFFY_SWORD, BONE_BOW, CANDLE_ARMS; b PASS) | compacted 440 | 436 | approved | values: git show 93103dfd:loop/LEDGER.md
spooky c mechanics 434-435 rows (PUMPKIN_SHOT, FIRE_ARROW, SPIRIT_FIRE, BURN + BURN_STATUS, SPIRIT_LIFT, FEAR_SKULL + STIFFY_FEAR, PUMPKIN_BURST) | compacted 436 | 435 | approved | values: git show e1126012:loop/LEDGER.md

spooky.swordcaster done 435-437 rows (SWORDCASTER_BOWL, SWORDCASTER_CUIRASS, SWORDCASTER_SKIRT) | compacted 440 | 437 | approved | values: git show 93103dfd:loop/LEDGER.md
pirateDress.ts:QUEEN_BOOTS [R] 450 (from, shaft, top, topTall, band, bandTall, bandAt; leather) + unitVisuals queen (scale, bulk) + QUEEN_SASH (wide, thick, proud, bomb, seat) | .38, 1.2, 1.32, .1, 1.26, .1, .52; (.45,.16,.1); 1.2 (439 [P], root exception spent), .85; .27, .1, .12, .25, .95 | 450 | approved | .12, 1.35, 1.7, .14, 1.42, .1, .34 (439-449); scale 1.45 (435-438); pale shins; sash .17, .08, .03, .2, .75 (428-434)
proceduralAnimation.ts:QUEEN_UPRIGHT (tilt, stride, lean, chin) | .07, .08, .02, 0 | 436 | approved | hashed stance (before 436)

spooky done 437-441 rows (STIFFY_HELMET, SKELETON_HOOD, VAMPIRE_BAT/HAIR/COLLAR, RIB_CRADLE, BONE_FRAME, CATAPULT_BANNER, SKELETON_BELT/CREW, STIFFY_SHORTS, ARCHER_KIT; spooky all D 444) | compacted 445 | 441 | approved | values: git show 8ace1e68:loop/LEDGER.md
pirateDress.ts:QUEEN_FRAME [R] 450 QUEEN_LEGLINE (trunk, deep, shoulders, pelvis, hips, tall, legs, pelvisCut, legSlim) + unitFactory tunicSkirt gate | .7, .85, .78, .75, .72, .65, .815, .5, .82; off, no cape (b5bd76ed) | 450 | approved | tall .76 legs .74 no cut/slim, tunicSkirt on (440-449); tall .85 legs 1 (438-439); tall 1 (437)
spooky.candlehead done 438-440 rows (CANDLE_TOWER, CANDLE_ROBE, CANDLE_BOOTS; a PASS, CONFIRM 440) | compacted 441 | 440 | approved | values: git show a46e87b8:loop/LEDGER.md

