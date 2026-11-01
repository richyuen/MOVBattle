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

451 | DYNAMITE_HOLD upright bundle at the belly in both hands (c3d7f4df) | wild_west.dynamite_thrower.b | rejected (no throw: c regression; reverted 8a086de6)
451 | LASSO_RAISE coil stood up in the world, loop over the fist (363add1b) | wild_west.lasso.b | approved (b PASS)
451 | _aimPick haft laid along the blow's aim, head on the man in front (1a48b2d8) | wild_west.miner.c | approved (c PASS)
451 | GUN_BELT dark belt, holster each hip (709dbc19) | wild_west.gunslinger.a | approved
451 | GUN_BELT belt, gun-hip holster, slanting brass pouch (1e4fd4d6) | wild_west.quick_draw.a | approved (a PASS)
451 | DEADEYE_SHIRT off-white puffy sleeves, cuffs, collar V (09138420) | wild_west.deadeye.a | approved
451 | [R] CACTUS_ROBE hem at the knee, spike rings, 3 flowers, slim boots, upright (1a160cdf) | wild_west.cactus.a | approved (struck 2, 4)
452 | DYNAMITE_HOLD resubmit + throwWindupCap 1 s (8326af8e) | wild_west.dynamite_thrower.b | approved (b PASS)
452 | DYNAMITE_SKIRT knee skirt, gold stripes per face, gold hem band (d87b2f79) | wild_west.dynamite_thrower.a | approved
452 | QUICK_DRAW_VEST team cloth body cloth, four grey buttons (1da9827a) | wild_west.quick_draw.a | approved
452 | GUNSLINGER_REST revolvers low by the thighs at rest (608df0a6) | wild_west.gunslinger.a | approved
452 | GUN_BELT pouch side list, deadeye pouch each hip (f7038a83) | wild_west.deadeye.a | approved
452 | MINER_BOOTS dark brown knee boots, turned top (e0e391fd) | wild_west.miner.a | approved (a PASS)
452 | CACTUS spikes tan, spike .55 base 1.15, hood ring 8 + crown 4 (81fef625) | wild_west.cactus.a | approved (a PASS)
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

## Spent (never retry as [P])

## Rows

dynasty.dragon done 416-431 rows (FLAME_JET + DRAGON_BREATH, DRAGON_FORM [R], DRAGON_CARRIER + poleColor + arm/fist, BODY_FLAMES, DRAGON_TRIM, DRAGON_HOLD) | compacted 432 | 431 | approved | values: git show 67890443:loop/LEDGER.md
dynasty.monkey_king + monk + crew split, ancient.minotaur strap/girdle, pirate beard done rows (MONKEY_RUYI/TAIL, BO_SHOVE, MONKEY_CROWN/FACE/SHORTS/ROBE/TRUNK/HAIR, FRONT_SPLIT, MINO_STRAP/GIRDLE/CAP, PIRATE_BEARD) | compacted 437 | 433 | approved | values: git show 3c42103f:loop/LEDGER.md
wild_west done 448-453 rows (MINER_BLAST, GUNSLINGER_SIDEBURNS/SUIT/REST/SHOES, CACTUS_ROBE [R] + boots/spines, QUICK_DRAW_SHIRT/VEST, GUN_BELT; cactus, gunslinger, quick_draw D) | compacted 455 | 453 | approved | values: git show fa4523ed:loop/LEDGER.md
pirate.bomb_thrower done 429-431 rows (PIRATE_SOCKS, BOMB_SASH, PIRATE_BELT) | compacted 432 | 431 | approved | values: git show 67890443:loop/LEDGER.md
pirate.flintlock + blunderbuss + captain done 429-433 rows (PIRATE_HAIR, FLINTLOCK_LOCKS, PLAIN_SOCKS, CANNON_BANDANNA, BLUNDERBUSS_HAIR, BLUNDERBUSS, BARREL_GREAVES, CAPTAIN_PARROTS/BEARD/LEGS/TRICORN/FRONT) | compacted 435 | 433 | approved | values: git show b90a44ee:loop/LEDGER.md
pirate.harpooner done 431-438 rows (HARPOON_BAYONET, scale 1.3, HARPOONER_PANTS, HARPOONER_SHOES, HARPOON_REST, HARPOON_BREECH [R]) | compacted 439 | 438 | approved | values: git show eb4676ee:loop/LEDGER.md
pirateDress.ts:QUEEN_DREADS (wrap, rootY, spray, thick, rise, lean, tip, droop, falls, drop, splay, bead) | .42, 1, 7, .2, 1.05, .8, .75, 1, 3, -1.9, .12, .26 | 434 | approved | QUEEN_HAIR pirateHair slabs + curl lumps side .36 drop -2 (430-433)
pirateDress.ts:QUEEN_SKIRT [R] 450 (top, knee, out, flare, deep, slant, frontRise, beads, bead, pale; flapWide, flapFoot, flapX, flapLong, flapProud, flapLean) | .06, .5, 1.04, 1.22, 1.1, .2 (to her right), .42, 7, .11, .3; .5, .12, .8, 1.45, .06, .12 | 450 | approved | top .14 knee 1.08 slant .6 (to her left) frontDrop .4 pale .18 flap .6/.22/-.25/1.3 (435-449); out 1.06 flare 1.45 deep 1.25 (433-434)
proceduralAnimation.ts:QUEEN_GUARD (out, ahead, drop, cross, lean, stagger) | .05, .14, .22, .6, .2, .04 | 450 | approved | drop .3 (431-449); blades held point-first, end-on (before 431)
pirateDress.ts:QUEEN_SHIRT (shoulderOut, puff, puffAt, to, cuffOut, vee, veeLong, laces) | 1.2, 1.6, .3, .62, 1.1, .28, .34, 2 | 435 | approved | 1.45, 1.95, cuff 1.25 (433-434); bare arms (before 433)

