# farmer.halfling
Status: open   Audited: 375 (re), a 391, 397-400, 402   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (9 since 388; 1 rejected [S] since 388)
 1. legs in unit_farmer.halfling_idle: the forward shin is a real bare segment on a nearly straight knee but still shorter than the shorts, and the feet are a walk stride, not well apart - TABS: shins about as long as the shorts, feet planted well outside the hips (ref: .blue.png, .red.png) [[S] only, no [P] re-splay]
  (struck 2 at 399: foot fur; struck 3: the vest V, 391; struck 5 at 400: the shin's length against the shorts; struck 4 at 402: the shorts' shade on the swatch; struck 6 at 402 under the lineup rule - the stride is blocker 1's)
b PASS (383)
c PASS (375)
d PASS (cost 50, hp 1.50x, dmg 0.17x, cd 1.50x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a planted stance - blocker 1: a planted idle pose with no fore-aft stride (stride 0, both ankles at the hip's z) and the feet spread .6 outside the hips (proceduralAnimation HALFLING_STANCE, the mechanism, not a [P] re-splay) - ref: .blue.png - ours: unit_farmer.halfling_idle.png
## Attempts (iter | gap | criterion | verdict: approved, rejected, rejected-kept, dropped)
339-391 | mitts, mop, jacket, shorts, belt, feet, Jump, Grab, coat, sleeves, cuff, belt ring, stance, vest, foot fur [S]; belt bar [P] | a,b,c | approved
397 | shinLength 1.5 lower leg + hip offset .22 -> .34, knee .02 (4fe6fd1) | a | approved (a.1 narrowed)
398 | shinLength 1.95 + a planted wide stance (.52 splay, .34 turned back at the knee) (58a4a23) | a | approved (a.1 stands; added 5, 6)
399 | foot fur rebuilt as a band over the instep: pad + 3 rows of lumps + 16 shards (d901df3 + 661f909) | a | approved (struck 2)
400 | shorts hem to just below the knee: thigh tube .99 + a hem tube off each shin with the turned cuff (74d90a4) | a | approved (struck 5)
402 | HALFLING_SHORTS_CLOTH: unlit team x .14, out of the glow (06049a1 + e4ec07a) | a | approved (struck 4; 6 struck by the lineup rule)
## Rejected (last 4)
- vest [S] [1] - 390: V to the belt, one-sided faceFront pieces - the white V vanished, a dark gap showed
- foot fur [P] [1] - 390: tuft inX 0, clump .8 - still rooted at the ankle off to the side
- stance [P] [2] - spent (HALFLING_STANCE row, ledger)
## Notes (max 3 lines)
- 403 evidence (94a7f14): probe_local at idle puts his feet .015 m apart fore-aft and .4 m across - no stride; the "walk stride" was the .6 rad idle swing. His idle now swings .2 rad (near front-on); RE-AUDIT a.1 (only) at 404's step 2 before any pick on it.
- 402: the shorts are an unlit plate (team x .14, emissive = colour, out of the glow). 400: HALFLING_SHORTS long .99; 399: HALFLING_TUFT; probe_close --aim=y:0.08.
- 398: shinLength 1.95 (bodyBuilder), HALFLING_STANCE spread .52 with .34 of the splay turned back at the knee so the soles lie flat; the [S] on blocker 1 must remove the stride itself.
