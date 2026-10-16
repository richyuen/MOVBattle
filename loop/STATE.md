# Loop state
Iteration: 285   Last re-audit: 285   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion; FAIL carries its closed blocker list and the count of approved [S] since the list was written)
battle-feel: a PASS b PASS c PASS d PASS (4/4)
unit-look: a PASS b PASS c PASS d PASS (4/4)
maps-light: a PASS b PASS c PASS d PASS (4/4)
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b PASS c PASS d PASS (4/4)
Tier 2 (fully scored at 198, re-audited 220-285):
battle-feel: e FAIL f PASS g PASS h PASS (3/4) (h cleared by [R] 065ba9e, 242)
- e FAIL (list rewritten by re-audit 285, plateau cleared) [S since: 0] B: 1 press_clubbers_hit: centre blue clubber holds his club straight up, neither cocked nor coming down; struck hoplite upright, board still in the wall, nothing flung; the other two blue clubbers sit/crouch; in _blow the struck helm only sinks a little, the club head hangs over the red rank without landing, no hoplite knocked out of the file (press_clubbers_side does show one toppling back with his board) — TABS r2c3: club ends low after its arc, struck man thrown back off his feet, arms out; 2 big_melee_2s/2150ms/5s/9s: red clubbers 1-3 bodies behind their own front, clubs cocked forward over their own rank or flat at hip, none comes down on a blue board or head; 3 closeup_weapon_reads: red knights hold swords level or up before the chest, no blade over a shoulder, none meets a body — TABS r3c1 arm cocked well back over the shoulder. Ref trailer_3_sheet_01 r2c3, r3c1.
unit-look: e PASS f PASS g PASS h PASS (4/4) (h cleared by 810f6c6, 240)
maps-light: e PASS f PASS g PASS h PASS (4/4)
ui-flow: e PASS f PASS g PASS h PASS (4/4)
camera: e PASS f PASS g PASS h PASS (4/4)
vfx: e PASS f PASS g PASS h PASS (4/4)
Tier 3 (scored 240, re-audited 245-285; ours lineup_<faction> / biome_<map> / throw_<group>; refs factions/<f>, units/<f>.<id>, maps/<biome>):
unit-look tier 3: i-v all PASS (14/14) (cleared 242-269)
maps-light tier 3: i-o all PASS (7/7) (cleared 246-273)
vfx tier 3: i FAIL j FAIL k FAIL l FAIL m FAIL n FAIL o FAIL p FAIL (0/8) (first scored 281)
- i spear_thrower [S since: 1 (281 7bff8d9)] B: struck 1-3; 4 held javelin a man-height pole, small blue tip; TABS a short javelin, big dark leaf head (units/tribal.spear_thrower.jpg)
- j harpooner [S since: 1 (285 harpoon-gun 09a194c)] B: struck 1, 3, 4 (09a194c: gun prop, missile from its muzzle, dark rope); 2 flies the generic thin blue-tipped spear; TABS a heavy dark barbed harpoon head on a short shaft; 5 (added by 09a194c) in throw_spears_flight the rope's start hangs where the muzzle was at release (~170 px above the gun, now at the hip) instead of following the gun; also gun reads pale grey, raised muzzle-up to head height, not blue and low at the hip (units/pirate.harpooner.jpg)
- k stoner [S since: 1 (283 8cb65fc)] B: 1 holds a head-sized grey pebble in one raised hand; TABS a chest-sized faceted boulder in both hands at the waist (units/tribal.stoner.jpg); 2 a small smooth sphere flies (his own held rock), not the faceted boulder (throw_bombs_flight); struck 3; 4 a one-arm overarm toss, not the end of a two-hand heave from the waist
- l bomb_thrower [S since: 1 (282 e833fa3)] B: struck 1, 2; 3 the bomb in flight is the one he held, but head-sized and only one; TABS a fist-sized bomb in each hand, short fuse (units/pirate.bomb_thrower.jpg; ours throw_bombs_release)
- m dynamite_thrower [S since: 1 (284 345314d)] B: struck 1-3; 4 the bundle is a forearm-length 3-pack at the hip (lineup_wild_west), and in flight sticks and bands merge into one plain red cylinder, no lit spark at the fuse (throw_bombs_flight); TABS a hip-to-chest, near torso-wide bundle of distinct sticks, two broad black bands, glowing fuse (units/wild_west.dynamite_thrower.jpg)
- n bone_mage [S since: 0] B: 1 missing: leaf whirl (a thin dark crossbow bolt from his waist, no leaves in throw_casters_flight; TABS a whirl of red-orange leaves, units/tribal.bone_mage.png); 2 no casting pose: staff never raised overhead
- o wizard [S since: 1 (285 wizard-fireball db5dbc1)] B: struck 1 (db5dbc1, glowing ball lit at the staff head); 2 staff chops down into the dirt like a club after the cast instead of staying thrust at the target (throw_casters_flight; units/legacy.wizard.png); note: in flight the ball blooms to a pale yellow disc, orange shell and tail not seen
- p swordcaster [S since: 0] B: 1 missing: flying sword (the same dark bolt; TABS long glowing white blades, dark keyhole hilts, point first, units/spooky.swordcaster.jpg); 2 holds a short grey hand sword; TABS a dark lockbox chest at the belly, swords floating round him
Total tier 1 24/24; tier 2 23/24; tier 3 21/29.

