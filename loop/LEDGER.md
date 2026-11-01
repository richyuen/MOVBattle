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

442 | REAPER_IMPALE weak man speared on a tendril, hung, stabbed (c350e411, 56eae583) | spooky.reaper.c | approved
442 | SKELETON_BONE flat unlit cream + unglowBone (21f0bc9a) | spooky.skeleton_archer.a, skeleton_warrior.a, reaper.a | approved
442 | PUMPKIN_POSTS upright square posts per rail, collar, cleat (4a2e5f3b) | spooky.pumpkin_catapult.a | approved
442 | cape arc gap + V .64 to the belt (8e29a2cb) | spooky.vampire.a | rejected
442 | QUEEN_SKIRT wrap hem + pale pelvis (af6e49fd, 6eb18db0) | pirate.pirate_queen.a | dropped
443 | STIFFY_UPRIGHT shield stood upright on the fist, face out front (a18d0a6f) | spooky.skeleton_warrior.b | approved
443 | DRAWS_BEFORE_LOOSE + skeleton archer, fire arrow off the full draw (3471ec43) | spooky.skeleton_archer.b | approved
443 | no counterweight box on the spooky catapult (1992ee2c) | spooky.pumpkin_catapult.a | approved
443 | REAPER_IMPALE hung high beside the shoulder, not targeted; REAPER_SPEAR thicker (b111a980) | spooky.reaper.c | approved
443 | VAMPIRE_VEST team vest slab + short V .5/.28, off secret_ghost (67ad1643) | spooky.vampire.a | approved
444 | reaper burst on the impaling blow too (49fad4e0) | spooky.reaper.c | approved
444 | VAMPIRE_LATCH jump onto the man, pinned at his neck, draughts + BLOOD_DRAIN (9e904930) | spooky.vampire.c | approved
444 | VAMPIRE_VEST V .12 under the trunk top to mid-chest, torso-frame belt band (681b8603, d1b8f3f4) | spooky.vampire.a | approved
444 | spooky wheel tyre + hub in PUMPKIN_TIMBER (d50fe07b) | spooky.pumpkin_catapult.a | approved
444 | [R] QUEEN_LEGLINE hem flipped/raised, pale pelvis, no tunic skirt, guards out (c71c375a, 9e30f921, c4daf42f) | pirate.pirate_queen.a | rejected
444 | BULLET_RAIN arms up, guns fired skyward, 3 bullets fall with blasts (0e73eb2a) | wild_west.gunslinger.c | approved
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
pirateDress.ts:QUEEN_SKIRT (top, knee, out, flare, deep, slant, frontDrop, beads, bead, pale; flapWide, flapFoot, flapX, flapLong, flapProud, flapLean) | .14, 1.08, 1.04, 1.22, 1.1, .6, .4, 7, .11, .18; .6, .22, -.25, 1.3, .06, .12 | 435 | approved | out 1.06 flare 1.45 deep 1.25 (433-434); no frontDrop (431-432)
proceduralAnimation.ts:QUEEN_GUARD (out, ahead, drop, cross, lean, stagger) | .05, .14, .3, .6, .2, .04 | 431 | approved | blades held point-first, end-on (before 431)
pirateDress.ts:QUEEN_SHIRT (shoulderOut, puff, puffAt, to, cuffOut, vee, veeLong, laces) | 1.2, 1.6, .3, .62, 1.1, .28, .34, 2 | 435 | approved | 1.45, 1.95, cuff 1.25 (433-434); bare arms (before 433)

