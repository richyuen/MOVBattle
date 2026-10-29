# viking.valkyrie
Status: open   Audited: 391, 400, 401, 402, 404 (CONFIRM)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (404; CONFIRM 404)
  (struck 4 at 404: the belt and ring at the waist; struck 1 at 394, 2 at 401, 3 at 402, the armour split at 403)
b FAIL (1 since 404; the CONFIRM's list, struck 1 at 405)
 2. crossguard colour in unit_viking.valkyrie_windup - TABS: a gold, wing-shaped crossguard and hilt on both swords; ours: a short dark/black bar guard (ref: viking.valkyrie.red.png, viking.valkyrie.png)
  (struck 1 at 405: the blade now about her height)
c PASS (393; CONFIRM 404)
d PASS (cost 500, hp 1.86x, dmg 1.68x, cd 0.50x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] b crossguard - blocker 2: a gold wing-shaped crossguard (two swept feather-wing lobes) and gold grip/pommel for the valkyrie_sword variant (propBuilder buildSlabSword / VALKYRIE_SWORD) - ref: .red.png - ours: unit_viking.valkyrie_windup.png
## Attempts (iter | gap | criterion | verdict)
391-394 | off-hand sword (b PASS); flight FLY (392 rejected, 393 approved, c PASS); layered feather wings (struck a.1) [S] | a,b,c | approved
400-402 | her own helm; cream feathers, eye-line band, tall crest (struck 2); VALKYRIE_COLLAR (struck 3) | a | approved
403 | VALKYRIE_ARMOUR: belt + rims, gold ring, arm bands, bracers, boots (0ec42c6) | a | approved (bands, bracers, boots struck)
404 | belt and ring seated off torsoMesh's own middle and scale (670efeb) | a | approved (struck 4, a PASS); CONFIRM agreed a, failed b
405 | VALKYRIE_SWORD slab cut .98 of her height, weaponVariant + offhandVariant valkyrie_sword (2e4602e) | b | approved (struck 1)
## Rejected (last 4)
- flight [S] [1] - 392: swoop keyed to every flying_hover unit (would throw the done balloon_archer) and the hover did not hold in her standing state
## Notes (max 3 lines)
- 404 critic (minor): the ring is small and a little off-centre toward her weapon side. CONFIRM: helmet wings smaller and fur cream not tan (not at lineup distance).
- 402: VALKYRIE_COLLAR ring .62 of the shoulder width, 9 lumps; braids via headbutterBraids (unlit cream). 401: VALKYRIE_HELM feathers 5 x 2.1 H.
- 394: unitVisuals wingStyle "layered"; `fly: true` keeps her valkyrieFly marker so FLY still finds her. Blocker b.2 is colour-only: give the critic a --noglow swatch.
