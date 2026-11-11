# Loop ledger (v4): every value the loop has tuned

Rows: `file:identifier | value | last iter | verdict | earlier values`. P: no approved reversal within 20 iterations; two failed polish attempts spend a row. S/R replace mechanisms; stats exempt. Alias paths below.

518 | 5ac81c17 | secret.taekwondo.a | approved [S] (struck 4)
518 | a8cf176b | secret.taekwondo.a | approved [S] (struck 6; a PASS)
518 | d6710917 | secret.cheerleader.a | approved [S] (struck 5; a PASS)
518 | 341eb7f4 | secret.cupid.a | approved [S] (struck 5; a PASS)
518 | 2b32ed39 | secret.cheerleader.c | approved [S] (struck 1)
518 | a80a6032 | secret.mace_spinner.c | rejected [S] (reverted aef00f7b: shared spinner preset, whirl only on the attack frame)
518 | 8e341463 | secret.raptor_rider.a | approved [S] (struck 1; 4 by lineup)
518 | a9080780 | secret.bank_robbers.a | approved [S] (struck 6 by lineup; safe too small)
517 | 798bbba5 | secret.fan_bearer.a | approved [R] (struck 1; a PASS; CONFIRM passed, done)
517 | b34b4519, 8142c383 | secret.present_elf.a | approved [S] (struck 1, 7, 6 by lineup)
517 | c46885b9, b82fd72b | secret.ice_mage.a | approved [S] (struck 1)
517 | 78eabf45 | secret.infernal_whip.a | approved [S] (struck 1; 5, 6 by lineup)
517 | 6679b6c8 | secret.taekwondo.a | approved [S] (struck 3, 5 by lineup)
517 | 7159b2bf | secret.cupid.a | approved [S] (struck 4)
517 | 9a0c8787 | secret.cheerleader.a | approved [S] (struck 3, 4 by lineup)

516 | a4b70e94, 602fa00f | secret.chu_ko_nu.b | approved [R] (struck 2, 4, 5; b PASS; CONFIRM passed, done)
516 | 66e47ff2 | secret.chu_ko_nu.c | approved [S] (struck 1; c PASS; CONFIRM passed, done)
516 | aac1740a | secret.ballooner.a | approved [S] (struck 1; a PASS; CONFIRM passed, done)
516 | 1955e016, f438c488 | secret.taekwondo.a | approved [S] (struck 1, 2)
516 | 23d145b2 | secret.taekwondo.c | approved [S] (struck 1)
516 | 463d1578 | secret.cupid.a | approved [S] (struck 3, 2 by lineup)
516 | 2cd491c9 | secret.cupid.b | approved [S] (struck 1)
516 | 848338c6 | secret.cheerleader.a | approved [S] (struck 2, 1 by lineup)
516 | deb199cb, 30b1375a | secret.clams.a | approved [S] (struck 2)

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

## Spent (never retry as [P])

Aliases: LD=legacyDress.ts, VB=vehicleBuilder.ts, UV=unitVisuals.ts, PB=propBuilder.ts, FX=visualEffects.ts, RU=runtimeUnit.ts, SS=simulationSystem.ts, PA=proceduralAnimation.ts, PS=projectileSystem.ts.