wild_west.* stats (cost, healthMultiplier, damageMultiplier, cooldownMultiplier, 7 units) | d PASS 7/7 | 444 | stats | values: git show 7aee94dc
simulationSystem.ts:VAMPIRE_LATCH (round, off, up, first, every, afterDeath, blood) + visualEffects BLOOD_DRAIN | .7, .75, .2, .3, .35, .5, 12 | 444 | approved | swing + star (before 444)
simulationSystem.ts:BULLET_RAIN (hold, raise, up, fall, count, every, spread, splash, blast) + GUNS_UP (reach, out) | 1.1, .3, 22, .55, 3, .4, .9, 2.5, .6; .95, .2 | 444 | approved | level burst (before 444)
propBuilder.ts:REVOLVER (long, bore, drum, drumLong, tail, over, hammer, grip, gripRake; pairSide, pairDrop, pairBack, pairSplay) | .36, .075, .2, .18, .1, .15, .1, .36, .55; .22, .08, .1, .12 | 446 | approved | one per fist (445); flintlock PISTOL (before 445)
wildWestDress.ts:BOWLER (crown, flare, tall, dome, brim, thick, curl, band, shade, bandShade) | 1.14, 1.06, .18, .32, 1.62, .035, .12, .08, .25, .12 | 445 | approved | shade .42 (445.4); cowboy_hat (before 445)
simulationSystem.ts:LASSO_DRAG (low, pull, first, every, under, most, trample, throwUp, throwOut) + LASSO_ROPE (thick, loop) | .12, 1.4, .3, .35, .6, 2.4, 1.5, 5, 4; .045, .62 | 445 | approved | jab (before 445)
simulationSystem.ts:CACTUS_EXPLOSION (cooldown, radius, damage, push) + visualEffects CACTUS_NEEDLES (count, long, thick, speed, life, rise, color) | 1.2, 3, 20, 3; 26, .42, .05, 8, .55, .45, (.5,.33,.17) glow .12 | 446 | approved | (.95,.78,.42) glow .6 (445); none (before 445)
propBuilder.ts:MINER_PICK (long, thick, grip, head, bar, droop, collar) | .82, .035, .22, .5, .05, .22, .08 | 445 | approved | short pickaxe (before 445)
wildWestDress.ts:GUNSLINGER_JACKET (upperOut, lowerOut, lowerTo, cuff, cuffOut, skirt, skirtFlare, vee, veeLong, lapel, lapelLong, lean, lapelShade) | 1.4, 1.35, .86, .14, 1.25, .78, 1.35, .34, .4, .13, .46, .32, .62 | 446 | approved | bare arms, tunic skirt .45 (before 446)
propBuilder.ts:PINTO_HEAD (wide, long, deep, muzzle, muzzleAt, nostril, earWide, earFlat, earSplay) + PINTO_EYE, PINTO_EAR | .36, .92, .34, .32, .9, .08, .18, .45, .35; .11, .5 | 446 | approved | cylinder head, box muzzle, ear .3, eye .075 (before 446)
wildWestDress.ts:LASSO_COIL (rise, loop, loopThick, tip, coils, coil, coilThick, coilStep) | .14, .3, .026, .35, 3, .15, .022, .025 | 446 | approved | loop .62 x1.25 (446.6, too big); whip + PINTO_LOOP flank ring (before 446)
proceduralAnimation.ts:POLE_GRIP.minerHaft | [-.14, -.06] | 446 | approved | one-handed (before 446)
spooky.* stats (cost, healthMultiplier, damageMultiplier, cooldownMultiplier, 7 units) | d PASS 7/7 | 434 | stats | values: git show 33bb56af
spooky b props 434-436 rows (VAMPIRE_CLAWS, STIFFY_SHIELD, STIFFY_SWORD, BONE_BOW, CANDLE_ARMS; b PASS) | compacted 440 | 436 | approved | values: git show 93103dfd:loop/LEDGER.md
spooky c mechanics 434-435 rows (PUMPKIN_SHOT, FIRE_ARROW, SPIRIT_FIRE, BURN + BURN_STATUS, SPIRIT_LIFT, FEAR_SKULL + STIFFY_FEAR, PUMPKIN_BURST) | compacted 436 | 435 | approved | values: git show e1126012:loop/LEDGER.md

spooky.swordcaster done 435-437 rows (SWORDCASTER_BOWL, SWORDCASTER_CUIRASS, SWORDCASTER_SKIRT) | compacted 440 | 437 | approved | values: git show 93103dfd:loop/LEDGER.md
spookyDress.ts:REAPER_TENDRILS (rootX, rootY, long, out, back, rise, wave, waves, thick, tip) | .3, .55, 4.6, .88, .45, [.24,.04,-.16], .22, 1.6, .1, .18 | 435 | approved | none (before 435)
pirateDress.ts:QUEEN_BOOTS [R] (from, shaft, top, topTall, band, bandTall, bandAt; leather) + unitVisuals queen (scale, bulk) + QUEEN_SASH (wide, thick, proud, bomb, seat) | .12, 1.35, 1.7, .14, 1.42, .1, .34; (.45,.16,.1); 1.2 (439 [P], root exception spent), .85; .27, .1, .12, .25, .95 | 439 | approved | scale 1.45 (435-438); pale shins; 1.6, 1.2; sash .17, .08, .03, .2, .75 (428-434)
visualEffects.ts:REAPER_BURST (ring0, thick, dome0, dome, domeAlpha, shards, shard, out, up, life, fade) | 1.6, .22, 1.2, 4.2, .7, 8, .55, 3, 4.5, .9, .4 | 436 | approved | spark only (before 436)
proceduralAnimation.ts:QUEEN_UPRIGHT (tilt, stride, lean, chin) | .07, .08, .02, 0 | 436 | approved | hashed stance (before 436)

