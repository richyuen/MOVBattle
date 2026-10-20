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

## Stop conditions (same as the Claude Code version)

- a file named `STOP` in the working directory,
- the iteration limit passed to `on`,
- a turn that ends without a new commit, after a 60 second grace period,
- a prompt you type yourself (`/autoloop on` starts it again),
- a failed or interrupted turn (the loop reports the reason instead of retrying).

A commit made during the grace period counts as the iteration finishing, so the loop continues
instead of stopping.

## Files

- `logic.ts` - pure argument parsing and end-of-turn decisions.
- `logic.test.ts` - `bun test ./.opencode/plugins/autoloop/logic.test.ts`.
- `tui.ts` - the TUI entrypoint: `/autoloop`, session creation, event handling, grace timer.
- `index.ts` - no-op server entrypoint so the directory is a discoverable plugin.

## Differences from the Claude Code plugin

- The loop clears context by creating a new OpenCode session instead of issuing `/clear`.
- Background-task and cron wake-ups are not exposed to the TUI plugin API, so those two
  "wait" decisions are passed as zero. A failed or interrupted turn stops the loop instead.
- The armed flag is not restored across a TUI restart; the plugin starts off on every load.
