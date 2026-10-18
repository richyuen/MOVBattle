# tribal.protector
Status: open   Audited: 315   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 315)
 1. (struck 320: domed cranium)
 2. (struck 320: one-shoulder garment)
 3. neck in unit_tribal.protector_idle is a dark flat ring — TABS: three small critter skulls strung on a strap (ref: tribal.protector.png, card Appearance)
b PASS (318)
c PASS (315)
d PASS (stats 317: cost 80=80, hp -8%, dmg +2%, cd +1%)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a critter-skull necklace — blocker 3: a strap with three small faceted bone skulls replacing the dark ring (finishes the protector) — ref: tribal.protector.png — ours: unit_tribal.protector_idle.png
## Attempts (iter | gap | criterion | verdict)
317 | no back spear (3fd57a5) | b | approved
318 | moss chunks (af37ab3) | b | approved
319 | skull helmet (e53ba02) | a | approved
320 | [P] domed cranium (12e7843) | a | approved
320 | one-shoulder garment (b077ecf) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 316 slab: root "slabshield", SLAB_WIDE 0.34, opening SLAB_EYE 0.12; 318 SLAB_MOSS lumps. Weapon "none"; the strike reads as a shield thrust.
- 319/320: hat bone_mask (SKULL_FACETED tall 1.6, under 0.7). 320: in TRIBAL_TUNIC_UNITS (dressTribalTunic, unitFactory). The dark neck ring is unitFactory's furCollar (bareSkinned): the necklace replaces it for this unit.
- Critic 320 (minor): dome ~1.45 heads wide in windup (TABS barely wider than the head); the tunic's ragged points sit at hip height, not on the hem.
