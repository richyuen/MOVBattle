# Loop ledger (v4): every value the loop has tuned

Rows: `file:identifier | value | last iter | verdict | earlier values`. P: no approved reversal within 20 iterations; two failed polish attempts spend a row. S/R replace mechanisms; stats exempt. Alias paths below.

## Structural attempts (last 5 iterations)

502 | c1dc9a29 | evil.death_bringer.a | approved (blocker 3)
502 | 1dde2456 | evil.death_bringer.a | approved (blocker 2; critic a PASS, CONFIRM failed a again: plateau)
502 | bd0dacb6 | evil.void_monarch.a | approved (blocker 2; a PASS, CONFIRM passed a, b, c)
502 | 495878c2 | evil.void_monarch.c | approved (no strike; form-change clause cleared)
502 | 28cf5772 | secret.bomb_on_a_stick.b | approved (blocker 1; added 2)
502 | 804fac9d | secret.ball_n_chain.b | approved (blocker 1; b PASS)
502 | b1963ee9 | secret.chu_ko_nu.c | approved (blocker 1; c PASS)
502 | 37541423 | secret.shouter.c | approved (blocker 1; c PASS)
502 | 60b441dd | secret.the_teacher.a | approved (blocker 1)

501 | 28c99aa4 | evil.death_bringer.a | approved (blocker 1)
501 | 12556880 | evil.death_bringer.a | approved (blocker 4)
501 | baccf212 | evil.void_monarch.a | approved (blocker 3; 1 struck by lineup)
501 | 82b8820a | evil.void_monarch.b | approved (blocker 1; b PASS)
501 | 2c5f720b | secret.ballooner.a | approved (blocker 1)
501 | 8b3c4a36 | secret.bomb_on_a_stick.b | approved (no strike; one-handed)
501 | 561dcf46 | secret.ball_n_chain.b | approved (blocker 2)
501 | 7d5f2bb5 | secret.the_teacher.b | approved (blocker 1; b PASS)
501 | 87af4842 | secret.chu_ko_nu.b | approved (blocker 1; b PASS)

500 | fd7a3c00,3b39c687 | evil.tempest_lich.a | approved [R] (blocker 1; a PASS; CONFIRM D)
500 | 5483a3d7 | evil.death_bringer.a | approved (blocker 5)
500 | 6e0424e3,8643adb8 | evil.death_bringer.a | approved (blocker 6; CONFIRM failed a)
500 | ce31248d,2b00b363 | evil.void_monarch.a | approved (blocker 2; CONFIRM failed a, b, c)
500 | e6fa1e1f | secret.executioner.b | approved (blocker 1; b PASS)
500 | 62fb739c | secret.shouter.a | approved (blocker 1)
500 | 69b5ae21 | secret.fan_bearer.b | approved (blocker 1)

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

## Spent (never retry as [P])

Aliases: LD=legacyDress.ts, VB=vehicleBuilder.ts, UV=unitVisuals.ts, PB=propBuilder.ts, FX=visualEffects.ts, RU=runtimeUnit.ts, SS=simulationSystem.ts, PA=proceduralAnimation.ts, PS=projectileSystem.ts.