wild_west.* stats (cost, healthMultiplier, damageMultiplier, cooldownMultiplier, 7 units) | d PASS 7/7 | 444 | stats | values: git show 7aee94dc
spooky done 435-444 rows (REAPER_TENDRILS/BURST/LEGS/ROBE/IMPALE, STIFFY_GREAVES/UPRIGHT, BOOT_SHAFT, SKELETON_BONE, PUMPKIN_TIMBER/POSTS, VAMPIRE_VEST/BEARD/LATCH; spooky all D 444) | compacted 447 | 444 | approved | values: git show cbd79d83:loop/LEDGER.md
wild_west 444-447 rows (BULLET_RAIN, REVOLVER, BOWLER, LASSO_DRAG/ROPE, CACTUS_EXPLOSION/NEEDLES, MINER_PICK, GUNSLINGER_JACKET, PINTO_HEAD, LASSO_COIL, POLE_GRIP.minerHaft, QUICK_FAN, MINER_CAP, GUNSLINGER_TIE, CACTUS_SLEEVE) | compacted 451 | 447 | approved | values: git show 3ac8ee79:loop/LEDGER.md
wildWestDress.ts:FLAT_HAT (crown, flare, tall, brim, thick, band, shade, glow; quick_draw + lasso) | 1.12, .94, .24, 2.15, .04, .1, .85, .12 | 448 | approved | captain_hat / cowboy_hat (before 447-448)
propBuilder.ts:WINCHESTER (long, grip, bore, tube, rcv, rcvDeep, loop, fore, butt, tilt) | 1.12, .3, .03, .75, .14, 2.2, 2.6, .32, .12, -.2 | 448 | approved | MATCHLOCK musket (before 448)
wildWestDress.ts:MINER_OVERALLS (lift, strap, apart, proud, waist, over) | .35, .1, .22, .04, .22, 1.06 | 448 | approved | leather vest block + tunic skirt (before 448)
wildWestDress.ts:PEAK_HAT (sides, crown, brim, slope, peak, tall, shade; deadeye + dynamite_thrower) | 8, 1.12, 2.25, .3, .22, .6, .9 | 449 | approved | cowboy_hat (before 449)
propBuilder.ts:DYNAMITE_WIRES (thick, rise, lean, bend, curl, tail) | .012, .08, .35, .06, 1.1, .09 | 449 | approved | one tan fuse (before 449)
wildWestDress.ts:MINER_MOUSTACHE (long, thick, droop, at, proud, tip, tipDrop) | .8, .28, .32, -.38, .08, .22, .16 | 449 | approved | long .62 thick .2 tip .17 (449 look); none (before 449)
proceduralAnimation.ts:LASSO_RAISE (out, back, face) | .45, .15, -.6 | 451 | approved | coil rode the fist, loop hanging under it (446-450)
proceduralAnimation.ts:DYNAMITE_HOLD (size, side, up, front, lowGrip, highGrip, across, palmOff, right raise/turn/elbow, left raise/turn/elbow) + unitVisuals throwWindupCap | .78, .2, .06, .36, .45, .1, .1, .2, -.3/.15/-1.2, -.45/1.15/-1.9; cap 1 s | 452 | approved | bundle on the shoulder (before 452); hold through the fire, rejected (451)
wildWestDress.ts:DYNAMITE_SKIRT (long, flare, stripes, stripe, proud, band, bandOut, gold, glow, teamGlow) | 1.05, 1.35, 2, .09, .03, .12, 1.04, (.95,.78,.42), .3, .12 | 452 | approved | tunic hem at the hip (before 452)
wildWestDress.ts:MINER_BOOTS (from, to, out, cuffFrom, cuff, color, glow) | .14, 1.04, 1.25, .06, 1.45, (.12,.065,.04), .1 | 452 | approved | plain team feet (before 452)
wildWestDress.ts:DYNAMITE_BOOTS (from, to, out, cuffFrom, cuff, color, glow) | .46, 1.04, 1.3, .32, 1.6, (.07,.055,.05), .1 | 453 | approved | from .34 cuffFrom .2 (453 look); plain team feet (before 453)
wildWestDress.ts:DYNAMITE_SKIRT.teamGlow | 0 | 453 | approved | .12 (452)
wildWestDress.ts:WESTERN_BRAID (apart, rootUp, rootBack, footOut, footDrop, standOff, bow, plaits, thick, overlap, shade, band, tuft, hair, glow; deadeye side -1) | .42, .32, .12, .5, .85, .12, .18, 5, .3, 1.5, .75, .12, .2, (.36,.19,.09), .14 | 453 | approved | none (before 453)
proceduralAnimation.ts:MINER_UPRIGHT (tilt, stride, lean, chin) | .06, .12, .06, .06 | 453 | approved | hashed stance, sunk crouch chin -.22 (before 453)
proceduralAnimation.ts:PICK_SHOULDER (side, up, front, back, out, arm raise/turn/elbow) | .15, 1.25, .5, .3, .12, -1.6/.4/-1.7 | 454 | approved | .32, .95, .42 (453, fists at the chest); up .05 (453 probe); pick on the fist rest (before 453)
wildWestDress.ts:MINER_HAT (sides, crown, brim, slope, top, tall, tilt, shade, glow) | 8, 1.2, 1.85, .16, .86, .75, .14, .9, .12 | 454 | approved | MINER_CAP skullcap + bill (447-453)
proceduralAnimation.ts:WINCHESTER_AIM (ahead, inward, drop, kick, settle, up, down) + simulationSystem GUN_WARMUP (warmup) | .2, .06, .2, .12, 8, 60, 2.5; 1 s | 454 | approved | fired from the shoulder carry (before 454)
projectileSystem.ts:RIFLE_TRACER (thick, hold, life; deadeye) | .035, .12, .3 | 455 | approved | none: only a muzzle puff (before 455)
wildWestDress.ts:DYNAMITE_SHIRT (shade, sleeveShade, glow, upperOut, lowerOut) | .85, .35, .12, 1.22, 1.2 | 455 | approved | sleeveShade .7 (455 look: pale); secret_bandit body cloth (before 455)
wildWestDress.ts:MINER_LEGS (shade, glow, out, shinOut, shinTo) + MINER_SLEEVES (upperOut, lowerOut, cuffFrom, cuffOut, glove, glow) | .3, .12, 1.18, 1.12, .3; 1.22, 1.18, .55, 1.55, (.72,.5,.26), .15 | 455 | approved | shade .55 (455 look: pale); bare team legs and arms (before 455)
wildWestDress.ts:LASSO_MOUSTACHE (long, thick, droop, at, proud, curl, curlThick) | .66, .26, .12, -.36, .08, .36, .13 | 455 | approved | none (before 455)
propBuilder.ts:PINTO_LEGS (fore, hind, sides, deep, foot, cannon, fetlock, hoof, hoofTall) | .22, .27, 6, 1.15, .12, .085, .065, .15, .09 | 455 | approved | barded wedges .36/.44 x1.45, hoof .27 (before 455)
propBuilder.ts:PINTO_HEAD (wide, long, deep, muzzle, muzzleAt) + PINTO_BEAD (disc, thick, proud, pupil, look) | .6, .6, .54, .46, .7; .3, .07, .03, .48, .18 | 454 | approved | long thin box snout (447-453)
propBuilder.ts:PINTO_COAT, PINTO_CREAM, PINTO_NOGLOW (cloth, out of the glow layer) | (1,.3,.06), (.9,.55,.34), true | 453 | approved | (1,.5,.16)/(1,.76,.54) read yellow/white (453 probe); (.95,.42,.1)/(1,.93,.78) wood in the glow (before 453)
wildWestDress.ts:DEADEYE_SHIRT (upperOut, lowerOut, lowerTo, cuffOut, vee, veeLong, color, glow) | 1.75, 1.95, .8, 1.35, .46, .4, (.95,.9,.74), .32 | 451 | approved | bare arms (before 451)
spooky.* stats (cost, healthMultiplier, damageMultiplier, cooldownMultiplier, 7 units) | d PASS 7/7 | 434 | stats | values: git show 33bb56af
spooky b props 434-436 rows (VAMPIRE_CLAWS, STIFFY_SHIELD, STIFFY_SWORD, BONE_BOW, CANDLE_ARMS; b PASS) | compacted 440 | 436 | approved | values: git show 93103dfd:loop/LEDGER.md
spooky c mechanics 434-435 rows (PUMPKIN_SHOT, FIRE_ARROW, SPIRIT_FIRE, BURN + BURN_STATUS, SPIRIT_LIFT, FEAR_SKULL + STIFFY_FEAR, PUMPKIN_BURST) | compacted 436 | 435 | approved | values: git show e1126012:loop/LEDGER.md

