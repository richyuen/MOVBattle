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

453 | no tunic skirt on the Quick Draw (f1e7c5e9) | wild_west.quick_draw.a | approved (a PASS)
453 | DYNAMITE_BOOTS black boots, folded cuff (7d3f3350) | wild_west.dynamite_thrower.a | approved
453 | GUNSLINGER_SHOES small black shoes (de84002b) | wild_west.gunslinger.a | approved (a PASS)
453 | WESTERN_BRAID brown plait over the off shoulder (ca4802eb) | wild_west.deadeye.a | approved (a PASS)
453 | MINER_UPRIGHT idle stance, chin up (8e7167ae) | wild_west.miner.a | approved
453 | PICK_SHOULDER pick shouldered at rest (0a616333) | wild_west.miner.b | approved (none struck)
453 | pinto coat + patches cloth, out of the glow layer, orange, peach (37b8faec) | wild_west.lasso.a | approved
454 | WINCHESTER_AIM two-hand levelled aim + GUN_WARMUP 1 s (6a7b4719) | wild_west.deadeye.c | approved (none struck)
454 | WESTERN_BRAID on the Dynamite Thrower (e92d6925) | wild_west.dynamite_thrower.a | approved (a PASS)
454 | MINER_HAT tall faceted crown, sloped brim (96109e64) | wild_west.miner.a | approved
454 | PICK_SHOULDER palm at the chin (aeb80c8a) | wild_west.miner.b | approved (b PASS)
454 | PINTO_HEAD round faceted skull + PINTO_BEAD eyes (641323cc) | wild_west.lasso.a | approved (a PASS)
455 | levelledGun gunner overlay off the aim + WINCHESTER_AIM at the hip (b5b86f36) | wild_west.deadeye.c | rejected (reverted c6329a96)
455 | RIFLE_TRACER white streak muzzle to chest (a5310afa) | wild_west.deadeye.c | approved
455 | DYNAMITE_SHIRT team cloth, dark sleeves to the wrist (905d3fd4, 9e286699) | wild_west.dynamite_thrower.a | approved (a PASS)
455 | MINER_LEGS dark team overall legs (63a28bba, 8ad8d441) | wild_west.miner.a | approved
455 | MINER_SLEEVES dark sleeves, tan glove cuffs and hands (b906f385) | wild_west.miner.a | approved (a PASS)
455 | LASSO_MOUSTACHE curled moustache (5517a3ff) | wild_west.lasso.a | approved
455 | PINTO_LEGS slim round legs, small hooves (e3f0ab28) | wild_west.lasso.a | approved
456 | WINCHESTER_AIM receiver seated in the fist, overlay off, hip aim; aimed at the man's chest (65b9d4eb, b831338d) | wild_west.deadeye.c | approved
456 | WINCHESTER_AIM recoil a slide back along the level barrel (da3c6b53) | wild_west.deadeye.c | approved (c PASS)
456 | LASSO_SHIRT team shirt, trousers, hem, short dark sleeves (3956ccec, 14478070) | wild_west.lasso.a | approved (a PASS)
456 | [R] DYNAMITE_LOOK hat lifted off the eyes + lighter team bandanna (a089b2c5) | wild_west.dynamite_thrower.a | approved (a PASS, plateau cleared)
457 | [R] MINER_BUILD lanky trunk, legs to half the height, waist flush, slim trousers (b6a093c2) | wild_west.miner.a | approved (a PASS; CONFIRM failed a on the hat)
457 | CHARGE_FLAG team flag, gold rim + emblem + ball; pole upright, uprightPole marker in the Healer's hold (3537400d, 35ba9eb6) | legacy.flag_bearer.b | approved
457 | STAY_BANNER gold cross-beam, two team banners with tower emblems; pole upright (c372d09e, 3244f182) | legacy.banner_bearer.b | approved
457 | TEAM_GLOVE team mitt centred on the fist, white band (4e6b33f9, bc99e306) | legacy.boxer.b | approved
457 | POACHER_HAT dark felt wide brim, team band (23a90927) | legacy.poacher.a | approved
457 | PEASANT_HOOD team cowl, peak, collar (863f64ea) | legacy.peasant.a | rejected (reverted da3672d0)

