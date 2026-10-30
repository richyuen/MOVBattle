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
429 | PIRATE_HAIR locks from under the cap to the shoulders (a216eda0, 70fa9c2c) | pirate.flintlock.a | approved
429 | PIRATE_SOCKS team/grey ringed socks (784eeeca) | pirate.bomb_thrower.a | approved
429 | CANNON_BANDANNA brimless dome, crew cap off (1f3e8df6) | pirate.cannon.a | approved
429 | MONKEY_HAIR curl ring + crown hair (e6fad918) | dynasty.monkey_king.a | approved
429 | DRAGON_TRIM orange collar, hem, cuffs on every carrier (3b24b339) | dynasty.dragon.a | approved
429 | DRAGON_HOLD _holdDragonPole, pole in at the chest (df5dd028) | dynasty.dragon.b | approved
429 | HARPOON_BAYONET lug + blade under the nozzle (37ea2e85) | pirate.harpooner.b | approved
430 | PLAIN_SOCKS grey sock cuff to shoe (4fd14183) | pirate.flintlock.a | approved
430 | BOMB_SASH band, pouch, bomb at the right hip (9c97ba97, 4ce95061) | pirate.bomb_thrower.a | approved
430 | PIRATE_BEARD jaw mass, sideburns, mouth (a2de9843) | pirate.harpooner.a | approved
430 | BLUNDERBUSS_HAIR pirateHair bob + crown cap (ed8b9edd) | pirate.blunderbuss.a | approved
430 | QUEEN_HAIR black locks, curls, tan beads (7899b9c6) | pirate.pirate_queen.a | approved
430 | CAPTAIN_PARROTS blue + red on the tricorn (674c7165) | pirate.captain.a | approved
430 | QUEEN_CUTLASS big curved main-hand blade (83f4e760) | pirate.pirate_queen.b | approved
430 | [R] MONKEY_FACE peach mask + MONKEY_ROBE team, orange band, no skirt/cape (80235174) | dynasty.monkey_king.a | approved
431 | [R] DRAGON_FORM lion-dog head (cheeks, beak, cream brow, horns, hanging tongue) + tube body, crest, frills (3e94ecfa, 48329bf4) | dynasty.dragon.a | approved
431 | team CANNON_BANDANNA on flintlock + bomb thrower, accent bandana hat off (6561ba6f) | pirate.flintlock.a | approved
431 | PIRATE_BELT leather band + square tan buckle (8d798815, 67e6d6eb) | pirate.bomb_thrower.a | approved
431 | CAPTAIN_BEARD pirateBeard brown + moustache + chest run (927e8a7a, ee1ab3a9) | pirate.captain.a | approved
431 | CUTLASS bowl guard + rolled rim (3021427b) | pirate.captain.b | approved
431 | QUEEN_GUARD _restQueenBlades crossed blades at rest (fe03e273) | pirate.pirate_queen.b | approved
431 | QUEEN_SKIRT wrap skirt, slanted hem, green beads, pale pants (d06b4abd) | pirate.pirate_queen.a | approved
431 | BLUNDERBUSS rebuilt full length (8addafc1) | pirate.blunderbuss.b | approved
431 | [P] unitVisuals harpooner scale 1.05 -> 1.3 (ec00c268) | pirate.harpooner.a | approved

## Spent (never retry as [P])

