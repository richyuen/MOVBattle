# Loop ledger (v4): every value the loop has tuned

Rows: `file:identifier | value | last iter | verdict | earlier values`. P: no approved reversal within 20 iterations; two failed polish attempts spend a row. S/R replace mechanisms; stats exempt. Alias paths below.

## Structural attempts (last 5 iterations)

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

483 | [R] ecabf523 | legacy.super_boxer.a | approved (struck 2; CONFIRM D)
483 | fc2bd780 | good.devout_gauntlet.c | approved (struck 1; c PASS)
483 | 6671dac9 | good.devout_gauntlet.a | approved (struck 2)
483 | 1ac698d2,e03d2881 | good.devout_gauntlet.a | approved (struck 1)
483 | aa07d7e5 | good.radiant_glaive.b | approved (struck 1; added b.3)
483 | 8dd2ba33 | good.righteous_paladin.b | approved (struck 1; b PASS)
483 | 11f730f5 | good.celestial_aegis.a | approved (struck 1)
483 | e73fec72 | good.divine_arbiter.a | approved (struck 1)


481 | [R] 6b438aa3,d4e92c92 | legacy.pharaoh.a | approved (struck 1; CONFIRM D)
481 | 6c55aaf4 | legacy.super_boxer.a | approved (struck 1; CONFIRM failed a)
481 | 3d14f448,45bdb226 | legacy.wizard.b | approved
481 | fcea338b | legacy.wizard.c | approved
481 | 82bb4a43 | legacy.dark_peasant.c | approved (no strike)
481 | 0224cf8c,a894d4ee | legacy.super_peasant.a | approved (struck 4)
481 | 5bc36110,ea254d1a | legacy.super_peasant.c | approved
481 | 30f43e5f | legacy.super_peasant.c | approved
481 | 2e8189ba,105e9532 | good.devout_gauntlet.b | approved
482 | [R] 8be7b98c | legacy.wizard.a | approved (struck 1)
482 | 2979a450,76a27267 | legacy.super_peasant.a | approved (struck 2)
482 | 4f58b14a | good.celestial_aegis.b | approved (struck 1)
482 | 611a0094 | good.righteous_paladin.b | approved (struck 1)
482 | 4635a717 | legacy.dark_peasant.c | approved (struck 1)
482 | b15c4843 | good.divine_arbiter.b | approved (struck 1)
482 | 8a86950f | good.radiant_glaive.b | approved (struck 1)
482 | f6e3fada | good.sacred_elephant.b | approved (struck 1)
482 | 81f139f6 | good.chronomancer.b | approved (struck 1)
## Spent (never retry as [P])

Aliases: LD=legacyDress.ts, VB=vehicleBuilder.ts, UV=unitVisuals.ts, PB=propBuilder.ts, FX=visualEffects.ts, RU=runtimeUnit.ts, SS=simulationSystem.ts, PA=proceduralAnimation.ts, PS=projectileSystem.ts.

