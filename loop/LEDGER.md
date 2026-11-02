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

466 | BANNER_POLE thick warm pole, gold collars, cross, butt cap, no spike (c3045bf2) | legacy.banner_bearer.b | approved (struck 3)
466 | BANNER_ARCH gold crenellated arch, team doorway (39c35a54) | legacy.banner_bearer.b | approved (struck 2)
466 | BANNER_FAN five gold rays under each banner (13b2b797) | legacy.banner_bearer.b | approved (struck 1; b PASS; D)
466 | PEASANT_SLEEVES tan undersleeves, flared cuff (07c88423) | legacy.peasant.a | approved (struck 1; D)
466 | boxerBareChest trunk in arm skin (07c88423) | legacy.boxer.a | approved (struck 1)
466 | FLAG_CUFFS white cuffs banded in gold (07c88423) | legacy.flag_bearer.a | approved (struck 3)
466 | TEAM_GLOVE rebuilt: wide .22, team x .8, white palm (7bac4615) | legacy.boxer.b | approved (struck 1; D)
467 | POISON green dye, 4 dps for 6 s on a dart hit (ab237b96) | legacy.blowdarter.c | approved (struck 3; c PASS)
467 | DRAWS_BEFORE_LOOSE poacher draws then looses (8faddfa9) | legacy.poacher.c | approved (struck 1; c PASS; D)
467 | FLAG_BOOTS white boots, gold tops (c676cf71) | legacy.flag_bearer.a | approved (struck 4; D)
467 | PIKE_BELT belt, baggy trousers; PIKE_HAIR (c676cf71) | legacy.pike.a | approved (struck 4, 3; D)
467 | POACHER_KNEES tan knee caps (c676cf71) | legacy.poacher.a | approved (struck 4)
467 | BARREL_WRAPS brown forearm wraps (c676cf71) | legacy.barrel_roller.a | approved (struck 5)
468 | BARREL_ROLL closes to 1.6 m, shot rolls from the barrelBody core (5a54adf1) | legacy.barrel_roller.c | approved (none struck; CONFIRM passed c, critic kept it)
468 | BLOWDARTER_SCARF tan V, white feathers (6539168f) | legacy.blowdarter.a | approved (none struck: side-on)
468 | BLOWDARTER_PANTS brown thighs, team hem (6539168f) | legacy.blowdarter.a | rejected (hunk reverted a49b8e78: colours inverted)
468 | BARREL_HAIR white locks; BARREL_LEGS pants, socks, shoes (6539168f) | legacy.barrel_roller.a | approved (struck 3, 6; added 7)
468 | SUPER_CUFFS glowing gold cuffs (9c6d188f) | legacy.super_peasant.b | approved (struck 1; b PASS)
468 | WIZARD_BEARD grey wedge, moustache (9c6d188f) | legacy.wizard.a | approved (struck 2)
469 | BLOWDARTER_SCARF one solid V, 7 feathers, shoulder wings (3495f889) | legacy.blowdarter.a | approved (struck 2)
469 | BLOWDARTER_SHORTS team shorts, tan fringed hem (9c5878c2) | legacy.blowdarter.a | approved (struck 1)
469 | BLOWDARTER_HAIR parted crown, flared locks (8c918f0e) | legacy.blowdarter.a | approved (struck 3; a PASS; D)
469 | BARREL_ROLL.ridden ridden barrel hidden + rolled on the fire path (d67af714, 5cabc202) | legacy.barrel_roller.c | approved (struck 2; c PASS; D)
469 | [P] BARREL_LEGS.pantTo .8, cream glow .1 (f5721bce) | legacy.barrel_roller.a | approved (struck 7; a PASS)
469 | PHARAOH_CROOK striped crook, curled hook (32f27e05) | legacy.pharaoh.b | approved (struck 1)
469 | MODIUS tall team crown, gold bands (7c1181a9) | legacy.pharaoh.a | approved (struck 1)
469 | WINGED_BAND grey band, white wings (e9078ccf, de828e55) | legacy.thor.a | approved (struck 1)
470 | offhand longsword (f309bcf8) | legacy.wizard.b | approved (struck 2)
470 | PHARAOH_FLAIL striped rod, beaded tassels; sword hold (00da6760, a8b8e64d, 12c19add) | legacy.pharaoh.b | approved (struck 2; added 3 hold)
470 | PHARAOH_GARB team trunk, gold bands (740e0371) | legacy.pharaoh.a | approved (struck 2)
470 | CHARIOT_HELM steel cap, team crest (6bf8b13f) | legacy.chariot.a | approved (struck 1)
470 | SUPER_BOXER_HAIR gold spikes, headband (8bcd54e9) | legacy.super_boxer.a | approved (struck 3, 5)
470 | THOR_HAIR blond shoulder-length (8bcd54e9) | legacy.thor.a | approved (struck 2)
470 | TANK_FIREBALL white-yellow fireball (889b498c, 78a19cba) | legacy.tank.c | approved (struck 1; c PASS)

## Spent (never retry as [P])

## Rows

