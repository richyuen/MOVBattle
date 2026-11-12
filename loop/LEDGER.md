# Loop ledger (v4): every value the loop has tuned

Rows: `file:identifier | value | last iter | verdict | earlier values`. P: no approved reversal within 20 iterations; two failed polish attempts spend a row. S/R replace mechanisms; stats exempt. Alias paths below.

526 | 10af68b7, 3d7752aa | secret.bank_robbers.c | approved [S] (struck 4, c PASS; fists judged in unit_secret.bank_robbers_punch)
526 | 588e761d | secret.present_elf.b | approved [S] (struck 1, 2, b PASS, CONFIRM passed; [P] PRESENT.knee fallout)
526 | 3260de91 | secret.clams.a | approved [S] (struck 1, a PASS, CONFIRM passed)
526 | 51713b01 | secret.ice_mage.a | approved [S] (struck 5, a PASS, CONFIRM passed)
526 | 79832b67 | secret.infernal_whip.a | approved [S] (struck 4, a PASS, CONFIRM passed)
526 | 582d6412, 02154310 | secret.clams.b | approved [S] (struck 1, b PASS, CONFIRM passed; [P] CLAM_HAND.flat fallout)
526 | 7a65dce6 | secret.raptor_rider.a | approved [S] (struck 2)
526 | 605d0072 | secret.raptor_rider.a | approved [S] (struck 3)
526 | 18a98a20 | secret.raptor_rider.a | approved [S] (struck 5, a PASS, CONFIRM passed; judged in unit_secret.raptor_rider_back)

525 | 553aa464 | secret.present_elf.a | approved [S] (struck 2; vest on unit_secret.present_elf_front)
525 | b2419661 | secret.present_elf.a | approved [S] (struck 3)
525 | 3928c3e9 | secret.ice_mage.a | approved [S] (struck 3; pinafore hem .72->.58)
525 | 955447c8 | secret.clams.a | approved [S] (struck 5)
525 | d6371769 | secret.clams.a | approved [S] (struck 6, a PASS; CONFIRM failed a, b)
525 | 828f37d3 | secret.present_elf.a | approved [S] (struck 4, a PASS, CONFIRM passed a)
525 | a2721aa3 | secret.ice_mage.a | approved [S] (struck 4)
525 | adcd07d8 | secret.infernal_whip.a | approved [S] (struck 3)
525 | 3df5c0a3 | secret.raptor_rider.c | approved [S] (struck 1, c PASS)

524 | 0bf6073a | secret.ice_mage.c | approved [S] (struck 2, c PASS)
524 | 19c243c3 | secret.clams.c | approved [S] (struck 2, c PASS)
524 | 0662d3b5, 44a4985b | secret.clams.a | approved [S] (struck 3)
524 | fb46a15f | secret.raptor_rider.b | approved [S] (struck 3, b PASS)
524 | eff4e629 | secret.present_elf.b | approved [S] (struck 3, b PASS)
524 | 68161f8e | secret.present_elf.a | dropped [S] (vest hidden behind the present; reverted 23b2afbd)
524 | c2752b3e | secret.infernal_whip.a | approved [S] (struck 2)
524 | 1410759b | secret.infernal_whip.b | approved [S] (no strike; [P] CHAIN_EMBER size fallout)
524 | e976a1b4 | secret.bank_robbers.a | approved [S] (struck 3)
524 | cd9ab43a | secret.ice_mage.a | approved [S] (struck 2)

523 | 8999f026 | secret.mace_spinner.a | approved [S] (struck 4, a PASS, CONFIRM passed)
523 | a369ec7a | secret.present_elf.b | approved [S] (struck 2)
523 | 5472e586 | secret.raptor_rider.b | approved [S] (struck 1)
523 | 2bcec881 | secret.infernal_whip.b | approved [S] (struck 2)
523 | 73fc448f | secret.ice_mage.c | approved [S] (struck 3)
523 | 3c3fcc54 | secret.bank_robbers.a | approved [S] (struck 1 and 6 by lineup)
523 | 4b3b6265 | secret.bank_robbers.c | approved [S] (struck 2)
523 | 53ebabd6, ab43da19 | secret.clams.a | approved [S] (struck 4)
523 | d97f5061 | secret.infernal_whip.c | approved [S] (struck 3, c PASS)

522 | 7bca30d3 | secret.bank_robbers.a | approved [S] (struck 1 and 3 by lineup)
522 | da6e9b4a | secret.mace_spinner.a | approved [S] (struck 1)
522 | 1b6811a1 | secret.ice_mage.a | approved [S] (struck 1 and 6)
522 | 20ef0217 | secret.infernal_whip.c | approved [S] (struck 2)
522 | a56f3ca0 | secret.mace_spinner.a | approved [S] (struck 3)
522 | d8255310 | secret.present_elf.c | approved [S] (struck 2, c PASS)