## Focus (every gap this iteration)
BASE 8322ed1 (iter 285; re-audit ran first: no flips, e's list rewritten so its plateau cleared)
- [S] wizard-fireball (vfx.o blocker 1) — db5dbc1 — APPROVE (struck o.1)
- [S] harpoon-gun (vfx.j blocker 1) — 09a194c — APPROVE (struck j.1, 3, 4; added j.5)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] wizard-fireball (db5dbc1) VERDICT: APPROVE CRITERION: vfx.o FAIL (previous: FAIL)
- GAP: [S] harpoon-gun (09a194c) VERDICT: APPROVE CRITERION: vfx.j FAIL (previous: FAIL); REGRESSIONS: none

## Ranked open gaps (max 8, tags and attempts in brackets; each clears a numbered blocker)
1. [S] battle-feel.e press-blow-lands — blocker 1: the centre clubber's club comes down from overhead onto the hoplite's helm and ends low; struck man thrown back off his feet, arms out (stagger into a topple) — ref trailer_3_sheet_01 r2c3 — ours press_clubbers_hit
2. [S] battle-feel.e crowd-clubbers-reach — blocker 2: red clubbers in the crowd step to the front and bring the club down on a blue board or head — ref trailer_3_sheet_01 r2c3 — ours big_melee_2s
3. [S] battle-feel.e sword-shoulder-cock — blocker 3: knight windup puts the blade back over the shoulder, arm cocked well back, before a swing that meets a body — ref trailer_3_sheet_01 r3c1 — ours closeup_weapon_reads
4. [S] vfx.n bone-mage-leaf-whirl — blocker 1: a spinning cluster of red-orange leaf cards replaces the bolt — ref units/tribal.bone_mage.png — ours throw_casters_flight
5. [S] vfx.p swordcaster-flying-sword — blocker 1: long glowing white blade, dark keyhole hilt, point first — ref units/spooky.swordcaster.jpg — ours throw_casters_flight
6. [S] vfx.k stoner-boulder — blocker 1: chest-sized faceted boulder held in both hands at the waist — ref units/tribal.stoner.jpg — ours throw_bombs_release
7. [S] vfx.j harpoon-rope-anchor — blocker 5: rope re-anchors to the live muzzle every frame (recompute the tether's world matrix), plus a barbed harpoon missile shape (blocker 2) — ref units/pirate.harpooner.jpg — ours throw_spears_flight
8. [P] vfx.o fireball-shell (fallout of [S] wizard-fireball db5dbc1, 285) — FIREBALL_SHELL alpha .7 -> 1, heart kept out of bloom so the orange faceted shell and tail show — NEXT: the pale disc over the left field in throw_casters_flight turns into an orange ball

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- head-snap-under-crown [attempts: 1] — 283: triggerBuckle from staggerFromBlow as last overlay after flinch; critic saw every helm under the club level, boards up. Cause found 284: the pose was there but hidden behind his own board / his file
- overhead-blow [attempts: 1, approved on 2nd at 280] — 279: fist at the grip end of a 35 deg line down onto the crown; in the capture the fist only reaches the striker's own head height so the club rises to the crests. Critic: _aimBlow values are now spent
- [R] aimed-blow-final-layer [attempts: 1] — 278: 277's _aimBlow + flinch after every stance layer; in the capture the club arrives level into the face from a low hand on the board rim, no visible recoil
- [R] target-aimed-blow [attempts: 1] — 277: pending-blow queue + _aimBlow + reposeNow flinch + contact hold; critic saw clubs hip-high/upright on the shot frame, no hoplite recoil
- landed-blow-on-hit [attempts: 2] — 276: pending-blow queue landing damage at BLOW_LAND_E; fixed arc ends below/short of the head; no recoil on hoplites

## Notes for next iteration (max 5 lines)
- 284 probe: the struck hoplite's pose survives to render, but the folded torso/neck flinch drops his head behind his own board, and the _hit camera sees him behind the striker; hitLog entries carry `head`; press_clubbers_blow frames it from behind his rank (alpha .3). Struck-man reaction should go in WORLD blow direction (hoplite torsos stand side-on); the proceduralAnimation lean clamp (torso -= .8*root lean) cancels root stagger pitch at the trunk.
- The capture's hit frame differs from an isolated probe run (+720 vs +640 ms): probe inside capture via temp console.error, read from summary.json consoleErrors. Throws: THROWS_HELD_PROP keys on weaponHint (dynamite keeps "bomb"); missile clones the held prop (_buildHeldMissile). Casters: staffHeadOf (orb child of the staff) is the fireball origin; harpoonMuzzleOf finds HARPOON_MUZZLE under the hands.
- Harpoon rope: _layRope reads tether.getAbsolutePosition() without recomputing the hand chain's world matrices, so it freezes at the release point; the harpooner still uses the "thrust" grip (spear pose raises the gun to head height). Glow layer: exclude meshes via getGlowLayerByName("glow").addExcludedMesh.
- Every other criterion PASS (274-285). mapBuilder.ts is LF, LOG.md CRLF. Hand-built up-facing quads: indices (0,1,2),(0,2,3) or they cull. Unit PBR colours grey out in shade: self-light (mf.get("cloth", c, { emissiveIntensity })).
- Melee hit path: _tryAttack applies damage at swing start unless a heavy blow is pending. No [P] on rows approved within 20 iterations, except fallout named by the critic.
