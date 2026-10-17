# tribal.clubber
Status: open   Audited: 315   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 315)
 1. hair in unit_tribal.clubber_idle is a short rounded black cap, no beard — TABS: long unkempt dark-brown hair past the ears and a full beard chunk (ref: tribal.clubber.blue.png, card Appearance)
 2. loincloth in unit_tribal.clubber_idle is a plain dark-grey box — TABS: brown loincloth tied with rope, a pale skull at the centre and a bone each side (ref: tribal.clubber.red.png)
 3. neck in unit_tribal.clubber_idle is a dark flat ring — TABS: a necklace of three pale tusks on a rope (ref: tribal.clubber.blue.png)
 4. wrists in unit_tribal.clubber_idle are bare — TABS: a pale bracelet on each wrist (ref: tribal.clubber.red.png)
b PASS (317)
c PASS (315)
d PASS (stats 317: cost 70=70, hp 1.00x, dmg 1.00x, cd 1.00x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a hair and beard — blocker 1: long dark-brown hair chunk past the ears plus a beard chunk — ref: tribal.clubber.blue.png — ours: unit_tribal.clubber_idle.png
## Attempts (iter | gap | criterion | verdict)
316 | club mesh (3af648b) | b | approved
317 | two-handed grip (6a1bbe4) | b | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 316 club: CreateTube with a radius profile, CLUB_LONG/GRIP/HEAD in propBuilder. 317: _offhandToGrip (proceduralAnimation) solves the left arm onto the shaft OFFHAND_GRIP_UP above the fist every frame after _carryProp; _buildCarry sets _twoHanded (a "club" node, no board, empty off hand) and _carryTurn 1 from the first frame.
- Critic 317: off elbow a little square at the waist (minor); _twoHanded keys on any club with an empty off hand (other factions' clubs inherit it).
