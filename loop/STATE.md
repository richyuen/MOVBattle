# Loop state
Iteration: 283   Last re-audit: 281   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion; FAIL carries its closed blocker list and the count of approved [S] since the list was written)
battle-feel: a PASS b PASS c PASS d PASS (4/4)
unit-look: a PASS b PASS c PASS d PASS (4/4)
maps-light: a PASS b PASS c PASS d PASS (4/4)
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b PASS c PASS d PASS (4/4)
Tier 2 (fully scored at 198, re-audited 220-281):
battle-feel: e FAIL f PASS g PASS h PASS (3/4) (h cleared by [R] 065ba9e, 242)
- e FAIL (un-deferred by the user after 279; list from re-audit 280, blocker 1 narrowed by 8f62d4e, b8ca15a) [S since: 3 approved (280 overhead-blow, 281 stagger c8d9701, 282 crown b8ca15a), 1 rejected (283 head-snap-under-crown)] B: 1 the hoplite right under the landed club in press_clubbers_hit stays upright, no head snap or knee buckle (all helms under the club level, boards up at the rim); centre clubber holds his club straight up on the hit frame; blue clubbers lie/sit on their backs in _hit and _blow — press_clubbers_hit, press_clubbers_blow; 2 red clubbers 1-3 bodies behind their own front, clubs cocked forward over their own rank (2s/2150ms) or flat at hip (5s/9s); none comes down on a blue board or head — big_melee_2s, 2150ms, 5s, 9s; 3 red knights hold swords upright or level before the body; no blade raised over a shoulder, none meets a body — closeup_weapon_reads. Ref trailer_3_sheet_01 r2c3, r3c1.
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
- m dynamite_thrower [S since: 0] B: 1 missing: dynamite (holds/throws the bomb thrower's black fused ball; TABS red sticks, black bands, fuse, units/wild_west.dynamite_thrower.jpg); struck 2, 3 by e833fa3 (shared bomb prop: leaves past the level hand, hand empty in flight)
- n bone_mage [S since: 0] B: 1 missing: leaf whirl (a thin dark crossbow bolt from his waist, no leaves in throw_casters_flight; TABS a whirl of red-orange leaves, units/tribal.bone_mage.png); 2 no casting pose: staff never raised overhead
- o wizard [S since: 0] B: 1 missing: fireball (dark bolt from the hip, nothing glowing in throw_casters_flight; units/legacy.wizard.png); 2 staff chops down into the dirt like a club instead of thrust at the target
- p swordcaster [S since: 0] B: 1 missing: flying sword (the same dark bolt; TABS long glowing white blades, dark keyhole hilts, point first, units/spooky.swordcaster.jpg); 2 holds a short grey hand sword; TABS a dark lockbox chest at the belly, swords floating round him
Total tier 1 24/24; tier 2 23/24; tier 3 21/29.

## Focus (every gap this iteration)
BASE 860f0a8 (iter 283)
- [S] head-snap-under-crown (battle-feel.e blocker 1) — 301aea7 — REJECT (reverted bf38c22)
- [S] stoner-held-rock-release (vfx.k blocker 3) — 8cb65fc — APPROVE (struck k.3, narrowed k.4)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] head-snap-under-crown (301aea7) VERDICT: REJECT CRITERION: battle-feel.e FAIL (previous: FAIL)
- GAP: [S] stoner-held-rock-release (8cb65fc) VERDICT: APPROVE CRITERION: vfx.k FAIL (previous: FAIL); REGRESSIONS: none

