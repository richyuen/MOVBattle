# tribal.protector
Status: open   Audited: 315   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 315)
 1. headgear in unit_tribal.protector_idle is a flat wide pale lid on the crown, 1.45 heads wide and under half a head tall, the face wholly below it (319: pale bone with sockets and a snout now) — TABS: a rounded cranium near as tall as it is wide sitting down over the top half of the head (ref: tribal.protector.png)
 2. torso in unit_tribal.protector_idle is bare team colour with a dark loincloth box — TABS: a brown garment to the thigh hung from one shoulder strap (ref: tribal.protector.png, card Appearance)
 3. neck in unit_tribal.protector_idle is a dark flat ring — TABS: three small critter skulls strung on a strap (ref: tribal.protector.png, card Appearance)
b PASS (318)
c PASS (315)
d PASS (stats 317: cost 80=80, hp -8%, dmg +2%, cd +1%)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [P] a domed cranium — blocker 1: SKULL_FACETED.tall 0.85 -> 1.6, under 0.35 -> 0.7 (the ball taller than its cap height, cut lower so it sits over the top half of the head), fallout of e53ba02 (319) — ref: tribal.protector.png — ours: unit_tribal.protector_idle.png
2. [S] a one-shoulder garment — blocker 2: the same brown faceted tunic chunk as the stoner's, hung from one shoulder strap — ref: tribal.protector.png — ours: unit_tribal.protector_idle.png
## Attempts (iter | gap | criterion | verdict)
316 | plank shield with face hole (77c8352) | b | approved
317 | no back spear (3fd57a5) | b | approved
318 | moss chunks (af37ab3) | b | approved
319 | skull helmet (e53ba02) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 316 slab: root "slabshield", four planks, SLAB_WIDE 0.34, opening SLAB_EYE 0.12 at SLAB_EYE_UP 0.22; 318 SLAB_MOSS lumps. Weapon "none" in unitVisuals, the strike reads as a shield thrust.
- 319: hat bone_mask is its own branch in buildFittedHat (SKULL_FACETED: jittered subdivision-2 icosphere baked to size, underside clamped flat at -under*Ry, seated at seat+under; sockets, cheeks, snout parented). Bone (0.93, 0.8, 0.58) emissive 0.18.
- Critic 319: no capture shot shows the helmet from the front at unit scale (idle from behind, struck from the side); the sockets are inferred. An evidence commit could add a frontal idle.
