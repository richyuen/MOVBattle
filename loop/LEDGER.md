# Loop ledger (v4): every value the loop has tuned

Rows: `file:unit identifier | current value (max 80 chars) | last iter | verdict | earlier values (newest first)`.
Verdicts: pending, approved, rejected, spent, stats. Two unapproved [P] attempts or never-retry makes a row spent, unpickable as [P].
[P] cannot reverse/re-nudge approvals within 20 iterations. [S] mechanism replacements may reset values, retaining earlier values.
Script stats are exempt from critic/reversal checks. One row per knob; update at commit/verdict. Drop after 25 untouched iterations.

## Structural attempts (last 5 iterations; `iter | gap | unit.criterion | verdict`)


476 | b64da862, ca17191a | legacy.chariot.a | approved (struck 3; CONFIRM failed a, b)
477 | b8d03fdd | legacy.pharaoh.a | approved (struck 1)
477 | a019aff2 | legacy.pharaoh.a | approved (struck 2)
477 | e8a90461 | legacy.thor.a | approved (struck 1)
477 | 8bdc9ab2, 74843223 | legacy.thor.a | approved (struck 2)
477 | dfbb27b2 | legacy.thor.a | approved (struck 3)
477 | 32545a0f | legacy.chariot.a | approved (struck 1)
477 | 17bfabb4 | legacy.chariot.b | approved
477 | e09e65d6 | legacy.super_boxer.a | approved (struck 1)
477 | 533a1de9 | legacy.super_boxer.b | approved
478 | [R] faaba396 | legacy.pharaoh.a | approved (struck 1; CONFIRM failed a: sandals)
479 | [R] 288e2eb7,ddec1562 | legacy.thor.a | approved (struck 1)
479 | b4856556 | legacy.chariot.b | approved (struck 1; b PASS)
479 | 36730de3,cc74e96d | legacy.super_boxer.b | approved (struck 1; b PASS)
479 | d2432f2a | legacy.super_boxer.c | approved (struck 1)
479 | 663b3f2d,5fa80d38 | legacy.dark_peasant.a | approved (struck 4)
479 | 1eb610b3 | legacy.dark_peasant.c | approved (struck 1)
479 | 0fb715a1,3f642c6a | legacy.super_peasant.a | approved (struck 3)
479 | 909a9f7c | legacy.super_peasant.c | approved (struck 2)
479 | 0117757c,c67e45e9 | legacy.wizard.c | approved (airborne clause struck)
480 | c444ddc5 [R] | legacy.thor.a | approved
480 | 1b06021b | legacy.tank.a | approved
480 | dc1ce591,d824f304 | legacy.wizard.a | approved
480 | c8592c0a | legacy.wizard.b | approved
480 | 88770cd1 | legacy.wizard.c | approved
480 | db753c81 | legacy.super_boxer.c | approved
480 | 09453b8f,3656bb73 | legacy.dark_peasant.a | approved
480 | a70e65b3,b2acc355,4a6cb2c2 | legacy.super_peasant.a | approved
480 | 2861b99c | legacy.super_peasant.c | dropped (victim not visible)
## Spent (never retry as [P])

