# Improvement loop: one iteration

You are the worker. Close gaps between MOVBattle and TABS. An adversarial critic judges your
work against reference media; you never judge it yourself. The loop works coarse to fine: it
adds or replaces mechanisms first and tunes constants only as fallout of a mechanism that was
approved. Follow these steps in order.

## 0. Preflight
- `git branch --show-current` must print `main`. `git status --porcelain` must be empty. No file named `STOP` in the repo root. `node loop/scripts/budget.mjs` must pass.
- On any failure: append `iter ? | preflight failed: <reason>` to `loop/LOG.md`, do not commit, end the turn.

## 1. Load memory (and nothing else)
- Read `loop/STATE.md`, `loop/LEDGER.md`, then `loop/REFERENCE_DIGEST.md`.
- Never read `progress.md`, `.omx/`, `web/*.md`, `loop/LOG.md`, or `output/loop/*/full-state.json`. Never read a source file over 20 KB in full: use Grep and ranged reads. Never write to the auto-memory directory.
- N = Iteration in STATE + 1.

## 2. Re-audit when due
If N is a multiple of 5, or Criteria in STATE says `unscored`, or fewer than 2 structural gaps are pickable: run `node loop/scripts/capture.mjs --iter N --showcase-only`, spawn the critic in RE-AUDIT mode (see step 6; give it the whole digest, `loop/LEDGER.md`, all `reference/small/*.jpg`, all `reference/frames/gameplay_sheet_*.jpg`, and the new PNGs), and rewrite Criteria and Ranked open gaps from its answer before continuing.

## 3. Pick gaps: structural first
- A gap is `[S]` structural (adds or replaces a mechanism: a pose state, a prop mesh, an effect, a camera rule, a map prop; up to 3 files and 300 changed lines, one failing criterion) or `[P]` polish (constants, colours, sizes; up to 2 files and 20 lines).
- Pickable: attempts < 2, and not spent in LEDGER. Take the top 2 pickable `[S]` gaps, in ranked order, from different dimensions when possible. Then take up to 2 pickable `[P]` gaps, but only ones the critic listed as fallout of an `[S]` gap approved within the last 3 iterations. Never pick a `[P]` gap on a criterion with no `[S]` attempt in the last 10 iterations. Both windows are read from Structural attempts in LEDGER, nowhere else.
- Read Rejected attempts and the LEDGER rows for every identifier you intend to touch. Write the picks into Focus. Record `BASE=$(git rev-parse HEAD)`.

## 4. Implement, one commit per gap
For each focus gap, in order: make the change that closes its criterion, touching only what it needs. An `[S]` gap must change behaviour or geometry, not only numbers. Type-check with `node web/node_modules/typescript/bin/tsc --noEmit -p web/tsconfig.json`. Commit only that gap: subject `loop(N.k): [S|P] <gap>` plus the attribution lines. Write the sha next to the gap in Focus. In LEDGER: append the gap to Structural attempts if it is `[S]`, and update one row per tuning knob the commit changed (not per line; verdict `pending`, old value kept under earlier values).

Evidence edits: if a focus gap cannot be seen in the capture set (no shot at the right time, wrong angle), edit `loop/scripts/capture.mjs` first and commit it alone as `loop(N.0): evidence - <what>`. The critic does not score it. Shots must stay deterministic (time through `window.advanceTime` only).

## 5. Capture evidence
`node loop/scripts/capture.mjs --iter N` in the foreground (10 min timeout). Read only `output/loop/iter-N/summary.json`. If a scenario fails, fix it with a follow-up commit on the responsible gap, or `git revert --no-edit <sha>` that gap now and mark it rejected (reason: regression) before the critic runs.

## 6. One critic review
Spawn a fresh `Agent` (general-purpose). Its prompt lists, by path: `loop/CRITIC.md`, `loop/LEDGER.md`, the digest sections for the focus dimensions, the reference files those sections name, every PNG in `output/loop/iter-N/`, `summary.json`, the Criteria block from STATE, and for each gap its tag, sha and `git show --stat <sha>` plus per-file diffs for files under 300 changed lines. State which gaps were attempted and nothing about how well you think they went.

## 7. Apply verdicts
- Each REJECT: `git revert --no-edit <sha>`. If the revert conflicts, `git revert --abort`, keep the code, mark it `rejected-kept`. Add the gap to Rejected attempts with attempts+1 and the top defect.
- Set each touched LEDGER row's verdict, and the gap's Structural attempts line, to the critic's verdict. A row attempted twice as `[P]` without approval becomes `spent`.
- Consecutive rejects: reset to 0 if any gap was approved, else +1. At 3, write the reason into a file named `STOP`.

## 8. Write memory and commit
- In LEDGER drop Structural attempts older than 10 iterations and rows untouched for 40.
- Rewrite `loop/STATE.md` fully: Iteration N, Criteria (from the last audit, with the critic's per-gap criterion flips applied), Focus with verdicts, Last verdicts (critic header lines verbatim), Ranked open gaps (critic's list, max 8, tags kept), Rejected attempts (last 8), Notes (max 5 lines).
- Append to `loop/LOG.md`: `iter N | <gap ids with tags> | <approved>/<total> approved | passes <before> -> <after>`.
- `node loop/scripts/budget.mjs` must pass. Commit the docs: subject `loop(N): <approved>/<total> gaps approved`.
- `git push` (bare, no arguments). If it fails, note it in LOG.md and carry on; the commit is what counts.
- End the turn with a two-line summary. Do not ask questions.
