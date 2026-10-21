# viking.valkyrie
Status: open   Audited: 391   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 391)
 2. helmet in _idle - TABS: layered cream feather wings on a bronze frame, a tall magenta crest and a metal brow band (ref: .red.png, .png); ours: flat pale fins on a grey-blue dome, no crest or brow band
 3. collar/braids in _idle - TABS: a pale fur collar and two thick pale braids over the chest (ref: .png, .red.png); ours: a bare blue chest
 4. armour in _idle - TABS: a team tunic with a wide brown belt and gold ring, gold arm bands, dark bracers and brown boots (ref: .red.png, .png); ours: a plain blue tunic and skirt, no belt, trim or boots
  (struck 1 at 394: the wings)
b PASS (391)
c PASS (393)
d PASS (cost 500, hp 1.86x, dmg 1.68x, cd 0.50x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a helmet - blocker 2: her own winged helm, cream feathers on a bronze frame, a magenta crest and a brow band - ref: .red.png - ours: unit_viking.valkyrie_idle.png
2. [S] a collar/braids - blocker 3: a pale faceted fur collar ring and two thick pale braids over the chest - ref: .png - ours: unit_viking.valkyrie_idle.png
3. [S] a armour - blocker 4: team tunic, brown belt + gold ring, gold arm bands, dark bracers, brown boots - ref: .red.png - ours: unit_viking.valkyrie_idle.png
## Attempts (iter | gap | criterion | verdict: approved, rejected, rejected-kept, dropped)
391 | off hand a second Valkyrie sword, shield off (54ae174) | b | approved (b PASS)
392 | flight: FLY hover (.34 H, knees tucked, wing beat) + swoop logged "swoop" [S] (ee733ae, reverted cd88c7e) | c | rejected
393 | flight redo: hover full weight from spawn + wall clamp, swoop gated to flying_melee [S] (455eece) | c | approved (c PASS)
394 | layered feather wings: two stepped rows of broad blunt feathers on a thick dark spar, span 2.9, raise .32 (df2b922 + bae3bb7) | a | approved (struck a.1)
## Rejected (last 4)
- flight [S] [1] - 392: swoop keyed to every flying_hover unit (would throw the done balloon_archer) and the hover did not hold in her standing state - the critic's top defects
## Notes (max 3 lines)
- 394 a.1: unitVisuals wingStyle "layered" -> propBuilder VALKYRIE_WINGS_LAYERED (rows 2, len [.5,.95], wide .5, tip .6, barTall .16); `fly: true` keeps her valkyrieFly marker, so FLY still finds her. Cupid/banshee keep the shard fan.
- 394 critic: the feathers are paler/greyer than the reference's sky blue and the rows very regular (not a lineup-distance defect).
- 393 c: `ability swoop at 17 ms`, knees tucked, shadow under her.