## Rows
legacyDress.ts:thorBelt owner/straps | pelvis .4H band, .48W plate, z .6D+.025 | 480 | approved | torso band .25H,z .56D (479)
vehicleBuilder.ts:tankSeatedInfantry | own .82 rig, head1.08, legs1.08, pelvis on seat | 480 | approved | addOperator .46 (471)
unitVisuals.ts:wizard build; legacyDress open tails; stance | .82bulk,.92W,legs1.3,.88/.8;2 tails,1.16knee;upright | 480 | approved | bulk1.08,closed bell,seeded crouch
propBuilder.ts:WIZARD_STAFF long/grip/carry | 1.3,.3,uprightPole grounded hold | 480 | approved | .98,.42,seeded slant (475)
visualEffects.ts:spawnWizardDetonation | 28 radial .6 tails, reach .4->2.2 in .3s,1.1s life | 480 | approved | shared compact firework (479)
visualEffects.ts:glove ribbons + simulation dash | .8s,.18wide,white-yellow,14 world samples | 480 | approved | none
legacyDress.ts:dark lower dress | ragged thigh shells1.35,rolled calf1.65,cream shoes | 480 | approved | lavender legs
legacyDress.ts:super tunic outer shell | pelvis1.06->1.2W,1.18D,1.35H;unlit .85,noglow | 480 | approved | inset cloth .62knee;torso shell hidden
runtimeUnit.ts:super punch | reverted | 480 | dropped | 80/25: victim lost
legacyDress.ts:THOR_COAT front | outer hull V .8->.16W;shade .35 | 479 | approved | inset strips,shade .85;belt history@288e2eb7
vehicleBuilder.ts:CHARIOT_SCUTUM mount (x,y,z,turn) | -1.35W,+.62H,+1.4D,.62; forearm bracket | 479 | approved | -.85W,+.18H,.9D,-.12 (477)
propBuilder.ts:GLOW_GLOVE knuckles,cuff,fit | pad 1.38x1x.8, cuff .4x.9; core max(2.4 hands,1 head) | 479 | approved | core ball + thumb,2.4 hands (477)
legacyDress.ts:DARK_JERKIN (panel,tail,laces,leather) | .32W,.93H; .42H;4;(.17,.13,.1) | 479 | approved | none
visualEffects.ts:DARK_VOLLEY (count,delay,speed,streak) | 15,.03,30,1.6; sphere slots restored at impact | 479 | approved | none
legacyDress.ts:SUPER_ROPE (knots,span,fat,ellipse,color) | 16,.27W,.16H,(.56W,.65D),(.7,.665,.56) emissive | 479 | approved | none
visualEffects.ts:SUPER_WRIST_RIBBONS (samples,width,emission) | 14,.09,(1.6,1.2,.15); world-space flight history | 479 | approved | none
runtimeUnit.ts:FIREWORK_LIFT + projectileSystem chest burst | analytic rise min(1.8,age*up), no gravity until burst; lethal | 479 | approved | ballistic up6.5,delay.75; root+.9,spell damage (475)
simulationSystem.ts:SUPERBOXER_PUNCH (back,backTime,forwardTime,cooldown) | 2,.22,.24,4; splash1.75,profile damage | 479 | approved | ordinary melee punch
legacyDress.ts:PHARAOH_GARB shell (proud, chest, chestAt, waist, flare) | .025,.22,.12,.23,1.08; sliced yoke/chest/pelvis | 478 | approved | box: out 1.08,chest .16,chestAt .12,waist .2,line .05 (470)
vehicleBuilder.ts:CHARIOT_SCUTUM oval/face, ornamentZ | 1.35W/1.35tall,1.22W/1.25tall;1.8t | 477 | approved | rectangular panels, hidden rim
unitVisuals.ts:legacy.super_boxer build + animator stance | .84,.92,1.08,1.3,.88/.8; tilt .02,stride .16,crouch 0,lean .04 | 477 | approved | 1.38 bulk,1.18 arms; crouched
propBuilder.ts:GLOW_GLOVE seat, glow | actual hand mesh centre;glow 2.5 | 477 | approved | sword grip offset; .17s * oversize; glow .5
unitVisuals.ts:legacy.pharaoh build + animator stance | .82,.92,1.3,.88/.8; tilt .02,stride .12,crouch 0,lean .04 | 477 | approved | bulk 1.08; caster crouch
legacyDress.ts:pharaohFalseBeard (height, diameters, y, z; half-head units) | 1.05,.55/.42,-1.05,1.17 | 477 | approved | none
unitVisuals.ts:iconic_thor build + animator stance | .84,.92,1.06,1.3,.88/.8; tilt .02,stride .12,crouch 0,lean .04 | 477 | approved | bulk 1.18,arms 1.12; crouched
legacyDress.ts:thorBeard (height, top, depth, y, z); cheeks | 2,1.8,.42,-1.25,1.12; cheeks y -.8, height 1.12 | 477 | approved | y -1.03, cheeks -.45 (look); bare chin
legacyDress.ts:WINGED_BAND vanes + covert | H*(1.65-.23k),W*.28,.22+.22k; W*.57,H*(.22+.04k); .16,.5,.35 | 477 | approved | cones .95H * .78^k at ear
vehicleBuilder.ts:CHARIOT_HELM crest mechanism | 11 spokes; step .23; R*(.29,.85,.78); inner band .22,.15,.48 | 477 | approved | half-cylinder arc, rotation.x -PI/2
vehicleBuilder.ts:CHARIOT_FRONT (rise, panels, depth, trim, leafCount, leafSize, relief) | .22, 7, .055, .07, 7 pairs/side, (.045,.14,.025), .04 | 476 | approved | plain half-cylinder, thin rim (before 476)