## Spent (never retry as [P])

Aliases: LD=legacyDress.ts, VB=vehicleBuilder.ts, UV=unitVisuals.ts, PB=propBuilder.ts, FX=visualEffects.ts, RU=runtimeUnit.ts, SS=simulationSystem.ts, PA=proceduralAnimation.ts, PS=projectileSystem.ts.

## Rows
secretDress/SS/RU/PB/UV:526 | PRESENT span 2.0 x shoulder joints, floor at knee 0, deepW .82, PRESENT_HOLD out 1.02 down .1; SAFE_HURL fistReady .5, robbers disarmToFists at the throw; CLAM_HAND head-sized long 1.55 wide 1.25 thick .85 past .4 flat .35 point .45 eye .13; clam_shell special builds nothing; ICE_SLEEVE out 1.16 fore .8 cuff .16 flare 1.42 deep .72, ice mage default preset; MAGMA_LEG round 1.14 shin .5 boot 1.24 deep .38 knee 1.5 kneeH .26; RIDER_HAIR lockLo -.62 brown (.2,.1,.05); RIDER_FEATHERS 6 long .78 fan .42; RIDER_LOIN wrapH .7 flapL .55 fur (.07,.065,.05), bone mask off | 526 | approved | torso-box present 1.55W; pistols after the throw; hand-sized CLAM_HAND 3.2/2.6/1.3; blue thigh disc; secret_ice tint; demon-tinted legs; bone mask, tunic skirt
secretDress/SS:525 | ELF_VEST off the yoke, yoke+pads to shirt cream; ELF_TROUSER thigh 1.14 shin 1.12 green (.03,.36,.15) self .25, no tunic skirt; ELF_BOOT shaft .55 round 1.36 cuff 1.52 black; ICE_SHORTS hem knee+.035 round 1.2/1.26 deepTeam .42; iceMagePinafore hem .58 of waist-to-knee; ICE_BOOT shaft .42 round 1.3 fur cuff 1.78 h .17 red (.29,.1,.12); CLAM_TROUSER thigh 1.12 shin 1.1 tan (.72,.5,.3) rope (.78,.42,.28), no tunic skirt; CLAM_BOOT shaft .45 cuff 1.62 wraps 1.46 brown (.26,.11,.06) rust (.62,.24,.12); MAGMA_BAND pad 1.85 padH .42 spike .32 band 1.5 bandH .2 at .55, 4-5 cracks; RAPTOR_STOMP every .22 size .42 ahead .6 side .45; CHAIN_EMBER crack 1.0 crackH .45 spark 2.0 sparkOut .6 | 525 | approved | pinafore hem .72; CHAIN_EMBER crack .8 crackH .16 spark .9 sparkOut .35; none else (team legs/feet, tunic skirts, no bands, no stomp)
RU/SS/secretDress/PB:524 | ICE_THROW fore 1.5 inward .12 back .45 hold .22 ease .25, HAND_LAUNCH palm; CLAM_THROW every .15 speed 11 apex 1.5 spin 9 short 1.4 spread .9; CLAM_COLLAR neck .9 rim 1.95 rimUp .32 thick .45 inside team^2 x.7; PLANK_WEATHER 4 tones ~(.6,.27,.17) cloth, 2 grooves, 3 teeth .06, bones out of glow; PRESENT_CANE long 1.05 r .035 14 stripes hook .1; INFERNAL_SLEEVE out 1.12 fore .62 cuff .2 flare 1.42; CHAIN_EMBER every 3 crack .8 crackH .16 spark .9 sparkOut .35 hot (1.6,.5,.05); BANK_SLEEVE charcoal (.1,.095,.1) self-lit .4 fore .72 cuff .18; ICE_SASH tall .22 out 1.12 brooch .42 tail .95 | 524 | approved | none (chest launch, summons beside him, no collar, (.2,.11,.055) planks, no cane, bare arms, plain chain, no sleeves, no sash)
UV/PA:mace spinner build | scale 1.1, bulk 1, square stance, crouch 0, lean .04 | 523 | approved | scale 1.3, bulk 1.2, hashed crouch
secretDress:PRESENT bell | open 9-sided cup .21W with clapper, splay .34 | 523 | approved | solid .13W cone at bow knot
PB:raptor_spear | wood .49s with lashed faceted flint .256s | 523 | approved | wood 1.0s and steel point
secretDress/RU:ChainWhip | one chain per hand, mirrored spawn angle, shared contact | 523 | approved | right hand only
RU:iceMageFreezeBlock | octagonal bevel, alpha .53, width 1.25x target span | 523 | approved | body-mounted shards
PB:cowboy_hat | pinched burgundy crown .086s and brim .278s with curled sides | 523 | approved | straight crown .12s, flat .34s brim
PB/SS/FX:safe landing | pivot .62pi, cash every .08s in flight plus 24 stacks on landing, 5 m ring | 523 | approved | closed safe, no cash, 3 m ring
secretDress:clamsShirt | tan chest, .88 upper-arm sleeves with rolls, two crossed laces | 523 | approved | team vest
FX:whip tip blast | two fronts and 12 sparks, grow to 1.25 m, .48 s total | 523 | approved | general explosion burst .35 scale
PB:OVERHEAD_SAFE | W .72 H .92 of body, inset hinged door .59W x .65H; floor unchanged | 522 | approved | W .6 H .42, flat face
secretDress:maceSpinnerBreastplate/maceSpinnerGreaves | five-ring breastplate and three-ring fauld; 1.58 to 1.32 tapered shin shell with ico knee cop | 522 | approved | team vest and bare legs
secretDress:iceMagePinafore hardware | two brass studs, 11 links with .56 torso half-height sag | 522 | approved | plain straps
SS/RU:Infernal Whip burn | applyBurn for existing status duration, materialize flames on hit tick | 522 | approved | one-off fire burst
secretDress/SS:present opening | hollow box, lid toss and confetti, discard box after .8 s | 522 | approved | solid box disappears at opening
secretDress:cheerleaderTop | unlit cream (.94,.90,.79), cap coverage .34, flare 1.43/1.2 | 521 | approved | teal torso
secretDress:cheerleaderSash | three bands .19 half-width each, shoulder z 1.34 torso half-depth | 521 | approved | no sash
UV:secret_raptor_rider | bulk .88, torso width/depth .8/.82, arms 1.18 long and .76/.72 wide | 521 | approved | bulk 1.1
secretDress:infernalShirt | team squared x .48, self-lit .12, caps cover .45 | 521 | approved | lilac torso
secretDress:iceMagePinafore | skirt .72 to knee, 10 faces, brown-red (.29,.10,.12), straps outside yoke | 521 | approved | no apron
secretDress:iceMageFrostHands | cyan-white core .49/.72 head radius, 4 satellites each hand | 521 | approved | empty fists
secretDress:presentElfShirt | unlit cream (.9,.8,.64), full sleeves, lower cuff flare 1.65 | 521 | approved | bare team arms
UV:secret_clams | scale 1.2, bulk .86, torso .88/.82, legs 1.22, arms 1.13 | 521 | approved | 1.18, 1.55, legs .8
RU/secretDress:maceWhirl | 15 rad/s in place through attack cooldown, fists level, maces anchored in hand space | 521 | approved | upright carry
SS/RU/secretDress/PS/PB/LAP:520 | RAPTOR_CHARGE from 1.2 speed 1.7 overrun 4 contact .6 cooldown 2.5 through; RAPTOR_GAIT amp .75 rate 2.6 bob .06; WHIP_LASH out .22 hold .3 back .35 radius 1.25 blast .35, CHAIN_WHIP sag .04; SAFE_CARRY inset .15, OVERHEAD_SAFE over .26->.2, flank robber scale .78->.95; SAFE_HURL speed 9 apex 1.6 radius 5 damage x3 lie 6 sink 3; ICICLE long .62 wide .13 4 shards (.55,.82,1) self .35; PRESENT_THROW speed 13.5 apex 1.4 open 3 rearm 12; SPINNER_MACE shaft .6 head .17 6 flanges lean .22, SPINNER_FISTS out .2->.32; SPINNER_HELM grey (.36,.37,.39) gold unlit; CLAM_CRITTER .62x.5 gape .6, clams summon farmer.halfling x3 | 520 | approved | none (static mount, dart, pistols out, bolt, summons beside him, shoulder mace, team cap, bomb men)
secretDress/PB/PS/SS/RU/PA:519 | FLY_KICK lead 1.55 knee .05 tuck 1.0/1.7 lean .4 guard .7 out .35 elbow 1.5 set outright on the leap tick; CHEER hold 1.4 up 2.5 fore .35 pump 1.1 2.5 Hz; HEART_ARROW long .56 head .12 s; HEART_ARROW_FLY head .2 m, 4 trail hearts .16 x.8 gap .24, pink (1,.22,.62), love 10 s; LOVE_HEARTS big .95 small 2x.45 over .85; LOVE_KISS reach .9 every .5 drain 4; PLANK_SHIELD 4 planks .36x.55 s wood (.2,.11,.055) torso-stood x-.62 sw; PRESENT 1.55x1.25x1.5 torso, band .2 x.55, bell .13; CHAIN_WHIP 14 links 1.0 H, blade .13, rope g22 drag 2.5 friction 12 | 519 | approved | none (hop, still poms, plain arrow, empty off hand, hand box, stick whip)
secretDress/PB/FX:518 | TKD_TROUSER thigh 2.0 shin 2.15->2.4 cuff 2.55 .72->1.12 cream unlit, feet skin; TKD_HAIR cap 1.12W .6H (.11,.08,.07), bun .34W .4H, team band; CHEER_HAIR cap 1.14W .56H team x.72, fringe .9W; CUPID_FOOT skin slim .86 cuff .7; CONFETTI 36 chips .11 ring .55 1.6 s; RAPTOR_MOUNT lift .7 trunk .62x.62x1.45H, jaw gape .75, 9 spikes, legs .3H out; OVERHEAD_SAFE .6x.42x.38 Hh over .26 | 518 | approved | none (bandanas, boots, smoke, box mount, hip safe)
secretDress:517 | ELF_CAP fur .2H at e+.02H W1.2, cone .42H 1.08->.52W, 5-pt tip, pom .22W, green (.04,.42,.17), fur unlit (.82,.76,.6), pom (.85,.28,.06); ICE_HAIR half-dome 1.16W to c+.6H, fringe .62W tilt .32, locks .34->.2W x.64 z.3 to c-.42H, unlit (.74,.68,.52); ROCK_HAIR ico 1.18W .5H, 7 spikes .3W to .62H, (.07,.045,.04) self-lit .4, 3 magma cracks; TKD_BELT off the tunic skirt: band .17h sink .04 out 1.1, knot, tails .62h splay .3; CUPID_DIAPER lathe waist 1.18 bulge 1.34 low .62 drop .9 unlit (.74,.64,.46), bare body; CHEER_SOCK shin .08-1 out 1.28, cuff, 8 stripes team x.85 | 517 | approved | none (hoods; belt inside the skirt; vest; plain legs)
secretDress/PB/SS/UV:516 | BALLOONER_LEG hem +.03 m waist 1.08 bulge 1.22 low 1.1 cuff 2.3, UV legLength 1.2 upperLegWidth .9; TKD_GI lapels .17TW to .86TH, belt .1TH, sleeves 1.7/1.85 flare 1.3, body material; KICK_BY_UNIT taekwondo within .75 windup .22 cooldown 1.5 damage 3 fling 7 raise 2.05 plain; CUPID_HAIR 4 rings x9 curls .34W unlit gold (.7,.5,.15); HEART_BOW tall .62 belly .3 unlit orange (.8,.38,.1) hearts pink (.8,.12,.55); CHEER_SKIRT 14 pleats flare .38 hem .55 purple (.42,.14,.63); CLAM_HAT 9 ribs span 1.3 long 1.5 rim .8 | 516 | approved | 515 BALLOONER_LEG hem -.07 bulge 1.5 low 1.36
Archived rows: secret_1 (all done) ledger@1cbd21bd; secret_1 raptor/jester @823dc1cf; evil death_bringer/void_monarch @8d2b01e3, walker/sentinel/cultist/mechanic/lich @87af4842 | specs in owning code | 519 | archived values | unchanged
SS:KICK start gate | dodge flip drops a pending kick (ready again after the flip); no start while _recovers, toppled, downed or airborne | 512 | approved | start gated on _recovers only
secret_2 stats cost/hm/dm/cm (10 units, 1890e47d) | d PASS 10/10;cheer hm .012 | 515 | stats | initial manifest
secretDress/PB:515 | BALLOONER_LEG lathe top .98 hem -.07 m waist 1.2 bulge 1.5 low 1.36, roll 2.7, stocking unlit (.6,.44,.22), shoe unlit (1,.2,.05) .82 Hf; KONU_ROBE knee -.02 m (tiers knee-anchored); KONU_LEG shell 1.32 taper .86 team x.3, 3 orange (.7,.2,.05) bands 1.5; CLAM_HAND long 3.2 wide 2.6 thick 1.3 past 1.1, eyes .55; POM_POM core .17 26 spikes .1 root .15 team x.8; CUPID_WINGS span 2.5 raise .08 rows 2 white, magenta bar | 515 | approved | none (shoe (1,.42,.12) read tan)
