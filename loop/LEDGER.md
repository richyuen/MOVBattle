# Loop ledger (v4): every value the loop has tuned

Rows: `file:identifier | value | last iter | verdict | earlier values`. P: no approved reversal within 20 iterations; two failed polish attempts spend a row. S/R replace mechanisms; stats exempt. Alias paths below.

515 | 19b0b661, 3948d262 | secret.chu_ko_nu.b | rejected [S] (reverted 823dc1cf, c248299a: still faces his retreat; b plateau)
515 | b8a58d45, d8a671fe | secret.ballooner.a | approved [S] (struck 6; CONFIRM failed a: pantaloons too long)
515 | e473f7f3 | secret.fan_bearer.a | approved [S] (struck 2)
515 | b8fda5ab | secret.fan_bearer.a | approved [S] (struck 1; CONFIRM failed a twice -> plateau: navy shins)
515 | ea39c522 | secret.chu_ko_nu.a | approved [S] (struck 3)
515 | 79e1a268 | secret.chu_ko_nu.a | approved [S] (struck 4; a PASS)
515 | 1f7b7113 | secret.cheerleader.b | approved [S] (struck 1, 2; b PASS)
515 | e79fae3e | secret.clams.b | approved [S] (struck 1; b PASS)
515 | dd1e07c2 | secret.cupid.a | approved [S] (struck 1)

514 | 76eb7ccd | secret.the_teacher.a | approved [S] (struck 3; CONFIRM passed, done)
514 | 6eb5edb1 | secret.fan_bearer.b | approved [S] (struck 2; b PASS)
514 | 77e689a3 | secret.fan_bearer.a | approved [S] (struck 4; CONFIRM failed a: skirt shade, sash width)
514 | 99a107b4 | secret.ballooner.c | approved [S] (struck 2; c PASS)
514 | 09540a69 | secret.chu_ko_nu.b | rejected [S] (reverted 4d6431b2: back-off windup has no readyAim)
514 | c478e0f8 | secret.ballooner.a | approved [S] (struck 4, 3 by lineup)
514 | 01ec5768 | secret.chu_ko_nu.a | approved [S] (struck 1)
514 | d85e50bc | secret.chu_ko_nu.a | approved [S] (struck 2)
514 | baed6b00 | secret.ballooner.a | approved [S] (struck 5)

513 | ecb2f1d2 | secret.shouter.a | approved [R] (struck 1-4; CONFIRM passed, done)
513 | 0e3163cb | secret.executioner.a | approved [S] (struck 1; CONFIRM passed, done)
513 | bd5c8bce, 9e93b061 | secret.ball_n_chain.c | approved [S] (struck 2; CONFIRM passed, done)
513 | aec49ae0 | secret.jester.a | approved [S] (struck 1; CONFIRM passed, done)
513 | 1ed2fd7e | secret.bomb_on_a_stick.a | approved [S] (struck 2)
513 | fdf374b2 | secret.bomb_on_a_stick.a | approved [S] (struck 5; CONFIRM passed, done)
513 | 75907159 | secret.fan_bearer.a | approved [S] (struck 3)
513 | b919c5d4 | secret.the_teacher.a | approved [S] (struck 1)
513 | ce979dd8 | secret.the_teacher.a | approved [S] (struck 2)

512 | 891ac028, 027436f7 | secret.jester.c | approved [S] (struck 3; c PASS)
512 | 5ebe1d59 | secret.the_teacher.a | approved [S] (struck 4)
512 | d5bc11bf | secret.raptor.a | approved [S] (struck 1)
512 | b1030b43 | secret.jester.a | approved [S] (struck 3; CONFIRM failed a: red tunic olive)
512 | f1761213 | secret.raptor.a | approved [S] (struck 2; CONFIRM passed, done)
512 | 19916c69 | secret.shouter.a | approved [S] (struck 3; CONFIRM failed a twice -> plateau)
512 | ee78ffbe | secret.the_teacher.a | approved [S] (struck 5; CONFIRM failed a)
512 | cf9030d9 | secret.executioner.a | approved [S] (struck 4)
512 | 3c31e1a0 | secret.bomb_on_a_stick.a | approved [S] (struck 4)

511 | 65f47ff7, 5dc19fb4 | secret.jester.b | approved [S] (struck 2; b PASS)
511 | 278dab28, 68792d69 | secret.jester.c | approved [S] (struck 2; added 3 kick mid-flip)
511 | 32de5d14 | secret.jester.a | approved [S] (struck 4)
511 | f7143acb | secret.ballooner.a | approved [S] (struck 3 doublet/V clause)
511 | 026039a3 | secret.ballooner.c | dropped [S] (reverted e2a612c1: dive and grip not visible)
511 | e64bd0b8 | secret.fan_bearer.b | dropped [S] (reverted f553726d: shaft hidden in pelvis)
511 | 7f696d24, 44e1c3fa | secret.chu_ko_nu.b | approved [S] (struck 1, 3; added 5 reversed bow)
511 | 70e26c54, 3ec7bafc | secret.raptor.a | approved [S] (struck 5; CONFIRM failed a)
511 | feef9d94 | secret.chu_ko_nu.c | approved [S] (no strike)

