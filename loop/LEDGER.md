# Loop ledger (v2): every value the loop has tuned

Rows: `file:identifier | current value | last iter | verdict | earlier values (newest first)`. The identifier carries the unit
(`rosterManifest.ts:tribal.clubber damageMultiplier`, `unitVisuals.ts:tribal.clubber proportions.scale`, `propBuilder.ts:club CLUB_LEN`).
Verdicts: approved, rejected, pending, spent. A row is `spent` after two attempts without approval or when it was listed as
never-retry; it is not pickable as [P]. The critic rejects a [P] gap that reverses or re-nudges a row approved within the last 20
iterations ("ledger reversal"). An [S] gap that replaces the mechanism owning a row may set new values: the worker resets the row to
pending and keeps the old value under earlier values. Stats knobs set by a `loop(N.0): [P] <batch> stats` commit are rows too
(verdict `stats`, never reviewed by the critic, never a ledger reversal). One row per tuning knob a mechanism exposes, not per line;
a value column is at most 80 characters. The worker updates rows at commit time (pending) and after verdicts. Drop rows untouched
for 25 iterations.

## Structural attempts (last 5 iterations; `iter | gap | unit.criterion | verdict`)

395 | three Long-Boaters standing at their oars, each oar hung off a fist (ffa5a93) | viking.longship.b | approved
395 | team shields: dark half, thin brown rim, bronze boss, four a side (512a007) | viking.longship.a | approved
395 | big dark beard + moustache, plaited braid and ties (ad8f6cf) | viking.berserker.a | approved
395 | dark beard from under the mask (d4bac61, reverted 0922c08) | viking.brawler.a | rejected
395 | belt, fur-cuffed bracers, cream fur boot cuffs over brown boots (607fd74) | viking.headbutter.a | approved
395 | ice crust: 4 pale-blue shards on trunk/head/arms/thighs while frozen (9400138) | viking.ice_archer.c | approved
396 | boots over the feet + warm puffy fur rolls (cb83fbe) | viking.headbutter.a | approved
396 | cream fur belt + big navy Landfall buckle (180a267 + 97c6946) | viking.berserker.a | approved
396 | round team cap, pale fur brim, snow pom (d84c723) | viking.ice_archer.a | approved
396 | beard hung under the mask, jaw wider than the cheek guards (3c8562d + 0ae74ce) | viking.brawler.a | approved
396 | own chop: lands .42 m under the crown, trunk over the man (6b98556) | viking.jarl.c | approved
396 | hurl + AoE crush + oarsmen disembark (1946694) | viking.longship.c | approved
396 | [R] 1.92 build, flat girdle inlays, front pauldron scroll (a76c891, reverted 32577c2) | ancient.minotaur.a | rejected
397 | [R] thrower's thigh stretched to a knee point, shins hanging (2e73091 + 2c2cc8b, reverted 8f53efc) | farmer.wheelbarrow.a | rejected
397 | shinLength 1.5 lower leg + hip offset .34 (4fe6fd1) | farmer.halfling.a | approved
397 | one faceted oval paddle blade per oar (4d811b7) | viking.longship.b | approved
397 | iceArrow: pale shaft, ice spike + two barbs, frost flakes (0fc57f6 + 636060c) | viking.ice_archer.c | approved
397 | brawlerLegs: puffy trousers, fur calf rolls, brown boots (707a5b0 + df9e860) | viking.brawler.a | approved
397 | armpit tufts high on the chest front (6904e0d + e5927fe) | viking.berserker.a | approved
398 | shinLength 1.95 + planted wide stance, knee turned back at .34 (58a4a23) | farmer.halfling.a | approved
398 | armpit tufts hung off the shoulder joint, fanned across the flank (7c2acb6 + cf65ff1) | viking.berserker.a | approved
398 | mask to the cheek line, jaw-wide beard filling the open lower face (3c31474) | viking.brawler.a | approved
398 | ice crown of 4 uneven shards + 3 barbs + 10 tetra flakes (42cf51c) | viking.ice_archer.c | approved
398 | brown oar timber, narrower blade, stout crew sunk to the deck plank (b94068d) | viking.longship.b | approved
398 | [R] beard foot to the collarbone, 4-link bolt on the drape, gold rings, white skirt (4778c43) | ancient.zeus.a | approved
399 | the Brawler's leg kit on his own limb boxes (52ba964) | viking.berserker.a | approved
399 | orange-gold hue, boltTop .72, links 7.5 cm proud (feff7d2 + 860ea63, reverted aa36ed2/9849d90) | ancient.zeus.a | rejected
399 | frost ribbon of three flat tetra shards swept along the shaft (2684991, reverted 084f002) | viking.ice_archer.c | rejected
399 | fur band over the instep: pad 1.3/.34/.9, 5x3 lumps .44, 16 shards .4 (d901df3 + 661f909) | farmer.halfling.a | approved
399 | paddle head .34/.2 on a .neck .1, flat .25; crew feet .3, top 1.19 (4aec762 + 116f015) | viking.longship.b | approved
400 | shorts hem to just below the knee: thigh tube .99 + a hem tube on each shin (74d90a4) | farmer.halfling.a | approved
400 | emblem at the belt's gold, .boltStand .075, high on the shoulder, unlit code value (6169685 + 9f043da) | ancient.zeus.a | approved
400 | head-first ram: DIVE hip pitch + a 3 m/s leap + a prone sprawl (7c3bc11) | viking.headbutter.c | approved
400 | unlit cream fur + buckle .5 at 1.35 proud, in front of the braids (4c49b9b) | viking.headbutter.a | approved
400 | icicles hanging under the shaft, raked back, spread .6 along it (92f8e5b) | viking.ice_archer.c | approved
400 | her own helm: dark team dome, bronze brow band, crest, temple mounts (715aff5) | viking.valkyrie.a | approved
400 | deep hull: 4 strakes, deck .4, deep timber, bow stem, rolled scroll stern (c0da83d) | viking.longship.a | approved
400 | [R] bear-head hood rebuilt: rounded skull, proud eyes, centred snout, teeth, curtains (f80dd04) | viking.jarl.a | approved

