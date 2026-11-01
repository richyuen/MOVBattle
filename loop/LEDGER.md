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

460 | BANNER_COATEE team coat, gold epaulettes, white cross-belt and waist belt (16dedb8c) | legacy.banner_bearer.a | approved (struck 2)
460 | FLAG_HELMET white crown, gold band and plate, team crest (53a654d8) | legacy.flag_bearer.a | approved (struck 1)
460 | BOXER_SHORTS dark-team thigh shells, gold striped waistband (37bcb6d4) | legacy.boxer.a | approved (struck 3)
460 | PEASANT_BELT 12 cream lumps, twisted by turns (9012c361) | legacy.peasant.a | approved (none struck: spaced shards)
460 | POACHER_BELT tan band, grey buckle (59057417) | legacy.poacher.a | approved (none struck: inside the coat)
460 | BEARER_AURA haste / stay on allies in the ring, a ring at their feet, in place of the heal (f1ecb6fc) | legacy.flag_bearer.c + legacy.banner_bearer.c | approved (none struck: not seen in the pair; evidence first)
461 | BANNER_CUFFS white wrist cuffs (e0b0812b) | legacy.banner_bearer.a | approved (struck 3, a PASS)
461 | BOXER_BOOTS team shafts, white crossed laces (66d5aaff) | legacy.boxer.a | approved (struck 4)
461 | FLAG_JACKET team coat, gold placket and collar (a397cd1f) | legacy.flag_bearer.a | approved (struck 2)
461 | PEASANT_LEGS cuffed pants, tan socks, brown shoes (a1d34191) | legacy.peasant.a | approved (struck 6)
461 | PEASANT_FRINGE dark locks out of the hood (5978f032) | legacy.peasant.a | approved (struck 3)
461 | POACHER_BOOTS tan boots, turned top (e811b7eb) | legacy.poacher.a | approved (struck 5, 6)
461 | BEARER_AURA follow-ups: ring lifted .14 H, material from legacyDress (3992023b, 33e7745e) | legacy.flag_bearer.c + legacy.banner_bearer.c | dropped (no ring on the ally; reverted)
462 | BLOWDARTER_HAIR brown bob, bare head (918046b8) | legacy.blowdarter.a | approved (struck 1; 4, 5 by the lineup test)
462 | cavalier_hat for the pike in place of the great-helm (9708312a) | legacy.pike.a | approved (none struck: plume team-coloured)
462 | quiver_back special for the poacher (8e47a5ac) | legacy.poacher.b | approved (struck 2)
462 | HAND_LAUNCH arrow from the bow fist (2f129417) | legacy.poacher.c | approved (none struck: bow not drawn at release)
462 | MOUTH_LAUNCH dart from the head front (2f129417, half) | legacy.blowdarter.c | rejected (reverted 24f067a4)
462 | [P] BEARER_RING radius 1.6 -> 2.2, root exception (d9f8f8c5) | legacy.flag_bearer.c + legacy.banner_bearer.c | approved (struck 1 each, c PASS both)
463 | LONG_PIKE orange pike 2.8 s, collar, hooked blade (55c1c679) | legacy.pike.b | approved (struck 1, 2, 3; b PASS)
463 | levelsPike for the pike: PIKE_LEVEL hold and thrust (cf35fc1b) | legacy.pike.c | approved (struck 1)
463 | BLOWGUN banded tube + BLOWGUN_HOLD at the mouth (67888276) | legacy.blowdarter.b | approved (struck 1, 2; b PASS)
463 | POACHER_BOW chunky stave, rope wraps, iceBowCarry (7e2eb586) | legacy.poacher.b | approved (none struck: no fist on it)
463 | BOXER_JAB straight jab from the guard (523ab3d2, 578ed136) | legacy.boxer.c | approved (struck 1)
463 | BARREL_RIDE staved barrel under his feet, hip lifted (e3458425) | legacy.barrel_roller.b | approved (struck 1, 2; b PASS)
463 | BARREL_SHOT hooped barrel missile (7089b8e7) | legacy.barrel_roller.c | approved (struck 1)
463 | [P] PIKE_PLUME tan (87ab1edc) | legacy.pike.a | approved (struck 1)
464 | HAND_LAUNCH muzzle from blowgunMuzzle (b42e6e1c) | legacy.blowdarter.c | approved (struck 1)
464 | HOP_BACK Backwards Dodge (f5c1b38a) | legacy.boxer.c | approved (struck 2; c PASS)
464 | PIKE_DROP pike let go on the first blow, disarmToFists (d57603bb, fa8827d7) | legacy.pike.c | approved (struck 2; c PASS)
464 | hat tricorn (38bca2d8) | legacy.barrel_roller.a | approved (struck 2)
464 | POACHER_BOW bowGrip in the fist (99c8103c) | legacy.poacher.b | approved (struck 1; b PASS)
464 | CHARGE_PENNANT narrow pennant, saltire, rings (c0cb4ef3) | legacy.flag_bearer.b | approved (struck 4)
464 | BEARER_HOLD pole plumb in both fists (70924ac8) | legacy.banner_bearer.b + legacy.flag_bearer.b | approved (struck 3 each; b PASS both)
464 | [P] POACHER_BOW wood (e968d1a0) | legacy.poacher.b | approved (root exception; row spent for [P])