## Spent (never retry as [P])

Aliases: LD=legacyDress.ts, VB=vehicleBuilder.ts, UV=unitVisuals.ts, PB=propBuilder.ts, FX=visualEffects.ts, RU=runtimeUnit.ts, SS=simulationSystem.ts, PA=proceduralAnimation.ts, PS=projectileSystem.ts.

## Rows
UV/PA:secret_shouter build | scale 1.1 bulk .88 torsoWidth .95 head 1.08 legLength 1.3 upperLeg .92 lowerLeg .82; upright stance by shouterHelmDome | 513 | approved | 1.35/1.25/1.18 squat, hashed crouch
UV/PA:secret_executioner build | scale 1.22 bulk .9 torsoWidth .9 legLength 1.3 upperLeg .9 lowerLeg .82; upright by executionerHood | 513 | approved | 1.42/1.4 slab
PA/RU:STONE_POUND | lift .55 back .45 slam 1.15 hold .14 neck .45 knee .35; DIVE at full weight in the Foolish Jump (RU _leapAir for ball_n_chain) | 513 | approved | generic mace swing, upright leap
secretDress:SHOUTER_VEST | 10-sided yoke shell wide 2.3 hem .9 deep 2.5 top 1.04 low 1.3, front point .2; tunic team x.8 | 513 | approved | 505 two front panels
secretDress:BOMBER_BAND/BREECH | band .17H over .03H round 1.24W, knot, tails; breech lathe .96 to knee-.06 m, 1.18/1.42/1.22, cuff 2.6 shin, patch, skin shins | 513 | approved | none
secretDress:FAN_SKIRT | under team x.36 (body), hem band .16 long x1.04 team x.8, flaps .42/.3, self-lit .4 | 515 | approved | 513 under x.7 flaps .42/.55
secretDress:TEACHER_TROUSER/SLEEVE | jacket-material shells loose 1.16/1.18, shin flare 1.26, cuff 1.42 x.16 | 513 | approved | skin limbs
Done secret_1 raptor and jester rows (raptorBody, RAPTOR_BITE, JESTER_*, jester kick/dodge/dagger/cap) | specs in owning code; ledger@823dc1cf | 515 | archived values | unchanged
Evil done units (death_bringer, void_monarch) rows | specs in owning code; ledger@8d2b01e3 | 511 | archived values | unchanged
SS:KICK start gate | dodge flip drops a pending kick (ready again after the flip); no start while _recovers, toppled, downed or airborne | 512 | approved | start gated on _recovers only
UV:secret_teacher special | none | 512 | approved | monk_robe (orange torso box and drape)
secretDress:SHOUTER_LEG | breech hem knee+.02 m; 5 wrap bands .07 tall .052 apart from knee+.08, 2.7 shin widths | 512 | approved | 510 hem -1.05 thigh box, 4 bands over the knee
secretDress:TEACHER_SHOE | ankle .8Wf x .92Hf x .48L, vamp .74 x .42 x .6, nose, heel; black (.08,.06,.07) self-lit .4; team foot hidden | 512 | approved | team boot
secretDress:EXEC_BOOT | trousers team x.5; boot shaft team x.26 2.25 s.x to .82 of foot-knee, cuff 2.55, 4 bands x.15 2.45 | 512 | approved | plain team legs
secretDress:BOMBER_VEST | yoke box: fronts .6 h.x at .68, tall 1.86, out 1.04, thick .2; edge .09 team x.95; sides at 1.04; back; team x.55 | 512 | approved | none
secretDress:BALLOONER_DOUBLET | team trunk, cream V .09 TW to .62 TH, puffs 2.5 arm widths, 3 slashes, belt .1 TH at .12 | 511 | approved | pale tunic
PA:RCB_HOLD | fist .16 m ahead of trunk front, .06 across, .12 under chest middle; stock .1 ahead, .04 up; off fist .45 mag under | 511 | approved (bow laid along move heading) | shouldered carry
SS:RCB_VOLLEY | one bolt per .25 s off rcbMuzzle, no scatter | 511 | approved | one-tick burst with random offset
secretDress:chuKoNuBelt | eight-sided dark strap, square buckle, loose end | 510 | approved | 509 hidden strap
secretDress:fanBearerSash | FAN_SASH wide .66 thick .16 shoulder (.78,1.06) hip (-.8,-.86) out 1.1, drape .72x.22, fall .5x.62, 2 folds; team x.45 self-lit .4 | 515 | approved [S] | 511 .155 TW dark strap x +.82,-.78
SS/PA:STONE_POUND | overhead stick swing retained; trial reverted (contact detached torso) | 509 | dropped [S] | three contact-timed pounds
secretDress:shouterKneeWraps | seven-sided tan bands down the shin from the knee (spec SHOUTER_LEG) | 512 | approved | 509 four bands at the shin top
secretDress:shouterBracers | six-sided tapered dark team guards and two edge bands | 509 | approved [S] | none
secretDress:EXECUTIONER_VEST | eight-sided iron shell .96TH, 5 buttons, dark team sleeves | 505 | approved | plain team torso
secretDress:PRISONER_CAP | 8-sided .29H team cap and .105H cream band above bead eyes | 505 | approved | spiked hood and collar
secretDress:BOMBER_HAIR | ginger crown, three locks per side and seven tapered braid segments | 505 | approved | bald
RU/SS:TEACHER_PARRY | frontal cone dot .45; hold .24 s, recover .55 s; intercept in melee contact, emit sparks | 505 | approved | no melee deflection
SS:Executioner jump | range .65 engage to engage+1.5 m, aim .45 engage short; rise 5, axe visual .46 s, jump cooldown 2 s | 504 | approved | planted before chop
SS:Foolish Jump | windup .24 s, backstep goal .5 m, approach band engage+3.4, rise 6.5, lands .4 engage short, cooldown 5 s | 504 | approved | spin_move
SS:BOMB_SMACK self-destruct | bomb prop hidden after blast, lethal self-damage, horizontal impulse 6 and lift input 4 | 504 | approved | bomber survived
manifest/UV:fan_bearer hat | none | 504 | approved | conical_hat
PA/PB:bombStickGrip | upright waist carry with forward pitch .12 rad; off-hand span .10-.14 shaft lengths | 507 | approved | hpoint at .28 L (off arm over crown)
PA:STONE_HUG | side.8 front-.1 drop.3 of the stone's radius;_armTo both fists | 502 | approved | none (front .35 out of reach)
PB/SS:rcbMuzzle | slot on the stock nose, HAND_LAUNCH chu_ko_nu muzzle | 502 | approved | face-height origin
SS/FX:SHOUT | reach9 half.55 speed10 lift4.5 large.6 giant.3, no damage;wave 4 rings .5-3.4 m,10 streaks,.6s | 502 | approved (no lean, thin ring) | melee hit from 7.8 m
secretDress:TEACHER_HAIR | brown(.16,.085,.06);cap1.12W e+.06H to .6H;3 puffs/side .42W at .6W;3 back lumps | 502 | approved (cap reads boxy) | bald
SS/RU:SECRET_503 | FAN_BLOW reach10 half.32 push10 + FX FAN_GUST 16 streaks 3 waves .85s,2 swirls;BOMB_SMACK radius3.5 scale.7 push1.6 chest1,engageRangeOverride2.6;RU steadfast blast slide .2 no lift;STEADFAST_UPRIGHT .3 | 503 | approved (fan streaks straight bars; monarch head leans 25 deg) | none (fan melee hit from 7.8 m; bomb thrown 6 m; monarch flung by blasts, swing rolled him flat)
secretDress:SECRET_503 | BALLOONER_GLUE unlit(.66,.5,.3) mitt3.4HW lump1.9;JESTER_CAP hood1.14W points root.34 tip.14 bell.22,brown spike.62H;KONU_KNOT black(.05) cap.62H,band.16H team stripe,bun.42H | 503 | approved (glue near-white, hand only; jester points thin; hair maroon-brown) | shuriken; maroon disc cap; conical hat
secretDress:BALLOONER_PACK | satchel.62x.5TH x.42TD brown,flap,straps.09TW;5 unlit balloons.42TW cream/team on strings to 1.4TH | 501 | approved | pink sphere special
PB:BOMB_STICK | halberd variant;haft1.05 grip.32;ico bomb.26L,2 orange bands,neck,fuse,unlit flame | 501 | approved (one-handed hold) | fist bomb
secretDress:BALL_STONE | torso ico 1.3TW .5TH down .62TW ahead,grey(.42);6 links.22TW to 1.05TH;flail hidden | 501 | approved (no hug) | flail
PB:SPADROON | rapier variant;blade.95s .022 flat.35;gold(.85,.6,.12) shell.12s,bow,ring.075s | 501 | approved | katana
PB:REPEATING_CROSSBOW | crossbow variant;stock.56s,magazine.17x.24s,2 studs/side,lever,arm.66s sweep.1 | 501 | approved | small bow arc
PB:EXECUTIONER_AXE | buildJarlAxe long1.3 grip.12 wide.22,steel(.52) crescent(.3) bulge.18 | 500 | approved | short axe stick
secretDress:SHOUTER_HELM | [R] 513 dome 1.24W to crown .64H, band, ear guards .5H, back plate, mask (brow V, cheeks, under-eye bars, nose .34H) off the eye box; horns .39W root 1.22W span | 513 | approved | 510 bowl cylinder + cheek blocks
PB:GIANT_FAN | halberd variant;haft1.0 stand grip.3;mount.32L;team half-oval1.4L x.8L | 500 | approved | hand fan
secret_2 stats cost/hm/dm/cm (10 units, 1890e47d) | d PASS 10/10;cheer hm .012 | 515 | stats | initial manifest
secretDress/PB:515 | BALLOONER_LEG lathe top .98 hem -.07 m waist 1.2 bulge 1.5 low 1.36, roll 2.7, stocking unlit (.6,.44,.22), shoe unlit (1,.2,.05) .82 Hf; KONU_ROBE knee -.02 m (tiers knee-anchored); KONU_LEG shell 1.32 taper .86 team x.3, 3 orange (.7,.2,.05) bands 1.5; CLAM_HAND long 3.2 wide 2.6 thick 1.3 past 1.1, eyes .55; POM_POM core .17 26 spikes .1 root .15 team x.8; CUPID_WINGS span 2.5 raise .08 rows 2 white, magenta bar | 515 | approved | none (shoe (1,.42,.12) read tan)
secret_1 stats cost/hm/dm/cm (10 units, b4d5ff95) | d PASS 10/10;fan dm .00064 | 500 | stats | initial manifest
SS/PS:SENTINEL_CATCH | warn.15,front cos.4,shafts lodged in the board met | 494 | approved | none
Completed evil units (walker, sentinel, cultist, mechanic, lich) rows | specs in owning code; ledger@87af4842 | 501 | archived values | unchanged
Completed good, legacy_2 and earlier rows | specs in owning code; ledger@7b0ae2f6 (legacy_2@b9daeaea, legacy_1@7090fef5) | 494 | archived values | unchanged
secretDress:balloonerGlueMitts forearm | three faceted lobes each, spanning .41-.84 of elbow-to-wrist and 1.85-2.35 lower-arm widths | 506 | approved | mitts and hand lumps only
SS:Balloon Backpack | once per fight, up to 3.3 m mass-scaled paired rise, release after 1.8 s, log float_pack | 506 | approved | generic pull and knock-up
secretDress:chuKoNuRobe | two faceted overlapping knee tiers with orange hem bands | 506 | approved | short tunic
PA/PB:fanGrip | fist ahead .23 in .12 drop .29 of height, pitch 1.95; GIANT_FAN.grip .1 (butt stub); offhand span +.13 to +.24 (ahead of the fist) | 514 | approved | 506 ahead .17 in .14 drop .34 pitch 1.9, grip .3, span -.28 to -.15
secretDress/SS/RU:514 | FAN_GUARD from .36 to .97 out 1.7 taper .84; TEACHER_BEARD top .56 jaw .5 tipY 1.12 tipZ 1.08 thick .3 stache .92; BALLOONER_RUFF 16 flutes .22W ring 1.34W grey .55; BALLOONER_HEAD cap/side/back falls, rim 1.32 tube .24; GLUE_HOLD chest .5, GLUE_GRIP side .75 up .2 near .95; KONU_SLEEVE 1.55/1.5 flare 1.18; KONU_MITT 1.3 band 1.45 cream (.86,.78,.62) unlit | 514 | approved | none (506 teacher beard cone)
secretDress:chuKoNuHarness | two leather runs over shoulders to a six-sided rear quiver | 508 | approved [S] | no harness
secretDress:teacherJabot | three overlapping faceted cream folds beneath beard | 508 | approved [S] | no jabot
secretDress:shouterFurTrim | seven faceted tufts on each shoulder and forearm opening | 508 | approved [S] | bare openings
secretDress:bomberShirt | cream torso and widened upper sleeves; two folded cuffs per elbow and cross-lacing | 508 | approved [S] | dark team torso and sleeves
secretDress:executionerHood | face-covering ten-sided tapered cloth | 510 | approved | spike and disc
secretDress:prisonerShirt | cream body, 1/2 cream bands per upper/lower arm | 510 | approved | team shirt
secretDress:shouterBreeches | seven-sided leg shells, split hem | 510 | approved | flared skirt
secretDress:prisonerTrousers | alternating 3/5 stripes per thigh/shin | 510 | approved | plain legs
