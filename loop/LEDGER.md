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
458 | [R] MINER_HAT slouched: lampshade brim, tapered crown, blunt cap (db88c15a) | wild_west.miner.a | approved (struck 1, added 2: eyes; CONFIRM failed a)
458 | PEASANT_HOOD resubmit, gap turned onto the face (2692a0f1) | legacy.peasant.a | approved (struck 2)
458 | POLE_GRIP.bearerPole off fist on the shaft (6864fd6b) | legacy.flag_bearer.b + legacy.banner_bearer.b | approved (none struck)
458 | STAY_BANNER beam 1.0 H, banners at its ends (20dbf14b) | legacy.banner_bearer.b | approved (struck 4)
458 | POACHER_HAIR pale side locks, back sheet, braids (07b24943) | legacy.poacher.a | approved (struck 2)
458 | barrel roller lanky build 1.00x (336bafe3) | legacy.barrel_roller.a | approved (struck 1)
459 | [R] MINER_LOOK hat lift .2 H slope .22, shirt lift 0 (5bbb0646) | wild_west.miner.a | approved (a PASS; CONFIRM passed a; miner D)
459 | BEARER_RING ground torus round the bearer, team colour (502c506c) | legacy.flag_bearer.c + legacy.banner_bearer.c | approved (struck 2 each; flag added 3 ring colour)
459 | flag bearer scale 1.34 -> 1.0, bulk .92 (f1844412) | legacy.flag_bearer.a | approved (struck 5)
459 | BOXER_HEADGEAR padded team shell, ear pads (17904d07) | legacy.boxer.a | approved (struck 2, 5)
459 | PEASANT_DRESS team dress, short sleeves, knee skirt, front point (b3a3379d) | legacy.peasant.a | approved (struck 4)
459 | POACHER_COAT brown sleeveless coat, skirt, white fur collar (cbf64ff2) | legacy.poacher.a | approved (struck 3)
459 | SHAKO tall team shako, peak, gold plate and band, plume (44da9220) | legacy.banner_bearer.a | approved (struck 1, 4)

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
wild_west.miner done 447-459 rows (MINER_OVERALLS/MOUSTACHE/BOOTS/UPRIGHT/HAT [R]/LEGS/SLEEVES/BUILD [R], PICK_SHOULDER; 459 hat lift .2 slope .22, shirt lift 0; miner D 459, wild_west all D) | compacted 459 | 459 | approved | values: git show 44da9220:loop/LEDGER.md
spooky.* stats (cost, healthMultiplier, damageMultiplier, cooldownMultiplier, 7 units) | d PASS 7/7 | 434 | stats | values: git show 33bb56af
spooky b props 434-436 rows (VAMPIRE_CLAWS, STIFFY_SHIELD, STIFFY_SWORD, BONE_BOW, CANDLE_ARMS; b PASS) | compacted 440 | 436 | approved | values: git show 93103dfd:loop/LEDGER.md
spooky c mechanics 434-435 rows (PUMPKIN_SHOT, FIRE_ARROW, SPIRIT_FIRE, BURN + BURN_STATUS, SPIRIT_LIFT, FEAR_SKULL + STIFFY_FEAR, PUMPKIN_BURST) | compacted 436 | 435 | approved | values: git show e1126012:loop/LEDGER.md

spooky.swordcaster done 435-437 rows (SWORDCASTER_BOWL, SWORDCASTER_CUIRASS, SWORDCASTER_SKIRT) | compacted 440 | 437 | approved | values: git show 93103dfd:loop/LEDGER.md
pirateDress.ts:QUEEN_BOOTS [R] 450 (from, shaft, top, topTall, band, bandTall, bandAt; leather) + unitVisuals queen (scale, bulk) + QUEEN_SASH (wide, thick, proud, bomb, seat) | .38, 1.2, 1.32, .1, 1.26, .1, .52; (.45,.16,.1); 1.2 (439 [P], root exception spent), .85; .27, .1, .12, .25, .95 | 450 | approved | .12, 1.35, 1.7, .14, 1.42, .1, .34 (439-449); scale 1.45 (435-438); pale shins; sash .17, .08, .03, .2, .75 (428-434)
proceduralAnimation.ts:QUEEN_UPRIGHT (tilt, stride, lean, chin) | .07, .08, .02, 0 | 436 | approved | hashed stance (before 436)

