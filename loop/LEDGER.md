# Loop ledger (v4): every value the loop has tuned

Rows: `file:identifier | value | last iter | verdict | earlier values`. P: no approved reversal within 20 iterations; two failed polish attempts spend a row. S/R replace mechanisms; stats exempt. Alias paths below.

## Structural attempts (last 5 iterations)

506 | 729b5eaf,42f202ed | evil.death_bringer.a | approved [R] (struck 1, 2)
506 | 03717227 | secret.ballooner.a | approved [S] (struck 2, 7)
506 | 55f5caee,607a9757 | secret.jester.b | approved [S] (struck 1)
506 | beecdbea | secret.jester.c | approved [S] (struck 1)
506 | b89901f6 | secret.ballooner.c | approved [S] (struck 1)
506 | 50013545 | secret.the_teacher.a | approved [S] (struck 2)
506 | 3b148781 | secret.chu_ko_nu.a | approved [S] (struck 2)
506 | 83f17efd,c2e1505e | secret.fan_bearer.b | approved [S]
506 | 2f45b912 | secret.jester.a | approved [S] (struck 2)

505 | 37724d45 | evil.death_bringer.a | approved [R] (struck 1)
505 | 81a7d921 | secret.executioner.a | approved (struck 2)
505 | f8f54345 | secret.ball_n_chain.a | approved (struck 1, 2, 5)
505 | 1ff4ba0b | secret.shouter.a | approved (struck 5)
505 | c4965761 | secret.bomb_on_a_stick.a | approved (struck 1)
505 | 140582e4,67439484 | secret.the_teacher.c | approved (struck 1)
505 | 18710e8b | secret.raptor.a | approved (struck 1, 2, 3)
505 | 53a75e63 | secret.raptor.b | approved (struck 1)
505 | be96b2b5,d7165ae8 | secret.raptor.c | approved

504 | 6a5b08c9 | secret.executioner.c | approved (struck 1, 2)
504 | f91998de | secret.ball_n_chain.c | approved (struck 1)
504 | e46ee0c3 | evil.death_bringer.a | approved (struck 1; CONFIRM failed a)
504 | 7aac0f42 | secret.bomb_on_a_stick.c | approved (struck 2)
504 | fa2c8ad9 | secret.fan_bearer.a | approved (struck 1)

