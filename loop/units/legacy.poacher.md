# legacy.poacher
Status: open   Audited: 457, 462 (RE-AUDIT lineup)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4 (6 on a), and the count of approved [S] since the list was written)
a FAIL (5 since 457)
 4. knees in unit_legacy.poacher_idle, bare team legs — TABS: tan knee caps (ref: legacy.poacher.blue.png)
b FAIL (2 since 457)
 1. bow in unit_legacy.poacher_idle, a thin dark curved stick held low at the hip — TABS: a chunky tan short bow with wrapped grips held across the chest (ref: legacy.poacher.red.png)
c FAIL (1 since 457)
 1. arrow origin in unit_legacy.poacher_release, the shaft leaves from the hat at head height while the bow hangs at the hip — TABS: the arrow leaves the drawn bow (ref: card Weapons Poacher Bow)
 2. projectile in unit_legacy.poacher_release, a long dark javelin-length shaft — TABS: a Small Arrow (ref: card Weapons)
d PASS (cost 120, hp 0.55x, dmg 0.72x, cd 1.10x; 457 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] legacy.poacher.b bow in the fist — blocker 1: seat POACHER_BOW in the weapon fist at its wrap, slanted across the chest — ref: legacy.poacher.red.png — ours: _idle
2. [S] legacy.poacher.c draw — blocker 1: hold the bow drawn at the shoulder from windup through release so HAND_LAUNCH fires from the drawn bow — ref: card Weapons — ours: _release
3. [S] legacy.poacher.c small arrow — blocker 2: a short "small_arrow" projectile shape — ref: card Weapons — ours: _release
4. [S] legacy.poacher.a knees — blocker 4: tan faceted knee caps over each knee joint — ref: legacy.poacher.blue.png — ours: _idle
## Attempts (iter | gap | criterion | verdict)
457-461 | POACHER_HAT, POACHER_HAIR, POACHER_COAT, POACHER_BELT, POACHER_BOOTS | a | approved (struck 1, 2, 3, 5, 6)
462 | quiver_back special (8e47a5ac) | b | approved (struck 2)
462 | HAND_LAUNCH arrow from the bow fist (2f129417) | c | approved (none struck: bow not drawn at release)
463 | POACHER_BOW chunky stave, rope wraps, iceBowCarry (7e2eb586) | b | approved (none struck: strapped across him, no fist on it)
## Rejected (last 4)
## Notes (max 3 lines)
- 459 critic (minor): the leather reads very dark brown (TABS tan-orange); the collar reads as beads, not shaggy fur.
- 463 critic: b.1 stands only because no fist holds the bow (iceBowCarry carries it); the stave reads near-white, wants a darker tan (palette).
- c.1 leaves at the hip fist; _flight shows the bow drawn at the shoulder 150 ms later: draw earlier, not a new origin.
