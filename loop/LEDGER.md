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

432 | [R] MONKEY_BUILD scale 1.25 bulk .85, MONKEY_SHORTS to the knee, orange bands, dark wrap (82d77ccb) | dynasty.monkey_king.a | approved
432 | BARREL_GREAVES stave barrels on thighs and shins, braceLimb (11be8ee6) | pirate.blunderbuss.a | approved
432 | HARPOONER_PANTS beige rolled pants, skin shins (02534ee3, 6df6805c) | pirate.harpooner.a | approved
432 | CAPTAIN_LEGS tan pants, black knee boots, buckles (209964c9, 8a9e1309) | pirate.captain.a | approved
432 | QUEEN_SKIRT wrap flap, longer steeper skirt (4d8b3736) | pirate.pirate_queen.a | approved
432 | FLINTLOCK_LOCKS ginger strands in place of PIRATE_HAIR (0ddfd8fa, 6d30b7c6) | pirate.flintlock.a | approved
433 | [R] MONKEY_SHORTS leg cut off the knee joint, team shin + boot, orange knee band + anklet on a low shoe (d21e71e8, 890391e8) | dynasty.monkey_king.a | approved
433 | CAPTAIN_TRICORN peaked walls + raised crown (1543b25e) | pirate.captain.a | approved
433 | CAPTAIN_FRONT white laced shirt, tan V vest, team sash (5033a559) | pirate.captain.a | approved
433 | HARPOONER_SHOES brown foot, grey sock, skin strip, tongue + buckle (ad0be350, 17ca01c7) | pirate.harpooner.a | approved
433 | QUEEN_SKIRT frontDrop, trousers as pale leg meshes (c521e5f2) | pirate.pirate_queen.a | approved
433 | QUEEN_SHIRT team trunk + yoke, puffy sleeves, laced V (c9dcb0cd, c4ad8740) | pirate.pirate_queen.a | approved
434 | HARPOONER_SHOES shoe shell to .62 over the grass line, sock to the top (10346a0f, 8c62322b) | pirate.harpooner.a | approved
434 | QUEEN_DREADS spray up out of a tan wrap, bead-tipped side locks (2f1f2b92) | pirate.pirate_queen.a | approved
434 | VAMPIRE_CLAWS empty clawed hands, no weapon (b8e42cdb) | spooky.vampire.b | approved
434 | STIFFY_SHIELD studded team board on the off arm (d65f38af) | spooky.skeleton_warrior.b | approved
434 | PUMPKIN_SHOT jack-o-lantern projectile (008ebd5c) | spooky.pumpkin_catapult.c | approved
434 | FIRE_ARROW flame tongues round the arrow head (9c6221b2) | spooky.skeleton_archer.c | approved
434 | SPIRIT_FIRE cyan spirit-fire ball (7ae6e9c8) | spooky.candlehead.c | approved
435 | BURN status: flames on trunk/head/arms, tick + spread (d50527c4) | spooky.skeleton_archer.c | approved
435 | SPIRIT_LIFT knock-up on a spirit_fire hit (a575da38) | spooky.candlehead.c | approved
435 | STIFFY_FEAR purple skull + flee (c989b05a) | spooky.skeleton_warrior.c | approved
435 | PUMPKIN_BURST rind + bouncing lanterns (a7717979) | spooky.pumpkin_catapult.c | approved
435 | HARPOON_BAYONET round spike of gun length (1026d70e) | pirate.harpooner.b | approved
435 | SWORDCASTER_BOWL black bowl cut, hood off (0e2c1030) | spooky.swordcaster.a | approved
435 | REAPER_TENDRILS six dark tubes off the upper back (ae92e8fa) | spooky.reaper.a | approved
435 | [R] QUEEN_BOOTS build: scale/bulk, slimmer shirt+skirt, boots, broad sash (ae0de203) | pirate.pirate_queen.a | approved
436 | HARPOON_REST gun hung at the hip by its handle, muzzle down-forward, off hand free (b4465c82) | pirate.harpooner.b | approved
436 | STIFFY_SWORD short grey leaf blade, dark bar guard (63a08a9f) | spooky.skeleton_warrior.b | approved
436 | BONE_BOW cream femur, knob ends, team wraps, upright carry (b5fd9a36) | spooky.skeleton_archer.b | approved
436 | CANDLE_ARMS lumpy wax forearm candles + cyan flames, torch hidden (4202591b) | spooky.candlehead.b | approved
436 | SWORDCASTER_CUIRASS charcoal shell, ridge, team studs, chained padlock (89b8eb03) | spooky.swordcaster.a | approved
436 | REAPER_BURST violet ring + dark dome + shards at the scythe hit (30c492bd) | spooky.reaper.c | approved
436 | QUEEN_UPRIGHT rest stance, no crouch (bdf2f44d) | pirate.pirate_queen.a | approved

