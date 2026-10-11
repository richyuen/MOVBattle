# Improvement loop: one iteration

You are the worker. Close gaps between MOVBattle and TABS. An adversarial critic judges your
work against reference media; you never judge it yourself. Follow these steps in order.

## 0. Preflight
- `git branch --show-current` must print `main`. `git status --porcelain` must be empty. No file named `STOP` in the repo root. `node loop/scripts/budget.mjs` must pass.
- On any failure: append `iter ? | preflight failed: <reason>` to `loop/LOG.md`, do not commit, end the turn.

## 1. Load memory (and nothing else)
- Read `loop/STATE.md` then `loop/REFERENCE_DIGEST.md`.
- Never read `progress.md`, `.omx/`, `web/*.md`, or `output/loop/*/full-state.json`. Never read a source file over 20 KB in full: use Grep and ranged reads. Never write to the auto-memory directory.
- N = Iteration in STATE + 1.

## 2. Re-audit when due
If N is a multiple of 5, or the ranked list has fewer than 3 pickable gaps: run `node loop/scripts/capture.mjs --iter N --showcase-only`, spawn the critic in RE-AUDIT mode (see step 6, give it the whole digest, all `reference/small/*.jpg`, all `reference/frames/gameplay_sheet_*.jpg`, and the new PNGs), and rewrite Scores and Ranked open gaps from its answer before continuing.

## 3. Pick 2-3 gaps
- Pickable: attempts < 2 and not listed under Rejected attempts. Take the top 2-3, preferring gaps that touch different files. Write them into Focus. Record `BASE=$(git rev-parse HEAD)`.

## 4. Implement, one commit per gap
For each focus gap: make the smallest change that moves it, touching only what it needs. Type-check with `node web/node_modules/typescript/bin/tsc --noEmit -p web/tsconfig.json`. Commit only that gap: subject `loop(N.k): <gap>` plus the attribution lines. Write the sha next to the gap in Focus.

## 5. Capture evidence
`node loop/scripts/capture.mjs --iter N` in the foreground (10 min timeout). Read only `output/loop/iter-N/summary.json`. If a scenario fails, fix it with a follow-up commit on the responsible gap, or `git revert --no-edit <sha>` that gap now and mark it rejected (reason: regression) before the critic runs.

## 6. One critic review
Spawn a fresh `Agent` (general-purpose). Its prompt lists, by path: `loop/CRITIC.md`, the digest sections for the focus dimensions, the reference files those sections name, every PNG in `output/loop/iter-N/`, `summary.json`, the Scores line from STATE, and for each gap its sha and `git show --stat <sha>` plus per-file diffs for files under 300 changed lines. State which gaps were attempted and nothing about how well you think they went.

## 7. Apply verdicts
- Each REJECT: `git revert --no-edit <sha>`. If the revert conflicts, `git revert --abort`, keep the code, mark it `rejected-kept`. Add the gap to Rejected attempts with attempts+1 and the top defect.
- Consecutive rejects: reset to 0 if any gap was approved, else +1. At 3, write the reason into a file named `STOP`.

## 8. Write memory and commit
- Rewrite `loop/STATE.md` fully: Iteration N, Scores, Focus with verdicts, Last verdicts (critic header lines verbatim), Ranked open gaps (critic's list, max 8), Rejected attempts (last 5), Notes (max 5 lines).
- Append to `loop/LOG.md`: `iter N | <gap ids> | <approved>/<total> approved | scores <before> -> <after>`.
- `node loop/scripts/budget.mjs` must pass. Commit the docs: subject `loop(N): <approved>/<total> gaps approved`.
- `git push` (bare, no arguments). If it fails, note it in LOG.md and carry on; the commit is what counts.
- End the turn with a two-line summary. Do not ask questions.