## Rows
evilDress:DEATH_SKULL | [S] cranium prism (crown .6H, cheek .6W) + jaw prism to .2W at -.66H fwd .04D;brow slabs .4W tip .25;sockets .3x.16 + drop .14;nose .16W;mouth .44W,5 teeth | 502 | approved (tooth row a defect) | one hexagon prism (DEATH_MASK outline)
evilDress:MONARCH_BEAK | prism plate topW1.1 jawW.8 to chin -.6H,.06D proud,from eye foot;beak .3W x .5H tilt.75;nostrils | 502 | approved | bare face
evilDress/RU/SS:MONARCH_DEMON | at demon_form standFirm (steadfast, topple cleared);void cloth (.05,.02,.06);pink eyes;2 rings TW3.2/3.8;7 shards orbit1.7TW | 502 | approved (tilt and lift stand) | lift only
PB:BOMB_STICK hpoint | grip wrap .1L at grip+.28L named hpoint (POLE_GRIP.hpoint [.15,.45]) | 502 | approved (off arm over the crown, b.2) | one-handed
PA:STONE_HUG | side.8 front-.1 drop.3 of the stone's radius;_armTo both fists | 502 | approved | none (front .35 out of reach)
PB/SS:rcbMuzzle | slot on the stock nose, HAND_LAUNCH chu_ko_nu muzzle | 502 | approved | face-height origin
SS/FX:SHOUT | reach9 half.55 speed10 lift4.5 large.6 giant.3, no damage;wave 4 rings .5-3.4 m,10 streaks,.6s | 502 | approved (no lean, thin ring) | melee hit from 7.8 m
secretDress:TEACHER_HAIR | brown(.16,.085,.06);cap1.12W e+.06H to .6H;3 puffs/side .42W at .6W;3 back lumps | 502 | approved (cap reads boxy) | bald
evilDress:DEATH_LEGS | [S] hem knee joint+.04;seat1.55 to .3,puff1.95,cuff1.35 .07;grey(.45) wrap1.3 whole shin,5 bands | 501 | approved | shorts to thigh box foot (.39 m);evilWrap rings
evilDress:DEATH_BELT | black belt.12H;3 tusks/side at.38/.5/.58W drop.32 hook.24 root.13W tan | 500 | approved | drop.14 hook.1 root.07 (look 500, hidden)
evilDress:MONARCH_BONE | evil preset bone = MONARCH_CROWN.tan lit cloth .12 rough1,out of glow (custom grey) | 501 | approved | HORNED_EVIL bone(.6,.6,.46)
secretDress:BALLOONER_PACK | satchel.62x.5TH x.42TD brown,flap,straps.09TW;5 unlit balloons.42TW cream/team on strings to 1.4TH | 501 | approved | pink sphere special
PB:BOMB_STICK | halberd variant;haft1.05 grip.32;ico bomb.26L,2 orange bands,neck,fuse,unlit flame | 501 | approved (one-handed hold) | fist bomb
secretDress:BALL_STONE | torso ico 1.3TW .5TH down .62TW ahead,grey(.42);6 links.22TW to 1.05TH;flail hidden | 501 | approved (no hug) | flail
PB:SPADROON | rapier variant;blade.95s .022 flat.35;gold(.85,.6,.12) shell.12s,bow,ring.075s | 501 | approved | katana
PB:REPEATING_CROSSBOW | crossbow variant;stock.56s,magazine.17x.24s,2 studs/side,lever,arm.66s sweep.1 | 501 | approved | small bow arc
evilDress:MONARCH_CROWN | tan(.66,.5,.2) band1.22W,6 rays.95H,5 spikes;black pole2.6H,5 wraps,tip;pink ring1.35W | 500 | approved | MONARCH_SPIKES;tan(.72,.56,.3) pole2 (look)
PB:EXECUTIONER_AXE | buildJarlAxe long1.3 grip.12 wide.22,steel(.52) crescent(.3) bulge.18 | 500 | approved | short axe stick
secretDress:SHOUTER_HELM | iron(.2,.21,.23) bowl1.22W rim e+.02H top.66H;nose.2W,cheeks.24W at.46W;horns.28W path to1.04W | 500 | approved | bare head
PB:GIANT_FAN | halberd variant;haft1.0 stand grip.3;mount.32L;team half-oval1.4L x.8L | 500 | approved | hand fan
secret_1 stats cost/hm/dm/cm (10 units, b4d5ff95) | d PASS 10/10;fan dm .00064 | 500 | stats | initial manifest
evilDress:MONARCH_TUNIC | trunk/yoke lit(.08,.06,.07);3 bone chevrons at.62/.45/.28H reach.46W dip.12H bar.085W proud.09W;belt.14H +.05W,7 studs.09W | 497 | approved | lilac team block
evilDress:MONARCH_HARNESS | bone V straps .13W foot.06H to shoulders .44W;tube wings .16W via mid(.74,.22,-.05) tip(1.05,.38,-.12),4 spikes.17W;evil preset harness flag | 496 | approved | pauldrons (custom keeps)
evilDress:DEATH_MASK | tan(.8,.6,.35) prism brow1.04W@.56H cheek1.18W chin.42W@-.62H deep1.12D;sockets.3x.11 droop.35;nose.14W;horns team x.5;skull/jaw boxes off | 496 | approved (mask reads square, pale) | cream skull+jaw boxes
evilDress:DEATH_HAIR | cap1.3W,sides.66W lit(.025);cape off;skull+body out of glow;trunk,yoke,upper arms team skin;fall 11 strands .06-.12TW over .62TW 1.25TH,kink.035 at.55,2 shoulder/side,unlit(.016) fog off;[S] 502 4 crown locks/side .14-.2TW at .58W to .8TH,9 back strands from the crown .8TW to 1.0TH | 502 | approved (CONFIRM: head box reads a slab/hood) | 501 fall .95TH,5 back strands .8TH; 5 even wedges (bib read, 500); 7 front spread.66 over dark body cloth (495)
UV:DEATH build/stance | 1.26,.9bulk,.84W,arms1.2 .7/.68,legs1.12 .8/.76;duelist | 495 | rejected [P] default stand (65d585c3, reverted: ledger reversal, idle still side-on; wants an [S] idle pose) | 1.74,1.44bulk;giant pose
manifest/UV:void_monarch size | no size class;vis 1.2,1.12bulk;hm.27 | 494 | approved | giant;2.08,1.46;hm.14
SS/PS:SENTINEL_CATCH | warn.15,front cos.4,shafts lodged in the board met | 494 | approved | none
manifest:void_monarch abilities | none (SS DEMON_FORM by id) | 498 | approved | fear only (493);summon+fear,2 shadow walkers
manifest:death_bringer abilities | none (SS QUICK_DODGE by id) | 498 | approved | fear
SS/PA:DEMON_FORM | 800/97.5 own blows dealt,splash counted (MONARCH_BURST.radius);burst3.5;lift.3 over DEMON_RISE.6s | 498 | approved | none
SS:QUICK_DODGE | warn.3,dist1.4,seconds.12,back.06 then slide back,cd.8 | 498 | approved | none
evilDress:MONARCH_KNEES | box2.2r x2.3r x.4h foot.14h under thigh,fwd.25r;3x2 face+2 side studs.55r | 499 | approved [P] | wide2.7 tall.62 (498, one slab)
evilDress:MONARCH_ELBOWS | ico ball2.3r at elbow+.05h out.55r;14 golden-angle spikes1r x.45r,none inward | 499 | approved (half a head, TABS a head) | none
SS:DEATH_CHARGE | from1.5 reach14 speed2.4 secs1.6 overrun3 contact.7;cut 95 fling3.5 lift2 swing.3,DEATH_SLASH,hitLog+charge_cut;cd5 | 499 | approved | none
SS:MONARCH_DODGE | warn.3 blink2.2 m off line,shadow poof both ends,cd1.2,either form;evil.void_monarch only | 499 | approved | none
SS:MONARCH_BURST | reaper burst radius2 dome4,ring(1.15,.2,.8) dark(.32,.03,.22) | 493 | approved | none
SS:DEATH_SLASH | slash arc pink(1.2,.25,.7) r1 band.2 tilt+-1.25 .45s chest1 | 493 | approved | none
PA:TWIN_SLASH | wind out.75 back.35,reach.9 across.45 drop.2,cock.18 driven.4 held.8,twist.35,guard.5 | 493 | approved | greatsword chop
PA:DAGGER_STAB | cock ahead.3 up.32 in.1,reach.95 down.45,cock.14 driven.32 held.8,lean.22 | 493 | approved | duelist overhead chop
manifest:void_monarch archetype | boss_melee (boss.legendary splash 2),weaponHint sword;hm.14 dm.25 cm.43 | 492 | approved | special_magic staff;hm.23 dm.53 cm.56
PB:WARGLAIVE | chord.33H sweep.95,wide.05H,hot edge unlit(1.6,.22,.32),gold self-lit.4 | 491 | approved | greatsword
PB:MONARCH_SWORD | blade.62H wide.085H,7 teeth/edge .032H rake.6,unlit khaki(.5,.45,.2);ball.075H 10 spikes | 501 | approved | blade.5H wide.05H bone(.78,.7,.44) (491);orb staff
evil stats cost/hm/dm/cm (7 units, 3666e25c) | d PASS 7/7 | 489 | stats | initial manifest
Completed evil units (walker, sentinel, cultist, mechanic, lich) rows | specs in owning code; ledger@87af4842 | 501 | archived values | unchanged
Completed good, legacy_2 and earlier rows | specs in owning code; ledger@7b0ae2f6 (legacy_2@b9daeaea, legacy_1@7090fef5) | 494 | archived values | unchanged
