# tribal.clubber
Status: open   Audited: 315   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 315)
 1. hair in unit_tribal.clubber_idle is a short rounded black cap, no beard — TABS: long unkempt dark-brown hair past the ears and a full beard chunk (ref: tribal.clubber.blue.png, card Appearance)
 2. loincloth in unit_tribal.clubber_idle is a plain dark-grey box — TABS: brown loincloth tied with rope, a pale skull at the centre and a bone each side (ref: tribal.clubber.red.png)
 3. neck in unit_tribal.clubber_idle is a dark flat ring — TABS: a necklace of three pale tusks on a rope (ref: tribal.clubber.blue.png)
 4. wrists in unit_tribal.clubber_idle are bare — TABS: a pale bracelet on each wrist (ref: tribal.clubber.red.png)
b FAIL (1 since 315)
 1. (struck 316: club mesh)
 2. grip in unit_tribal.clubber_windup is one hand, club low and level, other arm free — TABS: both hands on the grip, club cocked up behind the shoulder (card Weapon Type Two-handed; ref: tribal.clubber.jpg)
c PASS (315)
d PASS (stats 315: cost 70=70, hp 1.00x, dmg 1.00x, cd 1.00x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] b two-handed grip — blocker 2: off hand on the grip above the main fist, club cocked behind the shoulder in the carry/windup (proceduralAnimation club family) — ref: tribal.clubber.jpg — ours: unit_tribal.clubber_windup.png
2. [S] a hair and beard — blocker 1: long dark-brown unkempt hair past the ears and a full beard chunk — ref: tribal.clubber.blue.png — ours: unit_tribal.clubber_idle.png
## Attempts (iter | gap | criterion | verdict)
316 | club mesh (3af648b) | b | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 316 club: CreateTube with a radius profile, CLUB_LONG/GRIP/HEAD in propBuilder; critic: head could be a touch wider (2.5 grips vs 3.5), minor.
