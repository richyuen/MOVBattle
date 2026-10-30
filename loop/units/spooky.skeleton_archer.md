# spooky.skeleton_archer
Status: open   Audited: 434   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 434)
 1. headgear in unit_spooky.skeleton_archer_idle is a round blue skullcap — TABS: team hood around the whole skull with a short shoulder capelet (ref: spooky.skeleton_archer.red.png, card Appearance "rugged Archer hood")
 2. blue skirt block in unit_spooky.skeleton_archer_idle from the ribs to mid-thigh — TABS: no skirt; bare pelvis with a belt and small team tassels (ref: spooky.skeleton_archer.blue.png)
 3. bone colour in unit_spooky.skeleton_archer_idle is grey — TABS: cream bone (ref: spooky.skeleton_archer.red.png)
 4. limbs in unit_spooky.skeleton_archer_idle bare grey to grey boxy feet — TABS: team bracers on the forearms and brown boots on the feet (ref: spooky.skeleton_archer.red.png)
b PASS (436: long cream bone bow, knob ends, team wraps)
c PASS (435: Fire Arrow flies burning; the struck man is set alight, flames tick and spread)
d PASS (cost 180, hp 0.65x, dmg 0.11x, cd 2.50x; 436 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a hood - blocker 1: team hood round the skull with a short shoulder capelet - ref: spooky.skeleton_archer.red.png - ours: unit_spooky.skeleton_archer_idle (critic 436)
2. [S] a skirt - blocker 2: remove the skirt block; bare pelvis, belt, small team tassels - ref: spooky.skeleton_archer.blue.png - ours: unit_spooky.skeleton_archer_idle (critic 436)
## Attempts (iter | gap | criterion | verdict)
434 | FIRE_ARROW flame tongues on the arrow head (9c6221b2) | c | approved (struck 1)
435 | BURN status: flames on trunk/head/arms, tick + spread (d50527c4) | c | approved (struck 2; c PASS)
436 | BONE_BOW cream femur, knob ends, team wraps, upright carry (b5fd9a36) | b | approved (struck 1; b PASS)
## Rejected (last 4)
## Notes (max 3 lines)
- Evidence 436 (29e883f3): the ability pair frames the burning struck man (status:fire). 436 critic: the bow slants across his face, TABS upright at his side.
- Burn: runtimeUnit applyBurn/BURN, simulationSystem _stepBurning/BURN_STATUS. Bow: propBuilder buildBoneBow/BONE_BOW (weaponVariant bone_bow).
