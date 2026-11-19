# Improvement loop v11: one iteration (maps and stages; solo mode)

You are the worker. Make each MOVBattle map look and play like its TABS original, then make each curated campaign stage field the TABS level's
army in the TABS level's formation, one batch at a time (a group of maps, or one campaign's stages). An adversarial critic judges look,
layout and formation against the wiki images; scripts judge the rest; you never judge your own work.

## Items and criteria
- A map `map.<id>` (a TABS map, `web/src/map/tabsMaps.ts`): **a look** and **b layout** (critic), **c play** (script). Card `loop/cards/maps/<id>.md`;
  references `reference/maps/wiki/<id>.png` (the wiki's shot), `reference/maps/<biome>.png` (its placement view, named on the card), and the
  `reference/stages/<stage>.png` images of the stages fought on it (the map at ground level). Shots `map_<id>_island|top|ground|battle`.
- A stage `<campaign>.<level>` (a curated TABS level, `web/src/campaign/stages/<campaign>.ts`): **a army** (script: map, budget, enemy units and
  counts, player units against the card), **b formation** (critic: where and how the enemy army stands, against `reference/stages/<id>.png`
  and `.thumb.png` and the card's Survey), **c battle** (script: no enemy misplaced; the battle ends inside 120 s with nobody stuck in a
  hazard). Shots `stage_<id>_army|field|battle`.
- Script verdicts come from `node loop/scripts/world-judge.mjs --iter N` (reads the capture's `summary.json`, writes `judge.json`): a script
  FAIL's reasons are its blockers, verbatim. A criterion is PASS for an item only when its judge (critic + CONFIRM, or script) passes it.

## Solo mode (v11): one item until it passes
STATE's `Solo:` line names one item, a `Queue:` of the items after it, and two counters: `Rounds` (rounds run on the item) and `Dry` (rounds in
a row with no strike and no criterion flipped). While `Solo:` names an item, the iteration works that item alone and these rules override 1-8:
- Step 1 reads only that item's file. Step 2 and the batch's other items wait (no audit, no tail overlap, no starvation picks elsewhere).
- Rounds: up to 3 rounds of steps 3-7 on the item, one after another; memory (step 9) is written once at the end. Commits continue the
  iteration's `loop(N.k)` numbering. Round 1 captures `--iter N --items <the item and the stages fought on it>`, later rounds the same with
  `--add`; answers are saved as `critic.md`, `confirm.md`, then `critic-r2.md`, `confirm-r2.md`... Stop early when the item is `D` or `p`,
  or after a round with no approved gap.
- Picks (step 3): up to 4 gaps per round, each on a different blocker of a FAIL criterion: `[S]`, or on a `plateau` criterion one `[R]` (in
  the next round after it is marked). The 2-attempt cap, the per-item cap, starvation and the one-`[R]`-per-iteration limit do not apply; a
  blocker whose last 2 attempts were rejected is tried with a mechanism its Rejected lines do not name. No sub-batch looks: step 5's capture
  is the look. A rejected `[R]` never parks a criterion here (the breaker below is the only exit besides `D`).
- Critic: its prompt says this is a solo review of one item: rank only that item's remaining blockers, no minimum `[S]` count.
- Done: when the critic passes every criterion, CONFIRM runs in the same round (step 7, locked list); a passed CONFIRM makes the item `D`.
- Breaker: after each round set `Dry` (0 on any strike or flip, else +1) and `Rounds` +1. At `Dry: 6` the item's FAIL criteria are `parked`
  (status `p`), its Notes naming the blockers left. Consecutive empty and its STOP are not counted in solo mode.
- Next: when the item is `D` or `p`, move the first `Queue:` item to `Solo:` (Rounds 0, Dry 0), run step 8 if its batch has no open item
  left, and end the iteration. When the Queue is empty, drop the `Solo:` line: batch mode resumes at STATE's `Batch:`.

## 0. Preflight
- `git branch --show-current` must print `main`. `git status --porcelain` must be empty. No file named `STOP` in the repo root. `node loop/scripts/budget.mjs` must pass.
- On any failure: end the turn with one line saying why, no commit (the autoloop stops on a turn without a commit).
- Tooling: write files with Write and Edit (heredocs and `node -e` eat backslashes); commit messages via a file and `git commit -F`; never `git commit -a`. One command per Bash call.
- Context: read each file once. Memory files are rewritten at step 9 from what step 1 read, never read again. Source: Grep the identifier, then one ranged read under 150 lines; never read `mapBuilder.ts` (180 KB) or `main.ts` in full.
- Capture: `node loop/scripts/capture-world.mjs <args>` in the background (it can pass the 10 min Bash cap; wait for it, 20 min limit), then `node loop/scripts/world-judge.mjs`, with `--iter N` when the capture had it. Read only `summary.json`'s notes and errors and the judge's lines.
- Evidence pack (a critic prompt lists it by path): `loop/CRITIC.md`, `loop/REFERENCE_DIGEST.md` section 3, the items' cards and reference images (Items above), every PNG in `output/loop/iter-N/`, `summary.json`, `judge.json`.

## 1. Load memory (and nothing else)
- Read `loop/STATE.md`, `loop/LEDGER.md`, `loop/LESSONS.md`. The batch is STATE's `Batch:` field. Read `loop/items/<id>.md` for every item of the batch that is not `D` (done) or `p` (parked) in the Scoreboard; an item with no file is unaudited.
- Read an item's card only when you pick a gap on it. Never read `loop/archive/`, unit cards or files outside the batch, `progress.md`, `.omx/`, `web/*.md`, or `output/wiki/`.
- N = Iteration in STATE + 1. If the Scoreboard has no open or queued item left: write the reason into a file named `STOP` and end the turn.

## 2. Batch audit (when the batch has unaudited items, or STATE Notes orders a re-audit)
- Capture `--iter N --batch <batch>`.
- Script fixes first, outside the 9 and without a critic: for every stage a FAIL, set the stage's data to the card (budget, mapId, playerUnits, the enemy list's unit ids and counts; a missing unit is added in the rank of its kind, a surplus one removed from the back), type-check, commit alone as `loop(N.0): [D] <batch> stage data`. Then capture `--iter N --items <those stages> --add` again; a stage a still failing goes into its item file as a blocker.
- Re-audits: an evidence commit that changes the camera of a shot re-opens that shot's criteria for the batch's open items (say so in the critic prompt and give it each item file's Verdicts block; the other criteria keep their verdicts).
- Tail overlap: at step 3, when the batch has fewer than 9 pickable `[S]` or at most 2 open items and the next batch is unaudited, run this step for the next batch too, before step 4, and pick from both; `Batch:` names both (`maps_4+stages_introduction`) until the first's checkpoint.
- Spawn two fresh `Agent`s (general-purpose, default model) in AUDIT mode in one message, same prompt. The prompt lists the evidence pack for every item of the batch, plus `loop/LEDGER.md`. Say it is an AUDIT of the listed items and nothing about what you expect. Save the answers verbatim to `output/loop/iter-N/audit.md` and `audit2.md`.
- Write each item's file from the first answer, plus the second's blockers and gaps on elements the first did not name, to the cap; a criterion either fails is FAIL (template in STATE's header comment), plus the judge's script verdicts. An item with every criterion PASS is proposed done: it is `D` (`Done: N`) only after step 7's CONFIRM agrees. Update the Scoreboard.

## 3. Pick gaps: structural first
- A gap is `[S]` structural (adds or replaces a mechanism: a map's own builder, a set piece (castle, ship, pagoda, cliff wall, bridge), the island outline, a river or lake with its hazard, a ring of trees or rocks, the sky and light of a map; a stage's formation group re-laid (its shape, ranks, spacing, place on the map); up to 3 files and 300 changed lines, one failing criterion of one item) or `[P]` polish (constants, colours, sizes, a few positions; up to 2 files and 20 lines). `[R]` rebuild is the escalation for a criterion marked `plateau` in its item file: one commit that replaces the mechanism owning the criterion and aims at its whole blocker list, up to 5 files and 600 lines, designed from a spec written at the head of the rewritten builder or formation (shapes, counts, distances read off the references), approved on one cleared blocker with no regression. At most one `[R]` per iteration; a waiting `plateau` takes it in the iteration after it is marked (the oldest first). `[D]` data gaps (step 2) and map c fixes are script-judged.
- A map c FAIL is fixed by a gap on that map like any other (a zone, a hazard edge, an obstacle in the way); its commit goes to the critic too (it can change the look), and the judge must pass c after it.
- Pickable: attempts under 2 (the item file's Attempts), not spent in LEDGER, its criterion not `plateau` (then `[R]` only) nor `parked`. Take up to 9 pickable `[S]` from the batch's ranked gaps (best first across items, but an item with 3 or fewer FAIL blockers left first), at most 3 per item, each clearing a different numbered blocker, spread over the item's FAIL criteria before a second goes on one criterion. Then at most 1 `[P]`, only one the critic listed as fallout of an `[S]` approved on the same item within the last 3 iterations, whose NEXT line names the shot it shows in.
- Starvation: an open FAIL criterion with no attempt in the last 5 iterations is picked this iteration and takes one of the 9 slots (its first ranked gap, else its first blocker). A starving `plateau` criterion's `[R]` takes the `[R]` slot ahead of any other.
- Evidence first: a blocker whose named shot cannot show its element is re-aimed before any pick on that item, outside the 9: edit `loop/scripts/capture-world.mjs` (a pose, a scene) and commit it alone as `loop(N.0): evidence - <what>`; rewrite the blocker's shot in the item file. Shots stay deterministic (time through `window.advanceTime` only, seeded `Math.random`).
- Read the item's card, its Rejected lines and the LEDGER rows for every identifier you intend to touch; look at the reference images named on the card before writing geometry or positions. Write the picks into STATE's Focus. Record `BASE=$(git rev-parse HEAD)`.

## 4. Implement in sub-batches, one commit per gap
Work the picks in ranked order, two or three at a time. For each gap: make the change that clears its blocker, touching only what it needs; an `[S]` gap must change geometry, layout or positions, not only numbers. Where code goes:
- A map's geometry goes in its own builder `web/src/map/tabs/<id>.ts` (export `build<Id>`, list it in `web/src/map/tabs/index.ts`; the builder gets `base()`, its old base map's build, to dress or to replace). Never edit a `campaign.*` theme or the sandbox builder in `mapBuilder.ts` for a TABS map: other maps and the regression scenarios stand on them. A helper you need from `mapBuilder.ts` is exported as it is; a changed behaviour goes in a copy or behind an option that defaults to the old one.
- A stage's army is its entry in `web/src/campaign/stages/<campaign>.ts`: `enemy` holds `[unitId, x, z]` for team 1 (the right half; +x is away from the player, z is across). The counts are the card's: a formation gap moves units, never adds or drops one.
- Ground height is drawn, not simulated (AGENTS.md; example `tabs/hill.ts`). A cliff a man could walk into is a wall or obstacle.
Type-check with `node web/node_modules/typescript/bin/tsc --noEmit -p web/tsconfig.json`. Commit only that gap: subject `loop(N.k): [S|P|R] <itemId>: <gap>` plus the attribution lines. After each sub-batch but the last, one look: capture `--items <the sub-batch's item ids>` (writes `output/loop/look/`), and read each gap's named shot, and no other PNG: its element must be there and visible. The last sub-batch is looked at in step 5's capture instead (a gap reverted there has its item re-shot alone with capture `--iter N --items <id> --add`). A gap whose element is not visible, or after which the judge fails a criterion that passed, is reverted now (`git revert --no-edit <sha>`) and recorded in its item file's Attempts as `dropped`. At most 2 follow-up commits per gap per iteration (`loop(N.kb)`, `loop(N.kc)`): a gap still wrong after its second follow-up is reverted whole (`dropped`) and the cause goes into LESSONS. Before choosing a material colour, read `output/loop/palette.png` (`node loop/scripts/capture.mjs --palette` writes it) and take the code value whose swatch displays the target. Write each kept sha next to its gap in Focus. In LEDGER: append each `[S]` to Structural attempts, and update one row per tuning knob a commit changed (verdict `pending`, old value kept under earlier values). Add the gap to the item file's Attempts.

## 5. Capture evidence
Capture `--iter N --items <every item touched this iteration, plus every stage fought on a touched map>`. A `shot may miss` note, a `scene failed` note, a non-empty `pageErrors`, or a criterion the judge passed before and fails now is evidence trouble: fix its cause with a follow-up commit on the gap that caused it before the critic runs, or revert the gap.

## 6. One critic review
Spawn a fresh `Agent` (general-purpose, default model). Its prompt lists the evidence pack for the touched items, plus `loop/LEDGER.md`, the Verdicts block of each touched item's file (verbatim), and for each gap `[S|P|R] <item>.<letter> blocker <n> (<sha>)` with `git diff --stat <sha>^ <sha>` and `git diff <sha>^ <sha> -- <file>` for each file under 300 changed lines; nothing the worker wrote about the change (no commit subject, no gap description). State which gaps were attempted and nothing about how well you think they went. Save its answer verbatim to `output/loop/iter-N/critic.md`. In the same message, spawn step 7's CONFIRM for the touched items likely to be done.

## 7. Apply verdicts
- Each REJECT: `git revert --no-edit <sha>`. If the revert conflicts, `git revert --abort`, keep the code, mark it `rejected-kept`. Record it in the item file's Attempts and Rejected with attempts+1 and the top defect.
- Set each touched LEDGER row's verdict, and the gap's Structural attempts line, to the critic's verdict. A row attempted twice as `[P]` without approval becomes `spent`.
- Apply the critic's blocker strikes and additions to the item file's Verdicts, and the judge's script verdicts. Blockers not struck keep their text verbatim: a critic block that rewords or narrows one is applied as kept. A blocker joining two elements with "and" whose CLOSER says one clause cleared is split at the "and" and that clause struck. An added blocker is applied only when its `introduced by <sha> at <file:function>` names a hunk of this iteration's diff; otherwise it goes to the item's Notes. A criterion with 2 rejected `[S]` since its list was written, or 3 approved `[S]` in a row on it with no strike among them, is `plateau` (next pick on it is one `[R]`); an `[R]` rejected twice parks the criterion (`parked`). A criterion the CONFIRM critic has failed twice is `plateau` too, its `[R]` specified from every CONFIRM list it got. An item is `D` when every criterion PASSes (critic ones confirmed); `p` when every FAIL criterion it has is parked.
- CONFIRM before `D`: in the iteration an item would become `D` (this step or step 2's audit), spawn one more fresh `Agent` (general-purpose, default model) in CONFIRM mode on the would-be-done items alone. Spawned early in step 6 for items likely to be done (every FAIL blocker left is claimed by a gap this iteration), its answer counts only for items that end would-be-done; a would-be-done item it did not cover gets its own CONFIRM here. Its prompt lists the evidence pack for those items, their PNGs only; it says these items are proposed done and nothing about the first critic's verdicts, and names each criterion an earlier CONFIRM passed (the item file's Audited line) as confirmed. Locked list: it gives each item's Verdicts block (the struck lists) and says per critic criterion whether its list came from an AUDIT, from a CONFIRM, or is not kept (a pre-v11 PASS). A criterion is PASS only when both critics pass it; a criterion the confirmer fails gets back the blockers it re-opened plus its `glance:` blocker, if any (FAIL, 0 since N, list `from CONFIRM N`), and the item stays open; anything else the confirmer names goes to the item's Notes, not its list. Save its answer verbatim to `output/loop/iter-N/confirm.md`; the item file's Audited line gets `N (CONFIRM: passed a; failed b)`.
- Consecutive empty: reset to 0 if any gap struck a blocker or flipped a criterion, else +1. At 5, write the reason into a file named `STOP`.

## 8. Batch checkpoint
When this iteration leaves no item of a batch named on `Batch:` open (all `D` or `p`): `node loop/scripts/capture.mjs --iter N --regression-only` once (the unit-phase smoke suite: a scenario that errors, hangs or never ends goes into STATE Notes as the required first commit of the next iteration). After a map batch, also capture `--iter N --items <every stage fought on that batch's maps> --add`: a stage whose a or c a map change broke is re-opened (`o`) in its Scoreboard row with the judge's reasons as blockers. Then drop the name from `Batch:`. When `Batch:` would be empty, advance it to the next name in STATE's batch list; its items are unaudited (step 2 next iteration).

## 9. Write memory and commit
- Rewrite every touched `loop/items/<id>.md` (cap 3200 bytes: Verdicts, Ranked gaps left, Attempts, Rejected last 4, Notes max 3 lines). A struck blocker stays in Verdicts until the item is `D`, short: `s<n>. <element> in <shot> (struck N)` (the locked list CONFIRM re-checks). Attempts older than 10 iterations compact to one range line per criterion.
- In LEDGER drop Structural attempts older than 5 iterations and rows untouched for 25.
- Append to `loop/LESSONS.md` (one line under its heading) anything learned this iteration that is not about one item: a rendering or capture behaviour, a camera rule, a pattern that failed twice. Near its cap, merge duplicates.
- Rewrite `loop/STATE.md` fully: Iteration N, Batch, counters, the `Solo:` line (item, Queue, Rounds, Dry) while solo mode lasts, Scoreboard (every item's marks and status), Focus with shas and verdicts ending in `- <approved>/<total>, <struck> struck`, Last verdicts (critic header lines verbatim), Notes (max 5 lines).
- Each map that became `D` this iteration: `node loop/scripts/map-thumbs.mjs --items map.<id>[,map.<id>]` (its sandbox map-picker picture in `web/public/maps/thumbs/`; a failure goes to STATE Notes), committed with the docs.
- `node loop/scripts/budget.mjs` must pass (read its output before committing). Commit the docs: subject `loop(N): <batch> <approved>/<total> gaps approved`.
- `git push` (bare, no arguments). If it fails, note it in STATE Notes and carry on; the commit is what counts.
- End the turn with a two-line summary. Do not ask questions.