spooky done 437-441 rows (STIFFY_HELMET, SKELETON_HOOD, VAMPIRE_BAT/HAIR/COLLAR, RIB_CRADLE, BONE_FRAME, CATAPULT_BANNER, SKELETON_BELT/CREW, STIFFY_SHORTS, ARCHER_KIT; spooky all D 444) | compacted 445 | 441 | approved | values: git show 8ace1e68:loop/LEDGER.md
pirateDress.ts:QUEEN_FRAME + [R] 440 QUEEN_BUILD (trunk, deep, shoulders, pelvis, hips, tall, legs) | .7, .85, .78, .75, .72, .76, .74 | 440 | approved tall .85 legs 1 (438-439); tall 1 (437); full-width (before 437)
spooky.candlehead done 438-440 rows (CANDLE_TOWER, CANDLE_ROBE, CANDLE_BOOTS; a PASS, CONFIRM 440) | compacted 441 | 440 | approved | values: git show a46e87b8:loop/LEDGER.md

spookyDress.ts:REAPER_LEGS + proceduralAnimation.ts:REAPER_HOVER (glow, long, thin, foot; lift, bob, rate, hang, sway, knee) | .3, 1.6, .5, .75; .15, .02, 1.8, .85, .12, .12 | 440 | approved long 1 thin 1 (439); grey legs on the ground (before 439)
spookyDress.ts:STIFFY_GREAVES + knee (from, to, across, flare, knee, kneeSquash, foot, shade; patella, pSquash, pProud) | .34, .88, 3.4, .82, 1.12, .75, .72, .55; .62, 1.2, .25 | 441 | approved | from .14 to .84 (440)
spookyDress.ts:BOOT_SHAFT (from, to, across, cuffFrom, cuffTo, cuff, toe) | .48, 1.06, 2.5, .42, .56, 3.3, .78 | 440 | approved ARCHER_KIT boot box bootOut 1.25 (439)
spookyDress.ts:SKELETON_BONE (color, unlit + unglowBone) | (1.1,.78,.4) unlit emissive, out of glow | 442 | approved | cloth (1,.86,.6) glow .3 grey 166/161/156 (441); getCloth unlit-glow (before 441)
vehicleBuilder.ts:PUMPKIN_TIMBER (color, glow, rim) | (.1,.055,.05), .14, .7 (cw box removed 443; spooky tyre/hub 444) | 444 | approved | "wood" (.36,.13,.09) red-brown + wheel tone (before 441)
spookyDress.ts:REAPER_ROBE (across, deep, sides, long, flare, rags, rag, ragLong, ragShort, ragIn) | 1.08, 1.25, 8, .85, 1.12, 10, .13, .32, .16, .94 | 441 | approved | unitFactory bell: ROBE 1.3, SKIRT .85, HEM 2.1, TATTERS 7
spookyDress.ts:VAMPIRE_VEST (shirt, shirtGlow, vWide, vTop, vLong, ...; vestWide, vestTop, vestThick, vestProud; vUnder, vFoot, beltWide, beltProud, beltUp) + no secret_ghost | (.86,.84,.78), .3, .5, -.02, .28; .96, .02, .03, .006; .12, .5, 1.04, .02, .1 | 444 | approved | vWide .46 vLong .5 (441); 442 V .64/.86 rejected; plain team (before 441)
spookyDress.ts:VAMPIRE_BEARD (mouth, side, back, under, jawTop, proud, goatee, drop, fang, fangLong, fangGap, fangProud) | .42, .16, -.1, .18, .12, .08, .6, .4, .17, .34, .22, .14 | 440 | approved bare face (before 440)
simulationSystem.ts:REAPER_IMPALE (weak, up, side, back, rootUp, rootBack, through, every, bite, afterDeath) + spookyDress REAPER_SPEAR (thick, tip) | .15, .8, .45, .1, .66, .08, .3, .6, .18, 2.5; .22, .12 | 443 | approved | up .6 side .3 thick .16 (442); none (before 442)
vehicleBuilder.ts:PUMPKIN_POSTS (thick, apart, over, collar, collarTall, collarAt) | 1.35, .75, .3, 1.3, 1.4, .28 | 442 | approved | A-frame legs + brace (before 442)
propBuilder.ts:STIFFY_UPRIGHT (x, y, z rows in the hand frame; at) | (.713,-.501,.491) (-.174,.552,.816) (-.68,-.667,.306); (.062,.054,.36) | 443 | approved | round-branch carry, face up like a tray (before 443)