## Ranked open gaps (max 8, tags and attempts in brackets; each clears a numbered blocker)
1. [S] battle-feel.e buckle-visible-on-hit [attempts: 1 as head-snap-under-crown] — blocker 1: buckle sink and head roll survive the hit-step pose write on the hoplite under the club, his helm visibly below his file-mates — ref trailer_3_sheet_01 r2c3 — ours press_clubbers_hit
2. [S] battle-feel.e clubber-reaches-enemy — blocker 2: second-rank red clubbers step through to the front and bring the club down on a blue board or head — ref r2c3 — ours big_melee_2s
3. [S] vfx.k stoner-boulder — blocker 1: chest-sized faceted boulder prop, two-hand waist grip pose — ref units/tribal.stoner.jpg — ours throw_bombs_release
4. [S] vfx.k stoner-boulder-flight — blocker 2: the "stone" projectile reuses the held boulder mesh and size — ref units/tribal.stoner.jpg — ours throw_bombs_flight
5. [S] vfx.m dynamite-stick — blocker 1: red stick, black bands, fuse, held and thrown — ref units/wild_west.dynamite_thrower.jpg — ours throw_bombs_release
6. [S] vfx.j harpoon-gun — blocker 1: chunky blue-grey harpoon gun at the hip, harpoon fired from its muzzle — ref units/pirate.harpooner.jpg — ours throw_spears_release
7. [S] vfx.n leaf-whirl — blocker 1: red-orange leaf-whirl missile in place of the bolt — ref units/tribal.bone_mage.png — ours throw_casters_flight
8. [S] vfx.o wizard-fireball — blocker 1: glowing fireball missile from the staff — ref units/legacy.wizard.png — ours throw_casters_flight

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- head-snap-under-crown [attempts: 1] — 283: triggerBuckle from staggerFromBlow (thighs fwd 1.0, knees 1.9, hip sink .4 of hipRest, board arm sags .55, neck roll .45; full .18 s of .5 s) as last overlay after flinch, stagger moved before reposeNow; look shot read a slight sag, but the critic saw every helm under the club level, boards up. Probe (pre-change): the struck hoplite's torsoX -.55, neckX -1.17 already set on the land step yet reads upright: find what hides it (wrong man in frame? root/hip rewritten?) before adding more pose
- overhead-blow [attempts: 1, approved on 2nd at 280] — 279: 278 base + lunge legs + fist aimed at the grip end of a 35 deg line down onto the crown + flinch .85/.9; zoom probe read as overhead blows with hoplites thrown back, but in the capture the fist only reaches the striker's own head height so the club rises to the crests; no visible recoil. Critic: _aimBlow values are now spent
- [R] aimed-blow-final-layer [attempts: 1] — 278: 277's _aimBlow + flinch moved after every stance layer (held full .12 s) + hold .6 s + no reach gate; zoom probe showed clubs on helmets/faces with hoplites snapping back, but in the capture the club arrives level into the face from a low hand on the board rim, no visible recoil; knights and rear clubs unchanged
- [R] target-aimed-blow [attempts: 1] — 277: pending-blow queue + _aimBlow (arm pointed from shoulder at foe headTop, club laid across crown, own blow clock, hold .45 s) + reposeNow flinch + contact hold; probe put club tips .2-.6 m from heads, but the critic saw clubs hip-high/upright on the shot frame, no hoplite recoil, knights level, rear clubs over own rank
- landed-blow-on-hit [attempts: 2] — 276: pending-blow queue landing damage at BLOW_LAND_E .3 of the drop + pressers hold the swing while closing; clubbers reached contact, but the fixed arc ends below/short of the head (board face, shins); no recoil on hoplites
- landed-blow-on-hit [attempts: 1, dropped] — 275: heavy_swing put at impact (or 0.7 through the drop) on the hit step + striker/struck re-posed via animator.update(0) after decisions; look shot: striking clubbers ~2 m off, clubs diagonal at hip/shoulder, front clubber cocked upright; no club on a red head

## Notes for next iteration (max 5 lines)
- 282 crown (b8ca15a): _aimBlow aims at _crownOf(headTop) and lifts hip.position.y (leap up to BLOW_LEAP .5 stand); staggerFromBlow fires inside _landMeleeBlow for every heavy_swing attacker. Struck-man pose: flinch already logs torsoX -.55 neckX -1.17 at the land, but proceduralAnimation lean clamp (torso -= .8*root lean) cancels the stagger's root pitch at the trunk. Traps: sim steps without rendering (force-compute chains); moveTo/stopMoving cut the attack anim.
- Throws: THROWS_HELD_PROP {javelin, bomb, stone} defers spawn to throwReleasesIn() (THROW_LET_GO .5 of the swing); heldThrowProp skips metadata.visualKey glows; the missile is a clone of the held prop (_buildHeldMissile), so a new held mesh flies as-is. Casters have no projectileHint and fire ranged.heavy's bolt.
- capture throw pairs (259bbec) shoot when the missile count has risen once per thrower; throw_bombs_release logs a 30 s renderWhenReady race timeout under swiftshader (282-283) but the frame draws whole. press_clubbers_hit target is the first clubber hitLog entry; camera frames impactOrigin, which may not be the man under the club.
- Every other criterion PASS (274-283). mapBuilder.ts is LF, LOG.md CRLF. Hand-built up-facing quads: indices (0,1,2),(0,2,3) or they cull. Unit PBR colours grey out in lineup shade: self-light (mf.get("cloth", c, { emissiveIntensity })).
- Probe recipe: temp console.error lines show up in summary.json consoleErrors of `capture.mjs --only <shot>`; delete them after. Melee hit path: _tryAttack applies damage at swing start unless a heavy blow is pending. No [P] on rows approved within 20 iterations, except fallout named by the critic.
