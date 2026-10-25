# viking.valkyrie
Status: open   Audited: 391, 400, 401   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (3 since 391; struck 2 at 401)
 3. collar/braids in _idle - TABS: a pale fur collar and two thick pale braids over the chest (ref: .png, .red.png); ours: a bare blue chest
 4. armour in _idle - TABS: a team tunic with a wide brown belt and gold ring, gold arm bands, dark bracers and brown boots (ref: .red.png, .png); ours: a plain blue tunic and skirt, no belt, trim or boots
  (struck 1 at 394: the wings; struck 2 at 401: cream feather fans on the bronze temple mounts, a bronze band at the eye line, a tall crest)
b PASS (391)
c PASS (393)
d PASS (cost 500, hp 1.86x, dmg 1.68x, cd 0.50x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a collar - blocker 3: a pale fur collar and two thick pale braids over the chest - ref: .png - ours: unit_viking.valkyrie_idle.png
2. [S] a armour - blocker 4: team tunic, brown belt + gold ring, gold arm bands, dark bracers, brown boots - ref: .red.png - ours: unit_viking.valkyrie_idle.png
3. [S] a helm wings - blocker 2 (still open on size): the fans span about two thirds of the reference's and sit behind the dome, half lost against the back wings; the band has no V/nose guard - ref: .red.png - ours: unit_viking.valkyrie_idle.png
## Attempts (iter | gap | criterion | verdict)
391 | off hand a second Valkyrie sword, shield off (54ae174) | b | approved (b PASS)
392 | flight: FLY hover + swoop logged "swoop" [S] (ee733ae, reverted cd88c7e) | c | rejected
393 | flight redo: hover full weight from spawn + wall clamp (455eece) | c | approved (c PASS)
394 | layered feather wings: two stepped rows on a spar, span 2.9 (df2b922 + bae3bb7) | a | approved (struck a.1)
400 | her own helm: dark team dome, bronze brow band, crest spike, mounts (715aff5) | a | approved (blocker 2 stands)
401 | cream feathers, eye-line band, tall flat crest (c0c74ea + cbecbca) | a | approved (struck 2)
## Rejected (last 4)
- flight [S] [1] - 392: swoop keyed to every flying_hover unit (would throw the done balloon_archer) and the hover did not hold in her standing state - the critic's top defects
## Notes (max 3 lines)
- 401: VALKYRIE_HELM feathers 5 x 2.1 H blades (featherLen, fan .78, swept .42 back) at the mount top; VALKYRIE_FEATHER (.86,.74,.5) unlit, out of the glow; crest .95 H x .2 W, .crestFlat .55.
- 400: dome 1.16 W x .72 H at .46 rise; band .14 at eyeTop .56; mounts .16 W x .6 H at 1.04 W, .36 H.
- 394: unitVisuals wingStyle "layered"; `fly: true` keeps her valkyrieFly marker so FLY still finds her.