## Spent (never retry as [P])

## Rows

dynasty.monkey_king + monk + crew split, ancient.minotaur strap/girdle, pirate beard done rows (MONKEY_RUYI/TAIL, BO_SHOVE, MONKEY_CROWN/FACE/SHORTS/ROBE/TRUNK/HAIR, FRONT_SPLIT, MINO_STRAP/GIRDLE/CAP, PIRATE_BEARD) | compacted 437 | 433 | approved | values: git show 3c42103f:loop/LEDGER.md
wild_west done 448-453 rows (MINER_BLAST, GUNSLINGER_SIDEBURNS/SUIT/REST/SHOES, CACTUS_ROBE [R] + boots/spines, QUICK_DRAW_SHIRT/VEST, GUN_BELT; cactus, gunslinger, quick_draw D) | compacted 455 | 453 | approved | values: git show fa4523ed:loop/LEDGER.md
pirate.flintlock + blunderbuss + captain done 429-433 rows (PIRATE_HAIR, FLINTLOCK_LOCKS, PLAIN_SOCKS, CANNON_BANDANNA, BLUNDERBUSS_HAIR, BLUNDERBUSS, BARREL_GREAVES, CAPTAIN_PARROTS/BEARD/LEGS/TRICORN/FRONT) | compacted 435 | 433 | approved | values: git show b90a44ee:loop/LEDGER.md
pirate.harpooner done 431-438 rows (HARPOON_BAYONET, scale 1.3, HARPOONER_PANTS, HARPOONER_SHOES, HARPOON_REST, HARPOON_BREECH [R]) | compacted 439 | 438 | approved | values: git show eb4676ee:loop/LEDGER.md
pirateDress.ts:QUEEN_DREADS (wrap, rootY, spray, thick, rise, lean, tip, droop, falls, drop, splay, bead) | .42, 1, 7, .2, 1.05, .8, .75, 1, 3, -1.9, .12, .26 | 434 | approved | QUEEN_HAIR pirateHair slabs + curl lumps side .36 drop -2 (430-433)
pirateDress.ts:QUEEN_SKIRT [R] 450 (top, knee, out, flare, deep, slant, frontRise, beads, bead, pale; flapWide, flapFoot, flapX, flapLong, flapProud, flapLean) | .06, .5, 1.04, 1.22, 1.1, .2 (to her right), .42, 7, .11, .3; .5, .12, .8, 1.45, .06, .12 | 450 | approved | top .14 knee 1.08 slant .6 (to her left) frontDrop .4 pale .18 flap .6/.22/-.25/1.3 (435-449); out 1.06 flare 1.45 deep 1.25 (433-434)
proceduralAnimation.ts:QUEEN_GUARD (out, ahead, drop, cross, lean, stagger) | .05, .14, .22, .6, .2, .04 | 450 | approved | drop .3 (431-449); blades held point-first, end-on (before 431)
pirateDress.ts:QUEEN_SHIRT (shoulderOut, puff, puffAt, to, cuffOut, vee, veeLong, laces) | 1.2, 1.6, .3, .62, 1.1, .28, .34, 2 | 435 | approved | 1.45, 1.95, cuff 1.25 (433-434); bare arms (before 433)

