# farmer.halfling
Status: open   Audited: 375 (re), a 391, 397, 398, 399, 400   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (8 since 388; 1 rejected [S] since 388)
 1. legs in unit_farmer.halfling_idle: the forward shin is a real bare segment on a nearly straight knee but still shorter than the shorts, and the feet are a walk stride, not well apart - TABS: shins about as long as the shorts, feet planted well outside the hips (ref: .blue.png, .red.png) [[S] only, no [P] re-splay]
 4. shorts in _idle: still light team blue, near the jacket's - TABS: dark team shorts, clearly darker (ref: .blue.png; card)
 6. feet in _idle: the right foot still sits nearer the camera than the left - TABS: both feet level side by side (ref: .blue.png)
  (struck 2 at 399: foot fur, a tuft across the top of each foot; struck 3: the vest V, 391; struck 5 at 400: the shin's length against the shorts - the hem hangs off the shin now, so the bare shin is about the shorts' own length)
b PASS (383)
c PASS (375)
d PASS (cost 50, hp 1.50x, dmg 0.17x, cd 1.50x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a shorts colour - blocker 4: a dark-team shorts cloth darker than the jacket - ref: .blue.png - ours: unit_farmer.halfling_idle.png
2. [S] a planted feet - blocker 6: an idle pose with both feet level and apart, not the walk stride - ref: .blue.png - ours: unit_farmer.halfling_idle.png
## Attempts (iter | gap | criterion | verdict: approved, rejected, rejected-kept, dropped)
339-391 | mitts, mop, jacket, shorts, belt, feet, Jump, Grab, coat, sleeves, cuff, belt ring, stance, vest, foot fur [S]; belt bar [P] | a,b,c | approved
397 | shinLength 1.5 lower leg + hip offset .22 -> .34, knee .02 (4fe6fd1) | a | approved (a.1 narrowed)
398 | shinLength 1.95 + a planted wide stance (.52 splay, .34 turned back at the knee) (58a4a23) | a | approved (a.1 stands; added 5, 6)
399 | foot fur rebuilt as a band over the instep: pad + 3 rows of lumps + 16 shards (d901df3 + 661f909) | a | approved (struck 2)
400 | shorts hem to just below the knee: thigh tube .99 + a hem tube off each shin with the turned cuff (74d90a4) | a | approved (struck 5)
## Rejected (last 4)
- vest [S] [1] - 390: V to the belt, one-sided faceFront pieces - the white V vanished, a dark gap showed
- foot fur [P] [1] - 390: tuft inX 0, clump .8 - still rooted at the ankle off to the side
- stance [P] [2] - spent (HALFLING_STANCE row, ledger)
## Notes (max 3 lines)
- 400: HALFLING_SHORTS long .99 to the knee, a hem tube .22 of the shin (+.03 above it) flaring 1.05, cuff .06 of the shin; the bare shin reads about the shorts' length.
- 399: HALFLING_TUFT pad 1.3 W x .9 L on the toe's top face (lo.y + .42 of the box height), 5 lumps x 3 rows, 16 shards; probe_close --aim=y:0.08.
- 398: shinLength 1.95 (bodyBuilder), HALFLING_STANCE spread .52 with .34 of the splay turned back at the knee so the soles lie flat.
