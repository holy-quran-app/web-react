/**
 * Parses the Al Quran Cloud tajweed markup format into HTML.
 *
 * The API returns text with bracket-based annotations:
 *   [code[content]]        e.g. [n[ـٰ]]
 *   [code:number[content]] e.g. [h:11[ٱ]]
 *
 * Mapping from the official tajweed guide: https://alquran.cloud/tajweed-guide
 */

const CODE_TO_CLASS: Record<string, string> = {
  h: "ham_wasl",      // Hamzat ul Wasl
  s: "slnt",          // Silent
  l: "slnt",          // Lam Shamsiyyah
  n: "madda_normal",  // Normal Prolongation (2 vowels)
  p: "madda_permissible", // Permissible Prolongation (2, 4, or 6 vowels)
  m: "madda_necessary",  // Necessary Prolongation (6 vowels)
  o: "madda_obligatory", // Obligatory Prolongation (4-5 vowels)
  q: "qlq",           // Qalqalah
  c: "ikhf_shfw",     // Ikhfa' Shafawi (with Meem)
  f: "ikhf",          // Ikhfa'
  w: "idghm_shfw",    // Idgham Shafawi (with Meem)
  i: "iqlb",          // Iqlab
  a: "idgh_ghn",      // Idgham with Ghunnah
  u: "idgh_w_ghn",    // Idgham without Ghunnah
  d: "idgh_mus",      // Idgham Mutajanisayn
  b: "idgh_mus",      // Idgham Mutaqaribayn
  g: "ghn",           // Ghunnah (2 vowels)
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function parseTajweedMarkup(raw: string): string {
  const result: string[] = [];
  let i = 0;

  while (i < raw.length) {
    if (raw[i] === "[") {
      const match = parseTag(raw, i);
      if (match) {
        const cssClass = CODE_TO_CLASS[match.code];
        if (cssClass) {
          result.push(
            `<span class="${cssClass}">${escapeHtml(match.content)}</span>`,
          );
        } else {
          result.push(escapeHtml(match.content));
        }
        i = match.endIndex;
        continue;
      }
    }

    // Regular character or unrecognised '[' — collect plain text run
    const start = i;
    i++;
    while (i < raw.length && raw[i] !== "[") {
      i++;
    }
    result.push(escapeHtml(raw.substring(start, i)));
  }

  return result.join("");
}

interface TagMatch {
  code: string;
  content: string;
  endIndex: number;
}

function parseTag(raw: string, start: number): TagMatch | null {
  if (raw[start] !== "[") return null;

  let i = start + 1;

  // Read code letter (single char a-z)
  if (i >= raw.length || !/[a-z]/.test(raw[i])) return null;
  const code = raw[i];
  i++;

  // Optionally skip :number
  if (i < raw.length && raw[i] === ":") {
    i++;
    while (i < raw.length && /[0-9]/.test(raw[i])) {
      i++;
    }
  }

  // Expect '[' to start content
  if (i >= raw.length || raw[i] !== "[") return null;
  i++; // skip '['

  // Read content until ']]' (closing bracket for content + closing bracket for tag)
  const contentStart = i;
  while (i < raw.length && raw[i] !== "]") {
    i++;
  }
  if (i >= raw.length) return null;

  const content = raw.substring(contentStart, i);
  i++; // skip first ']'

  // Skip optional second ']' that closes the outer tag
  if (i < raw.length && raw[i] === "]") {
    i++;
  }

  return { code, content, endIndex: i };
}
