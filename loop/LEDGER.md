# Loop ledger (v4): every value the loop has tuned

Rows: `file:identifier | value | last iter | verdict | earlier values`. P: no approved reversal within 20 iterations; two failed polish attempts spend a row. S/R replace mechanisms; stats exempt. Alias paths below.

541 | 4896725f | secret.blackbeard.a | approved [S] (no strike; tan slab over the red coat)
541 | 2ccc5709 | secret.sensei.a | approved [S] (struck 2)
541 | 4b07f4b5 | secret.sensei.a | approved [S] (struck 3, a PASS; CONFIRM failed a, c)
541 | fcfbebf5 | secret.artemis.c | approved [S] (struck 1)
541 | e1c62c43 | secret.ullr.b | approved [S] (no strike; axe head edge-on, off fist empty)
541 | 12a23e39, 0d7d192d | secret.ullr.c | approved [S] (struck 1)
541 | b156bbab, f027b9a6 | secret.lady_red_jade.b | approved [S] (struck 1, b PASS)
541 | 7e4100ff | secret.tree_giant.b | approved [S] (struck 1)
541 | 816231de | secret.ice_giant.a | approved [S] (struck 1)

540 | 82532e47 | secret.vlad.a | approved [S] (struck 2, a PASS; CONFIRM passed, D)
540 | a803a83d | secret.necromancer.a | approved [S] (struck 1, 2)
540 | 8bb7f01c | secret.necromancer.b | approved [S] (struck 1, b PASS)
540 | 93159c23 | secret.necromancer.a | approved [S] (struck 3, a PASS; CONFIRM passed, D)
540 | ac64e6be | secret.sensei.b | approved [S] (struck 1, b PASS)
540 | 956195e2 | secret.sensei.a | approved [S] (struck 4)
540 | 6e62a793, 4f98ec35 | secret.blackbeard.a | approved [S] (struck 4)
540 | 415e5613 | secret.blackbeard.c | approved [S] (struck 1, 2, c PASS; evidence 931a204a)
540 | a1768aeb, 06717795 | secret.artemis.b | approved [S] (struck 1, b PASS)

539 | 01f56fe3 | secret.necromancer.a | approved [S] (struck 6, a PASS; CONFIRM failed a, b)
539 | 25ff6c1c | secret.necromancer.a | approved [P] NECRO_SHORTS hem (row spent for further nudging)
539 | b948a7cf | secret.vlad.a | approved [S] (struck 1)
539 | 7adefe06, 209ee003 | secret.vlad.a | approved [S] (no strike; log covers the chest)
539 | 2658848b | secret.vlad.a | approved [S] (struck 3; CONFIRM passed a)
539 | 349ed27b | secret.blackbeard.b | approved [S] (struck 2, b PASS)
539 | 58c71fd3, 8fdee906 | secret.blackbeard.c | approved [S] (no strike; balls unseen, evidence first)
539 | 2b444e72, 2206053a | secret.blackbeard.a | approved [S] (struck 1)
539 | 658d7e0f | secret.artemis.a | approved [S] (struck 1)
539 | 896b1aac | secret.sensei.a | approved [S] (struck 1, 5)

538 | 9c9fe16d | secret.witch.a | approved [S] (struck 5, a PASS; CONFIRM 536 copied, D)
538 | 5c8ac1db | secret.banshee.a | approved [S] (struck 5)
538 | 966b784f | secret.banshee.a | approved [S] (struck 6, a PASS; CONFIRM passed, D)
538 | 3997814f | secret.necromancer.a | approved [S] (struck 4; [P] NECRO_SHORTS hem fallout)
538 | ed76fae6 | secret.necromancer.a | approved [S] (struck 5)
538 | 96aeee6b | secret.necromancer.c | approved [S] (struck 3, c PASS)
538 | 2982232e, c9c7afbb | secret.vlad.a | approved [S] (struck 5, a PASS; CONFIRM failed a: mantle, stars, cap)
538 | 40db92f3 | secret.blackbeard.a | approved [S] (struck 2)
538 | afbccbda, dffef02c | secret.blackbeard.b | approved [S] (struck 1)

537 | a721ccd5 | secret.skeleton_giant.a | approved [S] (struck 3, a PASS; CONFIRM 536 copied, D)
537 | b9583fd6 | secret.necromancer.a | approved [S] (struck 3)
537 | bd4c21ff, 664a3f18 | secret.necromancer.c | approved [S] (no strike; graves rise, push unseen)
537 | 2c49273b, e9a60e53 | secret.banshee.a | approved [S] (struck 2)
537 | 56c897fc, 474c9e55 | secret.banshee.a | approved [S] (struck 3)
537 | 716d07af, 4d0f26b8 | secret.banshee.a | approved [S] (struck 4)
537 | 3eea93c7 | secret.vlad.a | approved [S] (struck 6)
537 | 8740885b | secret.vlad.a | approved [S] (struck 3)
537 | 71f3e6ad | secret.vlad.a | approved [S] (struck 2)

## Spent (never retry as [P])

