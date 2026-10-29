# Loop ledger (v4): every value the loop has tuned

Rows: `file:identifier | current value | last iter | verdict | earlier values (newest first)`. The identifier carries the unit
(`rosterManifest.ts:tribal.clubber damageMultiplier`, `unitVisuals.ts:tribal.clubber proportions.scale`, `propBuilder.ts:club CLUB_LEN`).
Verdicts: approved, rejected, approved, spent. A row is `spent` after two attempts without approval or when it was listed as
never-retry; it is not pickable as [P]. The critic rejects a [P] gap that reverses or re-nudges a row approved within the last 20
iterations ("ledger reversal"). An [S] gap that replaces the mechanism owning a row may set new values: the worker resets the row to
approved and keeps the old value under earlier values. Stats knobs set by a `loop(N.0): [P] <batch> stats` commit are rows too
(verdict `stats`, never reviewed by the critic, never a ledger reversal). One row per tuning knob a mechanism exposes, not per line;
a value column is at most 80 characters. The worker updates rows at commit time (approved) and after verdicts. Drop rows untouched
for 25 iterations.

## Structural attempts (last 5 iterations; `iter | gap | unit.criterion | verdict`)

407 | JARL_CRESCENT: dark steel crescent blade, hooked horns round a hollow back, honed band (f6b95a5) | viking.jarl.b | approved
407 | [R] BRAWLER_BEARD: near-black jaw mass, torso bib, spill on the board's face (9ece9b8) | viking.brawler.a | approved
407 | JARL_FLAPS: shoulder caps + long front flaps to the belt, side slabs gone (4859953 + 22d7ed7) | viking.jarl.a | approved
407 | HEADBUTTER_LEGS cut: trousers to mid-shin cuffs, short boots; shinLength 1.75, torsoLength .82 (ff93093) | viking.headbutter.a | approved
407 | ICE_UPRIGHT: upright bow carry across her front, iceBowCarry mark (1936db1 + a65dfd2) | viking.ice_archer.b | approved
407 | LONGSHIP_CARRIER: braided brown beard, horned headband, jarlBelt on the carriers (562d7f1) | viking.longship.a | approved
407 | MINO_LEGS: thinned thighs/shins, pastern, hock knob, cloven toes (8f84140) | ancient.minotaur.a | approved
408 | HEADBUTTER_TUNIC: team trunk shell + short sleeves, skirt in the same cloth (51b3972) | viking.headbutter.a | approved
408 | ICE_ARCHER_SNOWCAP: ruff gone, snow lumps on each shoulder (ea60323) | viking.ice_archer.a | approved
408 | bear head raised onto his head: eyes, snout, nose, fangs (1bc6d8d) | viking.jarl.a | approved
408 | MINO_STRAP foot seated on the girdle's measured top (f27b023) | ancient.minotaur.a | approved
408 | brawler torso beard tail to the belt (8489039, reverted 1d9a84a) | viking.brawler.a | dropped (hidden by the tray board)
408 | JARL_REST: diagonal rest through _restHalberd, blade broadside (e6d2ba3 + f25a459) | viking.jarl.b | approved
408 | LONGSHIP_PROW: S-curved neck, head lifted, disc eyes (0b5a856) | viking.longship.a | approved
409 | LONGSHIP_STERN: tall stern post curling into a spiral scroll (5c28a14) | viking.longship.a | approved
409 | jarl beard run one grey-brown tube from the jaw into a tied plait (b620406) | viking.jarl.a | approved
409 | MINO_BARREL: trunk widened/deepened, shoulders out, lathe barrel, hump, thick neck (506c4c3) | ancient.minotaur.a | approved
409 | ICE_ARCHER_COAT: team shell, full sleeves, belt, coat skirt (75774b2) | viking.ice_archer.a | approved
409 | HEADBUTTER_COPPER: copper two-tone braids, dark tie, flared tail (ef2e8e9) | viking.headbutter.a | approved
409 | DRAWS_BEFORE_LOOSE + viking.ice_archer: looses from a full draw (8b44250) | viking.ice_archer.b | approved
410 | MINO_ARMS: fur arm sleeves + big mitts (cfb6510) | ancient.minotaur.a | approved
410 | MINO_LEGS thigh/calf fur sleeves (bd87426) | ancient.minotaur.a | approved
410 | LEG_WRAPS: tan shin wraps on the jarl via brawlerLegs wrap (e1e9397) | viking.jarl.a | approved
410 | ICE_ARCHER_QUIVER: leather slab at the off hip, back tube off (d6fdbba) | viking.ice_archer.a | approved
410 | ICE_NOCK + _poseIceNock: drawn string halves, nocked ice arrow (742df8a) | viking.ice_archer.b | approved
410 | jarl beard narrowed + lobed plait, greyer (99f4edd) | viking.jarl.a | approved
411 | LEG_WRAPS on the ice archer: khaki shin wraps in place of the fur cuffs (4b4db5f) | viking.ice_archer.a | approved
411 | ICE_REST + _restIceBow: the bow stood upright, leant across her front (e1dc03c) | viking.ice_archer.b | approved
411 | BULL_MUZZLE: compact muzzle under the eyes, level horns (0469073) | ancient.minotaur.a | approved
411 | MONK_STAFF bo + _restMonkBo level across the chest, boGrip (0f878ea) | dynasty.monk.b | approved
411 | NINJA_HOOD: boxy team hood + mask, open eye band (e572534) | dynasty.ninja.a | approved
411 | SHURIKEN: four-point dark star in each fist (d5ebed9) | dynasty.ninja.b | approved