## Spent (never retry as [P])

## Rows
ancient done units (SARISSA_CAPE/MANTLE, SNAKE_CAP/WRAP/UPRIGHT, BALLISTA_WOOD/PLATES/BOLT/FRAME/STOCK, LOADED_BOLTS) | compacted 397 | 397 | approved | values: git show 8f53efc:loop/LEDGER.md
tribal.* (7 units' rows: JAVELIN, CHIEF, CLUB, HIDE, DEER, SLAB/SKULL, mammoth body; units done) | compacted 383 | 381 | approved | values: git show 6496b2e:loop/LEDGER.md
renaissance.* (painter, fencer, jouster, musketeer, balloon_archer, halberd rows; units done) | compacted 378 | 377 | approved | values: git show edb1692:loop/LEDGER.md
farmer.* done (hay_baler, scarecrow, harvester, farmer, potion_seller rows) | compacted 383 | 381 | approved | values: git show 6496b2e:loop/LEDGER.md
farmer.halfling (SHAGGY, no longer his; HALFLING_COAT, _SLEEVED) | compacted 382 | 381 | approved | values: git show b359959:loop/LEDGER.md
farmer.wheelbarrow (CREW_SEAT, LOW_RIM, THROWER_LEGS seat -.08, WHEELBARROW, LOG_WHEEL, HAY_BED, BUNCHED_CREW) | compacted 382 | 381 | approved | values: git show b359959:loop/LEDGER.md
ancient.* stats (cost, healthMultiplier, damageMultiplier, cooldownMultiplier, 7 units) | d PASS 7/7 | 378 | stats | values: git show 5715b05
viking.* stats (cost, healthMultiplier, damageMultiplier, cooldownMultiplier, 7 units) | d PASS 7/7 | 391 | stats | values: git show e5a0cb5
ancient.* 379-386 rows (MINO_*, BULL_*, PIKE_LEVEL, CORINTH_*, SNAKE_*, SARISSA_KEEP/KIT, ZEUS_REARM/TOGA/SANDAL/CHAIN, BOLT_SPARK, BALLISTA_*, SB_SANDAL, HOPLITE_CREST, MINO_SHELL/SCROLL) | compacted 387 | 386 | approved | values: git show fad9e5c:loop/LEDGER.md
ancient.shield_bearer + hoplite done (SCUTUM*, LEGION_HELM, LORICA, ASPIS*, DORY_*, HOPLITE_LEGS) | compacted 385 | 384 | approved | values: git show 522cb46:loop/LEDGER.md
ancient.* 387-388 rows (ZEUS_BEARD/LOCKS/HAIR, SNAKE_LIVE, BIG_HEADBUTT, SARISSA_FOLD, BALLISTA_CREW/HELM, GROUND_SNAKE, SNAKE_QUIVER, MINO_SASH_FOOT rej) | compacted 389 | 388 | approved | values: git show f31835b:loop/LEDGER.md
viking.* 392-394 rows (BEARDED_AXE + _CARRY, JARL_AXE, LEAP_AIR, HEADBUTT, LONGSHIP_TIMBER/SHIELDS, HEADBUTTER_KIT/BRAID, BERSERKER_BELT, ICE_ARCHER_CAP, CHOP_JARL, LONGSHIP_HURL, FROST, BRAWLER_LEGS, PAIR_AXE_FACE, OFF_AXE, BRAWLER_HELM, JARL_PELT, VALKYRIE_WINGS_LAYERED, Brawler board) | compacted 398 | 397 | approved | values: git show 4778c43:loop/LEDGER.md
proceduralAnimation.ts:HALFLING_STANCE (tilt, stride, lean, spread, ankle, knee) | .02, .03, .03, .52, .34, .03 | 398 | approved | .02, .05, .03, .34, no ankle, .02 (397); hashed idle stance (sunk)
unitFactory.ts:HALFLING_SHORTS (seat, seatTall, leg, flare, long, hemLift, hemLong, hemWide, hemFlare, cuff, cuffOut) | 1.04, .3, 1.3, 1.12, .99, .03, .22, .98, 1.05, .06, 1.1 | 400 | approved | long .78 with the turned cuff on the thigh (383-399)
bodyBuilder.ts:shinLength (optional lower-leg stretch on top of legLength) | halfling 1.95 | 398 | approved | halfling 1.5 (397)
farmerDress.ts:HALFLING_TUFT (top, padX/padY/padZ, across, rows, clump, spread, from/to, spikes, spike, lean) | .42, 1.3/.34/.9, 5, 3, .44, .92, .05/.86, 16, .4, .8 | 399 | approved | 5,.62,-.5,.3,.22,.55,10,.42,.2,.55 (391, rooted at c.y on the toe top); 5,.6,-.5,.3,.22,.45 (390 rejected [P]); HALFLING_FEET clump 1.35 tufts 9
farmerDress.ts:HALFLING_VEST_CUT (light, shade, glow) | .3, 1, .1 | 391 | approved | 0,.97,.04 (390); .3,1,.1 + veeDeep .6 vee .3 [S] 390 rejected (one-sided V vanished); vest box, vestLight .45
proceduralAnimation.ts:JUMP_CHARGE (rise, swoopRise) | 8, 4.5 | 393 | pending | swoopRise retired with the valkyrie revert (392); teleport (391)
proceduralAnimation.ts:FLY (lift, bob, rate, beat, thigh, knee) | .34, .02, 2, .34, .5, 1.0 | 393 | pending | 392 weight eased up from 0 (rejected)
vehicleBuilder.ts:LONGSHIP_OARS (long, thick, blade, bladeWide, neck, stem, flat, lean, timber) | 1.75, .055, .34, .2, .1, .07, .25, -.13/.05/.16, .52/.34/.19 self-lit .16 | 399 | approved | 1.75, .055, .5, .3, -.07, .17 (398); bladeWide .42 near-black (397); spread/across retired to LONGSHIP_CREW (394)
vehicleBuilder.ts:LONGSHIP_CREW (at z, across x, feet, raise, spread, elbow, butt, top, horn, stock) | -.62/.02/.66, -.1/.06/-.02, .3, -.5, .34, -.55, .62, 1.19, 3.2, bulk 1.3 head 1.35 | 399 | approved | feet .44, top 1.05 (398); feet .64, top 1.13, horn 1.5, slim (395)
propBuilder.ts:ICE_BOW (long, thick, taper, shards, shard, crown, fringe, fringeLen) | 1, .062, .45, 4, .16, 2.6, 6, .15 | 393 | pending | 3, .085, 1.9, no fringe (392)
ancientDress.ts:MINO_GIRDLE (lo, hi, proudX, proudZ, flare) on the hip joint | -.3, .03, 1.1, 1.22, 1.12 | 389 | approved | 386 band round the trunk base (MINO_SCROLL tall .24 at .04)
vikingDress.ts:BERSERKER_ARMPITS (in, across, drop, arc, front, tufts, len, wide, lean, splay, glow) | .95, .16, .02, .12, .95, 6, .52, .26, .3, .5, .24 | 398 | approved | .82, -.16, .99 on the trunk's front face (397)
vikingDress.ts:VIKING_BEARD (burnTop, burn, jaw, jawY, jawZ, locks, lockLong, braidLong, band, tuft; per cut jaw/jawY/jawZ, stacheLow/stacheZ, burns) | .2, .22, 1.2/.6/.62, .66, .6, 5, .26, .3, .09, .16; brawler 1.5/.95/.8 at 1.0 z .55, stache .62/1.25, no burns | 398 | approved | brawler 1.38/.74/.82 at 1.06 z .78 (396); berserker cut .9 wide 1.12 tip .48 braid
vikingDress.ts:BRAWLER_HELM (domeWide, domeTall, domeRise, domeSlice, band, bandProud, eyeTop, maskTop, maskBottom, maskWide, maskDepth, cheek, cheekTop, cheekDeep, nasal, nasalLow, nasalProud, cheekBottom, glow) | 1.14, .7, .5, .6, .14, 1.08, .42, -.18, -.52, 1.03, 1.04, .16, .3, .92, .24, -.2, .11, -1.02, .1 | 398 | approved | maskBottom -1.02 (394)
projectileSystem.ts:ICE_ARROW (head, wide, spikes, spike, spikeOut, barbs, barb, frost, frostSize, frostLong, frostOpen, frostShrink; icles, icleFrom, icleSpan, icleLong, icleVary, icleWide, icleOut, icleRake, icleDrop) | .34, .2, 4, .66, .42, 3, .5, 10, .05, .52, 2.4, .6; 4, .3, .6, .17, .6, .062, .3, .28, .02 | 400 | approved | 399 trail 3/trailLong .3/trailWide .1/flat .42 as a ribbon (rejected, reverted 084f002); .34, .18, 4 balls on the shaft (397); no icicles (398)
ancientDress.ts:ZEUS_TOGA (boltTop, boltTr, boltX, boltOut, boltWide, boltStand; boltGold unlit emissive = colour; rings, ring, beltAt, ringProud; gold) | .98, .3, .66, .98, .15, .075; (.62,.26,.03); 3, .075, .06, 1.14, (.88,.58,.1) .85 | 400 | approved | 399 boltTop .72, (1,.55,.1) at .55 lit, links .075 proud (rejected, reverted aa36ed2/9849d90); 398 .9/.34/.62/.95/.11, (.95,.22,.03) self-lit .55; 389-391 unlit 1.25/.72/.2 bolt, rings .045 at 1.12 (391)
ancientDress.ts:ZEUS_BEARD (jaw, jawY, jawZ, bib, bibY, bibZ, rows, perRow, top, foot) | 1.22/.7/.72, .62, .5, .95/.78/.55, 1.42, .62, 6, 7, -.25, -1.95 | 398 | approved | foot -2.65, bib .95 at 1.75 (387)
unitFactory.ts:zeusSkirt (material) | unlit white, out of the glow | 398 | approved | ZEUS_TUNIC_COLOR cloth (385)
proceduralAnimation.ts:DIVE (tip, trunk, head, arms, elbow, knee, in, out) | 1.22, .16, .62, .45, .5, .18, 18, 26 | 400 | approved | new (400); the ram was the BULL_CHARGE lean until then
simulationSystem.ts:HEADBUTT (within, windup, recover, ahead, radius, damage, fling, lift, edge, lunge, dive) | .55, .28, .5, .5, 1.15, 18, 5, 4.5, .5, .5, 3.0 | 400 | approved | lunge .5 with no dive (394)
runtimeUnit.ts:headbuttSprawl (flat s, downed s, recovering s) | .36, .22, .5 | 400 | approved | the light profile's topple+down+recover ~2.6 s (before 400)
vikingDress.ts:HEADBUTTER_KIT (fur unlit colour, buckle w share, buckleProud) | (0.78,0.58,0.34) emissive = colour, .5, 1.35 | 400 | approved | lit cloth (0.9,0.7,0.42) glow .14, buckle .22 at 1.24 (396)
vikingDress.ts:VALKYRIE_HELM (domeWide, domeTall, domeRise, slice; band, bandProud, eyeTop; crestTall, crestWide, crestRise; mountWide, mountTall, mountOut, mountUp, mountBack, mountCant) | 1.16, .72, .46, .55; .13, 1.07, .42; .58, .15, 1.12; .1, .5, 1.04, .36, .12, .3 | 400 | approved | shared plume_helmet (before 400)
vehicleBuilder.ts:LONGSHIP_HULL (rows, rowStep, strake, keelY, deck, wall, stem; wood, dark, self-light) | 4, .13, .15, .2, .4, .705, .9; (.2,.11,.055), (.13,.07,.035), .35 | 400 | approved | 3 strakes .18 at .29/.44/.59, deck .6, rail .66, wood (.62,.42,.25) (392)
vikingDress.ts:JARL_PELT (skullW/H/D, skullY/Z; eye, eyeOut, eyeY, eyeProud; muzzle*, nose*, teeth*; ear*; curtain*, tufts; drape*) | 1.3/.95/1.3 at .58/-.1; .24, .48, .6, 1.2; .44/.32/.34 at .12 z 1.24 tipped .34; .26/.13 z 1.24; 3 at -.2 z 1.16; .3W x .8D at 1.12 W z -.16, 3; drapeDrop 1.0 | 400 | approved | 393/394 crate skull and side panels (394 rejected, reverted 1ec0c3a)
