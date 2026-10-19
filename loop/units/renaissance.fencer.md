# renaissance.fencer
Status: open   Audited: 368 (re)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 368)
 1. cavalier hat in unit_renaissance.fencer_idle: pale sky-blue brim under a separate ribbed dome — TABS: dark team-felt broad brim to the brow, one piece with the crown, big team plume (ref: renaissance.fencer.red.png, .png). Idle is shot from behind: re-aim first (evidence commit)
 2. doublet shoulders in unit_renaissance.fencer_idle: plain — TABS: tan-banded shoulder wings over team sleeves (ref: renaissance.fencer.red.png)
b PASS (368)
c FAIL (0 since 368)
 1. missing: the step back after the thrust; in unit_renaissance.fencer_flight he stays bent in on the knight (card Characteristics)
 2. missing: Fencer Dodge (hop or sidestep from melee blows; card Abilities)
d PASS (cost 150, hp 0.82x vs 0.88x, dmg 0.67x, cd 1.00x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] c step back — blocker 1: after the lunge lands he recovers and steps back out of reach, facing the foe — ref: card Characteristics, renaissance.fencer.png — ours: unit_renaissance.fencer_flight.png
2. [S] a cavalier hat — blocker 1: dark team-felt broad brim, one piece with the crown, big team plume (idle re-aim first) — ref: renaissance.fencer.red.png — ours: unit_renaissance.fencer_idle.png
## Attempts (iter | gap | criterion | verdict)
327 | cavalier hat [S] (fbe32ce + 0acead3) | a | approved
328 | no back slab [S] (68ad77a) | b | approved
330 | lunge [S] (841edec + f287302 + fa4c27d) | c | approved
330 | cup hilt [S] (d255f45) | b | approved
331 | point-first rapier [S] (d2b3a7b) | c | approved
333 | lunge legs [S] (90d850a) | c | approved
334 | doublet, waist tabs, shoulder bands, paned breeches [S] (c58861e) | a | approved
335 | dark hair and curled moustache [S] (370f635) | a | approved
336 | brown cuffed knee boots [S] (0267ef9) | a | approved
337 | paned thigh rolls [S] (d8407ce + 2e54e8c) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- _lungeLegs (after _pointRapier) is the last leg layer; _pointRapier stands the rapier point-first.
- dressFencer (FENCER_DRESS, FENCER_BOOTS): panes are flattened cylinders round each thigh on a team core; getCloth cream greys (needs glow).
- dressFencer thigh rolls: FENCER_ROLL lathe pane slices, pushed out over the hips by their overlap. Critic 337 nit: rolls stand a bit wide of the hips.
