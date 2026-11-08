# Loop ledger (v4): every value the loop has tuned

Rows: `file:identifier | value | last iter | verdict | earlier values`. P: no approved reversal within 20 iterations; two failed polish attempts spend a row. S/R replace mechanisms; stats exempt. Alias paths below.

## Structural attempts (last 5 iterations)

499 | f7cd5edc | evil.shadow_walker.a | approved (blocker 7; a PASS; CONFIRM D)
499 | bb037ff9 | evil.mad_mechanic.a | approved (blocker 7)
499 | d837f5e3,54be779a | evil.mad_mechanic.a | approved (blocker 8)
499 | 1d2a9dc9 | evil.mad_mechanic.a | approved (blocker 9; a PASS; CONFIRM D)
499 | bb1030f6 | evil.tempest_lich.a | approved (blocker 5; CONFIRM failed a again: plateau)
499 | 3a3576d4 | evil.death_bringer.a | approved (blocker 4; 2 struck by lineup)
499 | fe3430c4 | evil.death_bringer.c | approved (blocker 3; c PASS)
499 | 66fc425a | evil.void_monarch.c | approved (blocker 2; c PASS)
499 | 413f738e | evil.void_monarch.a | approved (blocker 6)

498 | eb3df4ba,37602f6a | evil.shadow_walker.a | approved (blocker 4)
498 | cb8a83fa | evil.shadow_walker.a | approved (blocker 5)
498 | 1e5aa045 | evil.mad_mechanic.a | approved (blocker 6; critic a PASS, CONFIRM failed a)
498 | 63006385 | evil.tempest_lich.b | approved (blocker 4)
498 | 594b761d | evil.tempest_lich.b | approved (blocker 5; b PASS, CONFIRM passed b)
498 | b08f6e09 | evil.tempest_lich.a | approved (blocker 4; CONFIRM failed a)
498 | 647a7951 | evil.void_monarch.c | approved (Demon Transformation clause of 2)
498 | b42cc679 | evil.death_bringer.c | approved (blocker 2)
498 | 3ab07b72 | evil.void_monarch.a | approved (blocker 5; added 7)

497 | 88b2fcc7 | evil.void_cultist.b | approved (no strike; face-on, width short; CONFIRM passed all)
497 | 34f6e472 | evil.mad_mechanic.a | approved (blocker 5)
497 | 64959020 | evil.tempest_lich.b | approved (blocker 3)
497 | 7c77bf2f,29acc06f | evil.shadow_walker.a | approved (blocker 6)
497 | 67617691 | evil.void_monarch.a | approved (blocker 4)
497 | 75a3b139 | evil.mad_mechanic.a | approved (blocker 4)
497 | 4757c1df | evil.tempest_lich.b | approved (blocker 2)
497 | 7de67bfc,d838dbbe | evil.shadow_walker.c | approved (blocker 3; c PASS)

496 | cb86b6ef | evil.exiled_sentinel.b | approved (blocker 1)
496 | 1a6a70d4 | evil.exiled_sentinel.b | approved (blocker 2; b PASS; CONFIRM D)
496 | 94c8cd58 | evil.void_cultist.a | approved (blocker 2; a PASS; CONFIRM passed a, b)
496 | 55ee1043,a3943b02 | evil.void_cultist.b | approved (no strike; disc reads edge-on)
496 | 4f58d007 | evil.void_monarch.a | approved (blocker 3)
496 | 7c0bfd4f,4b82d4a0 | evil.shadow_walker.a | approved (blocker 3)
496 | e89b1570 | evil.mad_mechanic.a | approved (blocker 3)
496 | f724af18 | evil.tempest_lich.a | approved (blocker 3)
496 | da898f4f | evil.death_bringer.a | approved (horn clause of 2; 7 struck by lineup)

