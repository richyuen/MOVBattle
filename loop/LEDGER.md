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

## Structural attempts (last 10 iterations; `iter | gap | unit.criterion | verdict`)

367 | skull face plate: rims, bridge, muzzle (8762812) | tribal.protector.a | approved
367 | loin strips: 5 torn brown strips, tan skull (d0909d5) | tribal.clubber.a | approved
367 | skirt: ring of torn tongues (de2744b +df9a744) | tribal.stoner.a | approved
367 | ears: shaggy flap behind the eye (0d9c3d0 +b40c498) | tribal.mammoth.a | approved
367 | fur hem over leg roots (c69689e +d55dff7) | tribal.mammoth.a | rejected
367 | full beard to the chest (6c66d85) | tribal.chieftain.a | approved
368 | skull jaw, cheeks to it; slab lip 6-sided lit stone (b544fb9) | tribal.protector.a | approved
368 | rear box: pelvis block inside the skirt, in hide (8e46f46) | tribal.stoner.a | approved
368 | sallet: 8-sided bucket, slit + bead eyes, bevor (c52c267) | renaissance.halberd.a | approved
368 | horse: arched 2-segment neck, low head, front eyes, chestnut (f271f4d) | renaissance.jouster.a | approved
368 | jabot: 3 stacked ragged tiers (53e6e78, reverted) | renaissance.painter.a | rejected
368 | morion: tall 6-facet bowl, half-disc comb, brim points (965f103) | renaissance.musketeer.a | approved
369 | step back: hop off his man after the thrust (fbd58e7, rejected-kept; follow-up a285bea reverted) | renaissance.fencer.c | rejected
369 | dash back: hop back from a man inside the pole (e399131) | renaissance.halberd.c | approved
369 | canter charge through the man, lance on contact, trample; leg pivots + 3-beat canter (5ac2a1e) | renaissance.jouster.c | approved
369 | matchlock re-cut: fat pale octagon barrel, dark bands, deep stock, heel butt (828b96d) | renaissance.musketeer.b | approved
369 | balloon arrow in the draw fist, hidden at the loose (1dafd49 +2c4f0d0) | renaissance.balloon_archer.b | approved
369 | jabot under the jaw: 3 tiers below the head, fold rings (9f0bd3c) | renaissance.painter.a | approved
369 | skull backing plate filling the window (a321a18) | tribal.protector.a | approved
370 | candy lance: team band helix half each turn on tan shaft (14e00d6) | renaissance.jouster.b | approved
370 | feather plume: 7 flat stepped-blade feathers, helm + poll (38081d7 +1edcdf2, reverted) | renaissance.jouster.a | rejected
370 | falling collar: tan 8-sided cape on the vest top, 2 tabs (6bc67f7 +62c3f84) | renaissance.musketeer.a | approved
370 | quilted sleeves: packed puffs both arms, flared black cuff (9295c61) | renaissance.halberd.a | approved
370 | puffed beret: band + faceted puff slid aside, team colour (8139915 +afefe3a) | renaissance.painter.a | approved
370 | tan bone ring on the slab behind the window (37d76c7) | tribal.protector.a | approved
370 | step back: committed slide from the land, 1.8 m in .16 s (e2f2190) | renaissance.fencer.c | approved
371 | hose: garter + bow, tan sock tops, orange shoes (e7a49eb) | renaissance.musketeer.a | approved
371 | solid doublet, tan placket + buttons, slashed shoulder puffs (58d2ee9) | renaissance.balloon_archer.a | approved
371 | cavalier hat as one felt lathe, left brim swept up (47ab317 +4b357d0) | renaissance.fencer.a | approved
371 | feather clump: packed rings of fat icos, helm + poll (ae2a04b) | renaissance.jouster.a | approved
371 | Fencer Dodge: sidestep slide as a swing goes up, blow on air (c88c308) | renaissance.fencer.c | approved
372 | sleeve slashes laid flat: tan panes on the puff skin, tips down (25a752d) | renaissance.balloon_archer.a | approved
372 | cavalier hat re-seated, cocked, rounded crown, team feather clump (a8b654e) | renaissance.fencer.a | approved
372 | chunky tusks: full girth, blunt point, root knob over the band (e59b231) | tribal.spear_thrower.a | approved
372 | jabot as a front bib: 3 half-round flared panels, last to a point (0a0238a) | renaissance.painter.a | approved
372 | tapering legs, separate flared foot lathe (721d839) | tribal.mammoth.a | approved
372 | sallet bevor as a chin cup (512e743, reverted) | renaissance.halberd.a | dropped
373 | flat-topped wide-brim hat, cherry-pick of 401d70e (23dc915) | renaissance.balloon_archer.a | approved
373 | rolled wings + tan band, belt, flared skirt of tabs (909da65 +a7d213f +8669b5c) | renaissance.fencer.a | approved
373 | own loincloth: rope coils, narrow flap, skull + crossed bones, no kilt (cd8403d +bdad788 +483efeb) | tribal.spear_thrower.a | approved
373 | beret as lumpy lathe tam, dark team (6b5ac3c) | renaissance.painter.a | approved
373 | halberd at rest upright, fists belly + collar (a10c9e5) | renaissance.halberd.a | approved
373 | solid bone face plate in the window, own eyes + nose (41cba1a) | tribal.protector.a | approved
373 | Painter Dodge: sidestep off a missile, it lands on air (89dc959) | renaissance.painter.c | approved
374 | low leather shoes, turned cuff, dark stocking (b46132a) | renaissance.halberd.a | approved
374 | upright stance for a javelin man, lankier body (9fcac3a) | tribal.spear_thrower.a | approved
374 | sweater ends at hip in a ribbed band, legs 1.2x (0ee7192) | renaissance.painter.a | approved
374 | tabs bent near-straight, thigh rolls dropped (0118f84) | renaissance.fencer.a | approved
374 | hull lower half squared as a skirt; hull winding flipped outward (79f4083 +6910ac7) | tribal.mammoth.a | approved
375 | breeches: 3 quilted team puffs hip to knee, tan slashes (a74b9af) | renaissance.halberd.a | approved
375 | hay planks fanning above the shoulders, skirt of flat tongues (d822dce) | farmer.hay_baler.a | approved
375 | sweep carried through a step in the press (setState _afterSweep) (3a94e9e) | farmer.harvester.c | approved
375 | chunky faceted flask: bulb, shoulder, neck, lip, cork (5af9646) | farmer.potion_seller.b | approved
375 | mop of hanging locks in two tiers to jaw and nape (d04eef6) | farmer.halfling.a | approved
375 | crow wings: 3 layered feather rows, team wedge on the leading edge (730ae01) | farmer.scarecrow.a | approved
375 | round belly between the legs, skirt dropped, fur collar per leg (4ee59f9) | tribal.mammoth.a | approved
376 | square upright stance in a sallet, legs 1.18 (d66db47) | renaissance.halberd.a | approved
376 | two braids hung from the torso down the chest, team bands (ca0eef1) | farmer.harvester.a | approved
376 | perched crow as its own upright wingless bird (a5e59c1) | farmer.scarecrow.a | approved
376 | open coat: back/side walls, hinged fronts, lapels, vest, V, belt (e8d2448) | farmer.halfling.a | approved
376 | fitted 8-sided jerkin as the trunk, skirt band, lean build (bfd2385) | farmer.potion_seller.a | approved
376 | tall hood: one lathe shoulders to cone, oval face window (5162e03) | farmer.farmer.a | approved
376 | riders on the tray: Farmer on the lip legs forward, Thrower astride (78a73b0) | farmer.wheelbarrow.a | approved

