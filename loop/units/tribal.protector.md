# tribal.protector
Status: open   Audited: 315   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 315)
 1. headgear in unit_tribal.protector_idle is a smooth grey dome — TABS: a pale animal skull with eye sockets and a snout over the top half of the head (ref: tribal.protector.png)
 2. torso in unit_tribal.protector_idle is bare team colour with a dark loincloth box — TABS: a brown garment to the thigh hung from one shoulder strap (ref: tribal.protector.png, card Appearance)
 3. neck in unit_tribal.protector_idle is a dark flat ring — TABS: three small critter skulls strung on a strap (ref: tribal.protector.png, card Appearance)
b PASS (318)
c PASS (315)
d PASS (stats 317: cost 80=80, hp -8%, dmg +2%, cd +1%)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a skull helmet — blocker 1: pale animal skull with eye sockets and snout over the top half of the head — ref: tribal.protector.png — ours: unit_tribal.protector_idle.png
## Attempts (iter | gap | criterion | verdict)
316 | plank shield with face hole (77c8352) | b | approved
317 | no back spear (3fd57a5) | b | approved
318 | moss chunks (af37ab3) | b | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 316 slab: empty Mesh root "slabshield", four planks, SLAB_WIDE 0.34, opening SLAB_EYE 0.12 at SLAB_EYE_UP 0.22; 318 SLAB_MOSS lumps (jittered icospheres, emissive 0.15) at the top corner and bottom edge. The idle shot shows the shield edge-on; the face reads in _release and the lineup.
- 317: weapon "none" in unitVisuals and no weaponHint in rosterManifest; the strike is the default family and still reads as a shield thrust.
- Critic 318 (minor, b passed): the render's third moss chunk under the opening is absent and the top lump is on the corner away from the opening; the opening sits a third down, TABS top quarter.
