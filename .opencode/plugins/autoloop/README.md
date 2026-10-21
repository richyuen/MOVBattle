# autoloop (OpenCode TUI)

A project-local port of `~/.claude/mods/autoloop` for OpenCode V2. It runs a prompt again and
again, each iteration in a fresh session, which is the OpenCode equivalent of `/clear`.

## Use

```
/autoloop on [max] [prompt]   # arm the loop; prompt defaults to "continue"
/autoloop off                 # stop after the running turn, if any
/autoloop status              # show the current iteration and prompt
```

Examples:

```
/autoloop on
/autoloop on 20 continue
/autoloop on 5 implement the next gap
```

`/autoloop on` arms the loop and immediately starts iteration 1. Each iteration:

1. creates a new session at the current location (so no prior context is carried over),
2. focuses that session in the current tab or router,
3. sends the loop prompt.

## Stop conditions

- a file named `STOP` in the working directory,
- the iteration limit passed to `on`,
- a turn that ends without a new commit, after a 60 second grace period,
- a failed or interrupted turn (the loop reports the reason instead of retrying).

A commit made during the grace period counts as the iteration finishing, so the loop continues
instead of stopping. A prompt you type while the loop runs no longer stops it: the turn is
answered in its own session and the loop carries on when that turn ends.

## State and log

The loop keeps its own state in `~/.local/share/opencode/autoloop.json` and appends one line per
arm, start, turn end, verdict and stop to `~/.local/share/opencode/autoloop.log` (rotated at
256 KB). Both live outside the project on purpose: the loop's preflight needs a clean
`git status`, so the plugin writes nothing into the repository. When the log says why a loop
stopped, that is the answer.

An armed loop survives a TUI restart. On load it resumes at the next iteration when the last
iteration ended with a commit, and switches itself off with a reason when it did not. A turn-end
event that never arrives is caught by a 10 second watchdog on the tracked session, which judges
that turn by hand instead of waiting forever.

## Files

- `logic.ts` - pure argument parsing and end-of-turn decisions.
- `logic.test.ts` - `bun test ./.opencode/plugins/autoloop/logic.test.ts`.
- `tui.ts` - the TUI entrypoint: `/autoloop`, session creation, event handling, grace timer,
  state file, debug log, watchdog.
- `index.ts` - no-op server entrypoint so the directory is a discoverable plugin.

## Differences from the Claude Code plugin

- The loop clears context by creating a new OpenCode session instead of issuing `/clear`.
- Background-task and cron wake-ups are not exposed to the TUI plugin API, so those two
  "wait" decisions are passed as zero. A failed or interrupted turn stops the loop instead.
- The loop resumes across a TUI restart from its own state file, and a typed prompt pauses
  rather than ends it.
