# Loop ledger (v4): every value the loop has tuned

Rows: `file:identifier | value | last iter | verdict | earlier values`. P: no approved reversal within 20 iterations; two failed polish attempts spend a row. S/R replace mechanisms; stats exempt. Alias paths below.

532 | 6307e0d6 | secret.gatling_gun.a | approved [S] (struck 2)
532 | 35fde574 | secret.skeleton_giant.c | approved [S] (struck 1, c PASS)
532 | 44712ed1 | secret.wheelbarrow_dragon.a | approved [S] (struck 4, a PASS; CONFIRM failed a)
532 | 32b21a31 | secret.cavalry.a | approved [S] (struck 3)
532 | 31368387 | secret.cavalry.a | approved [S] (struck 4, a PASS; CONFIRM passed a, failed b)
532 | 16b934a1 | secret.gatling_gun.a | approved [S] (struck 3, a PASS; CONFIRM failed a, b)
532 | 4a2e4801 | secret.bomb_cannon.a | approved [S] (struck 2; 4 by lineup)
532 | e01c074c | secret.skeleton_giant.a | approved [S] (struck 5; [P] giant scale toward 3x fallout)
532 | f1fb5d6a | secret.wheelbarrow_dragon.b | approved [S] (struck 2, b PASS)

531 | af3247ae | secret.bank_robbers.b | approved [S] (struck 1; CONFIRM passed, D)
531 | e7664e58, 0ef10b96 | secret.wheelbarrow_dragon.a | approved [S] (struck 3)
531 | 0190b5cd | secret.cavalry.a | approved [S] (struck 2)
531 | bab41712 | secret.gatling_gun.a | approved [S] (struck 1; 4 by lineup)
531 | 135a95d9 | secret.bomb_cannon.b | approved [S] (struck 2, b PASS)
531 | 6704451a | secret.solar_architect.c | approved [S] (no strike; ray leaves from his feet)
531 | d7859f2a | secret.skeleton_giant.c | approved [S] (struck 2)
531 | aad23125 | secret.skeleton_giant.a | approved [S] (struck 1, 4)
531 | c99eccde | secret.necromancer.a | approved [S] (struck 1)

530 | f4eb62e2 | secret.bank_robbers.b | approved [S] (struck 2)
530 | 865a5057 | secret.bank_robbers.b | approved [S] (struck 3; added 4; [P] robbers armLength ~1.3 fallout)
530 | 7b82178a | secret.wheelbarrow_dragon.c | approved [S] (struck 1, c PASS)
530 | 489d21ae | secret.cavalry.c | approved [S] (struck 1, c PASS)
530 | ac9de35a | secret.banshee.c | approved [S] (struck 1)
530 | 9efd3166 | secret.necromancer.c | approved [S] (struck 1)
530 | 69d439c2, 03b0aab4 | secret.witch.a | approved [S] (struck 2; 3 by lineup)
530 | a57ca606 | secret.gatling_gun.b | approved [S] (struck 2, b PASS)
530 | 74451e1d | secret.solar_architect.b | approved [S] (struck 3)

529 | e692516e | secret.bank_robbers.a | approved [S] (struck 2, a PASS)
529 | 9115e65d | secret.gatling_gun.b | approved [S] (struck 1)
529 | f0b2561d, a83f0825 | secret.wheelbarrow_dragon.a | approved [S] (struck 2)
529 | ae04607c | secret.witch.c | approved [S] (struck 1)
529 | f1ccaab5 | secret.banshee.a | approved [S] (struck 2)
529 | 8471b2c3 | secret.solar_architect.b | approved [S] (struck 1; added 3 crossguard)
529 | be2c0fc3 | secret.bomb_cannon.a | approved [S] (struck 1)
529 | 022dce3e | secret.vlad.c | approved [S] (struck 1, c PASS)
529 | 8d4f93db | secret.necromancer.b | approved [S] (struck 2)

