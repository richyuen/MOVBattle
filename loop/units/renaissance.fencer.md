# renaissance.fencer
Status: open   Audited: 368 (re)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 368)
 1. cavalier hat in unit_renaissance.fencer_idle: pale sky-blue brim under a separate ribbed dome — TABS: dark team-felt broad brim to the brow, one piece with the crown, big team plume (ref: renaissance.fencer.red.png, .png). Idle is shot from behind: re-aim first (evidence commit)
 2. doublet shoulders in unit_renaissance.fencer_idle: plain — TABS: tan-banded shoulder wings over team sleeves (ref: renaissance.fencer.red.png)
b PASS (368)
c FAIL (0 since 368; 1 [S] rejected)
 1. missing: the step back after the thrust; in unit_renaissance.fencer_ability_after (backstep logged 1467 ms) he is bent back in on the squire, the gap closed (card Characteristics)
 2. missing: Fencer Dodge (hop or sidestep from melee blows; card Abilities)
d PASS (cost 150, hp 0.82x vs 0.88x, dmg 0.67x, cd 1.00x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] c step back — blocker 1: a committed ground slide >= 1.5 m within 150 ms, fired on the frame the thrust lands, that the foe's pursuit cannot cancel; the gap must grow from _ability to _ability_after — ref: renaissance.fencer.png — ours: unit_renaissance.fencer_ability_after.png
2. [S] a cavalier hat — blocker 1: dark team-felt broad brim, one piece with the crown, big team plume (idle re-aim first) — ref: renaissance.fencer.red.png — ours: unit_renaissance.fencer_idle.png
## Attempts (iter | gap | criterion | verdict)
327-337 | hat, back slab, lunge, cup hilt, point-first, lunge legs, doublet, hair, boots, thigh rolls [S] | a,b,c | approved
369 | step back: leap off the man 0.12 s after the land (HOP_BACK) [S] (fbd58e7; follow-up a285bea reverted) | c | rejected-kept
## Rejected (last 4)
- step back [S] [1] — 369: HOP_BACK leap, fired 317 ms after the hit — in the ability pair the squire chases him and the gap closes; reads as a separate event, not thrust-then-recover
## Notes (max 3 lines)
- _lungeLegs (after _pointRapier) is the last leg layer; dressFencer (FENCER_DRESS, FENCER_BOOTS, FENCER_ROLL panes).
- 369: HOP_BACK fencer entry still live (rejected-kept: its revert conflicts with the halberd's approved entry). Decisions run ~every 0.25 s, so afterLand .12 fires late: trigger it from _landMeleeBlow itself.
- Probe (scratch probe.mjs pattern): the leap carries him 1.8 m but the squire walks after him at the same pace; hold the foe or slide.