## Spent (never retry as [P])

## Rows
viking 401-403 rows (ICE_ARCHER_MANTLE, ICE_ARCHER_EYE_CLEAR, VIKING_BEARD, JARL_BEARD, HEADBUTTER_KIT, LONGSHIP_SHIP, LONGSHIP_HURL.sink) | compacted 409 | 403 | approved | values: git show 2ccd9f2:loop/LEDGER.md
ancient done units (SARISSA_CAPE/MANTLE, SNAKE_CAP/WRAP/UPRIGHT, BALLISTA_WOOD/PLATES/BOLT/FRAME/STOCK, LOADED_BOLTS) | compacted 397 | 397 | approved | values: git show 8f53efc:loop/LEDGER.md
farmer.halfling done (HALFLING_STANCE, HALFLING_SHORTS + _CLOTH, shinLength 1.95, HALFLING_TUFT, VEST_CUT, COAT, SHAGGY) | compacted 404 | 402 | approved | values: git show 244af97:loop/LEDGER.md
viking.* stats (cost, healthMultiplier, damageMultiplier, cooldownMultiplier, 7 units) | d PASS 7/7 | 391 | stats | values: git show e5a0cb5
ancient.* 379-386 rows (MINO_*, BULL_*, PIKE_LEVEL, CORINTH_*, SNAKE_*, SARISSA_KEEP/KIT, ZEUS_REARM/TOGA/SANDAL/CHAIN, BOLT_SPARK, BALLISTA_*, SB_SANDAL, HOPLITE_CREST, MINO_SHELL/SCROLL) | compacted 387 | 386 | approved | values: git show fad9e5c:loop/LEDGER.md
ancient.shield_bearer + hoplite done (SCUTUM*, LEGION_HELM, LORICA, ASPIS*, DORY_*, HOPLITE_LEGS) | compacted 385 | 384 | approved | values: git show 522cb46:loop/LEDGER.md
ancient.* 387-388 rows (ZEUS_BEARD/LOCKS/HAIR, SNAKE_LIVE, BIG_HEADBUTT, SARISSA_FOLD, BALLISTA_CREW/HELM, GROUND_SNAKE, SNAKE_QUIVER, MINO_SASH_FOOT rej) | compacted 389 | 388 | approved | values: git show f31835b:loop/LEDGER.md
viking 392-409 rows (BEARDED_AXE, JARL_AXE, LEAP_AIR, HEADBUTT, LONGSHIP_*, HEADBUTTER_KIT/BRAID/HAIR/COPPER, ICE_BOW, FROST, BRAWLER_*, JUMP_CHARGE, FLY, VALKYRIE_WINGS) | compacted 411 | 409 | approved | values: git show 186849d:loop/LEDGER.md, 4778c43, cdc71a4
viking a/b/c rows (LONGSHIP_OARS, LONGSHIP_CREW, LONGSHIP_HULL, ICE_ARROW, JARL_PELT) | compacted 403 | 401 | approved | values: git show 73e45c7:loop/LEDGER.md
ancientDress.ts:MINO_GIRDLE (lo, hi, proudX, proudZ, flare, sides, rimGrow, light, sunk) on the hip joint | -.3, .03, 1.03, 1.1, 1.04, 12, 1.02, .72, .5 | 402 | approved | 1.1, 1.22, 1.12, 8 sides, rims 1.05, outlined scrolls .55 light proud 1.4 (389); 386 band round the trunk base (MINO_SCROLL tall .24 at .04)
ancientDress.ts:MINO_SHELL wedge plate (inX, atY, long, lip, lipBend, thick, rootDeep, tipDeep, faceUp, droop, swirl) | .85, .86, .85, .3, .45, .14, .7, .95, .3, .18, .3 | 404 | approved | .78/.84/.5/.22/.12/.62/.82/.22 (404.6); curved shell + scrolls .3 at 1.3, .24 at .95 (385-403)
propBuilder.ts:BULL_HEAD (drop, forward, face, tilt, neck/neckTop/neckBottom/neckLean, dewlap) | -.4, .12, .86, .12, 1.0/1.0/1.55/.22, .22 | 406 | approved | .72, .28, 1.0, .15, .42/1.0/1.6/.3 (403); tilt .72 (402, muzzle at the ground); no drop/forward, tilt .5, neck .9/.9/1.5/.35 (382)
simulationSystem.ts:LONGSHIP_OARS (reach, damage, push) + vehicleBuilder OAR_CHOP (period, strike, up, down, elbow, spread) | 1.5, 12, 1.2; 1.1, .3, -2.75, -.55, -.3, .14 | 403 | approved | the oars dropped at the crash (396-402)
vikingDress.ts:JARL_BEARD_RUN (bibDrop, bibWide, bibTip, plaitLong, plait, flat, ties, lobes, overlap, shade) + JARL_BEARD color/jaw | .3, .34, .55, .46, .15, .5, 1, 4, 1.4, .75; (.32,.25,.22), jaw .62 | 410 | approved | tube to the plait .4/.62/.4/.4/.18 (.34,.22,.16) jaw .9 (409); bib cylinder (402-408)
vikingDress.ts:HEADBUTTER_CAP (dome, tall, strip, stripProud, eyeClear) + unitVisuals headSize | 1.1, .72, .2, .04, .03 off eyeTopInHead; 1.3 | 404 | approved | rise .16 fixed (403); 1.16, 1.04, no strip; headSize 1.8 (392-402)
viking c/done rows (BERSERKER_ARMPITS, BRAWLER_HELM, DIVE, HEADBUTT + SPRAWL.delay, headbuttSprawl) | compacted 406 | 401 | approved | values: git show 9c743e0:loop/LEDGER.md

