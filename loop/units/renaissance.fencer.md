# renaissance.fencer
Status: open   Audited: 368 (re)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 368)
 1. cavalier hat in unit_renaissance.fencer_idle: pale sky-blue brim under a separate ribbed dome — TABS: dark team-felt broad brim to the brow, one piece with the crown, big team plume (ref: renaissance.fencer.red.png, .png). Idle is shot from behind: re-aim first (evidence commit)
 2. doublet shoulders in unit_renaissance.fencer_idle: plain — TABS: tan-banded shoulder wings over team sleeves (ref: renaissance.fencer.red.png)
b PASS (368)
c FAIL (1 since 368; 1 [S] rejected)
 2. missing: Fencer Dodge (hop or sidestep from melee blows; card Abilities)
d PASS (cost 150, hp 0.82x vs 0.88x, dmg 0.67x, cd 1.00x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] c Fencer Dodge — blocker 2: when a melee foe's swing begins within reach he hops or sidesteps out of its arc on a cooldown, logged "dodge"; needs a scene where the squire swings first — ref: card Abilities — ours: unit_renaissance.fencer_ability_after.png
2. [S] a cavalier hat — blocker 1: dark team-felt broad brim, one piece with the crown, big team plume (idle re-aim first) — ref: renaissance.fencer.red.png — ours: unit_renaissance.fencer_idle.png
3. [S] a doublet shoulders — blocker 2: tan-banded shoulder wings over team sleeves — ref: .red.png — ours: unit_renaissance.fencer_idle.png
## Attempts (iter | gap | criterion | verdict)
327-337 | hat, back slab, lunge, cup hilt, point-first, lunge legs, doublet, hair, boots, thigh rolls [S] | a,b,c | approved
369 | step back: leap 0.12 s after the land (HOP_BACK) [S] (fbd58e7; a285bea reverted) | c | rejected-kept
370 | step back as part of the thrust: committed ground slide from _landMeleeBlow, 1.8 m in .16 s (FENCER_RECOVER) [S] (e2f2190) | c | approved
## Rejected (last 4)
- step back [S] [1] — 369: HOP_BACK leap fired 317 ms after the hit — squire chased him and the gap closed (partly a capture replay artefact, fixed by f9da668)
## Notes (max 3 lines)
- _lungeLegs (after _pointRapier) is the last leg layer; dressFencer (FENCER_DRESS, FENCER_BOOTS, FENCER_ROLL panes).
- 370: FENCER_RECOVER (_startRecover, _slideRecovers) replaced his HOP_BACK row. Critic minor: rigid slide, feet frozen in the lunge (TABS a quick step).
- Two of seven replays used to diverge (runtimeId hash); capture now resets the id counter (f9da668).