528 | 69681de4 | secret.witch.b | approved [S] (struck 1; [P] WITCH_STAFF thick/ropeAt fallout)
528 | dd424eab | secret.banshee.b | approved [S] (struck 1, 2, b PASS)
528 | 88adc711 | secret.necromancer.b | approved [S] (struck 1; added 3; [P] knife seat fallout)
528 | e00ede68 | secret.solar_architect.a | approved [S] (struck 2)
528 | 9e007d5c | secret.gatling_gun.c | approved [S] (struck 1, c PASS)
528 | 84812928 | secret.bank_robbers.a | approved [S] (struck 1, 3 by lineup)
528 | 53ccdaed | secret.skeleton_giant.b | approved [S] (struck 2, b PASS)
528 | d147ea1d | secret.vlad.a | approved [S] (struck 1)
528 | a6bcb527 | secret.wheelbarrow_dragon.a | approved [S] (struck a.1 and b.1)

## Spent (never retry as [P])

Aliases: LD=legacyDress.ts, VB=vehicleBuilder.ts, UV=unitVisuals.ts, PB=propBuilder.ts, FX=visualEffects.ts, RU=runtimeUnit.ts, SS=simulationSystem.ts, PA=proceduralAnimation.ts, PS=projectileSystem.ts.

## Rows
RU/LAP/SS/secretDress/UF/UV/PB/VB:532 | GATLING_STAND lean .14 reach .95 splay .12 elbow .25, crank gunner offset (0,0,-.78) scale .92, loader (.62,0,-.62); GIANT_SLASH radius 1.7 band .38 tilt .55 between .45 up 1.5 bone (1.15,1.08,.95); BARROW_OVERALLS bib .66 hi .56 shade .62 sat 2, driver bulk 1.35->.78 arms 1.12 legs 1.14; CAV_ARMOUR tabW .72 paul 2.5 gorW .82 steel CAV_HELM; CAV_CHEST arc 1.25 top .55 drop .12 flare 1.16; GATLING_VEST vee .5 shade .72 beige unlit (.86,.76,.52); BOMB_BARREL back -.3 front .7 bell .82 dBell .46 sight .17; GIANT_GREAVE top .36 foot .27 shade .85; BARROW_JAWS open .78 snout .5 teeth 6 gullet .45 | 532 | approved | low gunner beside the breech, no arc, slab driver bulk 1.35, bare rider, rump-only drape, plain team gunner, short .7 mortar, bare shins, boxed grin
PB/UV/LAP/UF/secretDress/SS/FX:531 | SAFE_STEEL peak .25 team^2, trim orange; robbers armLength 1.3 [P]; barrow driver dressAfro, straw_hat off; CAVALRY_SEAT lift .5; GATLING_HAIR cap 1.1x.5 quiff .8x.26 dark (.11,.08,.07), captain_hat off; bomb crew cutlassReseat pivot x PI; SOLAR_RAY core .16 halo .34 life .45 orb .55 burst .7; GIANT_FEAR cd 8 radius 6 fear 4 s; SKELETON_UNITS + skeleton_giant, necromancer (no hood on secret.*) | 531 | approved | team safe + gold trim, armLength 1, straw hat, unseated rider, top hat, point-down cutlass, lightning + pink dome, no fear aura, team humanoid bodies
secretDress/PB/VB/SS/RU/PS/LAP:530 | SAFE_DOOR dial .34 dw at .22 bar .36 plate .16 studs orange (1,.42,.1); SAFE_CARRY reach .97 (floor at shorter man's locked reach), flank robber scale .95->1.06 legLength 1.22; BARROW_BREATH jet .9 s ahead .08 chest .8 burn 2.5; CAVALRY_CHARGE from 1.2 reach 14 speed 1.6 overrun 3.5 dmg 30, CAVALRY_WAVE pull .7 every .35 radius 2 dmg 12; BANSHEE_SCREAM cd 10 radius 4 dmg 45 lift 7 push 6; NECRO_SKULL size .34 speed 25; WITCH_HOOD foot 1.7 top 1.25 back .45 seg .95/.95/1 team^2 x.9; GATLING_WHEELS dia .86 x .5 10 spokes team tyre; SOLAR_WAND collar 1.25 collarH .9, guard off; WITCH_STAFF thick .04->.07 ropeAt .06->.12 [P] | 530 | approved | small dial, bent carry, robber .95, puff on target, no charge, swoop only, no skull, brim witch_hat, slab on 4 wheels, crossguard, thick .04 ropeAt .06
secretDress/PB/VB/SS/FX/RM:529 | ROBBER_BELT at .97 h .16 out 1.13 holster .32x.78 grip .42 tilt .55 (.15,.085,.05); GATLING_CLUSTER 8 barrels bore .055 ring .075 collars .25 at .97/.55 breech .27 rails .17 out; BARROW_DRAGON w .5 h .34 l .42 at .6 sit .25 (.13 dropped) 7 fangs; witch clone x2 life 8 max 2 side by side; BANSHEE_GOWN out 1.12 top 2.3 foot 2.9 hem knee-.1 12 points .11; SOLAR_WAND long .3 wide .024 ring .1 on slab sword; BOMB_RIDER z .3 thigh -1.25 splay .62 knee 1.35 scale .86; VLAD_IMPALE cooldown 7 reach 7 step .75 width .85 dmg 1.2 lift 9, VLAD_STAKES 1.3-2.0 m girth .26; NECRO_LANTERN top .85 glass .8 ring 3.4 R; CAVALRY_SPEAR flagGap .03->.05 [P] | 529 | approved | open belt; 3 pipes on a box; hip cart box; 3 skeleton warriors; no dress; long orb staff; no rider; no impale; empty off hand; flagGap .03
secretDress/PB/PS/SS/UV/LAP:528 | WITCH_STAFF long 1.32 thick .04 4 knots 3 wraps ropeAt .06 stem .17 cap .36 capH .11 team; SPIRIT_RING wide 1.15 thick .045 at .12 tilt .38 unlit (.72,.9,1.15), banshee no wings; NECRO_KNIFE grip 2.6 long .21 wide .13 curve .18 hook .16, weapon dagger; SUN_HALO up .95 back .55 rings 1.25/2.1 12 spikes long 2.55 short 1.75 unlit gold (1,.7,.18), halo special off; GATLING_BULLET speed 48 trail 1.4 thick .03; ROBBER_BANDANA wrap 1.1 point .55 tip .35 magenta (.58,.05,.3); giant shield stiffy; VLAD_CROWN band 1.1 bandH .2 6 spikes tall .95 iron (.26,.26,.29) star unlit (.85,.46,.08), crown hat off; DRAGON_BARROW tray .42-1.12 W .34 wheel .27 wood (.3,.16,.085); CAVALRY_SPEAR flagW .026->.06 flagL .15->.2 [P] | 528 | approved | orb staff; wing shard fans; deer-skull staff; torus halo; bolt; bare face; no shield; gold crown hat; hip box; flags .026x.15
secretDress/PA/UV/PB/LAP:527 | ROBBER_STANCE square crouch 0 stride .14 lean .02, robbers legLength 1.22, OVERHEAD_SAFE over .2->.3; BANK_BOOT shaft .62 round 1.42 turn 1.52->1.82 h .17 (.1,.08,.075); BANK_VEST out 1.08 vee .46 open .62 6 rows 4 buttons, torso charcoal, no tunic skirt; GIANT_STIFFY_SWORD long .5 wide .075 7 jag runs bone (.66,.58,.45); GIANT_HELM bowl 1.26 side .6 cheek .26 deepTeam .85; CAVALRY_SPEAR long 1.5 thick .04 grip .2 blade .13 3 flags .15x.026; CAV_HELM steel (.5,.51,.54) bevor .42 crest .42; VLAD_LOG long .78 thick .1 point .4 grip .22; bomb crew cutlasses, reload raise shoulder -2.7 | 527 | approved | crouched hashed stance, legLength 1, over .2; low ankle boots; team torso + tunic skirt; empty fist; grey crown ball; striped jousting lance; plume cap; thin iron spear; bomb in loader's hand
Archived rows: secret_2 (all done 531) rows 516-526 @3af7d2b7; secret_2 done 525 elf/ice/clam/magma/raptor row @bd1f6929; secret_1 (all done) ledger@1cbd21bd, 515 ballooner/konu/clam/pom/cupid row @5e4a4273; secret_1 raptor/jester @823dc1cf; evil death_bringer/void_monarch @8d2b01e3, walker/sentinel/cultist/mechanic/lich @87af4842 | specs in owning code | 519 | archived values | unchanged
