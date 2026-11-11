# Loop ledger (v4): every value the loop has tuned

Rows: `file:identifier | value | last iter | verdict | earlier values`. P: no approved reversal within 20 iterations; two failed polish attempts spend a row. S/R replace mechanisms; stats exempt. Alias paths below.

519 | 39a25143 | secret.taekwondo.c | approved [S] (struck 2; c PASS; CONFIRM passed, done)
519 | f5bf16bc | secret.cheerleader.c | approved [S] (struck 2; c PASS; CONFIRM failed a: cream top, sash)
519 | 4d2fdb20 | secret.cupid.b | approved [S] (struck 2; b PASS; CONFIRM passed, done)
519 | 679bc01a, c9417b8f | secret.cupid.c | approved [S] (struck 1)
519 | a2784aa2, 25713663 | secret.cupid.c | approved [S] (struck 2; c PASS)
519 | cddeb53a | secret.ice_mage.b | approved [S] (struck 1)
519 | 604033c4, 135e2158 | secret.raptor_rider.b | approved [S] (struck 2; added 3: wood near-black)
519 | b2600e04 | secret.present_elf.b | approved [S] (struck 1; bells hidden in the knot)
519 | 8182f4b6 | secret.infernal_whip.b | approved [S] (struck 1)

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


## Spent (never retry as [P])

Aliases: LD=legacyDress.ts, VB=vehicleBuilder.ts, UV=unitVisuals.ts, PB=propBuilder.ts, FX=visualEffects.ts, RU=runtimeUnit.ts, SS=simulationSystem.ts, PA=proceduralAnimation.ts, PS=projectileSystem.ts.

## Rows
secretDress/PB/PS/SS/RU/PA:519 | FLY_KICK lead 1.55 knee .05 tuck 1.0/1.7 lean .4 guard .7 out .35 elbow 1.5 set outright on the leap tick; CHEER hold 1.4 up 2.5 fore .35 pump 1.1 2.5 Hz; HEART_ARROW long .56 head .12 s; HEART_ARROW_FLY head .2 m, 4 trail hearts .16 x.8 gap .24, pink (1,.22,.62), love 10 s; LOVE_HEARTS big .95 small 2x.45 over .85; LOVE_KISS reach .9 every .5 drain 4; PLANK_SHIELD 4 planks .36x.55 s wood (.2,.11,.055) torso-stood x-.62 sw; PRESENT 1.55x1.25x1.5 torso, band .2 x.55, bell .13; CHAIN_WHIP 14 links 1.0 H, blade .13, rope g22 drag 2.5 friction 12 | 519 | approved | none (hop, still poms, plain arrow, empty off hand, hand box, stick whip)
secretDress/PB/FX:518 | TKD_TROUSER thigh 2.0 shin 2.15->2.4 cuff 2.55 .72->1.12 cream unlit, feet skin; TKD_HAIR cap 1.12W .6H (.11,.08,.07), bun .34W .4H, team band; CHEER_HAIR cap 1.14W .56H team x.72, fringe .9W; CUPID_FOOT skin slim .86 cuff .7; CONFETTI 36 chips .11 ring .55 1.6 s; RAPTOR_MOUNT lift .7 trunk .62x.62x1.45H, jaw gape .75, 9 spikes, legs .3H out; OVERHEAD_SAFE .6x.42x.38 Hh over .26 | 518 | approved | none (bandanas, boots, smoke, box mount, hip safe)
secretDress:517 | ELF_CAP fur .2H at e+.02H W1.2, cone .42H 1.08->.52W, 5-pt tip, pom .22W, green (.04,.42,.17), fur unlit (.82,.76,.6), pom (.85,.28,.06); ICE_HAIR half-dome 1.16W to c+.6H, fringe .62W tilt .32, locks .34->.2W x.64 z.3 to c-.42H, unlit (.74,.68,.52); ROCK_HAIR ico 1.18W .5H, 7 spikes .3W to .62H, (.07,.045,.04) self-lit .4, 3 magma cracks; TKD_BELT off the tunic skirt: band .17h sink .04 out 1.1, knot, tails .62h splay .3; CUPID_DIAPER lathe waist 1.18 bulge 1.34 low .62 drop .9 unlit (.74,.64,.46), bare body; CHEER_SOCK shin .08-1 out 1.28, cuff, 8 stripes team x.85 | 517 | approved | none (hoods; belt inside the skirt; vest; plain legs)
secretDress/PB/SS/UV:516 | BALLOONER_LEG hem +.03 m waist 1.08 bulge 1.22 low 1.1 cuff 2.3, UV legLength 1.2 upperLegWidth .9; TKD_GI lapels .17TW to .86TH, belt .1TH, sleeves 1.7/1.85 flare 1.3, body material; KICK_BY_UNIT taekwondo within .75 windup .22 cooldown 1.5 damage 3 fling 7 raise 2.05 plain; CUPID_HAIR 4 rings x9 curls .34W unlit gold (.7,.5,.15); HEART_BOW tall .62 belly .3 unlit orange (.8,.38,.1) hearts pink (.8,.12,.55); CHEER_SKIRT 14 pleats flare .38 hem .55 purple (.42,.14,.63); CLAM_HAT 9 ribs span 1.3 long 1.5 rim .8 | 516 | approved | 515 BALLOONER_LEG hem -.07 bulge 1.5 low 1.36
Archived rows: secret_1 (all done) ledger@1cbd21bd; secret_1 raptor/jester @823dc1cf; evil death_bringer/void_monarch @8d2b01e3, walker/sentinel/cultist/mechanic/lich @87af4842 | specs in owning code | 519 | archived values | unchanged
SS:KICK start gate | dodge flip drops a pending kick (ready again after the flip); no start while _recovers, toppled, downed or airborne | 512 | approved | start gated on _recovers only
secret_2 stats cost/hm/dm/cm (10 units, 1890e47d) | d PASS 10/10;cheer hm .012 | 515 | stats | initial manifest
secretDress/PB:515 | BALLOONER_LEG lathe top .98 hem -.07 m waist 1.2 bulge 1.5 low 1.36, roll 2.7, stocking unlit (.6,.44,.22), shoe unlit (1,.2,.05) .82 Hf; KONU_ROBE knee -.02 m (tiers knee-anchored); KONU_LEG shell 1.32 taper .86 team x.3, 3 orange (.7,.2,.05) bands 1.5; CLAM_HAND long 3.2 wide 2.6 thick 1.3 past 1.1, eyes .55; POM_POM core .17 26 spikes .1 root .15 team x.8; CUPID_WINGS span 2.5 raise .08 rows 2 white, magenta bar | 515 | approved | none (shoe (1,.42,.12) read tan)
Completed good, legacy_2 and earlier rows | specs in owning code; ledger@7b0ae2f6 (legacy_2@b9daeaea, legacy_1@7090fef5) | 494 | archived values | unchanged
