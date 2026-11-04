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

472 | TANK_PAINT tan hull, team skirts/rails/fittings (f46e36f9, 918ae7b5) | legacy.tank.a | approved (none struck; getWood greys the tan)
472 | GLOW_GLOVE glowing gold mitts (d6551dd7, d0d1329f) | legacy.super_boxer.b | approved (none struck; off the fists)
472 | SUPER_BOXER_EYES yellow eyes (0cd79ea7) | legacy.super_boxer.a | approved (struck 6)
472 | [P] SUPER_BOXER_SHORTS.stripe .28 -> .12 (b86b479d) | legacy.super_boxer.a | approved
472 | CHARIOT_SCUTUM curved team shield, gold rim/boss/wings (69122fa4) | legacy.chariot.b | approved (struck 2)
472 | THOR_BELT wide grey belt, octagonal buckle (3212c6b0) | legacy.thor.a | approved (struck 4)
472 | PHARAOH_COLLAR flat gold broad collar (063e6c76) | legacy.pharaoh.a | approved (struck 3)
472 | WIZARD_ROBE team coat-robe to the knees, dark belt (731cde05) | legacy.wizard.a | approved (struck 4)
473 | peasant lanky cut at 1.15x (f74a0207) | legacy.dark_peasant.a | approved (struck 1)
473 | man's size 1.15x, lanky cut (1d7ba5f5) | legacy.super_peasant.a | approved (struck 1, 5)
473 | DARK_HANDS thirty floating black hands (599bbe2e) | legacy.dark_peasant.b | approved (struck 1; b PASS)
473 | THOR_SKY_BOLT sky bolts on the man and the hammer (06dcdf2e, a35fddac) | legacy.thor.c | approved (struck 1, 2; c PASS)
473 | WIZARD_SPELL glowing star bolt (aee5fce8) | legacy.wizard.c | approved (struck 1)
473 | KNEEL_AURA gold ring, disc, wheeling rays (3f0f1952) | legacy.pharaoh.c | approved (struck 1)
473 | PUNCH_BURST white-gold flash at contact (ca68611a) | legacy.super_boxer.c | approved (struck 3)
474 | SUPER_FLIGHT superman flight, lift .8 (06150948, 4796acd3) | legacy.super_peasant.c | approved (struck 1)
474 | DARK_PEASANT_HAIR bare head, brown mop (b40f53c2) | legacy.dark_peasant.a | approved (struck 2, 3)
474 | SUPER_TUNIC white tunic, laced collar (f8accbf7) | legacy.super_peasant.a | approved (none struck; skirt hidden)
474 | MJOLNIR short haft, head .19, glowing end rings (23dd93bf, a3c8a272) | legacy.thor.b | approved (struck 1, 2; b PASS)
474 | WIZARD_HAT floppy bent-tip hat (7c149002) | legacy.wizard.a | approved (struck 1)
474 | PHARAOH_BANDS gold armlets and wrist cuffs (44052bc1) | legacy.pharaoh.a | approved (struck 5; a PASS)
474 | [P] TANK_PAINT hull/roof on cloth, glow .12 (66732b31) | legacy.tank.a | approved (struck 2)
475 | THOR_LEGS knee trousers, fur cuffs, leather boots (df66d71e) | legacy.thor.a | approved (struck 5; CONFIRM failed a)
475 | TANK_TURRET low faceted Abrams wedge (e0b2e72e) | legacy.tank.a | approved (struck 3)
475 | CHARIOT_SCYTHE blade back from each hub (841dc9fc) | legacy.chariot.b | approved (struck 3; b PASS)
475 | TANK_ROOF cupola, team dome, hatch, antennas (7a612df2) | legacy.tank.a | approved (struck 4; CONFIRM failed a)
475 | CHARIOT_LORICA dark hoops, gold straps, pauldrons (89b096f6) | legacy.chariot.a | approved (struck 2)
475 | WIZARD_STAFF twisted staff, crystal head (c4906faa) | legacy.wizard.b | approved (struck 1; CONFIRM failed b)
475 | FLAIL_HOLD rod up and out, strands plumb (b994faf3) | legacy.pharaoh.b | approved (struck 3; b PASS)
475 | KNEEL_POSE struck man and circle kneel (a5a5db73) | legacy.pharaoh.c | approved (struck 2; c PASS)
475 | WIZARD_FIREWORK spin up then burst (2475d0af, 41a3dc3b) | legacy.wizard.c | approved (none struck; burst after he lands)
475 | [P] wizard proportions.scale 1.76 -> 1.3 (048b6138) | legacy.wizard.a | approved (struck 5)

476 | raised car front and gold laurels (b64da862, ca17191a) | legacy.chariot.a | approved (struck 3; CONFIRM failed a, b)
## Spent (never retry as [P])

## Rows
vehicleBuilder.ts:CHARIOT_FRONT (rise, panels, depth, trim, leafCount, leafSize, relief) | .22, 7, .055, .07, 7 pairs/side, (.045,.14,.025), .04 | 476 | approved | plain half-cylinder, thin rim (before 476)

wild_west done 444-459 rows (all dress, props, mechanics and stats; all D 459) | compacted 465 | 459 | approved | values: git show 44da9220:loop/LEDGER.md (it points to the earlier compactions)


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

legacyDress.ts:THOR_LEGS (pantTo, fur, furOut, tufts, bootFrom, bootOut, top, strapAt) | .34, .14, 1.85, 7, .5, 1.35, .1, .9 | 475 | approved | navy legs (before 475)
vehicleBuilder.ts:TANK_TURRET (wide, top, tall, foot, long, ahead, bustle, inset) | 1.56, .8, .34, -.02, 1.18, .06, .72, .86 | 475 | approved | stepped box turret (before 475)
vehicleBuilder.ts:TANK_ROOF (roof, commander, cupola, cupolaTall, domeAt, dome, hatchAt, antennas, antenna) | .33, [-.3,-.28], .34, .2, [.34,.14], .3, [-.12,.3], [+-.26,-.55], 1.35 | 475 | approved | two flat discs (before 475)
vehicleBuilder.ts:CHARIOT_SCYTHE (collar, out, long, root, tip, flat, curl) | .1, .08, 1.25, .11, .012, .28, .06 | 475 | approved | bare hubs (before 475)
vehicleBuilder.ts:CHARIOT_LORICA (hoops, line, out, hoopFrom, hoopTo, strap, strapAt, plates, plate, plateOut) | 4, .045, 1.06, .42, .88, .07, .22, 3, .16, 1.45 | 475 | approved | bare team torso (before 475)
propBuilder.ts:WIZARD_STAFF (long, thick, foot, head, strands, twist, round, tip, lean, crystals, grip) | .98, .034, .7, .14, 3, .9, .02, .07, .5, 3, .42 | 475 | approved | .85 s pole + orb (before 475)
propBuilder.ts:FLAIL_HOLD (hand axes, aim) | probed idle lHand, aim (-.7,.62,.35) | 475 | approved | rod along the fist (before 475)
runtimeUnit.ts:KNEEL_POSE (hip, knee, drop, bow, arms) + simulationSystem PHARAOH_KNEEL (radius, seconds) | .1, 1.55, .9, .35, .25; 2.4, 3 | 475 | approved | none (before 475)
projectileSystem.ts:WIZARD_FIREWORK (up, spin, tip, delay, over) | 6.5, 16, .5, .75, .9 | 475 | approved | blast fling (before 475)
unitVisuals.ts:legacy.wizard proportions.scale | 1.3 | 475 | approved | 1.76 (before 475)