## Spent (never retry as [P])

## Rows

wild_west done 448-453 rows (MINER_BLAST, GUNSLINGER_SIDEBURNS/SUIT/REST/SHOES, CACTUS_ROBE [R] + boots/spines, QUICK_DRAW_SHIRT/VEST, GUN_BELT; cactus, gunslinger, quick_draw D) | compacted 455 | 453 | approved | values: git show fa4523ed:loop/LEDGER.md
pirate.pirate_queen done 450 rows (QUEEN_SKIRT/BOOTS/FRAME [R], QUEEN_GUARD; D) | compacted 464 | 450 | approved | values: git log -- web/src/units/pirateDress.ts

wild_west.* stats (cost, healthMultiplier, damageMultiplier, cooldownMultiplier, 7 units) | d PASS 7/7 | 444 | stats | values: git show 7aee94dc
spooky done 435-444 rows (reaper, stiffy, skeleton, vampire, candlehead, catapult dress and props; all D) | compacted 463 | 444 | approved | values: git log -- web/src/units/spookyDress.ts
wild_west 444-447 rows (BULLET_RAIN, REVOLVER, BOWLER, LASSO_DRAG/ROPE, CACTUS_EXPLOSION/NEEDLES, MINER_PICK, GUNSLINGER_JACKET, PINTO_HEAD, LASSO_COIL, POLE_GRIP.minerHaft, QUICK_FAN, MINER_CAP, GUNSLINGER_TIE, CACTUS_SLEEVE) | compacted 451 | 447 | approved | values: git show 3ac8ee79:loop/LEDGER.md
wild_west done 448-456 rows (FLAT_HAT, PEAK_HAT, WINCHESTER(_AIM), RIFLE_TRACER, DYNAMITE_WIRES/HOLD/SKIRT/BOOTS/SHIRT/LOOK [R], WESTERN_BRAID, DEADEYE_SHIRT, LASSO_RAISE/MOUSTACHE/SHIRT, PINTO_LEGS/HEAD/COAT; dynamite, deadeye, lasso D 456) | compacted 457 | 456 | approved | values: git show 7f5ee168:loop/LEDGER.md
wild_west.miner done 447-459 rows (MINER_OVERALLS/MOUSTACHE/BOOTS/UPRIGHT/HAT [R]/LEGS/SLEEVES/BUILD [R], PICK_SHOULDER; 459 hat lift .2 slope .22, shirt lift 0; miner D 459, wild_west all D) | compacted 459 | 459 | approved | values: git show 44da9220:loop/LEDGER.md



