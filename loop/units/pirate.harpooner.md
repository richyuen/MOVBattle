# pirate.harpooner
Status: open   Audited: 422, 431 (CONFIRM: failed a)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 431; the CONFIRM 431 list)
 3. feet in unit_pirate.harpooner_idle are team-blue blocks — TABS: brown buckled shoes under grey socks (ref: pirate.harpooner.red.png, card Appearance "brown shoes")
  (struck 1, 2 at 432; 2 by the lineup test)
b PASS (429: a thin sword-bayonet under the nozzle reaching past the knee; CONFIRM 431)
c PASS (426: shoot, reel, kick all fire and show; CONFIRM 431)
d PASS (cost 300, hp 3.38x, dmg 0.29x, cd 1.80x; 432 stats; size 1.30 vs wiki 1.3)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a shoes - blocker 3: brown buckled shoes and grey sock cuffs over the foot (captainLegs foot recolour + brass buckle, PLAIN_SOCKS shell) - ref: pirate.harpooner.red.png - ours: unit_pirate.harpooner_idle (critic 432)
## Attempts (iter | gap | criterion | verdict)
423-426 | HARPOON_BREECH, HARPOON_OFF_GRIP; TRICORN_BROWN; reel-in; OPEN_COAT; PIRATE_KICK | a,b,c | approved (c PASS)
429 | HARPOON_BAYONET lug + thin blade (37ea2e85) | b | approved (struck 3; b PASS)
430 | PIRATE_BEARD jaw mass, sideburns, mouth (a2de9843) | a | approved (struck 2)
431 | [P] scale 1.05 -> 1.3 (ec00c268) | a | approved (struck 4; a PASS; CONFIRM failed a)
432 | HARPOONER_PANTS beige rolled pants to mid-calf, skin shins (02534ee3, 6df6805c) | a | approved (struck 1, 2)
## Rejected (last 4)
## Notes (max 3 lines)
- Gun: propBuilder case "harpoon"; reel simulationSystem _reelIn; kick _landKicks. Evidence 426: the ability pair shoots the kick.
- 432 critic: bare shin under the cuff very short in the idle. 426: lapels thin and short, coat flares as a stiff box below the waist.
- Legs take the head's skin material since 432 (harpoonerPants).