vikingDress.ts:JARL_WRAPS (from, to, out, bands, band, bandOut, furAt, furOut, furThick, lumps; maroon, dark) | .1, .94, 1.24, 3, .05, 1.3, .1, 1.42, .34, 7; (.3,.06,.07), (.16,.03,.04) glow .25 | 404 | approved | bare forearms (before 404)
vehicleBuilder.ts:LONGSHIP gunwale material + wrapAsBody source | darkWood; first longshipShield face | 404 | approved | teamPrimary rails as the body source (392-403)
vikingDress.ts:ICE_ARCHER_BAND (leather, rivet, glow, rivets, rivetSize, rivetProud) | (.26,.12,.06), (.5,.48,.44), .14, 8, .42, .8 | 405 | approved | the brim a pale fur roll ICE_ARCHER_FUR (396-404)
ancientDress.ts:MINO_STRAP (wide, proud, footX, footY, buckleAt) | .44, .32, .95, .06, .3 | 405 | approved | MINO_SASH .3 wide .03 thick flat on the chest, foot .85/.12, buckle at .68 (383-404)
propBuilder.ts:ICE_BOW (thick, taper, bow, recurve, crust, flake, flakeLift, tip) | .04, .5, .1, .035, 4, .07, .22, .06 | 406 | approved | thick .062 taper .45 bow .06, fringe 6 x .15, crowns 4 x .16, snow .105 (392-405)
vehicleBuilder.ts:longship SHEER (half, pinch, pow, rise, bow, segs) | 1.3, .8, 3, .34, 1.25, 12 | 406 | approved | straight strakes 2.56-.16r, straight rails 2.42, flat deck .82 x 2.34 (392-405)
vikingDress.ts:JARL_BELT (tall, at, out, rim, ring, ringThick, proud; leather, rimDark, metal) | .24, -.74, 1.2, .2, .24, .3, 1.08; (.24,.13,.07), (.13,.07,.04), (.55,.52,.48) | 406 | approved | jarlPeltMantle .86/.24/.68/.94 over the chest + tunicSkirt (401-405)
unitVisuals.ts:viking.headbutter legLength + proceduralAnimation standSquare | .92 default, hip-shot idle (reverted) | 406 | rejected | 1.22 + HALBERD_SQUARE stance rejected 406: upright but belt-to-sole unmoved (41%)
vehicleBuilder.ts:longship PLANKS (count, wide) + shieldDark/shieldBoss | 3, .035; (.14,.08,.05)/(.2,.13,.08) | 405 | approved | a dark half disc (.1,.11,.16), boss (.56,.36,.15) (395-404)
propBuilder.ts:JARL_CRESCENT (neck, hornUp, beardDown, hornX, beardX, bulge, edge; steel) | .07, .15, .2, .98, .82, .12, .13; (.16,.165,.19) glow .08 | 407 | approved | the rounded paddle outline in JARL_AXE.steel (392-406)
vikingDress.ts:BRAWLER_BEARD (jaw, jawY, jawZ; bibDrop, bibWide, bibTip, bibLean; spillFrom/To, spillWide; colour) | [1.5,.95,.8], 1.0, .55; .28, .6, .72, .08; (.085,.15)/(.12,-.05), .11; (.13,.065,.045) | 407 | approved | the VIKING_BEARD brawler cut (0.32,.15,.11) glow .22 (396-406)
vikingDress.ts:JARL_FLAPS (out, capWide, capTall, capBack, wide, tip, deep, proud, lean, past, tufts) | .3, .3, .16, .3, .32, .8, .16, .03, .06, .04, 3 | 407 | approved | jarlPeltSide panels .18/.58 + chest strips .2/.23 (401-406)
vikingDress.ts:HEADBUTTER_LEGS + unitVisuals headbutter shinLength/torsoLength | hemTo .62, hemOut 1.44, cuff .58-.76, bootFrom .74; 1.75, .82 | 407 | approved | the BRAWLER_LEGS cut, shin 1, torso 1 (405-406)
proceduralAnimation.ts:ICE_UPRIGHT (raise, out, elbow, tip, yaw, stagger, give) | -.85, -.2, -1.3, [.16,1,.06], .12, .06, .02 | 407 | approved | the hashed bowman hold (before 407); tip [-.42,1,.12] raise -.7 (407.5)
vikingDress.ts:LONGSHIP_CARRIER (beard, down, wide, tip; band, bandY, bandOut, horn, hornBase, hornSplay) | (.42,.22,.11), .75, 1.0, .5; .22, .32, 1.08, .85, .32, .55 | 407 | approved | the oarsmen's horned team cap + plain belt (401-406)
ancientDress.ts:MINO_LEGS (thigh, shin, toeWide, toeTall, toeDeep, cleft, toeAhead, toeSlope, pastern, hockUp, hockBack, hock) + thighShell/calfShell/calfTo | .7, .58, ... (407 values); 1.95, 2.0, .6 | 410 | approved | no sleeves (407-409)
viking.valkyrie + ancient.zeus done (VALKYRIE_ARMOUR/COLLAR/HELM/SWORD, SWORD_WINGS, ZEUS_TOGA + .boltGap, ZEUS_BEARD, glowLayer group 0 / bolt group 1) | compacted 407 | 406 | approved | values: git show 978f707:loop/LEDGER.md
vikingDress.ts:HEADBUTTER_TUNIC (out, deep, sleeve, sleeveOut, glow) | 1.05, 1.08, .42, 1.2, .12 | 408 | approved | the viking_fur-tinted trunk + body-material tunicSkirt (before 408)
vikingDress.ts:ICE_ARCHER_SNOWCAP (lumps, out, big, small, spread, sit, squash) | 4, .4, .2, [.7,.6,.55], .09, .05, .75 | 408 | approved | ICE_ARCHER_MANTLE ring + 10 points + 8 lumps (402-407)
vikingDress.ts:JARL_PELT bear head (skullW/H/D/Y/Z, eye/eyeOut/eyeY/eyeProud, muzzle/Tall/Long/Z, fangs/fang/fangOut/fangClear, ear/earY) | 1.45/1/1.35/1.25/-.05, .3/.44/1.5/1.32, .66/.42/.72/1.3, 2/.3/.17/.05, .3/2.0 | 408 | approved | 1.3/.95/1.3/.58/-.1, eye .24 at .6, muzzle .44 at .12, 3 teeth .1 (400-407)
ancientDress.ts:MINO_STRAP.clear (foot over the girdle's measured top, trunk heights) | .03 | 408 | approved | footY .06 fixed (405-407)
proceduralAnimation.ts:JARL_REST (ahead, inward, drop, across, forward) | .12, .02, .36, .95, .2 | 408 | approved | HALBERD_REST upright .05 tilt (392-407)
vehicleBuilder.ts:LONGSHIP_PROW (lift, root, tip, eye, path) | .75, .11, .085, .2, S from (.95,1.3) to (2.0,1.38) | 408 | approved | neck box .18x.66 at y .9, bead eyes .1 (392-407)
vehicleBuilder.ts:LONGSHIP_STERN (post, r0, r1, turns, root, mid, tip) | [y,z] (.45,-1.26)..(1.5,-1.52), .2, .05, 1.25, .12, .08, .04 | 409 | approved | stern post cylinder .82 + two scroll cylinders at y 1.0 (400-408)
ancientDress.ts:MINO_BARREL (wide, deep, ahead, profile, hump, humpY, neckFrom/To, neckBottom/Top, neckLean) | 1.35, 1.8, .08, 7 pts .8-1.02-.3, [.95,.24,.7], .98, .92/1.3, .95/.62, .25 | 409 | approved | the body's trunk box (before 409)
vikingDress.ts:ICE_ARCHER_COAT (out, deep, sleeveOut, cuffTo, belt, beltAt, beltOut, skirt, flare, glow; leather) | 1.06, 1.1, 1.15, .88, .11, .08, 1.08, .8, 1.4, .12; (.26,.12,.06) | 409 | approved | the viking_fur trunk + body tunicSkirt .45/1.5 (before 409)
ancientDress.ts:MINO_ARMS (upper, fore, fist) | 1.6, 1.85, 1.75 | 410 | approved | bare limb boxes (before 410)
vikingDress.ts:LEG_WRAPS (color, dark, out, bands, band, bandOut, glow) via BRAWLER_LEGS.wrap | (.55,.45,.28), (.32,.24,.14), 1.42, 2, .12, 1.5, .2 | 410 | approved | the fur cuff + roll (405-409)
vikingDress.ts:ICE_ARCHER_QUIVER (wide, long, deep, top, side, back, tilt, rim, tips, tipProud; leather) | .36, 1.15, .16, .32, 1.12, .05, .12, .07, 2, .16; (.32,.17,.09) | 410 | approved | quiver_back tube (before 410)
propBuilder.ts:ICE_NOCK (long, shaft, head, headWide) + _poseIceNock (on over w .2) | .5, .016, .09, .05 | 410 | approved | a straight string, no arrow (before 410)
proceduralAnimation.ts:ICE_REST (across, forward) via _restIceBow | .42, .12 | 411 | approved | ICE_UPRIGHT carry alone (407-410)
propBuilder.ts:BULL_MUZZLE (wide, tall, deep, drop, ahead, tilt; horns) | .95, .42, .62, .36, .3, .25 | 411 | approved | BULL_HEAD face .86 tilt .12 + hornBends (406-410)
dynastyDress.ts:MONK_STAFF (long, thick, offset, cap, capWide, band) + MONK_REST (ahead, inward, drop, tilt) | 1.2, .022, .2, .08, 1.45, .025; .14, .08, .16, .06 | 411 | approved | no staff (before 411)
dynastyDress.ts:NINJA_HOOD (out, clear, top, backFrom, sideFrom, chin, maskShade, knot, tail) | 1.12, .05, 1.12, -.15, .72, -1.08, .82, .22, .9 | 411 | approved | ninja_mask ball (before 411)
propBuilder.ts:SHURIKEN (span, waist, thick, hub, drop) | .2, .055, .012, .035, .07 | 411 | approved | a thin grey blade (before 411)
dynasty.* stats (cost, healthMultiplier, damageMultiplier, cooldownMultiplier, 7 units) | d PASS 7/7 | 411 | stats | values: git show cc4f7de
