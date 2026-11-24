// commuter-forecast-01 — one line of weather forecast for a city that isn't.
// Writes the entry to $MAKEFUN_OUTPUT_DIR/entry.txt (fallback $OUTPUT_DIR,
// default /output, never "."). Deterministic: same bytes on every run.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "In Bramblewick, drizzle till nine, then sunshine \u2014 the 8:15 bus waits for you, and your umbrella finally gets the morning off.";

const MAX_CHARS = 140;

function validate(text) {
  const chars = [...text].length;
  if (chars < 1 || chars > MAX_CHARS) {
    throw new Error(`entry must be 1-${MAX_CHARS} characters, got ${chars}`);
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  if (text !== text.trim()) {
    throw new Error("entry must not have leading or trailing whitespace");
  }
  if (/[\u0000-\u001f\u007f]/.test(text)) {
    throw new Error("entry must not contain control characters");
  }
}

validate(ENTRY);

const outDir =
  process.env.MAKEFUN_OUTPUT_DIR || process.env.OUTPUT_DIR || "/output";
if (outDir === ".") {
  throw new Error('output dir must never be "."');
}
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY, "utf8");

// Read back and verify byte-for-byte, no trailing newline added.
const back = readFileSync(outPath, "utf8");
if (back !== ENTRY) {
  throw new Error("entry.txt does not match the entry exactly");
}
console.log(`wrote ${outPath} (${[...ENTRY].length} chars, 1 line)`);
