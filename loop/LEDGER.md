# Loop ledger (v4): every value the loop has tuned

Rows: `file:identifier | value | last iter | verdict | earlier values`. P: no approved reversal within 20 iterations; two failed polish attempts spend a row. S/R replace mechanisms; stats exempt. Alias paths below.

## Structural attempts (last 5 iterations)

493 | 74215c7f | good.righteous_paladin.a | approved (blocker 1; a PASS; CONFIRM D)
493 | a127c2f7,0a8a899c,ddbe3995 | evil.void_cultist.c | approved (blocker 1; 7dcdbf23 reverted)
493 | 99b7a8fc,eee93888 | evil.mad_mechanic.c | approved (blocker 1; c PASS)
493 | 7387478e,d837acc3 | evil.exiled_sentinel.c | approved (blocker 1)
493 | 7b49861b | evil.shadow_walker.c | approved (blocker 2)
493 | 87954be0 | evil.death_bringer.c | approved (blocker 1)
493 | 301f1fad | evil.tempest_lich.c | rejected (hover hidden by the skirt; reverted 06b4f975)
493 | f22ca9e7 | evil.void_monarch.c | approved (blocker 1)
493 | 6c991027 | evil.void_cultist.a | approved (blocker 2)
492 | 694be5ff | good.sacred_elephant.a | approved (blocker 1)
492 | 5f638756 | good.sacred_elephant.a | approved (blocker 2)
492 | 509c48a0 | good.sacred_elephant.a | approved (blocker 3; a PASS; CONFIRM D)
492 | 9a91a5a5 | evil.exiled_sentinel.a | approved (blocker 5)
492 | 42fd82fe | evil.mad_mechanic.b | approved (blockers 1, 2; b PASS)
492 | 68d128e0 | evil.void_cultist.a | approved (blockers 1, 4)
492 | 3d7a1e02 | evil.shadow_walker.a | approved (blocker 2)
492 | a91f8594 | evil.tempest_lich.c | approved (blocker 1)
492 | 2117c98a,421014cc | evil.void_monarch.c | approved (dart clause of blocker 1)

491 | 65568848 | good.divine_arbiter.a | approved (blocker 3; a PASS; CONFIRM D)
491 | 67a1ba53 | evil.shadow_walker.a | approved (blocker 1)
491 | d2525821 | evil.exiled_sentinel.a | approved (blocker 2)
491 | a395751d,287847f9 | evil.mad_mechanic.b | approved (no strike; claw inside out)
491 | 4dfe45ac | evil.void_cultist.b | approved (blocker 2; b PASS)
491 | cdb92fd0,ddf16a33 | evil.death_bringer.b | approved (blockers 1, 2; b PASS)
491 | 071b5f23 | evil.void_monarch.b | approved (blockers 1, 2; b PASS)
491 | 6a770969,f86388a0 | evil.tempest_lich.c | approved (no strike; bolts unseen)
491 | 20f7342f | good.sacred_elephant.a | approved ([P] blocker 5; CONFIRM failed a)

490 | c223381e | good.divine_arbiter.a | approved ([R] blockers 1-3; struck 1, 2; CONFIRM early, not applied)
490 | 4f41d5e6 | good.chronomancer.a | approved (blocker 1; a PASS; CONFIRM D)
490 | 38f71664 | good.sacred_elephant.a | approved (blocker 6)
490 | 52fdcb61 | good.sacred_elephant.a | approved (blocker 3)
490 | df94c995 | evil.shadow_walker.b | approved (no strike)
490 | cc597223 | evil.exiled_sentinel.b | approved (blocker 1; b PASS)
490 | a9a68a3e | evil.void_cultist.b | approved (blocker 1)

489 | 5df4161c | good.celestial_aegis.a | approved ([R] blocker 1; a PASS; CONFIRM D)
489 | f0e9a4e5 | good.chronomancer.a | approved (blocker 6; CONFIRM failed a)
489 | 504716a7,b6f1d5ba | good.sacred_elephant.a | approved (blocker 2)
489 | 2c327ce9 | evil.shadow_walker.b | approved (no strike)
489 | 48281a0d | evil.shadow_walker.b | approved (blocker 2)
489 | ab3c3690 | evil.exiled_sentinel.a | approved (blocker 1)
489 | a755e889 | evil.exiled_sentinel.b | approved (blocker 2)