wild_west done 444-459 rows (all dress, props, mechanics and stats; all D 459) | compacted 465 | 459 | approved | values: git show 44da9220:loop/LEDGER.md (it points to the earlier compactions)
pirate.pirate_queen done 450 rows (QUEEN_SKIRT/BOOTS/FRAME [R], QUEEN_GUARD; D) | compacted 464 | 450 | approved | values: git log -- web/src/units/pirateDress.ts

spooky done 435-444 rows (reaper, stiffy, skeleton, vampire, candlehead, catapult dress and props; all D) | compacted 463 | 444 | approved | values: git log -- web/src/units/spookyDress.ts

legacy_1 stats (cost, healthMultiplier, damageMultiplier, cooldownMultiplier, 8 units) | d PASS 8/8 (bearers polearm_melee 465: hp .68/.17, dmg .63, cd 2.31) | 465 | stats | values: git show 5d6b5d24
legacy_1 done 457-459 rows (CHARGE_FLAG, STAY_BANNER, uprightPole, POACHER_HAT, POACHER_HAIR, PEASANT_HOOD, legacy.flag_bearer, BOXER_HEADGEAR, PEASANT_DRESS, POACHER_COAT; peasant, banner_bearer, boxer D 466; flag_bearer, pike, poacher D 467) | compacted 467 | 459 | approved | values: git show c07c1bca:loop/LEDGER.md
propBuilder.ts:TEAM_GLOVE (wide, squash, band, glow, shade, palm, palmProud) + subdivisions 2 | .22, .92, .025, .1, .8, .55, .9 | 466 | approved | .11, glow .06, x.5 grey knobs (458-465); [S] rebuild 466 (critic accepted the colour move)
unitVisuals.ts:legacy.barrel_roller build (scale, bulk, legLength, armLength, upperLegWidth, lowerLegWidth) | 1.0, .82, 1.08, 1.06, .9, .85 | 458 | approved | 1.24, 1.48 brute (before 458)
legacyDress.ts:BEARER_RING (radius, band, flat, lift, sides, glow; BEARER_RING_COLOR flag, banner) | 2.2, .05, .012, .02, 40, .45; (.95,.6,.2), (.25,.75,.95) | 462 | approved | radius 1.6 (460, the ally stood outside the reach); team colour (459); spent for [P] (root exception used 462)
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
simulationSystem.ts:BEARER_PULSE (every, holds) | 3, 3.5 | 465 | approved | aura on the support cooldown 2 x 1.5, holds +.5 (before 465)
projectileSystem.ts:SMALL_ARROW (long, thick, head, headWide, fletch) | .46, .03, .07, .045, .07 | 465 | approved | the .75 arrow (before 465)
projectileSystem.ts:BLOW_DART (long, thick, needle, tuft, tuftLong) | .2, .014, .07, .06, .07 | 465 | approved | the .75 arrow (before 465)
legacyDress.ts:PIKE_VEST (rim, rimOut, emblem, proud, emblemAt, cream, glow) | .1, 1.06, .62, .04, -.05, (.9,.76,.52), .18 | 465 | approved | cream (1,.9,.7) glow .25 (465 look, near white)
legacyDress.ts:BARREL_VEST (shade, glow, vWide, vDeep, proud) | .7, .12, .62, .62, .03 | 465 | approved | none (before 465)
unitVisuals.ts:legacy.boxer build (scale, bulk, torsoWidth, headSize, legLength) | 1.08, .84, .92, 1.12, 1.16 | 465 | approved | .68, .94, -, 1.32, - (before 465)
unitVisuals.ts:legacy.peasant build (scale, bulk, torsoWidth, headSize, legLength) | 1.0, .82, .92, 1.1, 1.16 | 465 | approved | .62, .78, -, 1.44, .74 (before 465)
propBuilder.ts:BANNER_POLE (thick, collar, collarOut, collarsAt, cross, cap, wood) | .04, .03, 1.5, [.22,.5,.74], 2.2, .04, (.55,.3,.12) | 466 | approved | .022 LEGACY_POLE + spike (before 466)
propBuilder.ts:BANNER_ARCH (wide, tall, drop, crenel, crenelTall, door, doorTall) | .78, .5, .12, .18, .12, .34, .72 | 466 | approved | tower .08 H glyph (before 466)
propBuilder.ts:BANNER_FAN (rays, spread, long, root, tip, splay) | 5, .8, .12, .05, .012, .3 | 466 | approved | none (before 466)
legacyDress.ts:PEASANT_SLEEVES (from, upperOut, lowerOut, lowerTo, cuffFrom, cuffOut, tan, glow) | .45, 1.2, 1.25, .8, .72, 1.75, (.85,.55,.28), .22 | 466 | approved | none (before 466)
legacyDress.ts:FLAG_CUFFS (from, band, bandOut) | .6, .07, 1.6 | 466 | approved | none (before 466)
runtimeUnit.ts:POISON (tint, dye, glow, seconds, dps, tick) | (.45,.9,.12), .7, .45, 6, 4, .5 | 467 | approved | none: 6 damage on the hit only (before 467)
legacyDress.ts:FLAG_BOOTS + PIKE_BELT + PIKE_HAIR + POACHER_KNEES + BARREL_WRAPS (467 dress, specs at the code) | see legacyDress | 467 | approved | none (before 467)
