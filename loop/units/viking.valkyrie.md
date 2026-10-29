# viking.valkyrie
Status: open   Audited: 391, 400, 401, 402   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (4 since 391; struck 2 at 401, 3 at 402)
 4. armour in _idle - TABS: a team tunic with a wide brown belt and gold ring, gold arm bands, dark bracers and brown boots (ref: .red.png, .png); ours: a plain blue tunic and skirt, no belt, trim or boots
  (struck 1 at 394: the wings; struck 2 at 401: cream feather fans, bronze eye-line band, tall crest; struck 3 at 402: the pale fur collar and two cream plaits)
b PASS (391)
c PASS (393)
d PASS (cost 500, hp 1.86x, dmg 1.68x, cd 0.50x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a armour - blocker 4: a wide brown belt band round the tunic's waist with a gold ring on its front, gold bands on both upper arms, brown boot shells on the feet (vikingDress valkyrieArmour, new) - ref: .red.png - ours: unit_viking.valkyrie_idle.png
2. [S] a armour (second element) - blocker 4: brown boot shells on the feet, when the first leaves them - ref: .png - ours: unit_viking.valkyrie_idle.png
## Attempts (iter | gap | criterion | verdict)
391 | off hand a second Valkyrie sword, shield off (54ae174) | b | approved (b PASS)
392 | flight: FLY hover + swoop logged "swoop" [S] (ee733ae, reverted cd88c7e) | c | rejected
393 | flight redo: hover full weight from spawn + wall clamp (455eece) | c | approved (c PASS)
394 | layered feather wings: two stepped rows on a spar, span 2.9 (df2b922 + bae3bb7) | a | approved (struck a.1)
400 | her own helm: dark team dome, bronze brow band, crest spike, mounts (715aff5) | a | approved (blocker 2 stands)
401 | cream feathers, eye-line band, tall flat crest (c0c74ea + cbecbca) | a | approved (struck 2)
402 | VALKYRIE_COLLAR: cream fur ring + 9 clumps, the Headbutter's plaits in cream to the belt (498f78d) | a | approved (struck 3)
## Rejected (last 4)
- flight [S] [1] - 392: swoop keyed to every flying_hover unit (would throw the done balloon_archer) and the hover did not hold in her standing state
## Notes (max 3 lines)
- 402: VALKYRIE_COLLAR ring .62 of the shoulder width, tube .32, 9 lumps, at the neck's foot; braids via headbutterBraids with a BraidStyle (unlit cream, thick .42, footDrop 1.5, footOut .6). Critic: the plaits read in _idle/_windup and swing in _release.
- 401: VALKYRIE_HELM feathers 5 x 2.1 H blades at the mount top; VALKYRIE_FEATHER (.86,.74,.5) unlit, out of the glow; crest .95 H x .2 W.
- 394: unitVisuals wingStyle "layered"; `fly: true` keeps her valkyrieFly marker so FLY still finds her.