## Rows
secretDress/PB/FX:518 | TKD_TROUSER thigh 2.0 shin 2.15->2.4 cuff 2.55 .72->1.12 cream unlit, feet skin; TKD_HAIR cap 1.12W .6H (.11,.08,.07), bun .34W .4H, team band; CHEER_HAIR cap 1.14W .56H team x.72, fringe .9W; CUPID_FOOT skin slim .86 cuff .7; CONFETTI 36 chips .11 ring .55 1.6 s; RAPTOR_MOUNT lift .7 trunk .62x.62x1.45H, jaw gape .75, 9 spikes, legs .3H out; OVERHEAD_SAFE .6x.42x.38 Hh over .26 | 518 | approved | none (bandanas, boots, smoke, box mount, hip safe)
secretDress:517 | ELF_CAP fur .2H at e+.02H W1.2, cone .42H 1.08->.52W, 5-pt tip, pom .22W, green (.04,.42,.17), fur unlit (.82,.76,.6), pom (.85,.28,.06); ICE_HAIR half-dome 1.16W to c+.6H, fringe .62W tilt .32, locks .34->.2W x.64 z.3 to c-.42H, unlit (.74,.68,.52); ROCK_HAIR ico 1.18W .5H, 7 spikes .3W to .62H, (.07,.045,.04) self-lit .4, 3 magma cracks; TKD_BELT off the tunic skirt: band .17h sink .04 out 1.1, knot, tails .62h splay .3; CUPID_DIAPER lathe waist 1.18 bulge 1.34 low .62 drop .9 unlit (.74,.64,.46), bare body; CHEER_SOCK shin .08-1 out 1.28, cuff, 8 stripes team x.85 | 517 | approved | none (hoods; belt inside the skirt; vest; plain legs)
secretDress/PB/SS/UV:516 | BALLOONER_LEG hem +.03 m waist 1.08 bulge 1.22 low 1.1 cuff 2.3, UV legLength 1.2 upperLegWidth .9; TKD_GI lapels .17TW to .86TH, belt .1TH, sleeves 1.7/1.85 flare 1.3, body material; KICK_BY_UNIT taekwondo within .75 windup .22 cooldown 1.5 damage 3 fling 7 raise 2.05 plain; CUPID_HAIR 4 rings x9 curls .34W unlit gold (.7,.5,.15); HEART_BOW tall .62 belly .3 unlit orange (.8,.38,.1) hearts pink (.8,.12,.55); CHEER_SKIRT 14 pleats flare .38 hem .55 purple (.42,.14,.63); CLAM_HAT 9 ribs span 1.3 long 1.5 rim .8 | 516 | approved | 515 BALLOONER_LEG hem -.07 bulge 1.5 low 1.36
UV/PA:secret_shouter build | scale 1.1 bulk .88 torsoWidth .95 head 1.08 legLength 1.3 upperLeg .92 lowerLeg .82; upright stance by shouterHelmDome | 513 | approved | 1.35/1.25/1.18 squat, hashed crouch
UV/PA:secret_executioner build | scale 1.22 bulk .9 torsoWidth .9 legLength 1.3 upperLeg .9 lowerLeg .82; upright by executionerHood | 513 | approved | 1.42/1.4 slab
PA/RU:STONE_POUND | lift .55 back .45 slam 1.15 hold .14 neck .45 knee .35; DIVE at full weight in the Foolish Jump (RU _leapAir for ball_n_chain) | 513 | approved | generic mace swing, upright leap
secretDress:SHOUTER_VEST | 10-sided yoke shell wide 2.3 hem .9 deep 2.5 top 1.04 low 1.3, front point .2; tunic team x.8 | 513 | approved | 505 two front panels
secretDress:BOMBER_BAND/BREECH | band .17H over .03H round 1.24W, knot, tails; breech lathe .96 to knee-.06 m, 1.18/1.42/1.22, cuff 2.6 shin, patch, skin shins | 513 | approved | none
secretDress:FAN_DRESS [R] 517 | team saturated ^2 (peak-renormalised), sash x.42 folds x.29, skirt x.5, flaps .38/.3, hem team x.95, all self-lit .12; FAN_SASH wide .66 thick .16; legs skin; FAN_SHOE ankle .7 Hf brown (.13,.07,.04) self-lit .4 | 517 | approved | 515 skirt team x.36 flaps .42/.3 hem x.8, sash x.45, all self-lit .4; navy shins, grey boot
secretDress:TEACHER_TROUSER/SLEEVE | jacket-material shells loose 1.16/1.18, shin flare 1.26, cuff 1.42 x.16 | 513 | approved | skin limbs
Archived rows: secret_1 raptor/jester ledger@823dc1cf; evil death_bringer/void_monarch @8d2b01e3, walker/sentinel/cultist/mechanic/lich @87af4842 | specs in owning code | 515 | archived values | unchanged
SS:KICK start gate | dodge flip drops a pending kick (ready again after the flip); no start while _recovers, toppled, downed or airborne | 512 | approved | start gated on _recovers only
UV:secret_teacher special | none | 512 | approved | monk_robe (orange torso box and drape)
secretDress:SHOUTER_LEG | breech hem knee+.02 m; 5 wrap bands .07 tall .052 apart from knee+.08, 2.7 shin widths | 512 | approved | 510 hem -1.05 thigh box, 4 bands over the knee
secretDress:TEACHER_SHOE | ankle .8Wf x .92Hf x .48L, vamp .74 x .42 x .6, nose, heel; black (.08,.06,.07) self-lit .4; team foot hidden | 512 | approved | team boot
secretDress:EXEC_BOOT | trousers team x.5; boot shaft team x.26 2.25 s.x to .82 of foot-knee, cuff 2.55, 4 bands x.15 2.45 | 512 | approved | plain team legs
secretDress:BOMBER_VEST | yoke box: fronts .6 h.x at .68, tall 1.86, out 1.04, thick .2; edge .09 team x.95; sides at 1.04; back; team x.55 | 512 | approved | none
secretDress:BALLOONER_DOUBLET | team trunk, cream V .09 TW to .62 TH, puffs 2.5 arm widths, 3 slashes, belt .1 TH at .12 | 511 | approved | pale tunic
PA:RCB_HOLD | [R] 516 explicit-basis lay (+z opposite the line); carry: fist .12 ahead .1 across .08 under chest, line left .5 fwd .85 up .22; aim (readyAim): .2/.05/.02, line on the chest; grip off a fresh torsoMesh box; off fist .45 mag under | 516 | approved | 511 fist .16/.06/.12 laid along heading (nose pointed backwards)
SS:RCB_VOLLEY | one bolt per .25 s off rcbMuzzle, no scatter, arc 0, targetLift = chest | 516 | approved | 511 default bolt arc .06
secretDress:chuKoNuBelt | eight-sided dark strap, square buckle, loose end | 510 | approved | 509 hidden strap
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
PB:REPEATING_CROSSBOW | crossbow variant;stock.56s,magazine.13x.05x.19s,2 studs/side,lever,arm.78s sweep.12 thick .035 | 516 | approved | 501 magazine .17x.07x.24, arm .66 sweep .1
PB:EXECUTIONER_AXE | buildJarlAxe long1.3 grip.12 wide.22,steel(.52) crescent(.3) bulge.18 | 500 | approved | short axe stick
secretDress:SHOUTER_HELM | [R] 513 dome 1.24W to crown .64H, band, ear guards .5H, back plate, mask (brow V, cheeks, under-eye bars, nose .34H) off the eye box; horns .39W root 1.22W span | 513 | approved | 510 bowl cylinder + cheek blocks
PB:GIANT_FAN | halberd variant;haft1.0 stand grip.3;mount.32L;team half-oval1.4L x.8L | 500 | approved | hand fan
secret_2 stats cost/hm/dm/cm (10 units, 1890e47d) | d PASS 10/10;cheer hm .012 | 515 | stats | initial manifest
secretDress/PB:515 | BALLOONER_LEG lathe top .98 hem -.07 m waist 1.2 bulge 1.5 low 1.36, roll 2.7, stocking unlit (.6,.44,.22), shoe unlit (1,.2,.05) .82 Hf; KONU_ROBE knee -.02 m (tiers knee-anchored); KONU_LEG shell 1.32 taper .86 team x.3, 3 orange (.7,.2,.05) bands 1.5; CLAM_HAND long 3.2 wide 2.6 thick 1.3 past 1.1, eyes .55; POM_POM core .17 26 spikes .1 root .15 team x.8; CUPID_WINGS span 2.5 raise .08 rows 2 white, magenta bar | 515 | approved | none (shoe (1,.42,.12) read tan)
secret_1 stats cost/hm/dm/cm (10 units, b4d5ff95) | d PASS 10/10;fan dm .00064 | 500 | stats | initial manifest
SS/PS:SENTINEL_CATCH | warn.15,front cos.4,shafts lodged in the board met | 494 | approved | none
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