## Spent (never retry as [P])

## Rows
tribal.spear_thrower (JAVELIN_LEAF, TUSK_BAND, SPEAR_LOIN hide (.5,.38,.26) glow .08 rope (.58,.24,.13), JAVELIN_UPRIGHT; unit done) | compacted 374 | 374 | approved | values: git show e35255b:loop/LEDGER.md + 374 gap commits
renaissance.painter (PAINTER_JABOT, BERET_TAM, PAINTER_DODGE, PAINTER_SWEATER .2,1.12,rib .45; legLength 1.2; unit done) | compacted 374 | 374 | approved | values: git show e35255b:loop/LEDGER.md + 374 gap commits
renaissance.fencer (FENCER_RECOVER, FENCER_DODGE, CAVALIER_FELT, FENCER_TRIM hip .6 hipOut 1.1 foot 1.32, FENCER_ROLL drop .24; unit done) | compacted 374 | 374 | approved | values: git show e35255b:loop/LEDGER.md + 374 gap commits
medieval.* (43 knob rows incl. stats, 351-365; batch done) | compacted 366 | 365 | approved | values: git show f142d6e:loop/LEDG..
tribal.chieftain (OFF_AXE, MAIN_AXE, CHIEF_LOIN, STONE_AXE, BEAST_SKULL, PAULDRON, CHIEF_BEARD; unit done) | compacted 369 | 367 | approved | values: git show 706894b:loop/LEDGER.md
tribal.clubber (DREAD_MOP, CLUB, RAGGED_LOIN, visuals, CURLY_MOP, RAGGED_STRIPS; unit done) | compacted 369 | 367 | approved | values: git show 706894b:loop/LEDGER.md
tribal.stoner (HIDE_DRESS, HIDE_SKIRT, HIDE_EDGE, SKIRT_TONGUES; unit done) | compacted 369 | 368 | approved | values: git show 706894b:loop/LEDGER.md
tribal.bone_mage (DEER_RACK, worn, staff, MASK_LEAF, STAFF_SKULL, DEER_MASK; unit done) | compacted 368 | 366 | approved | values: git show 96d1c20:loop/LEDGER.md
renaissance.jouster (BARDED_NECK, JOUSTER_CHARGE, HORSE_GAIT, LANCE_CANDY, FEATHER_CLUMP; unit done) | compacted 371 | 371 | approved | values: git show 58e64cc:loop/LEDGER.md + 371 gap commits
renaissance.musketeer (MORION_CUT, MATCHLOCK, MUSKETEER_COLLAR, MUSKETEER_HOSE; unit done) | compacted 371 | 371 | approved | values: git show 58e64cc:loop/LEDGER.md + 371 gap commits
tribal.protector (SLAB_FACETS, SKULL_FACE, SLAB_LIP, SLAB_WINDOW_BONE, SKULL_BACK, SLAB_WINDOW_FACE, SLAB_FRONT, SKULL_FACETED; unit done) | compacted 376 | 373 | approved | values: git show b0e9788:loop/LEDGER.md
renaissance.balloon_archer (HELD_BALLOON_ARROW, ARCHER_FRONT, BRIM_HAT; unit done) | compacted 373 | 373 | approved | values: git show 2703401:loop/LEDGER.md + 23dc915
farmer.hay_baler (HAY_BALE, HAY_PLANK; unit done) | compacted 376 | 375 | approved | values: git show b0e9788:loop/LEDGER.md
tribal.mammoth c (TRAMPLE_RING, CHARGE_POSE, MAMMOTH_DUST, KICK_DUST; c PASS 364) | compacted 376 | 364 | approved | values: git show b0e9788:loop/LEDGER.md
vehicleBuilder.ts:MAMMOTH_LEG (thigh, shin, foot) | r .31->.245, .245->.205, foot lathe .205->.255 | 372 | approved | thigh .37->.3, shin .28-.31 (366); radius-only change now = reversal
vehicleBuilder.ts:MAMMOTH_BARREL (..haunch, legAt, legSpread, belly, bellyNarrow, skirtFull; round, winding out) | ..,.26,.44,.32,.2,.38,5 | 375 | approved | skirtSquare .45, skirtDrop .16, belly .14 x (1-t^2) (374)
vehicleBuilder.ts:MAMMOTH_TRUNK (pitch, piece, rootR, tipR, flare, hole) | [.75..0.9] x8, .21, .25, .13, .16, .62 | 365 | approved | 8 dark pieces .2, .5->.22 diam
vehicleBuilder.ts:MAMMOTH_TUSK (tan, glow, tip, gap, stripe, proud) | (.8,.6,.36),.14,3,1,.45,1.08 cloth | 366 | approved | bone ivory (1,.82,.58) glow .22, 2-piece tip
vehicleBuilder.ts:MAMMOTH_EAR (tall, long, thick, z, flare) | .48,.42,.15,.3,1.05 | 367 | approved | edge-on fan
vehicleBuilder.ts:MAMMOTH_HEM (row, c, size, drop, skirt, ring, skirtY) | 9,-.55,[.08,.2,.22],.12,5,.36,-.42 | 367 | rejected (reverted) | -
vehicleBuilder.ts:MAMMOTH_LEG collar ([r,y] foot..top, collarJitter) | [.28,-.36],[.35,-.3],[.37,-.2],[.33,-.1], .045 | 375 | approved | -
renaissance.halberd (SALLET_FACETED, HOP_BACK, HALBERD_QUILT, HALBERD_REST, HALBERD_SHOE, HALBERD_BREECH) | compacted 376 | 375 | approved | values: git show b0e9788:loop/LEDGER.md
proceduralAnimation.ts:HALBERD_SQUARE (tilt, stride, lean, spread, knee); unitVisuals halberd legLength | .03,.12,.04,.09,.06; 1.18 | 376 | approved | hashed hip-shot stance; legLength .92
propBuilder.ts:POTION (ball, squash, shoulder, shoulderFoot, neck, neckLong, lip, cork, seat, glow) | .12,.85,.042,.7,.042,.035,1.3,.026,.06,.22 | 376 | rejected 1x [P] | 376 seat -.02 glass (.45,.68,.72) rejected; ball .065 .92, seat .035 (339)
tribalDress.ts:SHAGGY (cap, locks, long, front, fringeArc, thick, splay, locks2, long2, splay2, rootY2) | 1.3,22,.95,.32,.6,.42,.16,14,.5,.5,.85 | 375 | approved | 1.32,26,.5,.5,-,.3,.55 (340)
propBuilder.ts:CROW_LAYERS (shrink, lift, wide, tip, bandFrom, band, bandTip, bandProud, bandShade); CROW_WINGS wrist, rows | .72,.035,.42,.3,.16,.3,.45,.07,.8; .48, 3 | 375 | approved | wrist box .32 (339)
farmerDress.ts:CHEST_BRAID (apart, rootUp, rootAhead, footOut, footDrop, standOff, bow, plaits, thick) | .44,.45,.12,.5,1.05,.14,.18,7,.3 | 376 | approved | head-hung FLOPPY braid 1.95 (removed)
propBuilder.ts:PERCH_CROW (wide, deep, tall, tip, head, beak, eye, tail, tailTip, leg) | .1,.12,.18,.3,.085,.06,.02,.12,.35,.035 | 376 | approved | held crow laid flat
farmerDress.ts:HALFLING_COAT (neck, drop, out, front, gap, flare, lapel, vest, vee, belt, buckle) | .02,.32,.06,.3,.22,.08,.4,.46,.4,.12,.24 | 376 | approved | box jacket 1.14, drop .12
farmerDress.ts:POTION_FIT (top, waist, deep, band, skirt, hips, light, dark); bulk, legLength | 1,.84,1.04,.1,.2,.94,.55,.42; .84, 1.08 | 376 | approved | box jerkin shell 1.12
propBuilder.ts:TALL_HOOD (tip ring [y,r,back], sides, chin, brow, window) | [1.2,.01,.7], 12, -.92, -.1, .8 | 376 | approved | sphere cowl snug 1.18 + tube tail
vehicleBuilder.ts:CREW_SEAT (lipIn, lipUp, frontThigh, frontSplay, frontKnee, astrideUp, backThigh, backSplay, backKnee) | .05,.03,-1.15,.62,.45,.02,-.75,1,.95 | 376 | approved | seat .32, -1.45/-1.4, splay .45/.35