legacy_1 stats (cost, healthMultiplier, damageMultiplier, cooldownMultiplier, 8 units) | d PASS 6/8 (bearers deal no damage: an [S]) | 457 | stats | values: git show 5d6b5d24
propBuilder.ts:CHARGE_FLAG (long, thick, grip, ball, wide, tall, slab, edge, proud, emblem, glow) + LEGACY_GOLD, LEGACY_POLE | 1.55, .022, .3, .07, .48, .36, .012, .03, 1.8, .1, .15 | 457 | approved | staff log + orb (before 457)
propBuilder.ts:STAY_BANNER (long, grip, beam, bar, knob, spike, wide, tall, inset, edge, tower) | 1.5, .3, 1.0, .03, .05, .09, .27, .42, .02, .025, .08 | 458 | approved | beam .62, banners .03 apart at the pole (457); staff log + orb (before 457)
proceduralAnimation.ts:uprightPole marker -> PRIEST_HOLD + POLE_GRIP.bearerPole (off fist span) | Healer's planted hold; [.06, .24] | 458 | approved | one hand, the other raised (457); staff slant (before 457)
propBuilder.ts:TEAM_GLOVE (wide, squash, band, glow, shade) | .11, .92, .025, .06, .5 | 458 | approved | glow .15 x1 near-white (457); wide .17 (457 look); maroon ball off the fist (before 457); no further [P] on its colour
legacyDress.ts:POACHER_HAT (sides, crown, flare, tall, dome, brim, thick, band, glow, felt) | 10, 1.1, .92, .2, .12, 2.0, .04, .11, .12, (.17,.11,.07) | 457 | approved | hood dome over the face (before 457)
legacyDress.ts:POACHER_HAIR (side, top, foot, back, front, braid, braidFoot, knots, color, glow) | .22, .55, 1.25, 1.05, .45, .14, 1.75, 4, (.92,.92,.9), .22 | 458 | approved | none (before 458)
unitVisuals.ts:legacy.barrel_roller build (scale, bulk, legLength, armLength, upperLegWidth, lowerLegWidth) | 1.0, .82, 1.08, 1.06, .9, .85 | 458 | approved | 1.24, 1.48 brute (before 458)
legacyDress.ts:PEASANT_HOOD (wide, deep, tall, at, open, peak, back, collar, collarTall, neck, shade, glow) + rotation.y +PI | 1.24, 1.2, 1.2, .42, .34, .28, .08, 1.32, .24, 1.02, .72, .12 | 458 | approved | gap at the back (457 rejected)
legacyDress.ts:BEARER_RING (radius, band, flat, lift, sides, glow; BEARER_RING_COLOR flag, banner) | 2.2, .05, .012, .02, 40, .45; (.95,.6,.2), (.25,.75,.95) | 462 | approved | radius 1.6 (460, the ally stood outside the reach); team colour (459); spent for [P] (root exception used 462)
unitVisuals.ts:legacy.flag_bearer build (scale, bulk, headSize) | 1.0, .92, 1.05 | 459 | approved | 1.34 (before 459)
legacyDress.ts:BOXER_HEADGEAR (wide, deep, tall, at, open, ear, earThick, earOut, earAt, shade, glow) | 1.16, 1.12, .95, .38, .36, .46, .14, .6, .55, .6, .1 | 459 | approved | bald (before 459)
legacyDress.ts:PEASANT_DRESS (shade, glow, sleeveOut, sleeveTo, long, flare, point, pointLong, proud) | .72, .12, 1.3, .5, 1.0, 1.35, .5, .22, .02 | 459 | approved | plain team body (before 459)
legacyDress.ts:POACHER_COAT (leather, fur, glow, long, flare, tufts, tuft, ring, furGlow) | (.36,.2,.1), (.95,.94,.9), .14, .6, 1.45, 10, .24, .5, .25 | 459 | approved | plain team body (before 459)
legacyDress.ts:SHAKO (wide, flare, tall, peak, plate, plateTall, band, plume, plumeWide, shade, glow) | 1.02, 1.12, .95, .42, .42, .34, .08, .42, .22, .85, .12 | 459 | approved | bald (before 459)
legacyDress.ts:BANNER_COATEE (shade, glow, epOut, epTo, fringe, belt, thick, span, waist, waistAt, whiteGlow) | .85, .12, 1.75, .16, .1, .16, 1.12, .82, .12, -.72, .3 | 460 | approved | plain team body (before 460)
legacyDress.ts:FLAG_HELMET (wide, tall, dome, band, bandOut, plate, crest, crestLong, crestThin, whiteGlow) | 1.08, .18, .3, .12, 1.05, .22, .42, .8, .14, .25 | 460 | approved | bald (before 460)
legacyDress.ts:BOXER_SHORTS (shade, glow, out, to, band, bandOut, stripes, step) | .55, .12, 1.85, .88, .24, 1.1, 4, .03 | 460 | approved | plain team body (before 460)
legacyDress.ts:PEASANT_BELT (lumps, out, at, lump, fat, twist, cream, glow) | 14, 1.12, -.42, .5, .8, .6, (1,.95,.8), .32 | 461 | approved | 12 lumps .36 fat .42 (460, spaced shards); no further [P] (critic 461)
legacyDress.ts:POACHER_BELT (tall, at, out, buckle, bar, proud, tan, grey, glow) | .16, -.84, 1.14, .3, .24, .05, (.85,.55,.25), (.32,.32,.34), .16 | 460 | approved | none (before 460)
runtimeUnit.ts:BEARER_AURA (haste, ring, band) + simulationSystem BEARER_AURA_KIND | 1.5, .5, .035; flag haste, banner stay | 460 | approved | support heal (before 460)
legacyDress.ts:BANNER_CUFFS (from, to, out) | .62, 1.0, 1.45 | 461 | approved | bare forearms (before 461)
legacyDress.ts:BOXER_BOOTS (from, to, out, laces, lace, bar, tilt, proud, shade) | .5, 1.04, 1.45, 4, 1.5, .035, .35, .015, .85 | 461 | approved | team feet (before 461)
legacyDress.ts:FLAG_JACKET (shade, glow, placket, proud, collar, collarOut) | .85, .12, .12, .05, .1, .82 | 461 | approved | plain team body (before 461)
legacyDress.ts:PEASANT_LEGS (pantOut, pantTo, cuff, cuffOut, sockOut, sockTo, shade, tan, brown) | 1.35, .55, .1, 1.55, 1.2, 1.0, .8, (.8,.6,.35), (.3,.16,.08) | 461 | approved | team legs (before 461)
legacyDress.ts:PEASANT_FRINGE (locks, lockW, thick, top, foot, sideLong, proud, gap, color) | 6, .22, .12, .92, .18, .75, .04, .5, (.07,.05,.04) | 461 | approved | none (before 461)
legacyDress.ts:POACHER_BOOTS (from, to, out, cuffFrom, cuff, color) | .62, 1.04, 1.3, .5, 1.6, (.62,.36,.18) | 461 | approved | team feet (before 461)
scenarios.ts:gallery_faction_legacy (columns, spacingX, spacingZ, front) | 8, 4.6, 1.85, the legacy_1 men in the near rank | 462 | evidence | spacingZ 2.35 (461, ends cropped); 6 a rank, roster order (before 461)
legacyDress.ts:BLOWDARTER_HAIR (capOut, cap, side, top, foot, back, front, color, glow) | 1.12, .22, .24, .9, .75, 1.08, .35, (.16,.08,.06), .12 | 462 | approved | dark dome hat (before 462)
simulationSystem.ts:HAND_LAUNCH (unit -> hand) | legacy.poacher bow | 462 | approved | unit.position + 1 m (before 462); blowdarter mouth rejected 462
unitVisuals.ts:legacy.pike hat; legacy.poacher special | cavalier_hat; quiver_back | 462 | approved | great-helm; none (before 462)
propBuilder.ts:LONG_PIKE (long, thick, collar, blade, bladeWide, hook, hookAt, hookRake, grip, wood) | 2.8, .03, .08, .34, .07, .09, .18, .6, .12, (.7,.3,.08) | 463 | approved | spear 1.0 s (before 463)
runtimeUnit.ts:levelsPike units | ancient.sarissa, legacy.pike | 463 | approved | sarissa only (before 463)
propBuilder.ts:BLOWGUN (long, thick, mouth, mouthOut, band, bandsAt, dart, wood) | .55, .03, .05, 1.6, .022, [.22,.6], .07, (.9,.45,.15) | 463 | approved | .38 s stick (before 463)
proceduralAnimation.ts:BLOWGUN_HOLD (mouthAhead, mouthDrop, side, tilt, near, far) + blowdarter posePreset default | 1.05, .3, .18, .1, .07, .42 | 463 | approved | archer pose (before 463)
propBuilder.ts:POACHER_BOW (long, thick, taper, bow, grip, wrap, wrapAt, nockAt, wood, rope) | .62, .085, .55, .06, .1, .09, [.1,.26], .86, (.62,.3,.1), (1,.78,.45) | 464 | spent | wood (.85,.5,.25) (463); plain bow (before 463); no further [P] (critic 464)
proceduralAnimation.ts:BOXER_JAB (guardAhead, guardUp, guardIn, reach, jabUp, cock, cockAt, drivenAt, heldTo, lean) | .45, .12, .2, .95, -.05, .15, .12, .3, .78, .12 | 463 | approved | overhead strike (before 463)
legacyDress.ts:BARREL_RIDE (wide, long, staves, thick, alt, hoop, hoopAt, rivets, wood, iron) | .3, .44, 12, .14, .8, .035, .72, 6, (.9,.48,.2), (.38,.38,.4) | 463 | approved | barrel at the waist (before 463)
projectileSystem.ts:BARREL_SHOT (wide, long, staves, hoop, hoopAt, wood) + rosterManifest barrel_roller projectileHint | .42, .6, 10, .05, .7, (.9,.48,.2); barrel | 463 | approved | stone (before 463)
legacyDress.ts:PIKE_PLUME (color, glow) | (1,.72,.32), .08 | 463 | approved | team plume (before 463)
simulationSystem.ts:HOP_BACK legacy.boxer (afterLand, dist, rise, cooldown) | .2, 2.6, 2.2, 3 | 464 | approved | none (before 464)
simulationSystem.ts:PIKE_DROP (ahead, up, spin, ready) | .6, -2.4, 3, .6 | 464 | approved | up .8 spin 1.2 (464a, read as held)
propBuilder.ts:CHARGE_PENNANT (wide, tall, bar, ring, ringOut, ringGap) | .15, .46, .02, .025, 1.9, .07 | 464 | approved | CHARGE_FLAG sheet .48 x .36 (before 464)
proceduralAnimation.ts:BEARER_HOLD (ahead, out, high, low) | .42, .22, .72, .3 | 464 | approved | PRIEST_HOLD at the side (before 464)
unitVisuals.ts:legacy.barrel_roller hat | tricorn | 464 | approved | none (before 464)