## Spent (never retry as [P])

Aliases: LD=legacyDress.ts, VB=vehicleBuilder.ts, UV=unitVisuals.ts, PB=propBuilder.ts, FX=visualEffects.ts, RU=runtimeUnit.ts, SS=simulationSystem.ts, PA=proceduralAnimation.ts, PS=projectileSystem.ts.

## Rows
evilDress:CULTIST_BEARD | 6-sided point-down cone 1.12W x1.55H,flat.42,root .08H under centre .2D proud,tip.2 fwd;sideburns.14W x.55H;moustache horns.5H droop.5 light(.42,.39,.35);dark(.17,.15,.14) unlit | 493 | approved | wedge+5 strands (unitFactory VOID_BEARD)
manifest:void_cultist archetype | heavy_melee,weaponHint mace;hm.76 dm.43 cm.56;vis heavy_swing family,default grip | 493 | approved | special_magic staff;dm.53 cm.56
manifest:void_monarch abilities | fear only (no summon) | 493 | approved | summon+fear,2 shadow walkers
SS:MECHANIC_FIRE | jet .8s,ahead.25,chest.9,near.08 far.3 farPer.1,core(.8,1,1) rim(.25,.7,1.15);engage 4.5 | 493 | approved | near.14 far.55 (look);bomb lob 6 m
SS:MONARCH_BURST | reaper burst radius2 dome4,ring(1.15,.2,.8) dark(.32,.03,.22) | 493 | approved | none
SS:DEATH_SLASH | slash arc pink(1.2,.25,.7) r1 band.2 tilt+-1.25 .45s chest1 | 493 | approved | none
PA:TWIN_SLASH | wind out.75 back.35,reach.9 across.45 drop.2,cock.18 driven.4 held.8,twist.35,guard.5 | 493 | approved | greatsword chop
PA:DAGGER_STAB | cock ahead.3 up.32 in.1,reach.95 down.45,cock.14 driven.32 held.8,lean.22 | 493 | approved | duelist overhead chop
PB:SENTINEL_AXE | bearded cut .95 x1.25 scale,haft.6,steel(.5,.5,.54),blood smear(.75,.02,.02);RU hold 2.5s | 493 | approved | .7 haft.75 (look);sword hidden
PB/PA:PALADIN_HAMMER carry | uprightHammerCarry mark -> BEARDED_AXE_CARRY | 493 | approved | hashed carry (head at the hip)
evilDress:SENTINEL_SPIKES | 4/side black 4-sided,.26-.56W out,.12D back,.62TH tall (ends .72),.12W,splay.22 | 492 | approved | pauldrons only
evilDress:CULTIST_HALO | dark 12-sided ring 2.1H tube.11H,10 inward triangles len.5R base.38H thin.06H | 492 | approved | wooden wheel 2.1H,10 spokes,hub
evilDress:WALKER_HELM | 8-sided shell 1.24W x1.26D,-.56H..+.36H,dome.3H,4 tan(.6,.42,.18) bars.13W x.52H gap.24W;eyes off | 492 | approved | box cap+dome,5 teeth
manifest:void_monarch archetype | boss_melee (boss.legendary splash 2),weaponHint sword;hm.14 dm.25 cm.43 | 492 | approved | special_magic staff;hm.23 dm.53 cm.56
VB:ELEPHANT_GIANT | buildMammoth giant .84 (seat 3.4 m) | 491 | approved | 1 (seat 4.1 m)
goodDress:ARBITER_PUFFS | torso-hung ellipsoid .9W x.9H x1.1D at +-.84W,+.2H | 491 | approved | arm-frame balloon (490)
UV/unitFactory:WALKER_HORN | path out to 2.2 heads at .24-.4H, up to 1.5H | 491 | approved | out 1.6, up 2.0 (U)
evilDress:SENTINEL_MANE | 11 ico lumps .36-.62W, lit cloth ginger(.85,.3,.06) self-lit .2 | 491 | approved | none
PB:MECHANIC_CLAW | cuff3.4f x2.5f,housing2.3f,3 cyan lights,jaws2.9f open.32;clawFrame rot.x PI | 492 | approved | built backwards (491);hammer+bomb
evilDress:CULTIST_BUCKLER | 1.3W world-sized board,rim+.62 ring,10 rim/5 face spikes,boss | 491 | approved | 1.5W hand-frame disc
PB:WARGLAIVE | chord.33H sweep.95,wide.05H,hot edge unlit(1.6,.22,.32),gold self-lit.4 | 491 | approved | greatsword
PB:MONARCH_SWORD | blade.5H wide.05H,ball.075H 10 spikes,unlit bone(.78,.7,.44) | 491 | approved | orb staff
FX:STORM_CLOUD | high3.2,11 puffs1.3,bolts5 every.3,life1.7;bolts held to cloud end (zeus hold) | 492 | approved | .3 s bolts (491);horizontal staff bolt
goodDress:ELEPHANT_BLANKET | drape hull rx.85 ry.68 rz1.16 +.05,hang.42,z-1->.15,.035 thick;gold hem.1,teeth.2x.17 every.25,end bands.07;4 tassels.26 | 490 | approved | half-shell arc.5 patch (VB)
VB:ELEPHANT_SHIN | one 12-sided hide lathe r .29/.28/.27/.29/.3/.27/.2 at y .05..-.44 (shin+pad) | 492 | approved | hide frustum .6->.78+rim .8 (490);dark .08 sole disc
VB:ELEPHANT_TUSK | tube 6 pts root(.34,-.2,.56)->tip(.45,-.15,1.02),r.16->.008,grey-ivory(.72,.69,.63) self-lit.2;gold ring .37x.1 pts1-2 | 492 | approved | mammoth 12-piece sweep,ring piece 4
PB:CULTIST_MACE | shaft.66H x.022H dark,grip.4,team wrap.16H+band,ball.12H ico+12 spikes.075H,butt.07H;staff+orb rod | 490 | approved | plain staff+orb
UV:CHRONO build/stance | 1.3,.9bulk,.9W,legs1.4,.76/.7;upright hook on chronoCrownBand,lean.04 | 489 | approved | .96bulk;seeded crouch
VB:ELEPHANT_EAR | jittered flap .74H x.6L x.1,out.68 z.1 flare.5 droop.12;fold roll on top tipped.6 | 489 | approved | 7-sided disc .95 flare.55
PB:BONE_DAGGER | under boneDaggerHold rot.z PI (point-down);.42stand curved 5-seg,sweep.11,4 teeth .06;unlit tan(.95,.68,.3) | 490 | approved | lit tan(.62,.55,.36) point-up (489);dark shuriken pair
PB:PAVISE | coffin .42H x.17W,dark team .42,bone rim,2 studded bands;torso mount -.36SW,top .92neck;mirrored paviseShieldRight +.36SW,sword isVisible false | 490 | approved | one board (489);tower slab on hand
evilDress:SENTINEL_CONE | black 8-sided cone 1.06W->.2W,1.75H,brim.36H,lean.12;3 rows x6 team spikes | 489 | approved | great_helm
evil stats cost/hm/dm/cm (7 units, 3666e25c) | d PASS 7/7 | 489 | stats | initial manifest
UV:RADIANT build/stance | 1.24,.92bulk,.92W,legs1.38,.76/.7;upright | 487 | approved | 1.16bulk;seeded crouch
goodDress:RADIANT_TROUSERS | team legs,gold half-diamond1.1P to .55T,flank tri .6L,knee band2.4w+fin,shin.78,white feet,ankle2.5w | 487 | approved | dark pants,grey boots
goodDress:RADIANT_CAPE | team*.75 slab1.1->1.4W,1.9H,tilt.1,gold hem.1H,clasps.14W | 487 | approved | none
goodMagic:AEGIS look | 6m sphere unlit,diffuse black;opacity fresnel power.25 face.02 rim.62;emissive rim(1,.82,.3) face(1,.97,.86);orbs team lerp .25 white,<=1 | 489 | approved | power3 alpha.01+.03->.5 amber wash (488);alpha.055 + gold circles
goodDress:CHRONO_CROP | white unlit shell from -.15H to top,1.06W;gold hem.07H,neck ring.5W,armholes;trunk head skin | 488 | approved | icy body torso
goodDress:CHRONO_BREECHES | thigh shell1.5r,knee puff1.55r to .2S,gold band1.45r .24-.34S,boot1.22r;belt8-sided1.15P grey,gold buckle.3P,white ring | 488 | approved | icy legs
goodDress:CHRONO_ARMBANDS | upper bands1.4r .18-.3/.5-.62,fore1.35r .1-.22;white winglets .5U long .2U tip,yaw.5 | 488 | approved | bare arms
PA:PALADIN stance | square,PALADIN_SPLAY.15,sink 1-cos | 488 | approved | upright stride.14
PA:ARBITER stance | upright hook on arbiterMitre,crouch0,lean.04 | 488 | approved | seeded crouch
UV:AEGIS build/stance | 1.12,.88bulk,.9W,legs1.4,.76/.7;upright | 487 | approved | bulk1.2;seeded crouch
goodDress:ARBITER_ROBE | team torso/yoke,upper balloon 5.2r x4.6r on upperArm.parent (not seen 490),fore1.7r,glove cuff3.4->4.4r | 490 | approved | sleeve1.75r+elbow puffs 5r (487)
goodDress:ARBITER_SKIRT | hem knee joint+.25PD;back1.15->2.1P tilt.28,front .1-.55/.62-1.2P tilt-.24,sides lean.32,gold.07;grey legs,skin feet | 490 | approved | len .85T thigh mesh (mid-shin,487)
goodDress:PALADIN_CUIRASS | grey slabs .58D,1.16W,.04D slot,brown straps,gold hex+chevrons;team sleeves .55 | 486 | approved | white body plate,shoulder pads
goodDress:PALADIN_LEG_ARMOUR | shorts seat1.08->1.3P,bloused3.2/4.1/3r to .48T;thigh plate .5-.8T 1.7w;cop 6-sided1.8w .9d gold V;shin1.75w | 487 | approved | 2.15/2.2/2.25w,flat cops,limbShell puff (486)
UV:PALADIN build/stance | 1.3,.92bulk,.92W,legs1.38,.76/.7;upright,no pads/belt | 486 | approved | 1.34,1.36bulk;seeded crouch
goodDress:CHRONO_RING | ring3.2W,tube.17W,8 spikes.3W,top.85W,3/9 spikes.5W+winglets.6W | 490 | approved | 2.5W tube.07W spikes.18 (486);small attack-only torso hoop
SS/goodMagic:CHRONO_TRANSFORM | settle.2,drop1.45H,tilt1.15,grow.25,spin1.6;10 cubes r1.4 orbit.9 | 486 | approved | none
goodDress:RADIANT_VEST | team vest,white V .5W x .55H,gold trim+hem;sleeves 1.7/1.9,left .45 | 486 | approved | dark vest,pads
goodDress:AEGIS_HOODIE | bare torso+yoke (arm skin) narrowed to .76SW x .8SD;unlit team*.4 shell from .1H,>=yoke W;lip1.05;hood.62W | 488 | approved | full-width bare trunk (487),skin box,lit cloth shell (486)
goodDress:AEGIS_SKIRT | 8-sided1.1P->1.85P,.62T,black waist,gold hem,trapezoid.5->.26P | 486 | approved | trousers,grey boots
goodDress:ELEPHANT_RIDER_DRESS | white hair,team cap,gold crystal,white top gold bands+2 team stripes .13TH at +-.17 gold-lined .035,torso/yoke out of glow,shorts1.6 | 492 | approved | glowing plain top (486); bald team soldier
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
goodDress:ARBITER_COLLAR | one solid Medici shell:throat.45W,rim R .8+.8exp((|a|-95)/40)W,H ramp 30-95deg,.07W thick,unlit(.85,.55,.12) | 490 | approved | 10 rising petals 1.2-1.3W (483);bare neck
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