wild_west done rows | compacted 465 | 459 | approved | ledger@768b54e7


legacy_1 stats (cost, healthMultiplier, damageMultiplier, cooldownMultiplier, 8 units) | d PASS 8/8 (bearers polearm_melee 465: hp .68/.17, dmg .63, cd 2.31) | 465 | stats | values: git show 5d6b5d24
legacy_1 done 457-459 rows | compacted 467 | 459 | approved | ledger@768b54e7
propBuilder.ts:TEAM_GLOVE (wide, squash, band, glow, shade, palm, palmProud) + subdivisions 2 | .22, .92, .025, .1, .8, .55, .9 | 466 | approved | ledger@768b54e7
unitVisuals.ts:legacy.barrel_roller build (scale, bulk, legLength, armLength, upperLegWidth, lowerLegWidth) | 1.0, .82, 1.08, 1.06, .9, .85 | 458 | approved | 1.24, 1.48 brute (before 458)
legacyDress.ts:BEARER_RING (radius, band, flat, lift, sides, glow; BEARER_RING_COLOR flag, banner) | 2.2, .05, .012, .02, 40, .45; (.95,.6,.2), (.25,.75,.95) | 462 | approved | ledger@768b54e7
legacyDress.ts:SHAKO (wide, flare, tall, peak, plate, plateTall, band, plume, plumeWide, shade, glow) | 1.02, 1.12, .95, .42, .42, .34, .08, .42, .22, .85, .12 | 459 | approved | bald (before 459)
legacyDress.ts:BANNER_COATEE (shade, glow, epOut, epTo, fringe, belt, thick, span, waist, waistAt, whiteGlow) | .85, .12, 1.75, .16, .1, .16, 1.12, .82, .12, -.72, .3 | 460 | approved | plain team body (before 460)
legacyDress.ts:FLAG_HELMET (wide, tall, dome, band, bandOut, plate, crest, crestLong, crestThin, whiteGlow) | 1.08, .18, .3, .12, 1.05, .22, .42, .8, .14, .25 | 460 | approved | bald (before 460)
legacyDress.ts:BOXER_SHORTS (shade, glow, out, to, band, bandOut, stripes, step) | .55, .12, 1.85, .88, .24, 1.1, 4, .03 | 460 | approved | plain team body (before 460)
legacyDress.ts:PEASANT_BELT (lumps, out, at, lump, fat, twist, cream, glow) | 14, 1.12, -.42, .5, .8, .6, (1,.95,.8), .32 | 461 | approved | ledger@768b54e7
legacyDress.ts:POACHER_BELT (tall, at, out, buckle, bar, proud, tan, grey, glow) | .16, -.84, 1.14, .3, .24, .05, (.85,.55,.25), (.32,.32,.34), .16 | 460 | approved | none (before 460)
runtimeUnit.ts:BEARER_AURA (haste, ring, band) + simulationSystem BEARER_AURA_KIND | 1.5, .5, .035; flag haste, banner stay | 460 | approved | support heal (before 460)
legacyDress.ts:BANNER_CUFFS (from, to, out) | .62, 1.0, 1.45 | 461 | approved | bare forearms (before 461)
legacyDress.ts:BOXER_BOOTS (from, to, out, laces, lace, bar, tilt, proud, shade) | .5, 1.04, 1.45, 4, 1.5, .035, .35, .015, .85 | 461 | approved | team feet (before 461)
legacyDress.ts:FLAG_JACKET (shade, glow, placket, proud, collar, collarOut) | .85, .12, .12, .05, .1, .82 | 461 | approved | plain team body (before 461)
legacyDress.ts:PEASANT_LEGS (pantOut, pantTo, cuff, cuffOut, sockOut, sockTo, shade, tan, brown) | 1.35, .55, .1, 1.55, 1.2, 1.0, .8, (.8,.6,.35), (.3,.16,.08) | 461 | approved | team legs (before 461)
legacyDress.ts:PEASANT_FRINGE (locks, lockW, thick, top, foot, sideLong, proud, gap, color) | 6, .22, .12, .92, .18, .75, .04, .5, (.07,.05,.04) | 461 | approved | none (before 461)
legacyDress.ts:POACHER_BOOTS (from, to, out, cuffFrom, cuff, color) | .62, 1.04, 1.3, .5, 1.6, (.62,.36,.18) | 461 | approved | team feet (before 461)
scenarios.ts:gallery_faction_legacy (columns, spacingX, spacingZ, front) | 8, 4.6, 1.85, the legacy_1 men in the near rank | 462 | evidence | ledger@768b54e7
legacyDress.ts:BLOWDARTER_HAIR (capOut, cap, side, top, foot, back, front, color, glow) | 1.12, .22, .24, .9, .75, 1.08, .35, (.16,.08,.06), .12 | 462 | approved | dark dome hat (before 462)
simulationSystem.ts:HAND_LAUNCH (unit -> hand) | legacy.poacher bow | 462 | approved | ledger@768b54e7
unitVisuals.ts:legacy.pike hat; legacy.poacher special | cavalier_hat; quiver_back | 462 | approved | great-helm; none (before 462)
propBuilder.ts:LONG_PIKE (long, thick, collar, blade, bladeWide, hook, hookAt, hookRake, grip, wood) | 2.8, .03, .08, .34, .07, .09, .18, .6, .12, (.7,.3,.08) | 463 | approved | spear 1.0 s (before 463)
runtimeUnit.ts:levelsPike units | ancient.sarissa, legacy.pike | 463 | approved | sarissa only (before 463)
propBuilder.ts:BLOWGUN (long, thick, mouth, mouthOut, band, bandsAt, dart, wood) | .55, .03, .05, 1.6, .022, [.22,.6], .07, (.9,.45,.15) | 463 | approved | .38 s stick (before 463)
proceduralAnimation.ts:BLOWGUN_HOLD (mouthAhead, mouthDrop, side, tilt, near, far) + blowdarter posePreset default | 1.05, .3, .18, .1, .07, .42 | 463 | approved | archer pose (before 463)
propBuilder.ts:POACHER_BOW (long, thick, taper, bow, grip, wrap, wrapAt, nockAt, wood, rope) | .62, .085, .55, .06, .1, .09, [.1,.26], .86, (.62,.3,.1), (1,.78,.45) | 464 | spent | ledger@768b54e7
proceduralAnimation.ts:BOXER_JAB (guardAhead, guardUp, guardIn, reach, jabUp, cock, cockAt, drivenAt, heldTo, lean) | .45, .12, .2, .95, -.05, .15, .12, .3, .78, .12 | 463 | approved | overhead strike (before 463)
legacyDress.ts:BARREL_RIDE (wide, long, staves, thick, alt, hoop, hoopAt, rivets, wood, iron) | .3, .44, 12, .14, .8, .035, .72, 6, (.9,.48,.2), (.38,.38,.4) | 463 | approved | barrel at the waist (before 463)
projectileSystem.ts:BARREL_SHOT (wide, long, staves, hoop, hoopAt, wood) + rosterManifest barrel_roller projectileHint | .42, .6, 10, .05, .7, (.9,.48,.2); barrel | 463 | approved | stone (before 463)
legacyDress.ts:PIKE_PLUME (color, glow) | (1,.72,.32), .08 | 463 | approved | team plume (before 463)
simulationSystem.ts:HOP_BACK legacy.boxer (afterLand, dist, rise, cooldown) | .2, 2.6, 2.2, 3 | 464 | approved | none (before 464)
simulationSystem.ts:PIKE_DROP (ahead, up, spin, ready) | .6, -2.4, 3, .6 | 464 | approved | ledger@768b54e7
propBuilder.ts:CHARGE_PENNANT (wide, tall, bar, ring, ringOut, ringGap) | .15, .46, .02, .025, 1.9, .07 | 464 | approved | ledger@768b54e7
proceduralAnimation.ts:BEARER_HOLD (ahead, out, high, low) | .42, .22, .72, .3 | 464 | approved | ledger@768b54e7
unitVisuals.ts:legacy.barrel_roller hat | tricorn | 464 | approved | none (before 464)
simulationSystem.ts:BEARER_PULSE (every, holds) | 3, 3.5 | 465 | approved | ledger@768b54e7
projectileSystem.ts:SMALL_ARROW (long, thick, head, headWide, fletch) | .46, .03, .07, .045, .07 | 465 | approved | the .75 arrow (before 465)
projectileSystem.ts:BLOW_DART (long, thick, needle, tuft, tuftLong) | .2, .014, .07, .06, .07 | 465 | approved | the .75 arrow (before 465)
legacyDress.ts:PIKE_VEST (rim, rimOut, emblem, proud, emblemAt, cream, glow) | .1, 1.06, .62, .04, -.05, (.9,.76,.52), .18 | 465 | approved | ledger@768b54e7
legacyDress.ts:BARREL_VEST (shade, glow, vWide, vDeep, proud) | .7, .12, .62, .62, .03 | 465 | approved | none (before 465)
unitVisuals.ts:legacy.boxer build (scale, bulk, torsoWidth, headSize, legLength) | 1.08, .84, .92, 1.12, 1.16 | 465 | approved | ledger@768b54e7
unitVisuals.ts:legacy.peasant build (scale, bulk, torsoWidth, headSize, legLength) | 1.0, .82, .92, 1.1, 1.16 | 465 | approved | ledger@768b54e7
propBuilder.ts:BANNER_POLE (thick, collar, collarOut, collarsAt, cross, cap, wood) | .04, .03, 1.5, [.22,.5,.74], 2.2, .04, (.55,.3,.12) | 466 | approved | ledger@768b54e7
propBuilder.ts:BANNER_ARCH (wide, tall, drop, crenel, crenelTall, door, doorTall) | .78, .5, .12, .18, .12, .34, .72 | 466 | approved | tower .08 H glyph (before 466)
propBuilder.ts:BANNER_FAN (rays, spread, long, root, tip, splay) | 5, .8, .12, .05, .012, .3 | 466 | approved | none (before 466)
legacyDress.ts:PEASANT_SLEEVES (from, upperOut, lowerOut, lowerTo, cuffFrom, cuffOut, tan, glow) | .45, 1.2, 1.25, .8, .72, 1.75, (.85,.55,.28), .22 | 466 | approved | none (before 466)
legacyDress.ts:FLAG_CUFFS (from, band, bandOut) | .6, .07, 1.6 | 466 | approved | none (before 466)
runtimeUnit.ts:POISON (tint, dye, glow, seconds, dps, tick) | (.45,.9,.12), .7, .45, 6, 4, .5 | 467 | approved | ledger@768b54e7
legacyDress.ts:FLAG_BOOTS + PIKE_BELT + PIKE_HAIR + POACHER_KNEES + BARREL_WRAPS (467 dress, specs at the code) | see legacyDress | 467 | approved | none (before 467)

