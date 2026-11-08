# Loop ledger (v4): every value the loop has tuned

Rows: `file:identifier | value | last iter | verdict | earlier values`. P: no approved reversal within 20 iterations; two failed polish attempts spend a row. S/R replace mechanisms; stats exempt. Alias paths below.

## Structural attempts (last 5 iterations)

495 | 5d269f55 | evil.exiled_sentinel.a | approved (blocker 3; a PASS, CONFIRM failed b)
495 | 7d131c39 | evil.mad_mechanic.a | approved (blocker 2)
495 | 978009c4 | evil.void_cultist.a | approved (blocker 1)
495 | a808e403 | evil.shadow_walker.b | approved (blocker 1; b PASS)
495 | 97ea0360,36f79506 | evil.shadow_walker.c | approved (blocker 1)
495 | f6c8fb65,c08bc4d0 | evil.tempest_lich.a | approved (blocker 2)
495 | 4f458ebd | evil.tempest_lich.c | approved (blocker 2; c PASS)
495 | 3218b350 | evil.death_bringer.a | approved (blocker 3)
495 | 9ebc78bd | evil.void_cultist.b | approved (blocker 1)

494 | 6b26e43f | evil.mad_mechanic.a | approved (blocker 1)
494 | 1c20c66c | evil.exiled_sentinel.a | approved (blocker 4)
494 | 2f7c8529,5c8089a5,85c56b08 | evil.void_cultist.a | approved (blocker 3; critic a PASS, CONFIRM failed a, b)
494 | 8b9c277c | evil.tempest_lich.a | approved (blocker 4)
494 | fbae7a4d,03307096 | evil.tempest_lich.b | approved (blocker 1)
494 | 416104b2 | evil.death_bringer.a | approved (blocker 1)
494 | cdc2f6f8,e2469b0d | evil.void_monarch.a | approved (blocker 1)
494 | 146499df | evil.void_cultist.c | approved (blocker 2; c PASS)
494 | fb3bd010 | evil.exiled_sentinel.c | approved (blocker 2; c PASS)

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

## Spent (never retry as [P])

Aliases: LD=legacyDress.ts, VB=vehicleBuilder.ts, UV=unitVisuals.ts, PB=propBuilder.ts, FX=visualEffects.ts, RU=runtimeUnit.ts, SS=simulationSystem.ts, PA=proceduralAnimation.ts, PS=projectileSystem.ts.

