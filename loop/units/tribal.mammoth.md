# tribal.mammoth
Status: open   Audited: 360   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 360)
 1. body in unit_tribal.mammoth_windup, lineup_tribal: flat boxy slabs, straight back — TABS: rounded faceted barrel body, round belly, hump behind the head, dark mane (ref: tribal.mammoth.red.png, .jpg)
 2. legs in unit_tribal.mammoth_windup: octagonal drums, raised team bands, studs, black sole caps — TABS: stubby tapered brown legs, flush painted team stripes/dots, no caps (ref: tribal.mammoth.blue.png)
 3. ears not visible in unit_tribal.mammoth_windup — TABS: a small rounded flap behind each eye (ref: tribal.mammoth.red.png)
b FAIL (0 since 360)
 1. tusks in unit_tribal.mammoth_windup glowing ivory-white, plain team tip — TABS: bone-tan, team tip, tan gap, stripe (ref: tribal.mammoth.blue.png)
 2. trunk in unit_tribal.mammoth_windup near-black, raised team knobs — TABS: body brown, reaching the ground, flat painted dots (ref: tribal.mammoth.red.png, .jpg)
c FAIL (0 since 360)
 1. charge not visible in unit_tribal.mammoth_ability/_ability_after: same pose and place, no lunge, no dust (ref: card Abilities, tribal.mammoth.jpg)
 2. trample not visible in unit_tribal.mammoth_release/_flight: no ground shake, dust or ring (ref: card Characteristics, tribal.mammoth.jpg)
d PASS (cost 2200, hp 31.76x; dmg, cd wiki none)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] c charge — blocker 1: a visible Mammoth Charge (head-down lunge forward, dust kicked at the feet) — ref: tribal.mammoth.jpg — ours: unit_tribal.mammoth_ability.png
2. [S] a legs — blocker 2: stubby tapered brown legs with flush painted team stripes and dots, no drum hoops or caps — ref: tribal.mammoth.blue.png — ours: unit_tribal.mammoth_windup.png
## Attempts (iter | gap | criterion | verdict)
323 | brown fur hide (85c87e9 + 11b021e) | a | approved
323 | Mammoth Charge (7d01e90) | c | approved
324 | mane (6d8c95a) | a | approved
325 | ankle bands (0207b28) | a | approved
326 | face marking (edf1fdb + 5594a38, 01bd5ef, 1f8384e, b9a7a89) | a | approved
326 | [P] ankle band flush (86f8f39) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- critic 360 DEFECT: unit_tribal.mammoth_idle frames only legs and a tusk: widen, front three-quarter.
- 326 face: FACE_PAINT (strips by scene.pickWithRay; Mesh.intersects missed), trunkDot on trunk pieces 1/3/5.
- Critic 326 cosmetic: face band narrower and more upright than TABS diagonal swath.