spooky done 437-441 rows (STIFFY_HELMET, SKELETON_HOOD, VAMPIRE_BAT/HAIR/COLLAR, RIB_CRADLE, BONE_FRAME, CATAPULT_BANNER, SKELETON_BELT/CREW, STIFFY_SHORTS, ARCHER_KIT; spooky all D 444) | compacted 445 | 441 | approved | values: git show 8ace1e68:loop/LEDGER.md
pirateDress.ts:QUEEN_FRAME [R] 450 QUEEN_LEGLINE (trunk, deep, shoulders, pelvis, hips, tall, legs, pelvisCut, legSlim) + unitFactory tunicSkirt gate | .7, .85, .78, .75, .72, .65, .815, .5, .82; off, no cape (b5bd76ed) | 450 | approved | tall .76 legs .74 no cut/slim, tunicSkirt on (440-449); tall .85 legs 1 (438-439); tall 1 (437)
spooky.candlehead done 438-440 rows (CANDLE_TOWER, CANDLE_ROBE, CANDLE_BOOTS; a PASS, CONFIRM 440) | compacted 441 | 440 | approved | values: git show a46e87b8:loop/LEDGER.md

legacy_1 stats (cost, healthMultiplier, damageMultiplier, cooldownMultiplier, 8 units) | d PASS 6/8 (bearers deal no damage: an [S]) | 457 | stats | values: git show 5d6b5d24
propBuilder.ts:CHARGE_FLAG (long, thick, grip, ball, wide, tall, slab, edge, proud, emblem, glow) + LEGACY_GOLD, LEGACY_POLE | 1.55, .022, .3, .07, .48, .36, .012, .03, 1.8, .1, .15 | 457 | approved | staff log + orb (before 457)
propBuilder.ts:STAY_BANNER (long, grip, beam, bar, knob, spike, wide, tall, inset, edge, tower) | 1.5, .3, 1.0, .03, .05, .09, .27, .42, .02, .025, .08 | 458 | approved | beam .62, banners .03 apart at the pole (457); staff log + orb (before 457)
proceduralAnimation.ts:uprightPole marker -> PRIEST_HOLD + POLE_GRIP.bearerPole (off fist span) | Healer's planted hold; [.06, .24] | 458 | approved | one hand, the other raised (457); staff slant (before 457)
propBuilder.ts:TEAM_GLOVE (wide, squash, band, glow, shade) | .11, .92, .025, .06, .5 | 458 | approved | glow .15 x1 near-white (457); wide .17 (457 look); maroon ball off the fist (before 457); no further [P] on its colour
legacyDress.ts:POACHER_HAT (sides, crown, flare, tall, dome, brim, thick, band, glow, felt) | 10, 1.1, .92, .2, .12, 2.0, .04, .11, .12, (.17,.11,.07) | 457 | approved | hood dome over the face (before 457)
legacyDress.ts:POACHER_HAIR (side, top, foot, back, front, braid, braidFoot, knots, color, glow) | .22, .55, 1.25, 1.05, .45, .14, 1.75, 4, (.92,.92,.9), .22 | 458 | approved | none (before 458)
unitVisuals.ts:legacy.barrel_roller build (scale, bulk, legLength, armLength, upperLegWidth, lowerLegWidth) | 1.0, .82, 1.08, 1.06, .9, .85 | 458 | approved | 1.24, 1.48 brute (before 458)
legacyDress.ts:PEASANT_HOOD (wide, deep, tall, at, open, peak, back, collar, collarTall, neck, shade, glow) + rotation.y +PI | 1.24, 1.2, 1.2, .42, .34, .28, .08, 1.32, .24, 1.02, .72, .12 | 458 | approved | gap at the back (457 rejected)
legacyDress.ts:BEARER_RING (radius, band, flat, lift, sides, glow) | 1.6, .05, .012, .02, 40, .45; team colour | 459 | approved | none (before 459)
unitVisuals.ts:legacy.flag_bearer build (scale, bulk, headSize) | 1.0, .92, 1.05 | 459 | approved | 1.34 (before 459)
legacyDress.ts:BOXER_HEADGEAR (wide, deep, tall, at, open, ear, earThick, earOut, earAt, shade, glow) | 1.16, 1.12, .95, .38, .36, .46, .14, .6, .55, .6, .1 | 459 | approved | bald (before 459)
legacyDress.ts:PEASANT_DRESS (shade, glow, sleeveOut, sleeveTo, long, flare, point, pointLong, proud) | .72, .12, 1.3, .5, 1.0, 1.35, .5, .22, .02 | 459 | approved | plain team body (before 459)
legacyDress.ts:POACHER_COAT (leather, fur, glow, long, flare, tufts, tuft, ring, furGlow) | (.36,.2,.1), (.95,.94,.9), .14, .6, 1.45, 10, .24, .5, .25 | 459 | approved | plain team body (before 459)
legacyDress.ts:SHAKO (wide, flare, tall, peak, plate, plateTall, band, plume, plumeWide, shade, glow) | 1.02, 1.12, .95, .42, .42, .34, .08, .42, .22, .85, .12 | 459 | approved | bald (before 459)
