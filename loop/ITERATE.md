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
If N is a multiple of 5, or any criterion in STATE is `unscored` (tier 2 is scored once a dimension's a-d all pass), or fewer than 2 structural gaps are pickable: run `node loop/scripts/capture.mjs --iter N --showcase-only`, spawn the critic in RE-AUDIT mode (see step 6; give it the whole digest, `loop/LEDGER.md`, the Criteria block from STATE verbatim (its previous verdicts and blockers), all `reference/small/*.jpg`, all `reference/frames/gameplay_sheet_*.jpg`, and the new PNGs), and rewrite Criteria and Ranked open gaps from its answer before continuing.

## 3. Pick gaps: structural first
- A gap is `[S]` structural (adds or replaces a mechanism: a pose state, a prop mesh, an effect, a camera rule, a map prop; up to 3 files and 300 changed lines, one failing criterion) or `[P]` polish (constants, colours, sizes; up to 2 files and 20 lines).
- A third kind, `[R]` rebuild, is the escalation for a criterion marked `plateau`: one commit that replaces the mechanism owning the criterion and clears its whole blocker list, up to 5 files and 600 lines, designed from a spec, not from the latest defect. At most one `[R]` per iteration; it takes one of the two structural slots.
- Pickable: attempts < 2, not spent in LEDGER, its criterion not marked `plateau` in Criteria (a `plateau` criterion is pickable only by `[R]`), and for a tier-2 criterion (e-h) only once its dimension's a-d all pass. Take the top 2 pickable `[S]` gaps, in ranked order, on two different criteria, and not the same pair of criteria as the previous iteration's `[S]` picks (Structural attempts in LEDGER); each must clear a numbered blocker of its criterion. A blocker reading `no evidence` is cleared by an evidence commit (step 4), not a gap. Then take at most 1 pickable `[P]` gap, only one the critic listed as fallout of an `[S]` gap approved within the last 3 iterations, whose NEXT line names the shot it shows in. Never pick a `[P]` gap on a criterion with no `[S]` attempt in the last 10 iterations. Both windows are read from Structural attempts in LEDGER, nowhere else.
- Evidence first: if any criterion carries a `no evidence` blocker, take the first one (Criteria order) every iteration, on top of the gaps. Add the shot it asks for as a `loop(N.0): evidence` commit (step 4). If the feature cannot be shot because it does not exist in the game, rewrite the blocker as `missing: <feature>`; it is then an ordinary blocker for an `[S]`.
- Read Rejected attempts and the LEDGER rows for every identifier you intend to touch. Write the picks into Focus. Record `BASE=$(git rev-parse HEAD)`.

## 4. Implement, one commit per gap
For each focus gap, in order: make the change that closes its criterion, touching only what it needs. An `[S]` gap must change behaviour or geometry, not only numbers. An `[R]` gap starts with the spec: a comment block at the head of the rewritten mechanism stating the target proportions, poses or shapes read off the reference files (ratios, angles, counts), then code that meets it; it may delete the old mechanism. Type-check with `node web/node_modules/typescript/bin/tsc --noEmit -p web/tsconfig.json`. Before committing an `[S]` or `[R]`, look: `node loop/scripts/capture.mjs --only <shot>` (the shot the gap names; a few minutes, it still runs the scenes before it) writes `output/loop/look/<shot>.png`; read it and check the blocker's element is there and visible. If it is not, keep working or drop the gap uncommitted; a commit the critic cannot see in a shot is a wasted review. Commit only that gap: subject `loop(N.k): [S|P] <gap>` plus the attribution lines. Write the sha next to the gap in Focus. In LEDGER: append the gap to Structural attempts if it is `[S]`, and update one row per tuning knob the commit changed (not per line; verdict `pending`, old value kept under earlier values).

Evidence edits: if a focus gap cannot be seen in the capture set (no shot at the right time, wrong angle), edit `loop/scripts/capture.mjs` first and commit it alone as `loop(N.0): evidence - <what>`. The critic does not score it. Shots must stay deterministic (time through `window.advanceTime` only).

## 5. Capture evidence
`node loop/scripts/capture.mjs --iter N` in the foreground (10 min timeout). Read only `output/loop/iter-N/summary.json`. A note `shot may miss: ...` names what was not ready for a shot: fix that cause first (it is evidence, not a gap) or the critic judges a hollow frame. If a scenario fails, fix it with a follow-up commit on the responsible gap, or `git revert --no-edit <sha>` that gap now and mark it rejected (reason: regression) before the critic runs.

## 6. One critic review
Spawn a fresh `Agent` (general-purpose). Its prompt lists, by path: `loop/CRITIC.md`, `loop/LEDGER.md`, the digest sections for the focus dimensions, the reference files those sections name, every PNG in `output/loop/iter-N/`, `summary.json`, the Criteria block from STATE, and for each gap its tag, sha and `git show --stat <sha>` plus per-file diffs for files under 300 changed lines. State which gaps were attempted and nothing about how well you think they went.

## 7. Apply verdicts
- Each REJECT: `git revert --no-edit <sha>`. If the revert conflicts, `git revert --abort`, keep the code, mark it `rejected-kept`. Add the gap to Rejected attempts with attempts+1 and the top defect.
- Set each touched LEDGER row's verdict, and the gap's Structural attempts line, to the critic's verdict. A row attempted twice as `[P]` without approval becomes `spent`.
- Apply the critic's blocker strikes and additions to the Criteria block. A criterion with 4 or more approved `[S]` since its blocker list was written and still FAIL is marked `plateau`: no `[S]` is picked on it; the next pick on it is one `[R]`, and the mark clears when a re-audit rewrites its blockers or the `[R]` is approved.
- Consecutive rejects: reset to 0 if any gap was approved, else +1. At 3, write the reason into a file named `STOP`.

## 8. Write memory and commit
- In LEDGER drop Structural attempts older than 10 iterations and rows untouched for 40.
- Rewrite `loop/STATE.md` fully: Iteration N, Criteria (verdict, blockers and approved-[S]-since count per criterion, with this iteration's flips, strikes and `plateau` marks applied), Focus with verdicts, Last verdicts (critic header lines verbatim), Ranked open gaps (critic's list, max 8, tags kept), Rejected attempts (last 8), Notes (max 5 lines).
- Append to `loop/LOG.md`: `iter N | <gap ids with tags> | <approved>/<total> approved | passes <before> -> <after>`.
- `node loop/scripts/budget.mjs` must pass. Commit the docs: subject `loop(N): <approved>/<total> gaps approved`.
- `git push` (bare, no arguments). If it fails, note it in LOG.md and carry on; the commit is what counts.
- End the turn with a two-line summary. Do not ask questions.