spooky.swordcaster done 435-437 rows (SWORDCASTER_BOWL, SWORDCASTER_CUIRASS, SWORDCASTER_SKIRT) | compacted 440 | 437 | approved | values: git show 93103dfd:loop/LEDGER.md
pirateDress.ts:QUEEN_BOOTS [R] 450 (from, shaft, top, topTall, band, bandTall, bandAt; leather) + unitVisuals queen (scale, bulk) + QUEEN_SASH (wide, thick, proud, bomb, seat) | .38, 1.2, 1.32, .1, 1.26, .1, .52; (.45,.16,.1); 1.2 (439 [P], root exception spent), .85; .27, .1, .12, .25, .95 | 450 | approved | .12, 1.35, 1.7, .14, 1.42, .1, .34 (439-449); scale 1.45 (435-438); pale shins; sash .17, .08, .03, .2, .75 (428-434)
proceduralAnimation.ts:QUEEN_UPRIGHT (tilt, stride, lean, chin) | .07, .08, .02, 0 | 436 | approved | hashed stance (before 436)

spooky done 437-441 rows (STIFFY_HELMET, SKELETON_HOOD, VAMPIRE_BAT/HAIR/COLLAR, RIB_CRADLE, BONE_FRAME, CATAPULT_BANNER, SKELETON_BELT/CREW, STIFFY_SHORTS, ARCHER_KIT; spooky all D 444) | compacted 445 | 441 | approved | values: git show 8ace1e68:loop/LEDGER.md
pirateDress.ts:QUEEN_FRAME [R] 450 QUEEN_LEGLINE (trunk, deep, shoulders, pelvis, hips, tall, legs, pelvisCut, legSlim) + unitFactory tunicSkirt gate | .7, .85, .78, .75, .72, .65, .815, .5, .82; off, no cape (b5bd76ed) | 450 | approved | tall .76 legs .74 no cut/slim, tunicSkirt on (440-449); tall .85 legs 1 (438-439); tall 1 (437)
spooky.candlehead done 438-440 rows (CANDLE_TOWER, CANDLE_ROBE, CANDLE_BOOTS; a PASS, CONFIRM 440) | compacted 441 | 440 | approved | values: git show a46e87b8:loop/LEDGER.md