Aliases: LD=legacyDress.ts, VB=vehicleBuilder.ts, UV=unitVisuals.ts, PB=propBuilder.ts, FX=visualEffects.ts, RU=runtimeUnit.ts, SS=simulationSystem.ts, PA=proceduralAnimation.ts, PS=projectileSystem.ts.

## Rows
secretDress/UF/UV/PB/SS/PS/PA:541 | BB_COAT fitTop .92 fitFoot 1.06 skirt to knee hem .1 flare 1.14-1.6 wraps 2 at .08 h .2 out 1.2 tilt .09 tail .2x1.1 at .62, cape + tunicSkirt off; [P] blackbeard scale 1.58 -> 1.95 (pending: root of a.5, toward a ~3.5 m rig); SENSEI_VEST shade .78 open .38 strips .07 orange (.95,.42,.06), robe/drape off; SENSEI_BAND 2 bands h .2 out 1.08 step .96 rims .16; ARTEMIS_FAN 5 arrows nock .28 lift .12 land .18; ULLR_AXE haft .42 long .34 wide .13 curl .42, ullr axe pair duelist throw family; ULLR_THROW tumble 16 rearm .8 speed 25, freeze at queue; GUANDAO pole .78 grip .4 guard .17 blade .82 curl .22 + bombStickGrip wrap; TREE_HUG_ARM raise -1 out -.85 elbow -1.2, TIP (.12,1,.22), tree two-handed; ICE_APE upper 1.5 lower 1.6 girth 1.45/1.7 out 1.12 waist .72 | 541 | approved | navy vest + brown strap, scale 1.58, gold robe board, no band, one arrow per shot, bow + quiver, arrow volley, two swords, TREE_HIP_ARM (-.9,.15,-.4) tip (.9,.02,.35), arms to mid-thigh
RU/secretDress/UF/PB/UV/capture:540 | VLAD_CARRY shoulder -.25 elbow -.95 off -.4/-1.15 in .35 dir (-.5,-.42,.75); NECRO_VEST top .08 crop .3 out 1.0 taper .8 deep .78 rag .1 laces 4 strapH .035; NECRO_LANTERN size 1.0 forearm R ring 2.1 ringT .1 bandH .08 drop .2 ahead .15; NECRO_CAP horns 6 segs .3-.2 w .34 out .95 kinks .3/.28/.22/.12/.18 bands at 1, 2; SENSEI_SHURIKEN 10 blades long .13 ring .045 wide .032 sweep .35 hub .1 drop .09; SENSEI_BRACER .12-.95 out 1.75 taper .9 4 spikes long 2.2 lean .55 steel; BB_PEG cup 1.25 top .8 foot .42 (540.7b from 2.2/1.5/.8); blackbeard weaponPresentationFamily heavy_swing; ARTEMIS_BOW long 1.6 thick .036 (540.9b from .065) 3 dark wraps, iceBowCarry; capture rig 16 barrage after +20 | 540 | approved | raised log over the chest, box vest to the belt + pads, skull-sized lantern, 3-seg thin horns, ninja 4-point star, bare forearms, two boots, cutlass thrust, short recurve, barrage frame 2 +40
secretDress/UF/UV/PB/SS/capture:539 | NECRO_ARMBAND at .3/.62 round 2.7 tall .2 grey (.62,.62,.64) gap ring purple; [P] NECRO_SHORTS hem .55 -> .4 (spent); VLAD_MANTLE top .72 foot 1.6 drop .62 deep 1.3 tufts 14 fur (.8,.5,.2), closed collar, stoles off; VLAD_ROSETTE size .36 8+8 points at .42/.66 stand .9 (per-height shell front); VLAD_CAP round 1.1 crown .06 dome .12 badgeAt .42; blackbeard offhand cutlass+blackbeard_anchor default grip; CANNON_BARRAGE first 0 cd 8 balls 8 every .15 spread 2.2 lean .8 up 14 dmg 45 splash 1.4 push 6; BB_HAT black (.035,.03,.035) cords 2/side long .62 flame unlit, hat tricorn; ARTEMIS_BAND round 1.08 top .84 tall .42 tip -.42 gold (1,.62,.14), halo off; SENSEI_HOOD dome 1.14 domeH .78 band 1.16 star .34 flare 1.12->2.3, hat none; capture barrage onMan after +40 | 539 | approved | no armbands, hem .55, grey chunk mantle + stoles, 5-ray stars .26, thin band, flintlock off hand, no barrage, captain_hat, halo + laurel, cone hat
secretDress/UF/SS/PB/UV:538 | WITCH_BROOM club rebuild lift .38 lean .24 clear .1 thin .045 mid .065 thick .115 neck .55, no brush; BANSHEE_WAIST at .06 out 1.06 sag .05 link .075 step .056 cuff 1.55 at .72 dangle 5; BANSHEE_ARMBAND at .34/.66 round 1.42 tall .17 gold; NECRO_SHORTS hem .55 belt .12 out 1.36 pink (.55,.2,.36), no skeleton skirt; NECRO_BOOT shaft .97 round 2.5 laces 4 brown (.36,.17,.13); NECRO_GRAVES push reaches the trigger man (+ radius round him); VLAD_BOOT shaft .72 round 1.3 tan (.8,.6,.35) -> (.62,.36,.16); BEARD_BB chestW .62 tip .55 braids 2 ties 2 black lit .4; BB_ANCHOR size 1 -> 1.8 long .56 arm .2 sweep 2.1 flukes, weaponVariant blackbeard_anchor | 538 | approved | level brushed broom pitch .9 lift .3, no chains, bare arms, rag skirt, bare bone shins, 2.2 m push round the wall only, team feet, bare face, cutlass
secretDress/UF/UV/SS/FX:537 | [P] WITCH_BROOM pitch .18 -> .9, lift .2 -> .3; GIANT_FEET wide .34 toe .55 tall .36 long .86 heel 1.05 peg .5 pegUp .6 (wedge); NECRO_VEST top .08 below .06 out 1.16 flare 1.24 rags 8 laces 5 dark .42; NECRO_GRAVES first .5 cd 8 near 4 ahead 1.3 apart .85 radius 2.2 dmg 20 push 6 lift 4, GRAVESTONES w .62 h 1.05; BANSHEE_CROWN r 1.3 foot .2 back .5 lean .18 ribs 5 spike .26 top 1.5, hood hat off; BANSHEE_FACE long 1.5 top .4 wide 1.0 ahead .32 eye .27; BANSHEE_HAIR x .58 seg .7/.6 w .22 tufts 7; VLAD_COAT fitTop .9 fitFoot 1.04 fitDeep 1.08 mantleFoot 1.38 -> 1.12 collarH .45 collarW .62, vampire_collar off; VLAD_HAIR lockX .55 lockW .3; VLAD_STACHE seg .26/.22/.16 thick .15 droop .25 curl 1.3 | 537 | approved | broom pitch .18 lift .2, box feet .48, no vest, no graves, hood dish, ball head, no hair, box coat shell + mantle 1.38, tuft, no mustache
secretDress/UF/RU/PS/SS/FX/UV:536 | WITCH_BROOM lift .2 seat .01 ahead .78 behind .22 pitch .18 thin .045 thick .075 brush .28 brushW .18; WITCH_ROBE hem .45 out 1.2 flare 1.5 rags 9 bands .12 at .2 sash .13 dark .42 light .22, shorts hem .5; SHROOMS seconds 6 size .2 clear .9 shoulder .45 cap .62 (1,.22,.75); SHROOM_TURN reach 1.1 every 1 dmg 12; GIANT_HELM hood .62 hoodTop 1.24 hoodFoot 1.5 back .36 cheekW .3 under .32; GIANT_FEET wide .48 tall .5 long .8; SOLAR_MAELSTROM near 7 cd 12 radius 3.5 seconds 3 heal .04 pull 7, cast on the target, FX from .75; SOLAR_COAT out 1.16 flare 1.32 hem .5 white (.9,.9,.88) gold (.85,.6,.15); SOLAR_LEGS cuff .11; NECRO_CAP horns 3 segs out 1.05 bend .62 shade .42, hood hat off | 536 | approved | standing witch, no robe, pink head glow, bucket helm, block feet, pink dome, grey vest, dark trousers + boots, hood ball
SS/PS/RU/LAP/secretDress/UF/RM/VB/PB/UV:535 | NECRO_CURSE tick .5 rot .1 smoke (.2,.42,.16), raise on RU.onDeath; BANSHEE_CURSE stream .55 s curse 5 s chest 1; GHOST_CURSE dye .85 glow .75 wisps 6 long 1.1 wide .24 ring 1; CURSE_CAST fore 1.45 inward .18 hold .55; SOLAR_WAND_LAY out .55 up .75 fore .35 seat .6; solar ray from solarWandRing alternating; bomb loader actor dropped, gunner offset (.22,0,-.62), BOMB_GUNNER_STRIPES 4 rows band .09 out 1.07 cream; GATLING_TROUGH hi .08 -> -.03, waves 4 wave .11; witch in SKELETON_UNITS; WITCH_STAFF bends .28/.52/.76 kink .04, wraps 3 -> 5 rope .012 -> .016 ropeAt .1-.34 ropeC tan (.82,.64,.38); [P] giant bulk 1.7 -> 1.2, GIANT_BUILD hem .42 -> .3 | 535 | approved | free skeleton summon, swing + fear, team humanoid witch, straight wander staff, wands along the forearm, loader at the trail, tall cheeks .08 over the axis
Archived rows: secret_3 (all done 540) rows 527-534 @e96789e5; secret_2 (all done 531) rows 516-526 @3af7d2b7; secret_2 done 525 elf/ice/clam/magma/raptor row @bd1f6929; secret_1 (all done) ledger@1cbd21bd, 515 ballooner/konu/clam/pom/cupid row @5e4a4273; secret_1 raptor/jester @823dc1cf; evil death_bringer/void_monarch @8d2b01e3, walker/sentinel/cultist/mechanic/lich @87af4842 | specs in owning code | 519 | archived values | unchanged