legacyDress.ts:THOR_LEGS (pantTo, fur, furOut, tufts, bootFrom, bootOut, top, strapAt) | .34, .14, 1.85, 7, .5, 1.35, .1, .9 | 475 | approved | navy legs (before 475)
vehicleBuilder.ts:TANK_TURRET (wide, top, tall, foot, long, ahead, bustle, inset) | 1.56, .8, .34, -.02, 1.18, .06, .72, .86 | 475 | approved | stepped box turret (before 475)
vehicleBuilder.ts:TANK_ROOF (roof, commander, cupola, cupolaTall, domeAt, dome, hatchAt, antennas, antenna) | .33, [-.3,-.28], .34, .2, [.34,.14], .3, [-.12,.3], [+-.26,-.55], 1.35 | 475 | approved | two flat discs (before 475)
vehicleBuilder.ts:CHARIOT_SCYTHE (collar, out, long, root, tip, flat, curl) | .1, .08, 1.25, .11, .012, .28, .06 | 475 | approved | bare hubs (before 475)
vehicleBuilder.ts:CHARIOT_LORICA (hoops, line, out, hoopFrom, hoopTo, strap, strapAt, plates, plate, plateOut) | 4, .045, 1.06, .42, .88, .07, .22, 3, .16, 1.45 | 475 | approved | bare team torso (before 475)
propBuilder.ts:FLAIL_HOLD (hand axes, aim) | probed idle lHand, aim (-.7,.62,.35) | 475 | approved | rod along the fist (before 475)
runtimeUnit.ts:KNEEL_POSE (hip, knee, drop, bow, arms) + simulationSystem PHARAOH_KNEEL (radius, seconds) | .1, 1.55, .9, .35, .25; 2.4, 3 | 475 | approved | none (before 475)
projectileSystem.ts:WIZARD_FIREWORK (up, spin, tip, delay, over) | 6.5, 16, .5, .75, .9 | 475 | approved | blast fling (before 475)
