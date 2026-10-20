# viking.valkyrie
Status: open   Audited: 391   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 391)
 1. wings in unit_viking.valkyrie_idle - TABS: broad pale-blue feathered wings with a dark bone leading edge, each wider than the body (ref: .png, .red.png); ours: two fans of flat pale-blue shards threaded on one dark rod, no feathers
 2. helmet in _idle - TABS: layered cream feather wings on a bronze frame, a tall magenta crest and a metal brow band (ref: .red.png, .png); ours: flat pale fins on a grey-blue dome, no crest or brow band
 3. collar/braids in _idle - TABS: a pale fur collar and two thick pale braids over the chest (ref: .png, .red.png); ours: a bare blue chest
 4. armour in _idle - TABS: a team tunic with a wide brown belt and gold ring, gold arm bands, dark bracers and brown boots (ref: .red.png, .png); ours: a plain blue tunic and skirt, no belt, trim or boots
b PASS (391)
c FAIL (1 rejected [S] since 391)
 1. flight in _idle - TABS: hovers above the ground with feet tucked and a shadow below, then swoops (ref: .png, card Characteristics); ours: both boots planted in every shot, no flight/leap event
d PASS (cost 500, hp 1.86x, dmg 1.67x, cd 0.50x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] c flight redo - blocker 1: swoop gated to melee flyers ONLY (not every flying_hover unit) plus a permanent FLY hover that holds from spawn so _idle shows her off the ground - ref: .png - ours: unit_viking.valkyrie_idle.png
2. [S] a wings - blocker 1: layered long pale-blue feather slabs (primaries fanned, shorter coverts) hung from a thick dark bone leading edge, each wing wider than the body (vikingDress) - ref: .red.png - ours: unit_viking.valkyrie_idle.png
3. [S] a helmet - blocker 2: cream feather wings on a bronze frame, tall magenta crest, metal brow band - ref: .png - ours: unit_viking.valkyrie_idle.png
4. [S] a collar/braids - blocker 3: pale fur collar, two thick pale braids - ref: .png - ours: unit_viking.valkyrie_idle.png
5. [S] a armour - blocker 4: team tunic, brown belt + gold ring, gold arm bands, dark bracers, brown boots - ref: .red.png - ours: unit_viking.valkyrie_idle.png
## Attempts (iter | gap | criterion | verdict: approved, rejected, rejected-kept, dropped)
391 | off hand a second Valkyrie sword, shield off (54ae174) | b | approved (b PASS)
392 | flight: FLY hover (.34 H, knees tucked, wing beat) + swoop logged "swoop" [S] (ee733ae, reverted cd88c7e) | c | rejected
## Rejected (last 4)
- flight [S] [1] - 392: swoop keyed to every flying_hover unit (would throw the done balloon_archer) and the hover did not hold in her standing state - the critic's top defects
## Notes (max 3 lines)
- The redo must (a) gate the swoop to melee flyers and (b) start the hover at full weight from spawn; the wing beat and tuck were approved in principle.
- Visual map: sword / plume_helmet / none / wings; `flying_hover` is listed but nothing implements flight now.