## Rows
evilDress:SENTINEL_UNIFORM | trunk,yoke,pelvis,neck,arms lit(.08,.06,.07) self-lit.4 rough1;bracer cuff1.3r x.55 forearm,5 team spikes.45;collar.62W | 495 | approved | team plate body,team arms
evilDress:MECHANIC_HAIR | ginger-brown cloth(.7,.3,.07) .12;sides +.3H..-.62H,.72D,.24W at .6W;back 1.08W .2D at .5D;3+4 tips | 495 | approved | none
evilDress:CULTIST_SLEEVE | arms robe-dark;forearm bell .top2.3r->3.1r,.6r past wrist,team band.22 | 495 | approved | bare team arms
FX/SS:SHADOW_POOF | 12 puffs 1.1x1.7m .2->.75,rise.5,.8s fade.4,ring1.6,(.16,.05,.22) glow.6;walker teleport only | 495 | approved | 1.4s (look 495);grey 20-particle puff
evilDress:LICH_TENDRILS | head,eyes,cap,tines hidden;socket.42H x.78W;7 tendrils to 2.45H,root.2H;neck black | 495 | approved | brown tines on a blue head
evilDress/PA:LICH_HOVER | reaperHover mark y.22 = own lift share | 495 | approved | REAPER .15 (493 rejected)
evilDress:DEATH_HAIR | cap1.3W,sides.66W lit(.025);7 front strands.2TW spread.66 1.0TH unlit(.02);5 back.8TH;cape off;skull+body out of glow | 495 | approved | none
PA:_shieldBoard cultistBuckler | buckler is a board (low guard hold),squared face-out always | 495 | approved | staff stand free arm raised
evilDress:MECHANIC_GOGGLES | strap.13H .05H over eye top,3 cups .3/.3/.2W tilt1.05,dark red lens;bun.46W in MECHANIC_HAIR (495; was (.95,.5,.15)),knot.22W | 494 | approved | brown cap+pale-blue lenses over the eyes
evilDress:SENTINEL_LEGGINGS | black legs,shin4/thigh2 rows x4 team diamonds over +-1.75 rad,long.95r wide.6r proud.42r | 494 | approved | smooth team legs
evilDress:CULTIST_ROBE | lit cloth (.08,.06,.07) self-lit.4 rough1;team stripe.13W off-.14W,trunk+skirt front | 494 | approved | unlit (.05,.035,.04) (plum);lit maroon VOID_ROBE
evilDress:LICH_TUNIC | team 8-sided 1.12P->1.42P,.78K;7 black strips 1.05K +-2.2 rad back;black legs;UV legs .68/.6 | 494 | approved | bell skirt 1.9+9 rags
evilDress:LICH_CRYSTAL | 4 frustums .3L,.1L root,kink.012L,flat.45,barbs.07L at .75 rad;orb hidden | 494 | approved | 4 double points (beads);white orb
UV:DEATH build/stance | 1.26,.9bulk,.84W,arms1.2 .7/.68,legs1.12 .8/.76;duelist | 495 | rejected [P] default stand (65d585c3, reverted: ledger reversal, idle still side-on; wants an [S] idle pose) | 1.74,1.44bulk;giant pose
manifest/UV:void_monarch size | no size class;vis 1.2,1.12bulk;hm.27 | 494 | approved | giant;2.08,1.46;hm.14
SS/FX:CULTIST_IMPLOSION | first1.2,every7,reach5,radius4.5,pull2.4xdist,lift1.4,minor6;shell life.9 | 494 | approved | summon exiled_sentinel
SS/PS:SENTINEL_CATCH | warn.15,front cos.4,shafts lodged in the board met | 494 | approved | none
evilDress:CULTIST_BEARD | 6-sided point-down cone 1.12W x1.55H,flat.42,root .08H under centre .2D proud,tip.2 fwd;sideburns.14W x.55H;moustache horns.5H droop.5 light(.42,.39,.35);dark(.17,.15,.14) unlit | 493 | approved | wedge+5 strands (unitFactory VOID_BEARD)
manifest:void_cultist archetype | heavy_melee,weaponHint mace;hm.76 dm.43 cm.56;vis heavy_swing family,default grip | 493 | approved | special_magic staff;dm.53 cm.56
manifest:void_monarch abilities | fear only (no summon) | 493 | approved | summon+fear,2 shadow walkers
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
UV/unitFactory:WALKER_HORN | path out to 2.2 heads at .24-.4H, up to 1.5H | 491 | approved | out 1.6, up 2.0 (U)
evilDress:SENTINEL_MANE | 11 ico lumps .36-.62W, lit cloth ginger(.85,.3,.06) self-lit .2 | 491 | approved | none
PB:MECHANIC_CLAW | cuff3.4f x2.5f,housing2.3f,3 cyan lights,jaws2.9f open.32;clawFrame rot.x PI | 492 | approved | built backwards (491);hammer+bomb
evilDress:CULTIST_BUCKLER | 1.3W world-sized board,rim+.62 ring,10 rim/5 face spikes,boss | 491 | approved | 1.5W hand-frame disc
PB:WARGLAIVE | chord.33H sweep.95,wide.05H,hot edge unlit(1.6,.22,.32),gold self-lit.4 | 491 | approved | greatsword
PB:MONARCH_SWORD | blade.5H wide.05H,ball.075H 10 spikes,unlit bone(.78,.7,.44) | 491 | approved | orb staff
FX:STORM_CLOUD | high3.2,11 puffs1.3,bolts5 every.3,life1.7;bolts held to cloud end (zeus hold) | 492 | approved | .3 s bolts (491);horizontal staff bolt
PB:CULTIST_MACE | shaft.66H x.022H dark,grip.4,team wrap.16H+band,ball.12H ico+12 spikes.075H,butt.07H;staff+orb rod | 490 | approved | plain staff+orb
PB:BONE_DAGGER | eighth-turn baked then flattened;long.46 wide.17 thick.035 curve.24 segs6,4 teeth.11 | 495 | approved | long.42 wide.075 curve.11 (rhombus, 489-490);point-down (490)
PB:PAVISE | coffin .42H x.17W,dark team .42,bone rim,2 studded bands;torso mount -.36SW,top .92neck;mirrored paviseShieldRight +.36SW,sword isVisible false | 490 | approved | one board (489);tower slab on hand
evilDress:SENTINEL_CONE | black 8-sided cone 1.06W->.2W,1.75H,brim.36H,lean.12;3 rows x6 team spikes | 489 | approved | great_helm
evil stats cost/hm/dm/cm (7 units, 3666e25c) | d PASS 7/7 | 489 | stats | initial manifest
Completed good, legacy_2 and earlier rows | specs in owning code; ledger@7b0ae2f6 (legacy_2@b9daeaea, legacy_1@7090fef5) | 494 | archived values | unchanged