## Rows

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
dynastyDress.ts:DRAGON_FORM [R] (cheek, cheekAt, lip, rim, rimY, nose, eye, eyeAt, brow, browY, horn, jaw, jawY, tongue, tongueWide, tongueTo; bodyR, taper, crest, frill) | .5, [.5,-.3,.72], .38, 1.85, -.74, [.55,.7], .17, [.46,.3], [.72,.17,.24], .66, .15, .58, -1.32, .11, 2.4, .72; .24, .5, .24, .13 | 431 | approved | box snout + DRAGON_MUZZLE, band on edge tall .6 + scallops/fins (416-430): git show 3d4a557c:loop/LEDGER.md
dynasty.hwacha done (HWACHA_RACK, HWACHA_ROCKET, HWACHA_WHEEL, LAUNCH_SMOKE, HWACHA_SHAFT, HWACHA_TIMBER) | compacted 421 | 420 | approved | values: git show 7f580c19:loop/LEDGER.md
dynastyDress.ts:MONKEY_RUYI (long, thick, centre, sleeve, sleeveWide, cap) + MONKEY_TAIL (root, tip) | 1.7, .017, .16, .25, 1.3, .05; .045, .035 | 427 | approved | MONKEY_STAFF 1.35, .024, offset .12 L, ends .2 (416-426); bo_staff .85 (before 416)
simulationSystem.ts:BO_SHOVE monk; monkey_king (speed, lift) | 4.2, 2.4; 8.5, 5.5 (418) | 417-418 | approved | no throw (before 417)
dynastyDress.ts:DRAGON_CARRIER (every, leg, legLong, trunk, head, arm, grip) | 3, .09, .35 (418; .45 at 417), [.26,.32,.16], .17, .06, .16 | 417 | approved | no carriers (before 417)
dynastyDress.ts:DRAGON_CARRIER.poleColor | (.85,.24,.12) | 418 | approved | team (417)
visualEffects.ts:BODY_FLAMES (tongues, spread, low, high, tall, wide, flicker) + DRAGON_BREATH.burn | 9, .2, .55, 1.35, .42, .17, 13; 3 | 419 | approved | none (before 419)
ancient.minotaur 402-415 rows (MINO_GIRDLE, MINO_SHELL, BULL_HEAD, MINO_STRAP + .clear, MINO_LEGS, MINO_BARREL, MINO_ARMS, BULL_MUZZLE, MINO_LATHE) | compacted 420 | 415 | approved | values: git show a1460c56:loop/LEDGER.md
ancientDress.ts:MINO_STRAP (wide, proud) + MINO_GIRDLE (lo, hi, proudX, proudZ; off MINO_BARREL.profile) + MINO_CAP (inX, atY, radius, squash, droop, rim, swirl) + unitVisuals minotaur scale | .2, .04; -.08, .3, 1.07, 1.09; .98, .94, .72, .55, .4, .14, .6; 1.4 | 420 | approved | strap .44/.32, girdle -.3/.03/1.03/1.1 off the pelvis, MINO_SHELL plank, scale 2.1 (402-419)
dynastyDress.ts:MONKEY_CROWN (feather, featherWide, belly, stem, flat, spine, spineProud, lean) | 2.3, .55, .4, .3, .18, .14, .6, .32 | 424 | approved | rod feathers 2.6 x .2, lean .3 (420-423); torus crown hat (before 420)
dynastyDress.ts:DRAGON_CARRIER (arm, eye, hairTall, bun, fist, fistAt, poleAhead, elbowOut; arm material, fist material) | .075, .28, .22, .2, .09, .56, .07, .05; trousers, dark | 422 | approved | pole beside the head poleSide .17, fists at .99 h on one straight skin arm each (420-421; [P] 421 arm .1, fist .12 skin rejected as a ledger reversal); arm .06, pole through the head (417-419)
dynastyDress.ts:MONKEY_FACE [R] (plate, chin, brow, cheek, cheekAt, browTall, browOut, muzzle, muzzleY, muzzleZ, strip) | .08, -1, .6, [.5,.42,.3], [.58,-.52,1], .22, .22, [.5,.42,.42], -.66, 1.2, .26 | 430 | approved | dark plate .1, muzzle box 1.1, 8 blond tufts (421-429); bare team head (before 421)
dynastyDress.ts:MONKEY_SHORTS (hipOut, puffAt, puff, kneeOut, kneeTo, cuffOut, shoeOut, shoeTall, toe, toeWide, toeLift, anklet, ankletOut) | 1.7, .5, 2.3, 1.45, .14, 1.6, 1.15, .78, 1.2, 1.5, .55, .4, 1.25 | 422 | approved | puff 2.7, hip 1.8, knee 1.5 (422.3, ballooned); slim trouser legs, plain boots (before 422)
dynastyDress.ts:MONKEY_ROBE [R] (out, deep, under, band, bandFrom, bandTo; full width, no skirt, no cape) | 1.14, 1.18, .85, .08, [-.3,.7], [.95,-.85] | 430 | approved | left half edge .12, 2 gold strips .06 x .92 at [-.62,-.26] (422-429); tan trunk (before 422)
vehicleBuilder.ts:FRONT_SPLIT (hipOut, out, down, ahead, shinOut, shinAhead) + THROWER_SPLIT (out, down, ahead, shinOut, shinAhead) | .05, 1, .1, .12, .45, .1; 1, .3, .35, .6, .15 | 422 | approved | [R] reset: CREW_SEAT frontThigh -1.15/frontSplay .62/frontKnee .45 (Euler, crossed the knees) and THROWER_KNEES chest .55/out .2 targets (unreachable) (380-421); FRONT_SPLIT out .88/down .12/ahead .42 without the hip slide (403, rejected)
pirate 425-426 rows (TRICORN_BROWN, HARPOON_REEL, GUN_TOSS, BLUNDERBUSS + _AIM, CANNON_WHEEL, CUTLASS, CUTLASS_SLASH, PIRATE_KICK, BLUNDERBUSS_RECOIL, PISTOL_SHOT, BARREL_ARMOUR, OPEN_COAT, CANNON_SIGHT) | compacted 428 | 426 | approved | values: git show 0445ba6b:loop/LEDGER.md
pirate 423-424 rows (PISTOL + PISTOL_AIM, HARPOON_BREECH, CANNON_BARREL, TRICORN_PLATE, PIRATE_VEST, PIRATE_PANTS + PIRATE_SHORTS) | compacted 427 | 424 | approved | values: git show 613ba5b9:loop/LEDGER.md
pirate 427-428 rows (BOMB_SPIN + _POSE, BLUNDERBUSS_BLAST, PLANK_HAT, LAUNCH.cannonball, DRAGON_PISTOL, QUEEN_BANDANA, DRAGON_BLAST, CAPTAIN_COAT, QUEEN_SASH, BARREL_BRACERS, CANNON_HANDLES, CANNON_SHIRT) | compacted 430 | 428 | approved | values: git show 28adb4e4:loop/LEDGER.md
dynastyDress.ts:MONKEY_TRUNK (narrow, wraps, wrap, wrapOut, deep, step, tilt) | .7, 2, .11, 1.18, 1.25, .94, .08 | 428 | approved | full-width trunk (before 428)
pirateDress.ts:PIRATE_HAIR (out, clear, top, side, drop, front, splay, back; flintlock colour team x) | 1.08, .06, .62, .28, -1.7, .25, .12, .2; .42 | 429 | approved | crown cap slab, team x.55 (429.1); none (before 429)
pirateDress.ts:PIRATE_SOCKS (from, top, topOut, bands, to, out, shade; grey) | .22, .34, 1.5, 6, .98, 1.3, .8; (.5,.49,.47) | 429 | approved | bare shins (before 429)
pirateDress.ts:CANNON_BANDANNA (out, clear, rise, back, knot, segments, shade) | 1.22, .05, .12, .04, .32, 6, .8 | 429 | approved | dressCannonCrew crewCap + peak (before 429)
dynastyDress.ts:MONKEY_HAIR (curls, curl, swell, midY, rx, ry, sweep, z, capOut, capFoot, capTop; color) | 11, .34, .25, -.15, 1.12, 1.05, 2.2, .72, 1.06, .55, 1.1; (.95,.52,.14) | 429 | approved | MONKEY_FACE tufts only (before 429)
dynastyDress.ts:DRAGON_TRIM (collar, hem, out, cuff, sleeve, bodyCollar, bodyHem, limbCuff, limbOut) | .04, .045, 1.14, .05, 1.5, .1, .1, .16, 1.5 | 429 | approved | none (before 429)
proceduralAnimation.ts:DRAGON_HOLD (top, low) + dynastyDress FRONT_GRIP.ahead | .28, .22; .22 | 429 | approved | pole foot at D.headZ*.8 (.4 h), no hold (before 429)
propBuilder.ts:HARPOON_BAYONET (long, wide, thin, point, at, lug, below; steel) | .5, .04, .012, .18, .5, .03, .01; (.36,.37,.4) | 429 | approved | none (before 429)
pirateDress.ts:PLAIN_SOCKS (from, out; grey) | .46, 1.24; (.45,.4,.34) | 430 | approved | bare shins (before 430)
pirateDress.ts:BOMB_SASH (wide, thick, fromX, fromY, toX, toY, proud, pouch, bomb, seat, shade) | .16, .1, -.75, -.92, 1.2, -1.25, .4, .3, .3, .55, .85 | 430 | approved | toX 1.02 toY -1.42 proud .06 (430.2, buried); none (before 430)
pirateDress.ts:PIRATE_BEARD (jaw, under, foot, ahead, burn, burnBack, burnFront, mouth, mouthTall; brown) | [1.14,_,.72], .06, -1.38, .46, .22, -.35, .62, .42, .16; (.18,.09,.06) | 430 | approved | none (before 430)
pirateDress.ts:BLUNDERBUSS_HAIR (top, drop, side, cap; color) | .95, -1.55, .3, 1.1; (.28,.135,.09) | 430 | approved | none (before 430)
pirateDress.ts:QUEEN_HAIR (side, drop, splay, curls, curl, beads, bead) | .36, -2, .16, 4, .42, 3, .18 | 430 | approved | none (before 430)
pirateDress.ts:CAPTAIN_PARROTS (x, y, z, size, turn, body, head, headY, beak, tail, tailLean) | 1.15, .55, .35, 1, .35, [.32,.5,.34], .27, 1.05, .16, .75, .45 | 430 | approved | none (before 430)
propBuilder.ts:QUEEN_CUTLASS (long, wide, taper, curve, segs, cup) | .66, .1, .5, .24, 7, 4.2 | 430 | approved | CUTLASS .5, .05, .55, .13, 6, 3.4 (425-429); CUTLASS bowl .38, rim .32 (431, bowl guard replaces the frustum cup)
pirateDress.ts:PIRATE_BELT (tall, at, out, deep, buckle, bar, proud; leather, tan) | .18, -.6, 1.18, 1.4, .34, .2, .06; (.62,.22,.1), (.8,.6,.35) | 431 | approved | at -.84 tall .13 (431.3, hid behind the sash); none (before 431)
pirateDress.ts:CAPTAIN_BEARD (tash, tashTall, tashAhead, droop, run, proud; color) | 1.15, .2, .1, .22, [.46,.42,.34], .3; (.4,.2,.12) | 431 | approved | run [.44,.34,.3] proud .42 lower (431.4, floated); none (before 431)
pirateDress.ts:QUEEN_SKIRT (top, knee, out, flare, deep, slant, beads, bead, pantsOut, shin, pale; green) | .14, .92, 1.06, 1.45, 1.25, .32, 7, .11, 1.14, .6, .4; (.12,.55,.3) | 431 | approved | none (before 431)
proceduralAnimation.ts:QUEEN_GUARD (out, ahead, drop, cross, lean, stagger) | .05, .14, .3, .6, .2, .04 | 431 | approved | blades held point-first, end-on (before 431)
propBuilder.ts:BLUNDERBUSS [S] (long, grip, bore, flare, mouth, stock, fore, ramrod, wrist, heel, drop, offAt) | .92, .3, .05, .42, 2.8, 1.3, .84, .24, .75, .15, .28, .42 | 431 | approved | .62, .24, .075, bell .2, 3.3, 1.2, .62, heel .16, offAt .5 (425-430)
unitVisuals.ts:pirate.harpooner scale | 1.3 | 431 | approved | 1.05 (before 431)