## Rows
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
goodDress:ARBITER_MITRE | team8-sided rounded crown1.05H,gold .88H panel,diamond | 484 | approved | laurel/hair/halo
SS/PS/FX:ARBITER_LIGHTS | 5 book-origin lights,.1delay,18speed,radius2 ray friendly fire | 484 | approved | instant lightning/dome
goodDress:AEGIS_BUTTERFLY | white crown/temples/4-knot braid;four team lobes,upper1.32H/lower.4H | 483 | approved | steel cap
goodDress:ARBITER_COLLAR | 10 closed rising gold petals,rim1.2-1.3W,opening.35W,unlit(.85,.55,.12) | 483 | approved | bare neck outline
LD:SUPER_BOXER_REBUILD | eight-sided torso waist .64W;8 broad bent locks,1.6-2.45 half-head tall | 483 | approved | box torso,12 needle cones
PA:DEVOUT_PUNCH | alternating level jabs,charging lean .28;boxer overlay | 483 | approved | overhead duelist swing
UV:DEVOUT build/stance | 1.08scale,.8bulk,.9torsoW,1.4legs,.88/.8;upright,no vest/pads | 483 | approved | 1.02,1.12,1.08arms;duelist
goodDress:DEVOUT_TROUSERS | six-sided articulated flares1.08/1.55/2.2,beige unlit(.8,.72,.56),team hem5.5% | 483 | approved | dark tight legs,grey boots
PB:RADIANT_SHIELD | .46stand faceted team disc,gold rim,four luminous cusps,torso bracket | 483 | approved | no shield
PB:PALADIN_SHIELD | .5stand pale16-sided board,gold rim,broken chevrons,hex seal | 483 | approved | kite cross shield
LD:WIZARD_SLEEVES | upper1.7,fore1.65,cuff2.4,shoulder-to-wrist articulated shells | 482 | approved | recolored bare arms
LD:SUPER_TUNIC_SHELL | continuous lathe .64W hem to .54W chest;D/W*1.14;hem .56knee;sack overlay hidden | 482 | approved | pelvis-only frustum 480
UV:AEGIS equipment | none/none,caster | 482 | approved | sword/tower
PB:PALADIN_HAMMER | .48stand haft,paired .18L x .4L cheeks,.245L glowing faces | 482 | approved | greatsword
FX:DARK_GRIP | 4 inward palms,4 hooked two-segment fingers,mesh chest/head anchors,.12s closure | 482 | approved | cloned splayed ring
PB:ARBITER_BOOK + PA:book hold | two .18stand covers,.265 page block;V .32rad;two-hand corner IK | 482 | approved | lightning bolt
PB:RADIANT_GLAIVE | .44stand,opposed 3-facet swept wings,gold/light edge,one-hand grip | 482 | approved | halberd
VB:ELEPHANT_SPEARS | paired1.2shaft,.2tips,gold,diagonal .55/.85/.1 | 482 | approved | rider bow
PB:TIME_GAUNTLET | paired4.5f cuff,2.3->3.4f flare,4f ridge,bare fist | 482 | approved | staff
Completed legacy_1 and earlier rows | specs in owning code; ledger@7090fef5 | 482 | archived values | unchanged
good stats cost/hm/dm/cm (7 units, values at a54ace09) | d PASS 7/7; hm .74,.15,.38,.74,.05,.16,.4; dm glaive .59,paladin .43,chrono .39; cm .48,.56,1.53,.27 | 481 | stats | initial manifest
SS:SUPER_PUNCH victims | pre-lethal snapshot; speed18/lift14 replaces death velocity | 481 | approved | shallow death cap
PA:SUPERMAN arm solve | final IK .98(upper+fore), torso +Y/.08Z, 2 settles | 481 | approved | additive shoulder/elbow pose
PB:DEVOUT_GAUNTLET | 4 finger bands, thumb,cuff;10-facet crescent .18stand radius;paired | 481 | approved | single mace
LD:WIZARD_BEARD grey/glow | (.35,.35,.36),.08 | 481 | approved | (.78,.78,.8),.3
SS:Wizard staff shapes | wizard_spell enters fromStaff delayed cast and crystal origin | 481 | approved | fireball/leaves only
FX:darkGrab + SS:seizure | 6 hands,close .55->.3,.45s blast,1000dmg,range5;no summons | 481 | approved | area_pull/summon (Custom kept)
LD:superPeasantTrousers | thigh1.18,shin1.2 to.28;3 cuffs1.38/1.46;bare shins/feet | 481 | approved | bare team legs
LD:pharaohSandals | skin feet; thin sole/toe/ankle bars, front .42shin | 481 | approved | dark boots
LD:superBoxerBoots | team shin .18-1.05,out1.3;4 pale front wraps;team toes | 481 | approved | dark shins/toes
PB:WIZARD_SWORD + PA:upright offhand carry | .62stand,.027wide,1.65fist; swept quillons, grip at fist | 481 | approved | shared longsword, wrist slant
LD:thorBelt owner/straps | pelvis .4H band, .48W plate, z .6D+.025 | 480 | approved | torso band .25H,z .56D (479)
VB:tankSeatedInfantry | own .82 rig, head1.08, legs1.08, pelvis on seat | 480 | approved | addOperator .46 (471)
UV:wizard build; legacyDress open tails; stance | .82bulk,.92W,legs1.3,.88/.8;2 tails,1.16knee;upright | 480 | approved | bulk1.08,closed bell,seeded crouch
PB:WIZARD_STAFF long/grip/carry | 1.3,.3,uprightPole grounded hold | 480 | approved | .98,.42,seeded slant (475)
FX:spawnWizardDetonation | 28 radial .6 tails, reach .4->2.2 in .3s,1.1s life | 480 | approved | shared compact firework (479)
FX:glove ribbons + simulation dash | .8s,.18wide,white-yellow,14 world samples | 480 | approved | none
LD:dark lower dress | ragged thigh shells1.35,rolled calf1.65,cream shoes | 480 | approved | lavender legs
LD:super tunic outer shell | pelvis1.06->1.2W,1.18D,1.35H;unlit .85,noglow | 480 | approved | inset cloth .62knee;torso shell hidden
RU:super punch | reverted | 480 | dropped | 80/25: victim lost
LD:THOR_COAT front | outer hull V .8->.16W;shade .35 | 479 | approved | inset strips,shade .85;belt history@288e2eb7
VB:CHARIOT_SCUTUM mount (x,y,z,turn) | -1.35W,+.62H,+1.4D,.62; forearm bracket | 479 | approved | -.85W,+.18H,.9D,-.12 (477)
PB:GLOW_GLOVE knuckles,cuff,fit | pad 1.38x1x.8, cuff .4x.9; core max(2.4 hands,1 head) | 479 | approved | core ball + thumb,2.4 hands (477)
LD:DARK_JERKIN (panel,tail,laces,leather) | .32W,.93H; .42H;4;(.17,.13,.1) | 479 | approved | none
FX:DARK_VOLLEY (count,delay,speed,streak) | 15,.03,30,1.6; sphere slots restored at impact | 479 | approved | none
LD:SUPER_ROPE (knots,span,fat,ellipse,color) | 16,.27W,.16H,(.56W,.65D),(.7,.665,.56) emissive | 479 | approved | none
FX:SUPER_WRIST_RIBBONS (samples,width,emission) | 14,.09,(1.6,1.2,.15); world-space flight history | 479 | approved | none
RU:FIREWORK_LIFT + projectileSystem chest burst | analytic rise min(1.8,age*up), no gravity until burst; lethal | 479 | approved | ballistic up6.5,delay.75; root+.9,spell damage (475)
SS:SUPERBOXER_PUNCH (back,backTime,forwardTime,cooldown) | 2,.22,.24,4; splash1.75,profile damage | 479 | approved | ordinary melee punch
LD:PHARAOH_GARB shell (proud, chest, chestAt, waist, flare) | .025,.22,.12,.23,1.08; sliced yoke/chest/pelvis | 478 | approved | box: out 1.08,chest .16,chestAt .12,waist .2,line .05 (470)
VB:CHARIOT_SCUTUM oval/face, ornamentZ | 1.35W/1.35tall,1.22W/1.25tall;1.8t | 477 | approved | rectangular panels, hidden rim
UV:legacy.super_boxer build + animator stance | .84,.92,1.08,1.3,.88/.8; tilt .02,stride .16,crouch 0,lean .04 | 477 | approved | 1.38 bulk,1.18 arms; crouched
PB:GLOW_GLOVE seat, glow | actual hand mesh centre;glow 2.5 | 477 | approved | sword grip offset; .17s * oversize; glow .5
UV:legacy.pharaoh build + animator stance | .82,.92,1.3,.88/.8; tilt .02,stride .12,crouch 0,lean .04 | 477 | approved | bulk 1.08; caster crouch
LD:pharaohFalseBeard (height, diameters, y, z; half-head units) | 1.05,.55/.42,-1.05,1.17 | 477 | approved | none
UV:iconic_thor build + animator stance | .84,.92,1.06,1.3,.88/.8; tilt .02,stride .12,crouch 0,lean .04 | 477 | approved | bulk 1.18,arms 1.12; crouched
LD:thorBeard (height, top, depth, y, z); cheeks | 2,1.8,.42,-1.25,1.12; cheeks y -.8, height 1.12 | 477 | approved | y -1.03, cheeks -.45 (look); bare chin
LD:WINGED_BAND vanes + covert | H*(1.65-.23k),W*.28,.22+.22k; W*.57,H*(.22+.04k); .16,.5,.35 | 477 | approved | cones .95H * .78^k at ear
VB:CHARIOT_HELM crest mechanism | 11 spokes; step .23; R*(.29,.85,.78); inner band .22,.15,.48 | 477 | approved | half-cylinder arc, rotation.x -PI/2
VB:CHARIOT_FRONT (rise, panels, depth, trim, leafCount, leafSize, relief) | .22, 7, .055, .07, 7 pairs/side, (.045,.14,.025), .04 | 476 | approved | plain half-cylinder, thin rim (before 476)



