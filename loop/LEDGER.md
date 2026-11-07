# Loop ledger (v4): every value the loop has tuned

Rows: `file:identifier | value | last iter | verdict | earlier values`. P: no approved reversal within 20 iterations; two failed polish attempts spend a row. S/R replace mechanisms; stats exempt. Alias paths below.

## Structural attempts (last 5 iterations)

488 | 3d214b80,90d5416e,f63699d0 | good.celestial_aegis.a | approved (blocker 1)
488 | 51b500fc | good.celestial_aegis.a | approved (blocker 2; CONFIRM failed a: plateau)
488 | db9eceee | good.divine_arbiter.a | approved (blocker 1)
488 | 05f78f9f | good.divine_arbiter.a | approved (blocker 2; CONFIRM failed a: plateau)
488 | dba0cb7a | good.righteous_paladin.a | dropped (shield not moved; reverted bf730ed5)
488 | 57449aa1 | good.righteous_paladin.a | approved (blocker 2)
488 | a58de409 | good.chronomancer.a | approved (blocker 3)
488 | aa380788 | good.chronomancer.a | approved (blocker 4)
488 | b6a91fc9 | good.chronomancer.a | approved (blocker 5)

487 | 215e62cb,d89418f7 | good.celestial_aegis.a | approved (blocker 3)
487 | 2b127af7 | good.righteous_paladin.a | approved (no strike)
487 | 6c3892a7 | good.righteous_paladin.a | approved (no strike)
487 | 7436497a | good.radiant_glaive.a | approved (blocker 1)
487 | 13702a7e,8cb2ef91 | good.radiant_glaive.a | approved (blocker 5)
487 | 5cc46687,02948277 | good.radiant_glaive.a | approved (blocker 4; a PASS; CONFIRM D)
487 | 5822e7c7 | good.divine_arbiter.a | approved (blocker 4)
487 | 353aa34c | good.divine_arbiter.a | approved (blocker 5; CONFIRM failed a)
487 | 50a6fe6b | good.celestial_aegis.a | approved (blocker 1; CONFIRM failed a)

486 | 2b940c2b | good.righteous_paladin.a | approved (blocker 1)
486 | 86c5d31f | good.righteous_paladin.a | approved (blocker 3)
486 | 3287a3d9,5af5b18b | good.righteous_paladin.a | approved (no strike; CONFIRM failed a)
486 | 20a4e925 | good.chronomancer.a | approved (blocker 2)
486 | 1813eeb8,ec63e03e | good.chronomancer.c | approved (blocker 2; c PASS)
486 | c2ee629c,39b3ed63 | good.radiant_glaive.a | approved (blocker 3)
486 | b0e178f4 | good.celestial_aegis.a | approved (blockers 5-6 lineup)
486 | 2176add5 | good.celestial_aegis.a | approved (blocker 4)
486 | c2caca9d | good.sacred_elephant.a | approved (blocker 4)

485 | cf4041df | good.devout_gauntlet.a | approved (blocker 1)
485 | 11dabf78 | good.devout_gauntlet.a | approved (blockers 2-3; a PASS)
485 | 594e02aa | good.radiant_glaive.c | approved (blocker 1; c PASS)
485 | 4da0b53d,d1c4d6d0 | good.righteous_paladin.c | approved (blocker 1; c PASS)
485 | 784a2fdd | good.radiant_glaive.a | approved (blocker 2)
485 | c9266f24 | good.sacred_elephant.c | approved (blocker 1; c PASS)
485 | e9a4084a | good.chronomancer.c | approved (blocker 1)
485 | 0412f565 | good.chronomancer.a | approved (blocker 1)
485 | a18bb6c5 | good.sacred_elephant.a | approved (blocker 1)

484 | bd4ab456 | good.devout_gauntlet.a | approved (blocker 4)
484 | 83882d91 | good.devout_gauntlet.a | approved (blocker 6)
484 | b9d412bc | good.devout_gauntlet.a | approved (blocker 5)
484 | 76412962 | good.radiant_glaive.b | approved (blocker 3)
484 | cf178b1e | good.righteous_paladin.a | approved (blocker 2)
484 | aca3f94b | good.celestial_aegis.c | approved (blocker 1)
484 | b52aff2f | good.celestial_aegis.c | approved (blocker 2)
484 | 212ed7e2 | good.divine_arbiter.a | approved (blocker 2)
484 | 9f62f67c | good.divine_arbiter.c | approved (blocker 1)


## Spent (never retry as [P])

Aliases: LD=legacyDress.ts, VB=vehicleBuilder.ts, UV=unitVisuals.ts, PB=propBuilder.ts, FX=visualEffects.ts, RU=runtimeUnit.ts, SS=simulationSystem.ts, PA=proceduralAnimation.ts, PS=projectileSystem.ts.

