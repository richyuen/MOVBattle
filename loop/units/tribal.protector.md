# tribal.protector
Status: open   Audited: 360   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 360)
 1. helmet in unit_tribal.protector_idle, lineup_tribal: a smooth round white mushroom cap — TABS: a tan animal skull over the top half of the head, eye sockets and a snout ridge at the brow (ref: tribal.protector.png)
b FAIL (0 since 360)
 1. shield in unit_tribal.protector_idle: pale grey-tan plank door with one bright-green leaf — TABS: warm red-brown faceted slab, olive-grey moss patches at the top corner, beside the hole, bottom corner (ref: tribal.protector.red.png)
 2. shield in unit_tribal.protector_idle hangs off his side, hole well off the face — TABS: held square in front, brow to knee, face through the round hole (ref: tribal.protector.red.png, .png)
c PASS (360)
d PASS (cost 80, hp 0.89x, dmg 0.25x, cd 0.75x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] b shield hold — blocker 2: hold the slab square in front of the body, face hole at the eyes — ref: tribal.protector.red.png — ours: unit_tribal.protector_idle.png
2. [S] a skull helmet — blocker 1: a tan animal skull over the top half of the head, sockets at the brow — ref: tribal.protector.png — ours: unit_tribal.protector_idle.png
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
