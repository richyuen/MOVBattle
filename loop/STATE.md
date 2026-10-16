# Loop state
Iteration: 281   Last re-audit: 281   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion; FAIL carries its closed blocker list and the count of approved [S] since the list was written)
battle-feel: a PASS b PASS c PASS d PASS (4/4)
unit-look: a PASS b PASS c PASS d PASS (4/4)
maps-light: a PASS b PASS c PASS d PASS (4/4)
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b PASS c PASS d PASS (4/4)
Tier 2 (fully scored at 198, re-audited 220-281):
battle-feel: e FAIL f PASS g PASS h PASS (3/4) (h cleared by [R] 065ba9e, 242)
- e FAIL (un-deferred by the user after 279; list from re-audit 280, blocker 1 narrowed by 8f62d4e) [S since: 2 (280 overhead-blow, 281 stagger c8d9701 approved: one hoplite in press_clubbers_hit now rocks back, the one under the club in _blow still upright)] B: 1 on the registered hit frame the club falls from a straight-up arm but lands on the hoplite's face/neck, not his crown; one clubber down on his back; hoplites upright, no readable recoil or head snap — press_clubbers_hit, press_clubbers_blow, press_clubbers_side; 2 red clubbers 1-3 bodies behind their own front, clubs cocked forward over their own rank (2s/2150ms) or flat at hip (5s/9s); none comes down on a blue board or head — big_melee_2s, 2150ms, 5s, 9s; 3 red knights hold swords upright or level before the body; no blade raised over a shoulder, none meets a body — closeup_weapon_reads. Ref trailer_3_sheet_01 r2c3, r3c1.
unit-look: e PASS f PASS g PASS h PASS (4/4) (h cleared by 810f6c6, 240)
maps-light: e PASS f PASS g PASS h PASS (4/4)
ui-flow: e PASS f PASS g PASS h PASS (4/4)
camera: e PASS f PASS g PASS h PASS (4/4)
vfx: e PASS f PASS g PASS h PASS (4/4)
Tier 3 (scored 240, re-audited 245-281; ours lineup_<faction> / biome_<map> / throw_<group>; refs factions/<f>, units/<f>.<id>, maps/<biome>):
unit-look tier 3: i-v all PASS (14/14) (cleared 242-269; polish notes dropped at 281, see git history of STATE)
maps-light tier 3: i-o all PASS (7/7) (cleared 246-273)
vfx tier 3: i FAIL j FAIL k FAIL l FAIL m FAIL n FAIL o FAIL p FAIL (0/8) (first scored 281)
- i spear_thrower [S since: 1 (281 held-prop-release 7bff8d9)] B: 1 (narrowed by 7bff8d9) the spear leaves at the let-go but with the throwing arm straight up over his head, not out ahead at shoulder height (throw_spears_release; ref trailer_3_sheet_01 r3c3); struck 2, 3 by 7bff8d9; 4 held javelin a man-height pole, small blue tip; TABS a short javelin, big dark leaf head (units/tribal.spear_thrower.jpg)
- j harpooner [S since: 0] B: 1 missing: harpoon gun (holds a long spear level; TABS chunky blue-grey gun at the hip, units/pirate.harpooner.jpg); 2 flies the spear thrower's thin spear; white line only on release frame, ref a dark rope muzzle-to-target; 3 held spear never leaves (throw_spears_flight); 4 spawn at head height at swing start, not from a muzzle
- k stoner [S since: 0] B: 1 holds a head-sized grey pebble in one raised hand; TABS a chest-sized faceted boulder in both hands at the waist (units/tribal.stoner.jpg); 2 flies a smooth blue team sphere, not the grey rock (throw_bombs_flight); 3 rock still in hand in throw_bombs_flight; 4 release at swing start, arm cocked behind head, not the end of a two-hand heave
- l bomb_thrower [S since: 0] B: 1 a small fused bomb spawns at his head while the held bomb stays at his hip (throw_bombs_release); 2 held bomb still in hand in throw_bombs_flight; 3 held bomb torso-sized, flying one half that; TABS fist-sized, one per hand, short fuse (units/pirate.bomb_thrower.jpg)
- m dynamite_thrower [S since: 0] B: 1 missing: dynamite (holds/throws the bomb thrower's black fused ball; TABS red sticks, black bands, fuse, units/wild_west.dynamite_thrower.jpg); 2 missile spawns under the hat brim at swing start, bomb stays at hip (throw_bombs_release); 3 bomb still in hand in throw_bombs_flight
- n bone_mage [S since: 0] B: 1 missing: leaf whirl (a thin dark crossbow bolt from his waist, no leaves in throw_casters_flight; TABS a whirl of red-orange leaves, units/tribal.bone_mage.png); 2 no casting pose: staff never raised overhead
- o wizard [S since: 0] B: 1 missing: fireball (dark bolt from the hip, nothing glowing in throw_casters_flight; units/legacy.wizard.png); 2 staff chops down into the dirt like a club instead of thrust at the target
- p swordcaster [S since: 0] B: 1 missing: flying sword (the same dark bolt; TABS long glowing white blades, dark keyhole hilts, point first, units/spooky.swordcaster.jpg); 2 holds a short grey hand sword; TABS a dark lockbox chest at the belly, swords floating round him
Total tier 1 24/24; tier 2 23/24; tier 3 21/29.

## Focus (every gap this iteration)
BASE 88931c6 (iter 281; re-audit: vfx tier 3 first scored 0/8, no flips)
- evidence 259bbec: throw pairs shot once every thrower in the group has let go
- [S] overhead-blow-stagger (battle-feel.e blocker 1) — c8d9701 — APPROVE (blocker 1 kept)
- [S] held-prop-release (vfx.i blocker 1) — 7bff8d9 — APPROVE (struck 2, 3; 1 narrowed)

## Last verdicts (one line per gap, verbatim critic header)
- RE-AUDIT 281: no flips; REGRESSIONS: none; "vfx tier 3: i FAIL j FAIL k FAIL l FAIL m FAIL n FAIL o FAIL p FAIL (0/8)"
- GAP: [S] overhead-blow-stagger (c8d9701) VERDICT: APPROVE CRITERION: battle-feel.e FAIL (previous: FAIL); REGRESSIONS: none
- GAP: [S] held-prop-release (7bff8d9) VERDICT: APPROVE CRITERION: vfx.i FAIL (previous: FAIL); REGRESSIONS: none

## Ranked open gaps (max 8, tags and attempts in brackets; each clears a numbered blocker)
1. [S] battle-feel.e overhead-blow-crown — blocker 1: aim the land point at the struck man's crown mark (head top + helm) and keep his stagger visible in _blow — ref trailer_3_sheet_01 r2c3 — ours press_clubbers_blow
2. [S] battle-feel.e rear-clubber-reach — blocker 2: a rear-rank clubber steps into the nearest gap or swings overhead past his own man at the nearest blue board within one rank — ref r2c3 — ours big_melee_2s
3. [S] battle-feel.e sword-shoulder-cock — blocker 3: knight swing winds the blade back over the shoulder, then cuts down onto the target's head/board mark — ref r3c1 — ours closeup_weapon_reads
4. [P] vfx.i throw-let-go-late — blocker 1: THROW_LET_GO .38 -> .75, fallout of [S] held-prop-release (281); NEXT throw_spears_release: arm out ahead at shoulder height as the spear leaves — ref r3c3
5. [S] vfx.i short-leaf-javelin — blocker 4: propBuilder javelin a short shaft (~half a man) with a big dark faceted leaf head; flies the same via the held copy — ref units/tribal.spear_thrower.jpg — ours throw_spears_flight
6. [S] vfx.l held-bomb-release — blocker 1: add bomb to THROWS_HELD_PROP so the held bomb flies from the fist at the let-go, hand empty — ref units/pirate.bomb_thrower.jpg — ours throw_bombs_release
7. [S] vfx.j harpoon-gun — blocker 1: chunky blue-grey harpoon gun at the hip firing a harpoon trailing a dark rope from the muzzle — ref units/pirate.harpooner.jpg — ours throw_spears_release
8. [S] vfx.k two-hand-boulder — blocker 1: chest-sized faceted grey boulder in both hands at the waist, heaved two-handed — ref units/tribal.stoner.jpg — ours throw_bombs_release

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- overhead-blow [attempts: 1, approved on 2nd at 280] — 279: 278 base + lunge legs + fist aimed at the grip end of a 35 deg line down onto the crown + flinch .85/.9; zoom probe read as overhead blows with hoplites thrown back, but in the capture the fist only reaches the striker's own head height so the club rises to the crests; no visible recoil. Critic: _aimBlow values are now spent
- [R] aimed-blow-final-layer [attempts: 1] — 278: 277's _aimBlow + flinch moved after every stance layer (held full .12 s) + hold .6 s + no reach gate; zoom probe showed clubs on helmets/faces with hoplites snapping back, but in the capture the club arrives level into the face from a low hand on the board rim, no visible recoil; knights and rear clubs unchanged
- [R] target-aimed-blow [attempts: 1] — 277: pending-blow queue + _aimBlow (arm pointed from shoulder at foe headTop, club laid across crown, own blow clock, hold .45 s) + reposeNow flinch + contact hold; probe put club tips .2-.6 m from heads, but the critic saw clubs hip-high/upright on the shot frame, no hoplite recoil, knights level, rear clubs over own rank
- landed-blow-on-hit [attempts: 2] — 276: pending-blow queue landing damage at BLOW_LAND_E .3 of the drop + pressers hold the swing while closing; clubbers reached contact, but the fixed arc ends below/short of the head (board face, shins); no recoil on hoplites
- landed-blow-on-hit [attempts: 1, dropped] — 275: heavy_swing put at impact (or 0.7 through the drop) on the hit step + striker/struck re-posed via animator.update(0) after decisions; look shot: striking clubbers ~2 m off, clubs diagonal at hip/shoulder, front clubber cocked upright; no club on a red head

## Notes for next iteration (max 5 lines)
- 281 stagger (c8d9701): RuntimeUnit.staggerFromBlow, called from _landPendingBlows only (heavy blows); pitch put on root directly on the land step + term outside the crowd lean clamp. 280 overhead-blow: pending-blow queue + _aimBlow (arm straight up in WORLD, weapon laid down onto crown if below fist, else BLOW_DROP under it) + flinch as last pose layer. Traps: club prop origin near grip; sim steps without rendering so world matrices are stale (force-compute chains); moveTo/stopMoving cut the attack anim. Clubbers small (shoulder .9 m) vs hoplite heads 1.55 m.
- 281 held-prop-release (7bff8d9): THROWS_HELD_PROP (javelin only) defers the spawn to animator.throwReleasesIn() (THROW_LET_GO into the forward swing); _launchPendingThrows clones animator.heldThrowProp() via spawnProjectile({heldProp}) (projectileSystem._buildHeldMissile, +y laid on +z, streak for spear) and letGoOfThrow hides it until the next triggerAttack. _animateThrow is now an overhand throw for every throw-family unit. Extending to bomb/stone = add the hint to the set. Casters (bone_mage/wizard/swordcaster) have no projectileHint and fire ranged.heavy's bolt.
- capture throw pairs (259bbec) shoot when the missile count has risen once per thrower (spears 2, bombs 3, casters 3): spear thrower now lets go at +368 ms, after the harpooner.
- Every other criterion PASS (274-281). mapBuilder.ts is LF, LOG.md CRLF. Hand-built up-facing quads: indices (0,1,2),(0,2,3) or they cull. Unit PBR colours grey out in lineup shade: self-light (mf.get("cloth", c, { emissiveIntensity })).
- Melee hit path: _tryAttack applies damage at swing start unless a heavy blow is pending; decisions run on retargetInterval after unit.update. Probe recipe: temp console.log + playwright on vite preview (port 4187, build --outDir dist-probe, delete after) running gallery_press_clubbers; window.game.frameCamera zooms. No [P] on rows approved within 20 iterations, except fallout named by the critic.
