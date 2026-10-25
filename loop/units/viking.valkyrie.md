# viking.valkyrie
Status: open   Audited: 391, 400   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 391)
 2. helmet in _idle - TABS: layered cream feather wings on a bronze frame, a tall magenta crest and a metal brow band (ref: .red.png, .png); ours: flat pale fins on a grey-blue dome, no crest or brow band
 3. collar/braids in _idle - TABS: a pale fur collar and two thick pale braids over the chest (ref: .png, .red.png); ours: a bare blue chest
 4. armour in _idle - TABS: a team tunic with a wide brown belt and gold ring, gold arm bands, dark bracers and brown boots (ref: .red.png, .png); ours: a plain blue tunic and skirt, no belt, trim or boots
  (struck 1 at 394: the wings)
b PASS (391)
c PASS (393)
d PASS (cost 500, hp 1.86x, dmg 1.68x, cd 0.50x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a helm wings - blocker 2: cream feather wings on the bronze mounts, a bronze brow band, a taller crest - ref: .red.png - ours: unit_viking.valkyrie_idle.png
2. [S] a collar - blocker 3: a pale fur collar and two thick braids over the chest - ref: .png - ours: unit_viking.valkyrie_idle.png
3. [S] a armour - blocker 4: team tunic, brown belt + gold ring, gold arm bands, dark bracers, brown boots - ref: .red.png - ours: unit_viking.valkyrie_idle.png
## Attempts (iter | gap | criterion | verdict)
391 | off hand a second Valkyrie sword, shield off (54ae174) | b | approved (b PASS)
392 | flight: FLY hover (.34 H, knees tucked, wing beat) + swoop logged "swoop" [S] (ee733ae, reverted cd88c7e) | c | rejected
393 | flight redo: hover full weight from spawn + wall clamp, swoop gated to flying_melee [S] (455eece) | c | approved (c PASS)
394 | layered feather wings: two stepped rows of broad blunt feathers on a thick dark spar, span 2.9, raise .32 (df2b922 + bae3bb7) | a | approved (struck a.1)
400 | her own helm: dark team dome, bronze brow band, crest spike, bronze temple mounts; hat "none" (715aff5) | a | approved (blocker 2 stands: no cream helm feathers, band low, crest a nub)
## Rejected (last 4)
- flight [S] [1] - 392: swoop keyed to every flying_hover unit (would throw the done balloon_archer) and the hover did not hold in her standing state - the critic's top defects
## Notes (max 3 lines)
- 400: vikingDress VALKYRIE_HELM (domeWide 1.16, domeTall .72, domeRise .46, slice .55; band .13 at eyeTop .42; crest .58 H, .15 W, 4-sided; mounts .1 W x .5 H at 1.04 W, .36 H). The hat is off, so the shared plume_helmet is gone.
- 400 critic: cream feather wings on the mounts, a bronze band over the eyes and a taller crest are what is left of a.2; the wings themselves are propBuilder VALKYRIE_WINGS_LAYERED (a.1, struck).
- 394: unitVisuals wingStyle "layered"; `fly: true` keeps her valkyrieFly marker so FLY still finds her.