wild_west.* stats (cost, healthMultiplier, damageMultiplier, cooldownMultiplier, 7 units) | d PASS 7/7 | 444 | stats | values: git show 7aee94dc
spooky done 435-444 rows (REAPER_TENDRILS/BURST/LEGS/ROBE/IMPALE, STIFFY_GREAVES/UPRIGHT, BOOT_SHAFT, SKELETON_BONE, PUMPKIN_TIMBER/POSTS, VAMPIRE_VEST/BEARD/LATCH; spooky all D 444) | compacted 447 | 444 | approved | values: git show cbd79d83:loop/LEDGER.md
wild_west 444-447 rows (BULLET_RAIN, REVOLVER, BOWLER, LASSO_DRAG/ROPE, CACTUS_EXPLOSION/NEEDLES, MINER_PICK, GUNSLINGER_JACKET, PINTO_HEAD, LASSO_COIL, POLE_GRIP.minerHaft, QUICK_FAN, MINER_CAP, GUNSLINGER_TIE, CACTUS_SLEEVE) | compacted 451 | 447 | approved | values: git show 3ac8ee79:loop/LEDGER.md
wild_west done 448-456 rows (FLAT_HAT, PEAK_HAT, WINCHESTER(_AIM), RIFLE_TRACER, DYNAMITE_WIRES/HOLD/SKIRT/BOOTS/SHIRT/LOOK [R], WESTERN_BRAID, DEADEYE_SHIRT, LASSO_RAISE/MOUSTACHE/SHIRT, PINTO_LEGS/HEAD/COAT; dynamite, deadeye, lasso D 456) | compacted 457 | 456 | approved | values: git show 7f5ee168:loop/LEDGER.md
wildWestDress.ts:MINER_OVERALLS (lift, strap, apart, proud, waist, over) | .35, .1, .22, .04, .22, 1.01 | 457 | approved | over 1.06 (448-456, a waist ledge); leather vest block + tunic skirt (before 448)
wildWestDress.ts:MINER_MOUSTACHE (long, thick, droop, at, proud, tip, tipDrop) | .8, .28, .32, -.38, .08, .22, .16 | 449 | approved | long .62 thick .2 tip .17 (449 look); none (before 449)
wildWestDress.ts:MINER_BOOTS (from, to, out, cuffFrom, cuff, color, glow) | .14, 1.04, 1.25, .06, 1.45, (.12,.065,.04), .1 | 452 | approved | plain team feet (before 452)
proceduralAnimation.ts:MINER_UPRIGHT (tilt, stride, lean, chin) | .06, .12, .06, .06 | 453 | approved | hashed stance, sunk crouch chin -.22 (before 453)
proceduralAnimation.ts:PICK_SHOULDER (side, up, front, back, out, arm raise/turn/elbow) | .15, 1.25, .5, .3, .12, -1.6/.4/-1.7 | 454 | approved | .32, .95, .42 (453, fists at the chest); up .05 (453 probe); pick on the fist rest (before 453)
wildWestDress.ts:MINER_HAT (sides, crown, brim, slope, top, tall, tilt, shade, glow) | 8, 1.2, 1.85, .16, .86, .75, .14, .9, .12 | 454 | approved | MINER_CAP skullcap + bill (447-453)
wildWestDress.ts:MINER_LEGS (shade, glow, out, shinOut, shinTo) + MINER_SLEEVES (upperOut, lowerOut, cuffFrom, cuffOut, glove, glow) | .3, .12, 1.08, 1.06, .3; 1.22, 1.18, .55, 1.55, (.72,.5,.26), .15 | 457 | approved | out 1.18 shinOut 1.12 (455-456); shade .55 (455 look); bare team legs and arms (before 455)
spooky.* stats (cost, healthMultiplier, damageMultiplier, cooldownMultiplier, 7 units) | d PASS 7/7 | 434 | stats | values: git show 33bb56af
spooky b props 434-436 rows (VAMPIRE_CLAWS, STIFFY_SHIELD, STIFFY_SWORD, BONE_BOW, CANDLE_ARMS; b PASS) | compacted 440 | 436 | approved | values: git show 93103dfd:loop/LEDGER.md
spooky c mechanics 434-435 rows (PUMPKIN_SHOT, FIRE_ARROW, SPIRIT_FIRE, BURN + BURN_STATUS, SPIRIT_LIFT, FEAR_SKULL + STIFFY_FEAR, PUMPKIN_BURST) | compacted 436 | 435 | approved | values: git show e1126012:loop/LEDGER.md

