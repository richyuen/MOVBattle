# spooky.skeleton_archer
Status: open   Audited: 434   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 434)
 1. headgear in unit_spooky.skeleton_archer_idle is a round blue skullcap — TABS: team hood around the whole skull with a short shoulder capelet (ref: spooky.skeleton_archer.red.png, card Appearance "rugged Archer hood")
 2. blue skirt block in unit_spooky.skeleton_archer_idle from the ribs to mid-thigh — TABS: no skirt; bare pelvis with a belt and small team tassels (ref: spooky.skeleton_archer.blue.png)
 3. bone colour in unit_spooky.skeleton_archer_idle is grey — TABS: cream bone (ref: spooky.skeleton_archer.red.png)
 4. limbs in unit_spooky.skeleton_archer_idle bare grey to grey boxy feet — TABS: team bracers on the forearms and brown boots on the feet (ref: spooky.skeleton_archer.red.png)
b FAIL (0 since 434)
 1. bow in unit_spooky.skeleton_archer_idle is a thin brown curved stick — TABS: a big straight femur-shaped bone bow with knob ends and team wraps, as long as the torso and legs (ref: spooky.skeleton_archer.jpg, card Appearance "bow made out of bones")
c PASS (435: Fire Arrow flies burning; the struck man is set alight, flames tick and spread)
d PASS (cost 180, hp 0.65x, dmg 0.11x, cd 2.50x; 435 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] b bone bow - blocker 1: big straight femur-shaped bow with knob ends and team wraps - ref: spooky.skeleton_archer.jpg - ours: unit_spooky.skeleton_archer_idle (critic 435)
2. [S] a hood - blocker 1: team hood around the skull with a short shoulder capelet - ref: spooky.skeleton_archer.red.png - ours: unit_spooky.skeleton_archer_idle (critic 435)
## Attempts (iter | gap | criterion | verdict)
434 | FIRE_ARROW flame tongues on the arrow head (9c6221b2) | c | approved (struck 1)
435 | BURN status: flames on trunk/head/arms, tick + spread (d50527c4) | c | approved (struck 2; c PASS)
## Rejected (last 4)
## Notes (max 3 lines)
- 435 critic: ability pair framed on the archer, not the burning man (evidence commit to frame status:fire on the struck man, like candlehead knockup); tongues read thin yellow.
- Burn: runtimeUnit applyBurn/BURN, simulationSystem _stepBurning/BURN_STATUS, projectileSystem p.fireArrow at impact.
