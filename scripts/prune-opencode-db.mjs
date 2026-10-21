// Prune OpenCode's session store. Every screenshot a session reads is kept inline as base64 in
// `session_message`, so the loop's captures grow `opencode.db` by tens of MB per iteration.
//
//   node scripts/prune-opencode-db.mjs                     report only
//   node scripts/prune-opencode-db.mjs --apply             strip inline images older than --before
//   node scripts/prune-opencode-db.mjs --apply --vacuum    ...then compact the file (takes a while)
//
// Options: --db <path> (default ~/.local/share/opencode/opencode.db), --before <iso>
// (default: today 00:00 UTC). Text, tool calls and every other part of a message are kept: an
// image part becomes a one-line "[image/png image removed from history: name]" text part.
// Needs Node 22.5+ for node:sqlite, and no OpenCode running for a clean --vacuum.
import { DatabaseSync } from "node:sqlite";
import { homedir } from "node:os";
import { join } from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const at = argv.indexOf(`--${name}`);
  return at >= 0 && argv[at + 1] !== undefined ? argv[at + 1] : fallback;
};
const dbPath = flag("db", join(homedir(), ".local", "share", "opencode", "opencode.db"));
const before = flag("before", new Date(new Date().toISOString().slice(0, 10) + "T00:00:00Z").toISOString());
const apply = argv.includes("--apply");
const vacuum = argv.includes("--vacuum");
const cutoff = Date.parse(before);
if (Number.isNaN(cutoff)) {
  console.error("--before must be an ISO date");
  process.exit(1);
}

const db = new DatabaseSync(dbPath);
db.exec("PRAGMA busy_timeout = 60000");
const rows = db
  .prepare("SELECT COUNT(*) AS n, COALESCE(SUM(LENGTH(data)), 0) AS bytes FROM session_message WHERE time_created < ? AND instr(data, 'data:image') > 0")
  .get(cutoff);
console.log(`${dbPath}`);
console.log(`messages with inline images before ${before}: ${rows.n} (${(rows.bytes / 1048576).toFixed(0)} MB)`);
if (!apply) {
  console.log("report only; pass --apply to strip them");
  db.close();
  process.exit(0);
}

const IMAGE_URI = /^data:image\/[a-zA-Z0-9.+-]+;base64,/;
const swap = (part) => {
  if (!part || typeof part !== "object") return part;
  if (part.type === "file" && typeof part.uri === "string" && IMAGE_URI.test(part.uri)) {
    const mime = part.uri.slice(5, part.uri.indexOf(";"));
    const name = typeof part.filename === "string" ? part.filename : typeof part.name === "string" ? part.name : "";
    return { type: "text", text: `[${mime} image removed from history${name ? `: ${name}` : ""}]` };
  }
  if (Array.isArray(part)) return part.map(swap);
  const out = {};
  for (const [k, v] of Object.entries(part)) out[k] = typeof v === "object" && v !== null ? swap(v) : v;
  return out;
};

const ids = db
  .prepare("SELECT id FROM session_message WHERE time_created < ? AND instr(data, 'data:image') > 0 ORDER BY time_created")
  .all(cutoff)
  .map((r) => r.id);
const read = db.prepare("SELECT data FROM session_message WHERE id = ?");
const write = db.prepare("UPDATE session_message SET data = ? WHERE id = ?");
let done = 0;
let freed = 0;
for (const id of ids) {
  const row = read.get(id);
  if (!row) continue;
  let next;
  try {
    next = JSON.stringify(swap(JSON.parse(row.data)));
  } catch {
    next = row.data.replace(/"?data:image\/[a-zA-Z0-9.+-]+;base64,[^"]*"?/g, '"[image removed]"');
  }
  if (next.length >= row.data.length) continue;
  freed += row.data.length - next.length;
  write.run(next, id);
  done++;
  if (done % 200 === 0) console.log(`${done}/${ids.length}, ${(freed / 1048576).toFixed(0)} MB freed`);
}
console.log(`rewrote ${done} rows, ${(freed / 1048576).toFixed(0)} MB freed`);
db.exec("PRAGMA wal_checkpoint(TRUNCATE)");
if (vacuum) {
  console.log("vacuuming (the file is rewritten; this needs a free exclusive lock)");
  db.exec("VACUUM");
  db.exec("PRAGMA wal_checkpoint(TRUNCATE)");
}
db.close();
console.log("done");
