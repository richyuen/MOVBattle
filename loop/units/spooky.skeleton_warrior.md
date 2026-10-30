# spooky.skeleton_warrior
Status: open   Audited: 434   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 434)
 1. helmet in unit_spooky.skeleton_warrior_idle is a small round skullcap on top of the skull — TABS: Roman-style team helmet whose cheek guards hang down both sides of the skull to the jaw (ref: spooky.skeleton_warrior.red.png, card Appearance "Roman-style helmet")
 2. bone colour in unit_spooky.skeleton_warrior_idle is cool grey — TABS: warm cream/tan bone (ref: spooky.skeleton_warrior.red.png)
 3. shorts in unit_spooky.skeleton_warrior_idle are a straight blue skirt block hung from the ribs — TABS: baggy team shorts to the knee with a brown belt at the pelvis and ragged hems around each leg (ref: spooky.skeleton_warrior.red.png, card Appearance "ragged shorts")
 4. greaves in unit_spooky.skeleton_warrior_idle are grey boot boxes on the feet — TABS: team-coloured greaves over knee and shin, bare bone feet below (ref: spooky.skeleton_warrior.blue.png)
b PASS (436: short grey Stiffy Sword, studded team shield)
c PASS (435: Stiffy Fear, purple skull over the struck man who runs off)
d PASS (cost 80, hp 0.62x, dmg 1.00x, cd 1.00x; 436 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a Roman helmet - blocker 1: team helmet with cheek guards hanging to the jaw - ref: spooky.skeleton_warrior.red.png - ours: unit_spooky.skeleton_warrior_idle (critic 436)
2. [S] a shorts - blocker 3: baggy team shorts to the knee, brown belt, ragged hems - ref: spooky.skeleton_warrior.red.png - ours: unit_spooky.skeleton_warrior_idle (critic 436)
## Attempts (iter | gap | criterion | verdict)
434 | STIFFY_SHIELD studded team board on the off arm (d65f38af) | b | approved (struck 1)
435 | STIFFY_FEAR purple skull + flee (c989b05a) | c | approved (struck 1; c PASS)
436 | STIFFY_SWORD short grey leaf blade, dark bar guard (63a08a9f) | b | approved (struck 2; b PASS)
## Rejected (last 4)
## Notes (max 3 lines)
- 436 critic: sword a little longer than the forearm, leaf swell not visible. Sword: propBuilder buildLeafSword/STIFFY_SWORD (weaponVariant stiffy_sword).
- Fear: runtimeUnit applyFear/FEAR_SKULL, simulationSystem STIFFY_FEAR (every 2nd blow) + flee in _processUnitDecision.
