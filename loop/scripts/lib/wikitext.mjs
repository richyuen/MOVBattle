// MediaWiki wikitext helpers for the TABS wiki (tabs.wiki.gg): template extraction with nested-brace matching, value cleaning, sections.
// Pure string work on untrusted text; nothing here evaluates or imports what it reads.

/** Every {{Name ...}} template body in `text` as [{ params: {key: raw}, order: [keys] }], nested braces and links respected. */
export function extractTemplates(text, name) {
  const out = [];
  const open = new RegExp(`\\{\\{\\s*${name}\\s*(?=[|}\\n])`, "g");
  let m;
  while ((m = open.exec(text))) {
    const start = m.index;
    let i = start + 2;
    let depth = 1;
    let link = 0;
    for (; i < text.length && depth > 0; i++) {
      const two = text.slice(i, i + 2);
      if (two === "{{") { depth++; i++; }
      else if (two === "}}") { depth--; i++; }
      else if (two === "[[") { link++; i++; }
      else if (two === "]]") { link = Math.max(0, link - 1); i++; }
    }
    const body = text.slice(start + m[0].length, i - 2);
    out.push(parseParams(body));
    open.lastIndex = i;
  }
  return out;
}

/** Split a template body on top-level pipes into key=value params. Positional params get numeric keys. */
function parseParams(body) {
  const parts = [];
  let depth = 0, link = 0, tag = 0, cur = "";
  for (let i = 0; i < body.length; i++) {
    const two = body.slice(i, i + 2);
    if (two === "{{") { depth++; cur += two; i++; continue; }
    if (two === "}}") { depth--; cur += two; i++; continue; }
    if (two === "[[") { link++; cur += two; i++; continue; }
    if (two === "]]") { link--; cur += two; i++; continue; }
    // <tabber>...</tabber> and <gallery>...</gallery> carry pipes of their own
    if (body[i] === "<" && /^<(tabber|gallery)\b/.test(body.slice(i))) tag++;
    if (body[i] === "<" && /^<\/(tabber|gallery)\b/.test(body.slice(i))) tag--;
    if (body[i] === "|" && depth === 0 && link === 0 && tag === 0) { parts.push(cur); cur = ""; continue; }
    cur += body[i];
  }
  parts.push(cur);
  const params = {};
  const order = [];
  let pos = 1;
  for (const p of parts.slice(1)) {
    const eq = p.indexOf("=");
    const key = (eq >= 0 ? p.slice(0, eq) : String(pos++)).trim();
    const val = (eq >= 0 ? p.slice(eq + 1) : p).trim();
    params[key] = val;
    order.push(key);
  }
  return { params, order };
}

/** Template targets ({{Image|X|..}}, {{HDIcon|X}}, {{HDIcon1|X}}) and [[X]] links in a raw value, as page titles. */
export function targets(raw) {
  const out = [];
  const t = /\{\{\s*(Image|HDIcon1?|Icon)\s*\|\s*([^|}]+)/g;
  let m;
  while ((m = t.exec(raw))) out.push(m[2].trim());
  const l = /\[\[([^\]|#]+)(?:[|#][^\]]*)?\]\]/g;
  while ((m = l.exec(raw))) if (!/^File:/i.test(m[1])) out.push(m[1].trim());
  return [...new Set(out)];
}

/** Plain text of a raw value: known templates reduced to their meaning, links to their label, markup stripped. */
export function clean(raw) {
  let v = String(raw ?? "");
  for (let k = 0; k < 8; k++) {
    const before = v;
    v = v
      .replace(/<tabber>[\s\S]*?<\/tabber>/g, "")
      .replace(/<gallery[^>]*>[\s\S]*?<\/gallery>/g, "")
      .replace(/<ref[^>]*>[\s\S]*?<\/ref>/g, "")
      .replace(/<ref[^>]*\/>/g, "")
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/\{\{\s*(Money|WM|Hp|HP)\s*\|\s*([^|}]*)\s*\}\}/g, "$2")
      .replace(/\{\{\s*Tooltip\s*\|\s*([^|}]*)\s*\|\s*([^|}]*)\s*\}\}/g, "$1 ($2)")
      .replace(/\{\{\s*(Image|HDIcon1?|Icon)\s*\|\s*([^|}]*)(?:\|[^}]*)?\}\}/g, "$2")
      .replace(/\{\{\s*List\s*\|([^}]*)\}\}/g, (_, body) => body.split("|").map((s) => s.trim()).filter(Boolean).join(" "))
      .replace(/\[\[File:[^\]]*\]\]/gi, "")
      .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, "$2")
      .replace(/\[\[([^\]]+)\]\]/g, "$1")
      .replace(/\{\{[^{}]*\}\}/g, "")
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/<\/?(center|small|big|span|div|b|i|u|sup|sub|nowiki|code)[^>]*>/gi, "")
      .replace(/'''?/g, "");
    if (v === before) break;
  }
  return v.replace(/[ \t]+/g, " ").replace(/\s*\n\s*/g, "\n").trim();
}

/** Section bodies keyed by heading (level 2 and 3), raw wikitext. */
export function sections(text) {
  const out = {};
  const re = /^={2,3}\s*(.+?)\s*={2,3}\s*$/gm;
  let m, last = null, lastEnd = 0;
  while ((m = re.exec(text))) {
    if (last) out[last] = text.slice(lastEnd, m.index);
    last = m[1].trim();
    lastEnd = m.index + m[0].length;
  }
  if (last) out[last] = text.slice(lastEnd);
  return out;
}

/** Prose of a section: cleaned, paragraphs joined, cut at `max` chars on a sentence boundary. */
export function prose(raw, max = 900) {
  let v = clean(raw ?? "").replace(/\n+/g, " ").replace(/\s+/g, " ").trim();
  if (v.length <= max) return v;
  const cut = v.lastIndexOf(". ", max);
  return (cut > max * 0.5 ? v.slice(0, cut + 1) : v.slice(0, max)).trim();
}

/** [[File:X]] and gallery File titles in raw text, in order. */
export function fileTitles(raw) {
  const out = [];
  const a = /\[\[File:([^\]|]+)/gi;
  let m;
  while ((m = a.exec(raw))) out.push(m[1].trim());
  const g = /<gallery[^>]*>([\s\S]*?)<\/gallery>/gi;
  while ((m = g.exec(raw))) for (const line of m[1].split("\n")) {
    const t = line.replace(/^\s*File:/i, "").split("|")[0].trim();
    if (/\.(png|jpe?g|gif|webp)$/i.test(t)) out.push(t);
  }
  return [...new Set(out)];
}

export function num(v) {
  const m = /-?\d[\d,]*(?:\.\d+)?/.exec(clean(v).replace(/^\s*[~≈]/, ""));
  return m ? Number(m[0].replace(/,/g, "")) : null;
}

/** "60 - 120" or "60-120" or "90" -> { min, max, avg } */
export function range(v) {
  const s = clean(v);
  const m = /(-?\d[\d,]*(?:\.\d+)?)\s*(?:-|–|to)\s*(-?\d[\d,]*(?:\.\d+)?)/.exec(s);
  if (m) {
    const a = Number(m[1].replace(/,/g, "")), b = Number(m[2].replace(/,/g, ""));
    return { min: a, max: b, avg: (a + b) / 2 };
  }
  const n = num(s);
  return n === null ? null : { min: n, max: n, avg: n };
}

/** "1.00x" -> 1 */
export function mult(v) {
  const m = /(-?\d+(?:\.\d+)?)\s*x/i.exec(clean(v));
  return m ? Number(m[1]) : num(v);
}
