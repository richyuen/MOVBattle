# tribal.protector
Status: done   Audited: 315   Done: 321
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (321)
b PASS (318)
c PASS (315)
d PASS (stats 317: cost 80=80, hp -8%, dmg +2%, cd +1%)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
## Attempts (iter | gap | criterion | verdict)
317 | no back spear (3fd57a5) | b | approved
318 | moss chunks (af37ab3) | b | approved
319 | skull helmet (e53ba02) | a | approved
320 | [P] domed cranium (12e7843) | a | approved
320 | one-shoulder garment (b077ecf) | a | approved
321 | critter-skull necklace (3adbe16 + aec9799) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 316 slab: root "slabshield", SLAB_WIDE 0.34, SLAB_EYE 0.12; 318 SLAB_MOSS. 319/320: hat bone_mask; TRIBAL_TUNIC_UNITS (dressTribalTunic).
- 321: dressTribalNecklace "critter_skulls" (tribalDress.ts, CRITTER_NECKLACE) replaces furCollar. Critic 321 (minor): the rope strap hardly shows.
- Critic 320 (minor): dome ~1.45 heads wide in windup; tunic points sit at hip height, not on the hem.