495 | 5d269f55 | evil.exiled_sentinel.a | approved (blocker 3; a PASS, CONFIRM failed b)
495 | 7d131c39 | evil.mad_mechanic.a | approved (blocker 2)
495 | 978009c4 | evil.void_cultist.a | approved (blocker 1)
495 | a808e403 | evil.shadow_walker.b | approved (blocker 1; b PASS)
495 | 97ea0360,36f79506 | evil.shadow_walker.c | approved (blocker 1)
495 | f6c8fb65,c08bc4d0 | evil.tempest_lich.a | approved (blocker 2)
495 | 4f458ebd | evil.tempest_lich.c | approved (blocker 2; c PASS)
495 | 3218b350 | evil.death_bringer.a | approved (blocker 3)
495 | 9ebc78bd | evil.void_cultist.b | approved (blocker 1)


## Spent (never retry as [P])

Aliases: LD=legacyDress.ts, VB=vehicleBuilder.ts, UV=unitVisuals.ts, PB=propBuilder.ts, FX=visualEffects.ts, RU=runtimeUnit.ts, SS=simulationSystem.ts, PA=proceduralAnimation.ts, PS=projectileSystem.ts.

## Rows
evilDress:MECHANIC_TANK | dark(.07,.06,.06) ico ball1.05W at out.55W up.42H back.62W;14 spikes.28W;mouth.42W;3 unlit smoke tubes(.75,1.05,1.15) 1.5W r.1W | 497 | approved | none
evilDress:MECHANIC_SLEEVE | shirt unlit(.36,.36,.37) upper+fore arms,trunk,yoke;cuff fold(.22,.22,.23) 1.5r .26h on forearm .3h under elbow | 499 | approved | lit (.2,.2,.21) upper arms,cuff 1.55r at elbow (497); look 499 (.5) near-white
evilDress:LICH_POLE | rod hidden;6-sided pole .022L (.05,.04,.05);bands .034L at .38/.55/.9 | 497 | approved | thick grey rod
evilDress:LICH_BOLT | team zig-zag (0,0)(.035,-.07)(-.03,-.1)(.025,-.19)L,strip.03L flat.45 | 497 | approved | round rod end
evilDress:WALKER_HAIR | lit(.08,.06,.07);root-.42H long.8H;sides.22W x.8D at.68W;back1.3W;9 strands.16W .38H | 497 | approved | none (look 497: .56W out .62H hid)
evilDress:MONARCH_TUNIC | trunk/yoke lit(.08,.06,.07);3 bone chevrons at.62/.45/.28H reach.46W dip.12H bar.085W proud.09W;belt.14H +.05W,7 studs.09W | 497 | approved | lilac team block
FX/SS:WALKER_MARK | per stack orb.2 m+3 sparks,r.36 h.5 speed2.4,8 s fade1.5,unlit(.08,.9,.12);stacks per target WeakMap | 497 | approved | none (.13 m (.35,1.6,.3) read yellow, 497)
evilDress:CULTIST_COAT | skirt to .3K over the rest knee (cultistCoatLength);boots .5 shin dark(.06,.045,.04) 2.25r,team cuff.13 2.5r | 496 | approved | VOID_SKIRT 1.75K (ankle bell)
evilDress:MONARCH_HARNESS | bone V straps .13W foot.06H to shoulders .44W;tube wings .16W via mid(.74,.22,-.05) tip(1.05,.38,-.12),4 spikes.17W;evil preset harness flag | 496 | approved | pauldrons (custom keeps)
evilDress:WALKER_VEST | trunk/yoke/upper arms team skin out of glow;near-black shell 1.1W x1.25D .62H..-.22H,12 hem teeth.2H,5 crown.16H,straps.22W at.3W | 496 | approved | navy body cloth jacket
evilDress:MECHANIC_OVERALLS | trunk grey(.2,.2,.21) self-lit.3;collar.62W+flaps;bib.66W .74H dark;straps.13W;unlit bone wrench+hammer X .42W at.5H | 496 | approved | dark body cloth vest
evilDress:LICH_COLLAR | ochre(.45,.31,.08) band.16H .98W at socket foot;8 down .3H,8 up .2H,vary.35 | 496 | approved | none
UV:tempest_lich scale | 1.05 | 496 | approved [P] | 1.42
evilDress:DEATH_MASK | tan(.8,.6,.35) prism brow1.04W@.56H cheek1.18W chin.42W@-.62H deep1.12D;sockets.3x.11 droop.35;nose.14W;horns team x.5;skull/jaw boxes off | 496 | approved (mask reads square, pale) | cream skull+jaw boxes
evilDress:SENTINEL_UNIFORM | trunk,yoke,pelvis,neck,arms lit(.08,.06,.07) self-lit.4 rough1;bracer cuff1.3r x.55 forearm,5 team spikes.45;collar.62W | 495 | approved | team plate body,team arms
evilDress:MECHANIC_HAIR | blond-brown cloth(.7,.49,.13) .12;sides +.3H..-.62H,.72D,.24W at .6W;back 1.08W .2D at .5D;3+4 tips | 499 | approved | ginger (.7,.3,.07)
evilDress:MECHANIC_HAIR_FALL | torso-hung 3 locks/side thick.32hW root.42hW over.4W lift.04H rest.55D proud.16D drop.28-.36H;mantle.82W to .45H under top,5 tips | 499 | approved | none
UV:mad_mechanic build | scale1.1 bulk.94 head1.12 torso.84 upperArm.78 foreArm.82 | 499 | approved [S] | scale1.18 bulk1.16 head1.04
evilDress:CULTIST_SLEEVE | arms robe-dark;forearm bell .top2.3r->3.1r,.6r past wrist,team band.22 | 495 | approved | bare team arms
FX/SS:SHADOW_POOF | 12 puffs 1.1x1.7m .2->.75,rise.5,.8s fade.4,ring1.6,(.16,.05,.22) glow.6;walker teleport only | 495 | approved | 1.4s (look 495);grey 20-particle puff
evilDress:LICH_TENDRILS | head,eyes,cap,tines hidden;socket.42H x.78W;7 tendrils to 2.45H,root.2H;neck black | 495 | approved | brown tines on a blue head
evilDress/PA:LICH_HOVER | reaperHover mark y.22 = own lift share | 495 | approved | REAPER .15 (493 rejected)
evilDress:DEATH_HAIR | cap1.3W,sides.66W lit(.025);5 front strands.2TW spread.3 1.0TH unlit(.02);5 back.8TH;cape off;skull+body out of glow;trunk,yoke,upper arms team skin (deathBringerBareTorso) | 499 | approved | 7 front spread.66 over dark body cloth (495)
PA:_shieldBoard cultistBuckler | buckler is a board (low guard hold),squared face-out always | 495 | approved | staff stand free arm raised
evilDress:MECHANIC_GOGGLES | strap.13H .05H over eye top,3 cups .3/.3/.2W tilt1.05,dark red lens;bun.46W in MECHANIC_HAIR (495; was (.95,.5,.15)),knot.22W | 494 | approved | brown cap+pale-blue lenses over the eyes
evilDress:SENTINEL_LEGGINGS | black legs,shin4/thigh2 rows x4 team diamonds over +-1.75 rad,long.95r wide.6r proud.42r | 494 | approved | smooth team legs
evilDress:CULTIST_ROBE | lit cloth (.08,.06,.07) self-lit.4 rough1;team stripe.13W off-.14W,trunk+skirt front | 494 | approved | unlit (.05,.035,.04) (plum);lit maroon VOID_ROBE
evilDress:LICH_TUNIC | team 8-sided 1.12P->1.5P,1.02K;10 hem teeth.26K;shin robe 8-sided 1.55r .5h,5 teeth.2h;7 black strips.92K;black legs | 499 | approved (CONFIRM: tendrils short) | .78K hip tunic,1.42P,strips1.05K (494)
evilDress:LICH_CRYSTAL | blade .8L,profile widths .045/.07/.085/.055/.06/.045/0 L,kink.008L,flat.45;orb hidden | 498 | approved [S] | 4 frustums .3L,.1L root,barbs (494, read a tenth of the man);white orb
UV:DEATH build/stance | 1.26,.9bulk,.84W,arms1.2 .7/.68,legs1.12 .8/.76;duelist | 495 | rejected [P] default stand (65d585c3, reverted: ledger reversal, idle still side-on; wants an [S] idle pose) | 1.74,1.44bulk;giant pose
manifest/UV:void_monarch size | no size class;vis 1.2,1.12bulk;hm.27 | 494 | approved | giant;2.08,1.46;hm.14
SS/FX:CULTIST_IMPLOSION | first1.2,every7,reach5,radius4.5,pull2.4xdist,lift1.4,minor6;shell life.9 | 494 | approved | summon exiled_sentinel
SS/PS:SENTINEL_CATCH | warn.15,front cos.4,shafts lodged in the board met | 494 | approved | none
evilDress:CULTIST_BEARD | 6-sided point-down cone 1.12W x1.55H,flat.42,root .08H under centre .2D proud,tip.2 fwd;sideburns.14W x.55H;moustache horns.5H droop.5 light(.42,.39,.35);dark(.17,.15,.14) unlit | 493 | approved | wedge+5 strands (unitFactory VOID_BEARD)
manifest:void_cultist archetype | heavy_melee,weaponHint mace;hm.76 dm.43 cm.56;vis heavy_swing family,default grip | 493 | approved | special_magic staff;dm.53 cm.56
manifest:void_monarch abilities | none (SS DEMON_FORM by id) | 498 | approved | fear only (493);summon+fear,2 shadow walkers
manifest:death_bringer abilities | none (SS QUICK_DODGE by id) | 498 | approved | fear
SS/PA:DEMON_FORM | 800/97.5 own blows dealt,splash counted (MONARCH_BURST.radius);burst3.5;lift.3 over DEMON_RISE.6s | 498 | approved | none
SS:QUICK_DODGE | warn.3,dist1.4,seconds.12,back.06 then slide back,cd.8 | 498 | approved | none
evilDress:WALKER_BOOTS | shell1.18r .8h dark(.08,.06,.07);3 tan fins2.4r base1.1r .15-.62h lean.75 flat.45;evilGuard/evilSpike on shins hidden | 498 | approved (fins short, close) | navy shin guards (1.35r/1.5r fin, look 498)
evilDress:WALKER_KNEES | ico pad1.65r deep.62 at shin top fwd.55r;tan spike1.1r | 498 | approved (merge with boot tops) | none
evilDress:MECHANIC_TROUSERS | legs dark(.08,.06,.07);3 skin tears/leg proud.06r;bone ring1.35r tube.22r,3 tools | 498 | approved (edge-on slivers) | brown legs
evilDress:LICH_COAT | trunk,yoke,arms team cloth.18;cuffs.35L 1.5->2.3w;seam.06W | 498 | approved | lavender body cloth
PA:POLE_GRIP lichGrip | [.12,.3] (evilDress marker on the staff) | 498 | approved | off arm raised
evilDress:MONARCH_KNEES | box2.2r x2.3r x.4h foot.14h under thigh,fwd.25r;3x2 face+2 side studs.55r | 499 | approved [P] | wide2.7 tall.62 (498, one slab)
evilDress:MONARCH_ELBOWS | ico ball2.3r at elbow+.05h out.55r;14 golden-angle spikes1r x.45r,none inward | 499 | approved (half a head, TABS a head) | none
SS:DEATH_CHARGE | from1.5 reach14 speed2.4 secs1.6 overrun3 contact.7;cut 95 fling3.5 lift2 swing.3,DEATH_SLASH,hitLog+charge_cut;cd5 | 499 | approved | none
SS:MONARCH_DODGE | warn.3 blink2.2 m off line,shadow poof both ends,cd1.2,either form;evil.void_monarch only | 499 | approved | none
SS:MECHANIC_FIRE | jet .8s,ahead.25,chest.9,near.08 far.3 farPer.1,core(.8,1,1) rim(.25,.7,1.15);engage 4.5 | 493 | approved | near.14 far.55 (look);bomb lob 6 m
SS:MONARCH_BURST | reaper burst radius2 dome4,ring(1.15,.2,.8) dark(.32,.03,.22) | 493 | approved | none
SS:DEATH_SLASH | slash arc pink(1.2,.25,.7) r1 band.2 tilt+-1.25 .45s chest1 | 493 | approved | none
PA:TWIN_SLASH | wind out.75 back.35,reach.9 across.45 drop.2,cock.18 driven.4 held.8,twist.35,guard.5 | 493 | approved | greatsword chop
PA:DAGGER_STAB | cock ahead.3 up.32 in.1,reach.95 down.45,cock.14 driven.32 held.8,lean.22 | 493 | approved | duelist overhead chop
PB:SENTINEL_AXE | bearded cut .95 x1.25 scale,haft.6,steel(.5,.5,.54),blood smear(.75,.02,.02);RU hold 2.5s | 493 | approved | .7 haft.75 (look);sword hidden
evilDress:SENTINEL_SPIKES | 4/side black 4-sided,.26-.56W out,.12D back,.62TH tall (ends .72),.12W,splay.22 | 492 | approved | pauldrons only
evilDress:CULTIST_HALO | dark 12-sided ring 2.1H tube.11H,10 inward triangles len.5R base.38H thin.06H | 492 | approved | wooden wheel 2.1H,10 spokes,hub
evilDress:WALKER_HELM | 8-sided shell 1.24W x1.26D,-.56H..+.36H,dome.3H,4 tan(.6,.42,.18) bars.13W x.52H gap.24W;eyes off | 492 | approved | box cap+dome,5 teeth
manifest:void_monarch archetype | boss_melee (boss.legendary splash 2),weaponHint sword;hm.14 dm.25 cm.43 | 492 | approved | special_magic staff;hm.23 dm.53 cm.56
evilDress:WALKER_HORN | horns re-materialled helm-bar tan(.6,.42,.18) self-lit.3, out of glow; path out to 2.2 heads at .24-.4H, up to 1.5H | 499 | approved | pale cream (.9,.8,.55) in glow;path out 1.6, up 2.0 (U)
evilDress:SENTINEL_MANE | 11 ico lumps .36-.62W, lit cloth ginger(.85,.3,.06) self-lit .2 | 491 | approved | none
PB:MECHANIC_CLAW | cuff3.4f x2.5f,housing2.3f,3 cyan lights,jaws2.9f open.32;clawFrame rot.x PI | 492 | approved | built backwards (491);hammer+bomb
evilDress/PA:CULTIST_BUCKLER | 2.6W world-sized board,rim+.62 ring,10 rim/5 face spikes,boss;PA _seatBuckler CULTIST_SEAT side.1W drop.12H ahead.3W turn.4 tilt-.14 (497) | 498 | approved [P] (b PASS, D) | 1.85W (496-497, trunk-wide);squared brace yaw (496);1.3W hand-seated (491)
PB:WARGLAIVE | chord.33H sweep.95,wide.05H,hot edge unlit(1.6,.22,.32),gold self-lit.4 | 491 | approved | greatsword
PB:MONARCH_SWORD | blade.5H wide.05H,ball.075H 10 spikes,unlit bone(.78,.7,.44) | 491 | approved | orb staff
FX:STORM_CLOUD | high3.2,11 puffs1.3,bolts5 every.3,life1.7;bolts held to cloud end (zeus hold) | 492 | approved | .3 s bolts (491);horizontal staff bolt
PB:CULTIST_MACE | shaft.66H x.022H dark,grip.4,team wrap.16H+band,ball.12H ico+12 spikes.075H,butt.07H;staff+orb rod | 490 | approved | plain staff+orb
PB:BONE_DAGGER | eighth-turn baked then flattened;long.46 wide.17 thick.035 curve.24 segs6,4 teeth.11 | 495 | approved | long.42 wide.075 curve.11 (rhombus, 489-490);point-down (490)
PB:PAVISE | coffin .58H x.18W,shoulder.86 top.8 foot.74,bands.8/.13;dark team .42,bone rim;root mount PAVISE_STAND gap.12 lift.07 ahead.21 splay.06,top on the shoulder joint;mirrored paviseShieldRight,sword isVisible false | 496 | approved | .42H x.17W torso mount -.36SW top .92neck (490);one board (489)
evilDress:SENTINEL_CONE | black 8-sided cone 1.06W->.2W,1.75H,brim.36H,lean.12;3 rows x6 team spikes | 489 | approved | great_helm
evil stats cost/hm/dm/cm (7 units, 3666e25c) | d PASS 7/7 | 489 | stats | initial manifest
Completed good, legacy_2 and earlier rows | specs in owning code; ledger@7b0ae2f6 (legacy_2@b9daeaea, legacy_1@7090fef5) | 494 | archived values | unchanged