spooky.swordcaster done 435-437 rows (SWORDCASTER_BOWL, SWORDCASTER_CUIRASS, SWORDCASTER_SKIRT) | compacted 440 | 437 | approved | values: git show 93103dfd:loop/LEDGER.md
pirateDress.ts:QUEEN_BOOTS [R] 450 (from, shaft, top, topTall, band, bandTall, bandAt; leather) + unitVisuals queen (scale, bulk) + QUEEN_SASH (wide, thick, proud, bomb, seat) | .38, 1.2, 1.32, .1, 1.26, .1, .52; (.45,.16,.1); 1.2 (439 [P], root exception spent), .85; .27, .1, .12, .25, .95 | 450 | approved | .12, 1.35, 1.7, .14, 1.42, .1, .34 (439-449); scale 1.45 (435-438); pale shins; sash .17, .08, .03, .2, .75 (428-434)
proceduralAnimation.ts:QUEEN_UPRIGHT (tilt, stride, lean, chin) | .07, .08, .02, 0 | 436 | approved | hashed stance (before 436)

spooky done 437-441 rows (STIFFY_HELMET, SKELETON_HOOD, VAMPIRE_BAT/HAIR/COLLAR, RIB_CRADLE, BONE_FRAME, CATAPULT_BANNER, SKELETON_BELT/CREW, STIFFY_SHORTS, ARCHER_KIT; spooky all D 444) | compacted 445 | 441 | approved | values: git show 8ace1e68:loop/LEDGER.md
pirateDress.ts:QUEEN_FRAME [R] 450 QUEEN_LEGLINE (trunk, deep, shoulders, pelvis, hips, tall, legs, pelvisCut, legSlim) + unitFactory tunicSkirt gate | .7, .85, .78, .75, .72, .65, .815, .5, .82; off, no cape (b5bd76ed) | 450 | approved | tall .76 legs .74 no cut/slim, tunicSkirt on (440-449); tall .85 legs 1 (438-439); tall 1 (437)
spooky.candlehead done 438-440 rows (CANDLE_TOWER, CANDLE_ROBE, CANDLE_BOOTS; a PASS, CONFIRM 440) | compacted 441 | 440 | approved | values: git show a46e87b8:loop/LEDGER.md

unitVisuals.ts:wild_west.miner MINER_BUILD [R] 457 (bulk, torsoWidth, legLength, upperLegWidth, lowerLegWidth) | .84, .92, 1.16, .88, .8 | 457 | approved | bulk 1.22, default torso and legs (before 457)
legacy_1 stats (cost, healthMultiplier, damageMultiplier, cooldownMultiplier, 8 units) | d PASS 6/8 (bearers deal no damage: an [S]) | 457 | stats | values: git show 5d6b5d24
propBuilder.ts:CHARGE_FLAG (long, thick, grip, ball, wide, tall, slab, edge, proud, emblem, glow) + LEGACY_GOLD, LEGACY_POLE | 1.55, .022, .3, .07, .48, .36, .012, .03, 1.8, .1, .15 | 457 | approved | staff log + orb (before 457)
propBuilder.ts:STAY_BANNER (long, grip, beam, bar, knob, spike, wide, tall, gap, edge, tower) | 1.5, .3, .62, .03, .05, .09, .27, .42, .03, .025, .08 | 457 | approved | staff log + orb (before 457)
proceduralAnimation.ts:uprightPole marker -> PRIEST_HOLD (a staff named staff with an uprightPole child) | Healer's planted hold | 457 | approved | staff slant + waving arm (before 457)
propBuilder.ts:TEAM_GLOVE (wide, squash, band, glow) | .11, .92, .025, .15 | 457 | approved | wide .17 (457 look); maroon ball on a cuff off the fist (before 457)
legacyDress.ts:POACHER_HAT (sides, crown, flare, tall, dome, brim, thick, band, glow, felt) | 10, 1.1, .92, .2, .12, 2.0, .04, .11, .12, (.17,.11,.07) | 457 | approved | hood dome over the face (before 457)