PA:BLOWGUN_HOLD (spec in code; ledger@46cf26f6) + blowdarter posePreset default | 1.05, .3, .18, .1, .07, .42 | 463 | approved | archer pose (before 463)
PA:BOXER_JAB (spec in code; ledger@46cf26f6) | .45, .12, .2, .95, -.05, .15, .12, .3, .78, .12 | 463 | approved | overhead strike (before 463)
PA:BEARER_HOLD (ahead, out, high, low) | .42, .22, .72, .3 | 464 | approved | ledger@768b54e7

LD:THOR_LEGS (spec in code; prior ledger@46cf26f6) | .34, .14, 1.85, 7, .5, 1.35, .1, .9 | 475 | approved | navy legs (before 475)
VB:TANK_TURRET (wide, top, tall, foot, long, ahead, bustle, inset) | 1.56, .8, .34, -.02, 1.18, .06, .72, .86 | 475 | approved | stepped box turret (before 475)
VB:TANK_ROOF (spec in code; prior ledger@46cf26f6) | .33, [-.3,-.28], .34, .2, [.34,.14], .3, [-.12,.3], [+-.26,-.55], 1.35 | 475 | approved | two flat discs (before 475)
VB:CHARIOT_SCYTHE (collar, out, long, root, tip, flat, curl) | .1, .08, 1.25, .11, .012, .28, .06 | 475 | approved | bare hubs (before 475)
VB:CHARIOT_LORICA (hoops, line, out, hoopFrom, hoopTo, strap, strapAt, plates, plate, plateOut) | 4, .045, 1.06, .42, .88, .07, .22, 3, .16, 1.45 | 475 | approved | bare team torso (before 475)
PB:FLAIL_HOLD (hand axes, aim) | probed idle lHand, aim (-.7,.62,.35) | 475 | approved | rod along the fist (before 475)
RU:KNEEL_POSE (hip, knee, drop, bow, arms) + simulationSystem PHARAOH_KNEEL (radius, seconds) | .1, 1.55, .9, .35, .25; 2.4, 3 | 475 | approved | none (before 475)
PS:WIZARD_FIREWORK (up, spin, tip, delay, over) | 6.5, 16, .5, .75, .9 | 475 | approved | blast fling (before 475)
