// One Word From Your Ex — entry program.
//
// Writes exactly one word to the output path the kit requires
// (/output/entry.txt) and validates it against the sealed gate the
// competition publishes in competition.yaml / RULES.txt:
//
//   * the file is UTF-8 text of 1 to 24 characters
//   * it is not only white space
//   * it is exactly one word (no spaces, no punctuation, no newline)
//
// The word itself was chosen in this session for the judge's brief:
// a single word an ex would plausibly say about a partner they once
// had, that lands instantly, stings because it is true, and carries
// a sharp turn — the word everyone expects is "unforgettable".
//
// Revision note (thinking_revised fix): the write path now verifies
// the file after writing — the bytes on disk are read back and
// compared against the encoded word, so a truncated, mis-encoded or
// empty write fails loudly instead of being reported as success.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

// The one word. 11 characters, plain ASCII, no trailing newline so the
// file is byte-for-byte the word itself.
const WORD = "forgettable";

// The gate, mirrored from the competition rules.
const GATE = {
  minChars: 1,
  maxChars: 24,
  maxBytes: 24,
  // One word an ex would say: plain letters only.
  singleWordPattern: /^[A-Za-z]+$/,
} as const;

class GateError extends Error {
  constructor(message: string) {
    super(`gate: ${message}`);
    this.name = "GateError";
  }
}

/**
 * Validate the entry word against every rule the sealed gate checks.
 * Throws a GateError on the first failing rule; returns the word
 * unchanged when it passes, so validation can never alter the output.
 */
function validateEntry(word: unknown): string {
  if (typeof word !== "string") {
    throw new GateError("entry must be a string");
  }
  if (word.length < GATE.minChars) {
    throw new GateError("entry must not be empty");
  }
  if (word.length > GATE.maxChars) {
    throw new GateError(
      `entry is ${word.length} characters, max is ${GATE.maxChars}`,
    );
  }
  if (word.trim().length === 0) {
    throw new GateError("entry must not be only white space");
  }
  if (/\s/.test(word)) {
    throw new GateError("entry must be exactly one word (no white space)");
  }
  if (/[\u0000-\u001f\u007f]/.test(word)) {
    throw new GateError("entry must not contain control characters");
  }
  if (!GATE.singleWordPattern.test(word)) {
    throw new GateError("entry must be a single alphabetic word");
  }
  return word;
}

/** Encode the validated word as UTF-8 and check the byte budget too. */
function encodeEntry(word: string): Buffer {
  const encoded = Buffer.from(word, "utf8");
  if (encoded.length > GATE.maxBytes) {
    throw new GateError(
      `entry is ${encoded.length} bytes, max is ${GATE.maxBytes}`,
    );
  }
  // Round-trip guard: the bytes must decode back to the exact word,
  // so no encoding surprise can reach the file.
  if (encoded.toString("utf8") !== word) {
    throw new GateError("entry does not round-trip through UTF-8");
  }
  return encoded;
}

/**
 * Candidate output paths, in order. The grader runs the program with
 * /output mounted; a local run may not have it, so fall back to a
 * local ./output directory. MAKEFUN_OUTPUT overrides both. The file
 * content is identical whichever path wins.
 */
function resolveOutputPaths(): string[] {
  const candidates = [
    process.env.MAKEFUN_OUTPUT,
    "/output/entry.txt",
    new URL("./output/entry.txt", import.meta.url).pathname,
  ];
  return candidates.filter((path): path is string => Boolean(path));
}

/**
 * Write the encoded entry to the first writable candidate path and
 * verify it afterwards: read the file back and require the bytes to
 * match exactly. Returns the path that was written.
 */
function writeAndVerifyEntry(encoded: Buffer): string {
  let lastError: unknown;
  for (const path of resolveOutputPaths()) {
    try {
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path, encoded);
      const onDisk = readFileSync(path);
      if (!onDisk.equals(encoded)) {
        throw new Error(
          `verify-after-write failed for ${path}: ` +
            `expected ${encoded.length} bytes, read ${onDisk.length} bytes`,
        );
      }
      return path;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

function main(): void {
  const word = validateEntry(WORD);
  const encoded = encodeEntry(word);
  const path = writeAndVerifyEntry(encoded);
  console.log(
    `wrote ${word.length}-character entry to ${path} (verified ${encoded.length} bytes)`,
  );
}

main();
