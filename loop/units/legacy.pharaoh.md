# legacy.pharaoh
Status: open   Audited: 468   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4 (6 on a), and the count of approved [S] since the list was written)
a FAIL (1 since 468)
 2. torso in unit_legacy.pharaoh_idle: plain grey base vest block — TABS: team-coloured garb banded with gold across chest and waist (ref: legacy.pharaoh.red.png)
 3. broad collar missing at the neck in unit_legacy.pharaoh_idle — TABS: a gold collar across the shoulders (ref: legacy.pharaoh.red.png)
 4. lower body in unit_legacy.pharaoh_idle: dark navy trousers to the boots — TABS: a flared team kilt to mid-thigh over bare team legs (ref: legacy.pharaoh.red.png)
 5. arm cuffs missing in unit_legacy.pharaoh_idle: bare team arms — TABS: gold bands at upper arm and wrist (ref: legacy.pharaoh.red.png, legacy.pharaoh.jpg)
 6. feet in unit_legacy.pharaoh_idle: dark navy boots — TABS: gold sandals (ref: legacy.pharaoh.red.png)
b FAIL (1 since 468)
 2. off hand in unit_legacy.pharaoh_idle: empty — TABS: a striped flail rod with gold tassel strands hanging from its tip (ref: legacy.pharaoh.red.png; card Off Hand Pharaoh Flail)
c FAIL (0 since 468)
 1. kneel aura missing in unit_legacy.pharaoh_ability and _ability_after: nothing around him, though summary records status:fear at 467 ms — TABS: golden rays circle him and a golden circle forms on the ground (card Abilities Pharaoh Kneel)
 2. target in unit_legacy.pharaoh_struck: the knight reels backwards, standing, arms raised — TABS: enemies stop in front of him and kneel (card Characteristics)
d PASS (cost 750=750, hp 0.81x vs 0.81x (0%), dmg 1.08x vs 1.08x (+0%), cd 1.01x vs 1.00x (+1%); 468 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] legacy.pharaoh.b off-hand flail — blocker 2: PHARAOH_FLAIL striped rod with gold tassel strands (propBuilder) — ref: legacy.pharaoh.red.png — ours: unit_legacy.pharaoh_idle
2. [S] legacy.pharaoh.a team garb — blocker 2: PHARAOH_GARB team torso shell with gold chest and waist bands (legacyDress) — ref: legacy.pharaoh.red.png — ours: unit_legacy.pharaoh_idle
3. [S] legacy.pharaoh.c kneel aura — blocker 1: golden ray ring and ground circle spawned on status:fear (simulationSystem/effects) — ref: card Abilities Pharaoh Kneel — ours: unit_legacy.pharaoh_ability
## Attempts (iter | gap | criterion | verdict)
469 | PHARAOH_CROOK striped team/gold crook, curled hook (32f27e05) | b | approved (struck 1)
469 | MODIUS tall team crown, gold rim, gold-white-gold bands (7c1181a9) | a | approved (struck 1)
## Rejected (last 4)
## Notes (max 3 lines)
- ref legacy.pharaoh.red.png: tall striped modius with gold bands over a team face; ours unit_legacy.pharaoh_idle: a wide yellow box with navy stripes hides the head, nothing tall above it