## Spent (never retry as [P])

## Rows

dynasty.monk + viking.brawler done (MONK_STAFF + MONK_REST, MONK_SWING, MONK_TROUSERS, MONK_ARM_PLATES, BRAWLER_BEARD, BRAWLER_HATCHET, NORSE_BOARD, FIRST_LUNGE) | compacted 419 | 418 | approved | values: git show f1bce224:loop/LEDGER.md
viking done 410-412 rows (LEG_WRAPS, ICE_ARCHER_QUIVER, ICE_NOCK, ICE_REST + grip seat) | compacted 413 | 412 | approved | values: git show e702238:loop/LEDGER.md
dynasty.ninja done 411-413 rows (NINJA_HOOD, SHURIKEN, NINJA_GI, SHURIKEN_FLIGHT, NINJA_TROUSERS) | compacted 415 | 413 | approved | values: git show 46161b8:loop/LEDGER.md
dynasty.* stats (cost, healthMultiplier, damageMultiplier, cooldownMultiplier, 7 units) | d PASS 7/7 | 411 | stats | values: git show cc4f7de
dynasty.samurai + firework_archer + monk done (KABUTO, KATANA_REST, KATANA_STEEL, SAMURAI_BLOCK + SLASH_ARC, SAMURAI_CUIRASS, SAMURAI_HAKAMA, ARCHER_HAIR, ARCHER_ROBE, ARCHER_LEGS, KASA_GOLD, FIREWORK_BOW/ROCKET/NOCK/BURST/REST, TENGU_MASK) | compacted 422 | 421 | approved | values: git show 268e1355:loop/LEDGER.md
dynasty.dragon done 416-431 rows (FLAME_JET + DRAGON_BREATH, DRAGON_FORM [R], DRAGON_CARRIER + poleColor + arm/fist, BODY_FLAMES, DRAGON_TRIM, DRAGON_HOLD) | compacted 432 | 431 | approved | values: git show 67890443:loop/LEDGER.md
dynasty.hwacha done (HWACHA_RACK, HWACHA_ROCKET, HWACHA_WHEEL, LAUNCH_SMOKE, HWACHA_SHAFT, HWACHA_TIMBER) | compacted 421 | 420 | approved | values: git show 7f580c19:loop/LEDGER.md
dynastyDress.ts:MONKEY_RUYI (long, thick, centre, sleeve, sleeveWide, cap) + MONKEY_TAIL (root, tip) | 1.7, .017, .16, .25, 1.3, .05; .045, .035 | 427 | approved | MONKEY_STAFF 1.35, .024, offset .12 L, ends .2 (416-426); bo_staff .85 (before 416)
simulationSystem.ts:BO_SHOVE monk; monkey_king (speed, lift) | 4.2, 2.4; 8.5, 5.5 (418) | 417-418 | approved | no throw (before 417)
ancient.minotaur 402-415 rows (MINO_GIRDLE, MINO_SHELL, BULL_HEAD, MINO_STRAP + .clear, MINO_LEGS, MINO_BARREL, MINO_ARMS, BULL_MUZZLE, MINO_LATHE) | compacted 420 | 415 | approved | values: git show a1460c56:loop/LEDGER.md
ancientDress.ts:MINO_STRAP (wide, proud) + MINO_GIRDLE (lo, hi, proudX, proudZ; off MINO_BARREL.profile) + MINO_CAP (inX, atY, radius, squash, droop, rim, swirl) + unitVisuals minotaur scale | .2, .04; -.08, .3, 1.07, 1.09; .98, .94, .72, .55, .4, .14, .6; 1.4 | 420 | approved | strap .44/.32, girdle -.3/.03/1.03/1.1 off the pelvis, MINO_SHELL plank, scale 2.1 (402-419)
dynastyDress.ts:MONKEY_CROWN (feather, featherWide, belly, stem, flat, spine, spineProud, lean) | 2.3, .55, .4, .3, .18, .14, .6, .32 | 424 | approved | rod feathers 2.6 x .2, lean .3 (420-423); torus crown hat (before 420)
dynastyDress.ts:MONKEY_FACE [R] (plate, chin, brow, cheek, cheekAt, browTall, browOut, muzzle, muzzleY, muzzleZ, strip) | .08, -1, .6, [.5,.42,.3], [.58,-.52,1], .22, .22, [.5,.42,.42], -.66, 1.2, .26 | 430 | approved | dark plate .1, muzzle box 1.1, 8 blond tufts (421-429); bare team head (before 421)
dynastyDress.ts:MONKEY_SHORTS [R] 433 (puffAt, puff, kneeOut, below, band, cuffOut, shoeTall, anklet, ankletOut, ankletDeep) | .5, 1.9, 1.12, 0 (hem at the knee joint), .12, 1.12 over the taper, .32, .15, 1.35, 1.45 | 433 | approved | hem .72 of the thigh mesh, band .08, shoeTall .45, anklet .24 at the boot top (432); hip 1.7 puff 2.3 knee 1.45 (422-431)
dynastyDress.ts:MONKEY_ROBE [R] (out, deep, under, band, bandFrom, bandTo; full width, no skirt, no cape) | 1.14, 1.18, .85, .08, [-.3,.7], [.95,-.85] | 430 | approved | left half edge .12, 2 gold strips .06 x .92 at [-.62,-.26] (422-429); tan trunk (before 422)
vehicleBuilder.ts:FRONT_SPLIT (hipOut, out, down, ahead, shinOut, shinAhead) + THROWER_SPLIT (out, down, ahead, shinOut, shinAhead) | .05, 1, .1, .12, .45, .1; 1, .3, .35, .6, .15 | 422 | approved | [R] reset: CREW_SEAT frontThigh -1.15/frontSplay .62/frontKnee .45 (Euler, crossed the knees) and THROWER_KNEES chest .55/out .2 targets (unreachable) (380-421); FRONT_SPLIT out .88/down .12/ahead .42 without the hip slide (403, rejected)
pirate 425-426 rows (TRICORN_BROWN, HARPOON_REEL, GUN_TOSS, BLUNDERBUSS + _AIM, CANNON_WHEEL, CUTLASS, CUTLASS_SLASH, PIRATE_KICK, BLUNDERBUSS_RECOIL, PISTOL_SHOT, BARREL_ARMOUR, OPEN_COAT, CANNON_SIGHT) | compacted 428 | 426 | approved | values: git show 0445ba6b:loop/LEDGER.md
pirate 423-424 rows (PISTOL + PISTOL_AIM, HARPOON_BREECH, CANNON_BARREL, TRICORN_PLATE, PIRATE_VEST, PIRATE_PANTS + PIRATE_SHORTS) | compacted 427 | 424 | approved | values: git show 613ba5b9:loop/LEDGER.md
pirate 427-428 rows (BOMB_SPIN + _POSE, BLUNDERBUSS_BLAST, PLANK_HAT, LAUNCH.cannonball, DRAGON_PISTOL, QUEEN_BANDANA, DRAGON_BLAST, CAPTAIN_COAT, QUEEN_SASH, BARREL_BRACERS, CANNON_HANDLES, CANNON_SHIRT) | compacted 430 | 428 | approved | values: git show 28adb4e4:loop/LEDGER.md
dynastyDress.ts:MONKEY_TRUNK (narrow, wraps, wrap, wrapOut, deep, step, tilt, wrapShade) + unitVisuals monkey_king (scale, bulk) | .7, 2, .11, 1.18, 1.25, .94, .08, .62; 1.25, .85 | 432 | approved | wrap team x1, scale 1.72 bulk 1.18 (before 432)
pirate.bomb_thrower done 429-431 rows (PIRATE_SOCKS, BOMB_SASH, PIRATE_BELT) | compacted 432 | 431 | approved | values: git show 67890443:loop/LEDGER.md
pirate.flintlock + blunderbuss + captain done 429-433 rows (PIRATE_HAIR, FLINTLOCK_LOCKS, PLAIN_SOCKS, CANNON_BANDANNA, BLUNDERBUSS_HAIR, BLUNDERBUSS, BARREL_GREAVES, CAPTAIN_PARROTS/BEARD/LEGS/TRICORN/FRONT) | compacted 435 | 433 | approved | values: git show b90a44ee:loop/LEDGER.md
dynastyDress.ts:MONKEY_HAIR (curls, curl, swell, midY, rx, ry, sweep, z, capOut, capFoot, capTop; color) | 11, .34, .25, -.15, 1.12, 1.05, 2.2, .72, 1.06, .55, 1.1; (.95,.52,.14) | 429 | approved | MONKEY_FACE tufts only (before 429)
propBuilder.ts:HARPOON_BAYONET [S] 435 (long of gun, thick, point, at, lug, below; steel) | 1, .014, .3, .85, .03, .01; (.2,.21,.23) | 435 | approved | flat blade .5 long, .04 wide, .012 thin, at .5; (.36,.37,.4) (429-434)
pirateDress.ts:PIRATE_BEARD (jaw, under, foot, ahead, burn, burnBack, burnFront, mouth, mouthTall; brown) | [1.14,_,.72], .06, -1.38, .46, .22, -.35, .62, .42, .16; (.18,.09,.06) | 430 | approved | none (before 430)
pirateDress.ts:QUEEN_DREADS (wrap, rootY, spray, thick, rise, lean, tip, droop, falls, drop, splay, bead) | .42, 1, 7, .2, 1.05, .8, .75, 1, 3, -1.9, .12, .26 | 434 | approved | QUEEN_HAIR pirateHair slabs + curl lumps side .36 drop -2 (430-433)
propBuilder.ts:QUEEN_CUTLASS (long, wide, taper, curve, segs, cup) | .66, .1, .5, .24, 7, 4.2 | 430 | approved | CUTLASS .5, .05, .55, .13, 6, 3.4 (425-429); CUTLASS bowl .38, rim .32 (431, bowl guard replaces the frustum cup)
pirateDress.ts:QUEEN_SKIRT (top, knee, out, flare, deep, slant, frontDrop, beads, bead, pale; flapWide, flapFoot, flapX, flapLong, flapProud, flapLean) | .14, 1.08, 1.04, 1.22, 1.1, .6, .4, 7, .11, .18; .6, .22, -.25, 1.3, .06, .12 | 435 | approved | out 1.06 flare 1.45 deep 1.25 (433-434); no frontDrop (431-432)
proceduralAnimation.ts:QUEEN_GUARD (out, ahead, drop, cross, lean, stagger) | .05, .14, .3, .6, .2, .04 | 431 | approved | blades held point-first, end-on (before 431)
unitVisuals.ts:pirate.harpooner scale | 1.3 | 431 | approved | 1.05 (before 431)
pirateDress.ts:HARPOONER_PANTS (beige, cuff; legs take the head skin) | (.78,.66,.5), .82 | 432 | approved | (.5,.43,.33) (432.3, taupe); team legs (before 432)
pirateDress.ts:HARPOONER_SHOES (shellTo, shellOut, shellLong, sockFrom, sockTo, tongue, buckle; brown, grey) | .62, 1.25, 1.12, .62, 1 (no skin ring), .55, .6; (.4,.2,.13), (.55,.48,.38) | 434 | approved | shell .45 (434.1); no shell, sock .34-.82, grey (.45,.4,.34) (433)
pirateDress.ts:QUEEN_SHIRT (shoulderOut, puff, puffAt, to, cuffOut, vee, veeLong, laces) | 1.2, 1.6, .3, .62, 1.1, .28, .34, 2 | 435 | approved | 1.45, 1.95, cuff 1.25 (433-434); bare arms (before 433)