## Rows
UV:RADIANT build/stance | 1.24,.92bulk,.92W,legs1.38,.76/.7;upright | 487 | approved | 1.16bulk;seeded crouch
goodDress:RADIANT_TROUSERS | team legs,gold half-diamond1.1P to .55T,flank tri .6L,knee band2.4w+fin,shin.78,white feet,ankle2.5w | 487 | approved | dark pants,grey boots
goodDress:RADIANT_CAPE | team*.75 slab1.1->1.4W,1.9H,tilt.1,gold hem.1H,clasps.14W | 487 | approved | none
goodMagic:AEGIS_FIELD look | built at spawn;6m sphere,alpha.01+opacity fresnel .03->.5 p3,emissive fresnel cream->yellow,culled back;no rings | 488 | approved | alpha.055 fill + two gold great circles (sim only)
goodDress:CHRONO_CROP | white unlit shell from -.15H to top,1.06W;gold hem.07H,neck ring.5W,armholes;trunk head skin | 488 | approved | icy body torso
goodDress:CHRONO_BREECHES | thigh shell1.5r,knee puff1.55r to .2S,gold band1.45r .24-.34S,boot1.22r;belt8-sided1.15P grey,gold buckle.3P,white ring | 488 | approved | icy legs
goodDress:CHRONO_ARMBANDS | upper bands1.4r .18-.3/.5-.62,fore1.35r .1-.22;white winglets .5U long .2U tip,yaw.5 | 488 | approved | bare arms
PA:PALADIN stance | square,PALADIN_SPLAY.15,sink 1-cos | 488 | approved | upright stride.14
PA:ARBITER stance | upright hook on arbiterMitre,crouch0,lean.04 | 488 | approved | seeded crouch
UV:AEGIS build/stance | 1.12,.88bulk,.9W,legs1.4,.76/.7;upright | 487 | approved | bulk1.2;seeded crouch
goodDress:ARBITER_ROBE | team torso/yoke,sleeve1.75r,elbow puff to 5r,fore1.5r,glove cuff3.4->4.4r,unlit(1,.62,.12) | 487 | approved | dark vest
goodDress:ARBITER_SKIRT | split panels back1.15->1.9P,front .12-.6->.35-1P,sides,gold.07,len to .85T;grey(.62,.64,.68) legs,skin feet | 487 | approved | dark skirt,trousers,boots
goodDress:PALADIN_CUIRASS | grey slabs .58D,1.16W,.04D slot,brown straps,gold hex+chevrons;team sleeves .55 | 486 | approved | white body plate,shoulder pads
goodDress:PALADIN_LEG_ARMOUR | shorts seat1.08->1.3P,bloused3.2/4.1/3r to .48T;thigh plate .5-.8T 1.7w;cop 6-sided1.8w .9d gold V;shin1.75w | 487 | approved | 2.15/2.2/2.25w,flat cops,limbShell puff (486)
UV:PALADIN build/stance | 1.3,.92bulk,.92W,legs1.38,.76/.7;upright,no pads/belt | 486 | approved | 1.34,1.36bulk;seeded crouch
goodDress:CHRONO_RING | ring2.5W,tube.07W,spikes.18W,top.55W,3/9 spikes+winglets | 486 | approved | small attack-only torso hoop
SS/goodMagic:CHRONO_TRANSFORM | settle.2,drop1.45H,tilt1.15,grow.25,spin1.6;10 cubes r1.4 orbit.9 | 486 | approved | none
goodDress:RADIANT_VEST | team vest,white V .5W x .55H,gold trim+hem;sleeves 1.7/1.9,left .45 | 486 | approved | dark vest,pads
goodDress:AEGIS_HOODIE | bare torso+yoke (arm skin) narrowed to .76SW x .8SD;unlit team*.4 shell from .1H,>=yoke W;lip1.05;hood.62W | 488 | approved | full-width bare trunk (487),skin box,lit cloth shell (486)
goodDress:AEGIS_SKIRT | 8-sided1.1P->1.85P,.62T,black waist,gold hem,trapezoid.5->.26P | 486 | approved | trousers,grey boots
goodDress:ELEPHANT_RIDER_DRESS | white hair,team cap,gold crystal,white top gold bands,shorts1.6 | 486 | approved | bald team soldier
UV:ARBITER scale/build | 1.12,bulk.92,torso.92,legs1.42,.78/.72 | 488 | approved | bulk.96 legs1 (486);1.86,1.22
goodDress:DEVOUT_ARM_WRAPS | upper .45-1 x1.45,fore 0-.94 x1.7,3 ridges,unlit(.62,.64,.68) | 485 | approved | bare forearms
goodDress:DEVOUT_WAIST_COLLAR | front W points .48 torsoH,V to band,sides/back;pelvis out of glow;band 1.04W | 485 | approved | two 4-sided fold cones
SS/PS:RADIANT_THROW | range12,cd1.25,speed25,3 hops reach7,heavy>.8 costs2;held glaive back 1s | 485 | approved | halberd melee
SS/goodMagic:PALADIN_HAMMER | reach7,cd8,power1.5,radius2.5,push5,daze1.2,hang.4,fall.3 | 485 | approved | none
goodDress:RADIANT_HELMET | gold box crown/sides/back,1H gold diamond,team .8 inset .6 shade,strand | 485 | approved | laurel/hair
SS/PS:ELEPHANT_SPEARS throw | range16,cd1.2,rearm3,.5x dmg;suck radius3.5 pull7 minor.1 | 485 | approved | rider idle
SS/PS:CHRONO_BOLTS | right then left .25s,speed22,clock face .5 | 485 | approved | slow dome
goodDress:CHRONO_CROWN | 8-sided band1.12W,9 spikes.22H,front .95H,ear guards;gold(.85,.55,.12) | 485 | approved | laurel/halo
VB:ELEPHANT_TRUNK | one 8-sided tube,piece.17,root.27->tip.12,flare.15 | 485 | approved | 8 separate cylinders,hooked tip
goodDress:DEVOUT_CIRCLET | 8-sided hoop,triangular .85H front,.38H ivory gem | 484 | approved | laurel/hair
goodDress:DEVOUT_SHOULDERS | two solid curled plates span2.68W,3-point chest band | 484 | approved | absent
goodDress:DEVOUT_MOUSTACHE | paired closed pale-yellow curled wings,1.12headW | 484 | approved | absent
PB:RADIANT_SHIELD mount | leftHand,STIFFY_UPRIGHT axes,grip bracket | 484 | approved | torso bracket (483 approved)
goodDress:PALADIN_HAIR | center-part grey locks,3 pale winglets/side,tied ponytail | 484 | approved | great helm
SS/PS:AEGIS_FIELD | radius3,500damage capacity,10s recharge,enemy projectile reflection | 484 | approved | absent
SS/PS:AEGIS_ORBS | 6 orbit lights,hand-origin team orb,range10,cooldown2,speed18,push8 | 484 | approved | contact melee
goodDress:ARBITER_MITRE | half-ellipsoid dome1.12W x2H rim.36H,gold band1.16W .16H,gold point.6W .55H tilt.28,team diamond in gold frame | 488 | approved | team8-sided cylinder1.05H+shield panel (484);laurel/hair/halo
SS/PS/FX:ARBITER_LIGHTS | 5 book-origin lights,.1delay,18speed,radius2 ray friendly fire | 484 | approved | instant lightning/dome
goodDress:AEGIS_BUTTERFLY | white crown/temples/4-knot braid;four team lobes,upper1.32H/lower.4H | 483 | approved | steel cap
goodDress:ARBITER_COLLAR | 10 closed rising gold petals,rim1.2-1.3W,opening.35W,unlit(.85,.55,.12) | 483 | approved | bare neck outline
PA:DEVOUT_PUNCH | alternating level jabs,charging lean .28;boxer overlay | 483 | approved | overhead duelist swing
UV:DEVOUT build/stance | 1.08scale,.8bulk,.9torsoW,1.4legs,.88/.8;upright,no vest/pads | 483 | approved | 1.02,1.12,1.08arms;duelist
goodDress:DEVOUT_TROUSERS | six-sided articulated flares1.08/1.55/2.2,beige unlit(.8,.72,.56),team hem5.5% | 483 | approved | dark tight legs,grey boots
PB:RADIANT_SHIELD | .46stand faceted team disc,gold rim,four luminous cusps,torso bracket | 483 | approved | no shield
PB:PALADIN_SHIELD | .5stand pale16-sided board,gold rim,broken chevrons,hex seal | 483 | approved | kite cross shield
UV:AEGIS equipment | none/none,caster | 482 | approved | sword/tower
PB:PALADIN_HAMMER | .48stand haft,paired .18L x .4L cheeks,.245L glowing faces | 482 | approved | greatsword
PB:ARBITER_BOOK + PA:book hold | two .18stand covers,.265 page block;V .32rad;two-hand corner IK | 482 | approved | lightning bolt
PB:RADIANT_GLAIVE | .44stand,opposed 3-facet swept wings,gold/light edge,one-hand grip | 482 | approved | halberd
VB:ELEPHANT_SPEARS | paired1.2shaft,.2tips,gold,diagonal .55/.85/.1 | 482 | approved | rider bow
Completed legacy_2 and earlier rows | specs in owning code; ledger@b9daeaea (legacy_1@7090fef5) | 487 | archived values | unchanged
good stats cost/hm/dm/cm (7 units, values at a54ace09) | d PASS 7/7; hm .74,.15,.38,.74,.05,.16,.4; dm glaive .59,paladin .43,chrono .39; cm .48,.56,1.53,.27 | 481 | stats | initial manifest
PB:DEVOUT_GAUNTLET | 4 finger bands, thumb,cuff;10-facet crescent .18stand radius;paired | 481 | approved | single mace