503 | 90f0707f,6ace58da | evil.death_bringer.a | approved [R] (blocker 2; 1's crown clause cleared; CONFIRM passed a, gap critic failed it)
503 | 412d556a,1888c349 | evil.void_monarch.c | approved (blocker 1; c PASS; CONFIRM D)
503 | c9a3b096,71cb0028 | secret.ballooner.b | approved (blocker 1; b PASS)
503 | 59e6b1af | secret.fan_bearer.c | approved (blocker 1; c PASS)
503 | bf9a5a70,cb05da8e | secret.bomb_on_a_stick.c | approved (blocker 1)
503 | 1101ed14 | secret.jester.a | approved (blocker 1)
503 | 945b798f | secret.chu_ko_nu.a | approved (blocker 1; 5 struck by lineup)

502 | c1dc9a29 | evil.death_bringer.a | approved (blocker 3)
502 | 1dde2456 | evil.death_bringer.a | approved (blocker 2; critic a PASS, CONFIRM failed a again: plateau)
502 | bd0dacb6 | evil.void_monarch.a | approved (blocker 2; a PASS, CONFIRM passed a, b, c)
502 | 495878c2 | evil.void_monarch.c | approved (no strike; form-change clause cleared)
502 | 28cf5772 | secret.bomb_on_a_stick.b | approved (blocker 1; added 2)
502 | 804fac9d | secret.ball_n_chain.b | approved (blocker 1; b PASS)
502 | b1963ee9 | secret.chu_ko_nu.c | approved (blocker 1; c PASS)
502 | 37541423 | secret.shouter.c | approved (blocker 1; c PASS)
502 | 60b441dd | secret.the_teacher.a | approved (blocker 1)


## Spent (never retry as [P])

Aliases: LD=legacyDress.ts, VB=vehicleBuilder.ts, UV=unitVisuals.ts, PB=propBuilder.ts, FX=visualEffects.ts, RU=runtimeUnit.ts, SS=simulationSystem.ts, PA=proceduralAnimation.ts, PS=projectileSystem.ts.

## Rows
evilDress:DEATH_SKULL | single beveled face .94W at cheeks, .3W chin, depth .39D; dark sockets and nasal notch, hidden head box | 505 | approved [R] | 502 deep cranium and jaw prisms with a flat tooth row
secretDress:EXECUTIONER_VEST | eight-sided iron shell .96TH, 5 buttons, dark team sleeves | 505 | approved | plain team torso
secretDress:PRISONER_CAP | 8-sided .29H team cap and .105H cream band above bead eyes | 505 | approved | spiked hood and collar
secretDress:SHOUTER_VEST | two dark iron front panels, darkened team torso | 505 | approved | light-blue torso block
secretDress:BOMBER_HAIR | ginger crown, three locks per side and seven tapered braid segments | 505 | approved | bald
RU/SS:TEACHER_PARRY | frontal cone dot .45; hold .24 s, recover .55 s; intercept in melee contact, emit sparks | 505 | approved | no melee deflection
raptorBody:RAPTOR | articulated biped, long trunk, hinged skull, raised taper tail and opposing triangular teeth | 505 | approved | green four-legged mount on humanoid
RU/SS:RAPTOR_BITE | forward head and neck .3 s, closure .12 s, target impulse .22 of melee | 505 | approved (contact blocker stands) | generic unarmed hit
SS:Executioner jump | range .65 engage to engage+1.5 m, aim .45 engage short; rise 5, axe visual .46 s, jump cooldown 2 s | 504 | approved | planted before chop
SS:Foolish Jump | windup .24 s, backstep goal .5 m, approach band engage+3.4, rise 6.5, lands .4 engage short, cooldown 5 s | 504 | approved | spin_move
evilDress:DEATH_HAIR crown/back | 4 locks per side .032-.046 TW in both axes, staggered behind mask; 6 narrow rear strands | 504 | approved | 503 flat side locks and 9 back strands
SS:BOMB_SMACK self-destruct | bomb prop hidden after blast, lethal self-damage, horizontal impulse 6 and lift input 4 | 504 | approved | bomber survived
manifest/UV:fan_bearer hat | none | 504 | approved | conical_hat
evilDress:MONARCH_BEAK | prism plate topW1.1 jawW.8 to chin -.6H,.06D proud,from eye foot;beak .3W x .5H tilt.75;nostrils | 502 | approved | bare face
evilDress/RU/SS:MONARCH_DEMON | at demon_form standFirm (steadfast, topple cleared);void cloth (.05,.02,.06);pink eyes;2 rings TW3.2/3.8;7 shards orbit1.7TW | 502 | approved (tilt and lift stand) | lift only
PB:BOMB_STICK hpoint | grip wrap .1L at grip+.28L named hpoint (POLE_GRIP.hpoint [.15,.45]) | 502 | approved (off arm over the crown, b.2) | one-handed
PA:STONE_HUG | side.8 front-.1 drop.3 of the stone's radius;_armTo both fists | 502 | approved | none (front .35 out of reach)
PB/SS:rcbMuzzle | slot on the stock nose, HAND_LAUNCH chu_ko_nu muzzle | 502 | approved | face-height origin
SS/FX:SHOUT | reach9 half.55 speed10 lift4.5 large.6 giant.3, no damage;wave 4 rings .5-3.4 m,10 streaks,.6s | 502 | approved (no lean, thin ring) | melee hit from 7.8 m
secretDress:TEACHER_HAIR | brown(.16,.085,.06);cap1.12W e+.06H to .6H;3 puffs/side .42W at .6W;3 back lumps | 502 | approved (cap reads boxy) | bald
evilDress:DEATH_LEGS | [R] 503 shin mesh itself unlit pale(.62,.58,.5),6 seams unlit(.4,.37,.32) 1.1 out .035 tall slant.22;thigh stub past knee wrapped 1.03;feet team skin;shorts hem/seat/puff/cuff kept | 503 | approved (shins struck) | 501 grey(.45) wrap1.3 whole shin,5 bands 1.45 (CONFIRM: greaves);shorts to thigh box foot (.39 m);evilWrap rings
SS/RU:SECRET_503 | FAN_BLOW reach10 half.32 push10 + FX FAN_GUST 16 streaks 3 waves .85s,2 swirls;BOMB_SMACK radius3.5 scale.7 push1.6 chest1,engageRangeOverride2.6;RU steadfast blast slide .2 no lift;STEADFAST_UPRIGHT .3 | 503 | approved (fan streaks straight bars; monarch head leans 25 deg) | none (fan melee hit from 7.8 m; bomb thrown 6 m; monarch flung by blasts, swing rolled him flat)
secretDress:SECRET_503 | BALLOONER_GLUE unlit(.66,.5,.3) mitt3.4HW lump1.9;JESTER_CAP hood1.14W points root.34 tip.14 bell.22,brown spike.62H;KONU_KNOT black(.05) cap.62H,band.16H team stripe,bun.42H | 503 | approved (glue near-white, hand only; jester points thin; hair maroon-brown) | shuriken; maroon disc cap; conical hat
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
evilDress:DEATH_HAIR | [R] 503 cap/crown/side boxes gone: scalp ellipsoid 1.06x1.0x1.04 under the head top;6 locks/side .045TW across x .08-.12 deep at .52W;back fall rooted inside .8 head W;was cap1.3W,sides.66W lit(.025);cape off;skull+body out of glow;trunk,yoke,upper arms team skin;fall 11 strands .06-.12TW over .62TW 1.25TH,kink.035 at.55,2 shoulder/side,unlit(.016) fog off;[S] 502 4 crown locks/side .14-.2TW at .58W to .8TH,9 back strands from the crown .8TW to 1.0TH | 503 | approved [R] (side locks merge into a flat plate; reads maroon-brown) | 502 CONFIRM: head box read a slab/hood; 501 fall .95TH,5 back strands .8TH; 5 even wedges (bib read, 500); 7 front spread.66 over dark body cloth (495)
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
evilDress:deathBringerMask swept horn | 6 tapered sections from .32W out at temple to .74W out before .66W tip at 1.48H | 506 | approved [R] | reused evilHorn prongs
evilDress:deathBringerHair chest feathers | 6 raised-spine feathers per side rooted at neckline, ragged tips from ribs to belt | 506 | approved [R] (CONFIRM: shoulders and flanks still bare) | 501 chest wedges, retained crown and back locks
secretDress:balloonerGlueMitts forearm | three faceted lobes each, spanning .41-.84 of elbow-to-wrist and 1.85-2.35 lower-arm widths | 506 | approved | mitts and hand lumps only
PB:jester_dagger | .28 hand-scale tapered blade with .085 strap, elbow-parented just above wrist | 506 | approved | shuriken mesh in each hand
SS:JESTER_DODGE | .54 s melee sidestep with forward roll, 1.9 m, cooldown 2.5 s | 506 | approved | no melee dodge
SS:Balloon Backpack | once per fight, up to 3.3 m mass-scaled paired rise, release after 1.8 s, log float_pack | 506 | approved | generic pull and knock-up
secretDress:teacherHair beard | .5H faceted triangle, .69W top, paired moustache lobes | 506 | approved | bare chin
secretDress:chuKoNuRobe | two faceted overlapping knee tiers with orange hem bands | 506 | approved | short tunic
PA/PB:fanGrip | fist forward and in, leaf at 1.9 rad off vertical with face up, offhand span -.28 to -.15 | 506 | approved (far fist off shaft) | hpoint high carry
secretDress:jesterCap collar | six layered team lobes, 0.84 inset over gold | 506 | approved | bare neckline