spooky.* stats (cost, healthMultiplier, damageMultiplier, cooldownMultiplier, 7 units) | d PASS 7/7 | 434 | stats | values: git show 33bb56af
spookyDress.ts:VAMPIRE_CLAWS (grow, fingers, thick, knuckle, tip, curl, nail) + unitVisuals vampire weapon none | 1.3, 4, .2, .5, .45, 1.1, .35 | 434 | approved | "dagger" in both hands (before 434)
propBuilder.ts:STIFFY_SHIELD (board, rim, stud, studs, inner; x2.0 on the arm) | .3, 1.1, .016, 12, 4 | 434 | approved | buckler .18 grey (before 434)
spooky c mechanics 434-435 rows (PUMPKIN_SHOT, FIRE_ARROW, SPIRIT_FIRE, BURN + BURN_STATUS, SPIRIT_LIFT, FEAR_SKULL + STIFFY_FEAR, PUMPKIN_BURST) | compacted 436 | 435 | approved | values: git show e1126012:loop/LEDGER.md

spookyDress.ts:SWORDCASTER_BOWL (out, clear, crown, side, sideTo, front, back, nape) | 1.14, .05, .16, .16, .15, .45, .16, -.75 | 435 | approved | hood (before 435)
spookyDress.ts:REAPER_TENDRILS (rootX, rootY, long, out, back, rise, wave, waves, thick, tip) | .3, .55, 4.6, .88, .45, [.24,.04,-.16], .22, 1.6, .1, .18 | 435 | approved | none (before 435)
pirateDress.ts:QUEEN_BOOTS [R] (from, shaft, top, topTall, band, bandTall, bandAt; leather) + unitVisuals queen (scale, bulk) + QUEEN_SASH (wide, thick, proud, bomb, seat) | .12, 1.35, 1.7, .14, 1.42, .1, .34; (.45,.16,.1); 1.45, .85; .27, .1, .12, .25, .95 | 435 | approved | pale shins; 1.6, 1.2; sash .17, .08, .03, .2, .75 (428-434)
proceduralAnimation.ts:HARPOON_REST (drop, ahead, out, dip) | .27, .05, .07, .95 | 436 | approved | idle carry across the chest, off hand on the block (before 436)
propBuilder.ts:STIFFY_SWORD (long, base, belly, bellyAt, thick, point, guard, grip; steel) | .26, .03, .05, .55, .25, .22, 3.2, 1.6; (.42,.43,.45) | 436 | approved | slab sword .46 (before 436)
propBuilder.ts:BONE_BOW (long, thick, bow, knob, knobOut, wrapAt, wrap, grip; bone) | 1.15, .05, .025, .065, .026, .66, .06, .09; (1,.8,.48) | 436 | approved | plain brown bow .4 (before 436)
spookyDress.ts:CANDLE_ARMS (top, long, lumps, wide, wobble, swell, wick, flame; wax, fire) | .12, 2.2, 6, .78, .08, .18, .12, .48; (1,.84,.58), (.35,1.1,1.3) | 436 | approved | torch stick (before 436)
spookyDress.ts:SWORDCASTER_CUIRASS (out, deep, top, foot, ridge, proud, studs, stud, lock, lockY) | 1.16, 1.22, .04, -.75, .5, .12, 4, .16, .42, .3 | 436 | approved | none (before 436)
visualEffects.ts:REAPER_BURST (ring0, thick, dome0, dome, domeAlpha, shards, shard, out, up, life, fade) | 1.6, .22, 1.2, 4.2, .7, 8, .55, 3, 4.5, .9, .4 | 436 | approved | spark only (before 436)
proceduralAnimation.ts:QUEEN_UPRIGHT (tilt, stride, lean, chin) | .07, .08, .02, 0 | 436 | approved | hashed stance (before 436)
