# Loop state
Iteration: 284   Last re-audit: 281   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion; FAIL carries its closed blocker list and the count of approved [S] since the list was written)
battle-feel: a PASS b PASS c PASS d PASS (4/4)
unit-look: a PASS b PASS c PASS d PASS (4/4)
maps-light: a PASS b PASS c PASS d PASS (4/4)
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b PASS c PASS d PASS (4/4)
Tier 2 (fully scored at 198, re-audited 220-281):
battle-feel: e FAIL f PASS g PASS h PASS (3/4) (h cleared by [R] 065ba9e, 242)
- e FAIL plateau (since 284: 4 approved [S] since its list; next pick on it is one [R], or a re-audit rewrites the list) (un-deferred by the user after 279; list from re-audit 280, blocker 1 narrowed by 8f62d4e, b8ca15a, 751f858) [S since: 4 approved (280 overhead-blow, 281 stagger c8d9701, 282 crown b8ca15a, 284 board-off 751f858), 1 rejected (283 head-snap-under-crown)] B: 1 (knee buckle struck by 751f858: struck helm sinks under file-mates' in _blow) the hoplite under the club in press_clubbers_hit stays upright with no head snap, his board still up at the rim, and no board is seen flung out on the struck man in _hit or _blow; the centre clubber holds his club straight up on the hit frame; blue clubbers lie or sit on their backs in _hit and _blow — press_clubbers_hit, press_clubbers_blow; 2 red clubbers 1-3 bodies behind their own front, clubs cocked forward over their own rank (2s/2150ms) or flat at hip (5s/9s); none comes down on a blue board or head — big_melee_2s, 2150ms, 5s, 9s; 3 red knights hold swords upright or level before the body; no blade raised over a shoulder, none meets a body — closeup_weapon_reads. Ref trailer_3_sheet_01 r2c3, r3c1.
unit-look: e PASS f PASS g PASS h PASS (4/4) (h cleared by 810f6c6, 240)
maps-light: e PASS f PASS g PASS h PASS (4/4)
ui-flow: e PASS f PASS g PASS h PASS (4/4)
camera: e PASS f PASS g PASS h PASS (4/4)
vfx: e PASS f PASS g PASS h PASS (4/4)
Tier 3 (scored 240, re-audited 245-281; ours lineup_<faction> / biome_<map> / throw_<group>; refs factions/<f>, units/<f>.<id>, maps/<biome>):
unit-look tier 3: i-v all PASS (14/14) (cleared 242-269; polish notes dropped at 281, see git history of STATE)
maps-light tier 3: i-o all PASS (7/7) (cleared 246-273)
vfx tier 3: i FAIL j FAIL k FAIL l FAIL m FAIL n FAIL o FAIL p FAIL (0/8) (first scored 281)
- i spear_thrower [S since: 1 (281 held-prop-release 7bff8d9)] B: struck 1 (add4e77 [P], arm level ahead at the let-go), 2, 3 (7bff8d9); 4 held javelin a man-height pole, small blue tip; TABS a short javelin, big dark leaf head (units/tribal.spear_thrower.jpg)
- j harpooner [S since: 0] B: 1 missing: harpoon gun (holds a long spear level; TABS chunky blue-grey gun at the hip, units/pirate.harpooner.jpg); 2 flies the spear thrower's thin spear; white line only on release frame, ref a dark rope muzzle-to-target; 3 held spear never leaves (throw_spears_flight); 4 spawn at head height at swing start, not from a muzzle
- k stoner [S since: 1 (283 stoner-held-rock-release 8cb65fc)] B: 1 holds a head-sized grey pebble in one raised hand; TABS a chest-sized faceted boulder in both hands at the waist (units/tribal.stoner.jpg); 2 a small smooth sphere flies (now his own held rock), not the faceted boulder (throw_bombs_flight); struck 3 (8cb65fc, hand empty in flight); 4 (narrowed) release now at the end of the arm's reach, but a one-arm overarm toss, not the end of a two-hand heave from the waist
- l bomb_thrower [S since: 1 (282 held-bomb-release e833fa3)] B: struck 1, 2 (e833fa3); 3 (narrowed) the bomb in flight is the one he held, but head-sized and only one; TABS a fist-sized bomb in each hand, short fuse (units/pirate.bomb_thrower.jpg; ours throw_bombs_release)
- m dynamite_thrower [S since: 1 (284 dynamite-stick 345314d)] B: struck 1 (345314d, red sticks/bands/fuse held and thrown), 2, 3 (e833fa3); 4 the bundle is a forearm-length 3-pack at the hip (lineup_wild_west), and in flight sticks and bands merge into one plain red cylinder, no lit spark at the fuse (throw_bombs_flight); TABS a hip-to-chest, near torso-wide bundle of distinct sticks, two broad black bands, glowing fuse (units/wild_west.dynamite_thrower.jpg)
- n bone_mage [S since: 0] B: 1 missing: leaf whirl (a thin dark crossbow bolt from his waist, no leaves in throw_casters_flight; TABS a whirl of red-orange leaves, units/tribal.bone_mage.png); 2 no casting pose: staff never raised overhead
- o wizard [S since: 0] B: 1 missing: fireball (dark bolt from the hip, nothing glowing in throw_casters_flight; units/legacy.wizard.png); 2 staff chops down into the dirt like a club instead of thrust at the target
- p swordcaster [S since: 0] B: 1 missing: flying sword (the same dark bolt; TABS long glowing white blades, dark keyhole hilts, point first, units/spooky.swordcaster.jpg); 2 holds a short grey hand sword; TABS a dark lockbox chest at the belly, swords floating round him
Total tier 1 24/24; tier 2 23/24; tier 3 21/29.

## Focus (every gap this iteration)
BASE e545848 (iter 284)
- evidence f635d00: press_clubbers_blow centred on the struck man's head (hitLog.head), from behind his rank — APPROVE (not scored)
- [S] board-off-under-blow (battle-feel.e blocker 1) — 751f858 — APPROVE (knee buckle struck; e now plateau)
- [S] dynamite-stick (vfx.m blocker 1) — 345314d — APPROVE (struck m.1, added m.4)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: evidence f635d00 (press_clubbers_blow frames the struck man's head) VERDICT: APPROVE CRITERION: battle-feel.e FAIL (previous: FAIL; not scored)
- GAP: [S] board-off-under-blow (751f858) VERDICT: APPROVE CRITERION: battle-feel.e FAIL (previous: FAIL)
- GAP: [S] dynamite-stick (345314d) VERDICT: APPROVE CRITERION: vfx.m FAIL (previous: FAIL); REGRESSIONS: none

## Ranked open gaps (max 8, tags and attempts in brackets; each clears a numbered blocker)
1. [R] battle-feel.e (plateau: only an [R] is pickable; critic's [S] items 1-4 fold into its spec) — blocker 1: club held down on the struck head on the land frame (club tip at hit.head), board legibly swung clear of the wall, head snapped back on the sunk helm; blocker 2: front-rank clubbers bring the club down on a blue board/head (big_melee_2150ms); blocker 3: knight overhead windup cut into a body (closeup_weapon_reads) — ref trailer_3_sheet_01 r2c3 — ours press_clubbers_hit, press_clubbers_blow
2. [S] vfx.j harpooner — blocker 1: harpoon gun prop at the hip, harpoon on a rope from its muzzle — ref units/pirate.harpooner.jpg — ours throw_spears_release
3. [S] vfx.o wizard — blocker 1: glowing fireball missile from the staff — ref units/legacy.wizard.png — ours throw_casters_flight
4. [S] vfx.k stoner — blocker 1: chest-sized faceted boulder held in both hands at the waist, two-hand heave — ref units/tribal.stoner.jpg — ours throw_bombs_release
5. [P] vfx.m dynamite (fallout of [S] dynamite-stick 345314d, 284) — blocker 4: DYNAMITE_LONG .26 -> ~.5, DYNAMITE_STICK_WIDE .05 -> ~.09 — NEXT: the bundle at the dynamite thrower's hip in lineup_wild_west and in flight in throw_bombs_flight
6. [S] vfx.n leaf-whirl — blocker 1: red-orange leaf-whirl missile in place of the bolt — ref units/tribal.bone_mage.png — ours throw_casters_flight
7. [S] vfx.p flying-sword — blocker 1: glowing white blade missile, point first — ref units/spooky.swordcaster.jpg — ours throw_casters_flight
8. [S] vfx.k stoner-boulder-flight — blocker 2: the "stone" projectile reuses the held boulder mesh and size — ref units/tribal.stoner.jpg — ours throw_bombs_flight

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- head-snap-under-crown [attempts: 1] — 283: triggerBuckle from staggerFromBlow (thighs fwd 1.0, knees 1.9, hip sink .4 of hipRest, board arm sags .55, neck roll .45; full .18 s of .5 s) as last overlay after flinch, stagger moved before reposeNow; critic saw every helm under the club level, boards up. Cause found 284: the pose was there but hidden behind his own board / his file (see Notes)
- overhead-blow [attempts: 1, approved on 2nd at 280] — 279: 278 base + lunge legs + fist aimed at the grip end of a 35 deg line down onto the crown + flinch .85/.9; zoom probe read as overhead blows with hoplites thrown back, but in the capture the fist only reaches the striker's own head height so the club rises to the crests; no visible recoil. Critic: _aimBlow values are now spent
- [R] aimed-blow-final-layer [attempts: 1] — 278: 277's _aimBlow + flinch moved after every stance layer (held full .12 s) + hold .6 s + no reach gate; zoom probe showed clubs on helmets/faces with hoplites snapping back, but in the capture the club arrives level into the face from a low hand on the board rim, no visible recoil; knights and rear clubs unchanged
- [R] target-aimed-blow [attempts: 1] — 277: pending-blow queue + _aimBlow (arm pointed from shoulder at foe headTop, club laid across crown, own blow clock, hold .45 s) + reposeNow flinch + contact hold; probe put club tips .2-.6 m from heads, but the critic saw clubs hip-high/upright on the shot frame, no hoplite recoil, knights level, rear clubs over own rank
- landed-blow-on-hit [attempts: 2] — 276: pending-blow queue landing damage at BLOW_LAND_E .3 of the drop + pressers hold the swing while closing; clubbers reached contact, but the fixed arc ends below/short of the head (board face, shins); no recoil on hoplites
- landed-blow-on-hit [attempts: 1, dropped] — 275: heavy_swing put at impact (or 0.7 through the drop) on the hit step + striker/struck re-posed via animator.update(0) after decisions; look shot: striking clubbers ~2 m off, clubs diagonal at hip/shoulder, front clubber cocked upright; no club on a red head

## Notes for next iteration (max 5 lines)
- 284 probe: the struck hoplite's pose survives to render (head .9-1.1 vs mates ~1.57, hipY .51 with board-off), but the folded torso/neck flinch drops his head behind his own board, and the _hit camera sees him behind the striker; side-on he hides behind his file when struck mid-line. hitLog entries now carry `head` (struck head world pos); press_clubbers_blow frames it from behind his rank (alpha .3).
- The capture's hit frame differs from an isolated probe run (+720 vs +640 ms, other man struck): probe inside capture via temp console.error in _landMeleeBlow / end of SimulationSystem.update, read from summary.json consoleErrors. Throws: THROWS_HELD_PROP keys on definition.weaponHint (dynamite keeps "bomb"); the missile clones the held prop (_buildHeldMissile).
- e's [R] spec should own the struck-man reaction (board-off, buckle, head back in WORLD blow direction, not torso-local x: hoplite torsos stand side-on) and the club-on-head contact together; the proceduralAnimation lean clamp (torso -= .8*root lean) still cancels root stagger pitch at the trunk.
- Every other criterion PASS (274-284). mapBuilder.ts is LF, LOG.md CRLF. Hand-built up-facing quads: indices (0,1,2),(0,2,3) or they cull. Unit PBR colours grey out in lineup shade: self-light (mf.get("cloth", c, { emissiveIntensity })).
- Melee hit path: _tryAttack applies damage at swing start unless a heavy blow is pending. No [P] on rows approved within 20 iterations, except fallout named by the critic. throw_bombs_release logs a 30 s renderWhenReady race timeout under swiftshader at times but the frame draws whole.
