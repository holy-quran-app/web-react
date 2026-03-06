/**
 * Parses the Al Quran Cloud tajweed markup format into HTML.
 *
 * The API returns text with bracket-based annotations:
 *   [code[content]]       e.g. [n[ـٰ]]
 *   [code:number[content]] e.g. [h:11[ٱ]]
 *
 * Code-to-CSS-class mapping (standard tajweed color coding):
 *   h → ham_wasl       (Hamzatul Wasl)
 *   l → lpieces_letter (Lam Shamsiyya)
 *   s → slnt           (Silent letter)
 *   n → madda_normal   (Normal Madd / Natural prolongation)
 *   p → madda_permissible (Permissible Madd / Jaa'iz)
 *   m → madda_necessary   (Necessary Madd / Laazim)
 *   o → madda_obligatory  (Obligatory Madd / Waajib)
 *   u → madda_necessary   (Necessary Madd variant)
 *   q → qlq            (Qalqala)
 *   f → ikhpieces      (Ikhfa / Hiding)
 *   g → ghunnah        (Ghunna / Nasalisation)
 *   i → imark          (Idgham / Assimilation)
 *   a → imark_n        (Idgham without Ghunna)
 */

const CODE_TO_CLASS: Record<string, string> = {
  h: "ham_wasl",
  l: "lpieces_letter",
  s: "slnt",
  n: "madda_normal",
  p: "madda_permissible",
  m: "madda_necessary",
  o: "madda_obligatory",
  u: "madda_necessary",
  q: "qlq",
  f: "ikhpieces",
  g: "ghunnah",
  i: "imark",
  a: "imark_n",
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
      // Try to match [code:number[content]] or [code[content]]
      const match = parseTag(raw, i);
      if (match) {
        const cssClass = CODE_TO_CLASS[match.code];
        if (cssClass) {
          result.push(
            `<span class="${cssClass}">${escapeHtml(match.content)}</span>`,
          );
        } else {
          // Unknown code, render content without styling
          result.push(escapeHtml(match.content));
        }
        i = match.endIndex;
        continue;
      }
    }

    // Regular character — collect plain text run
    const start = i;
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
  // Must start with '['
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

  // Read content until ']'
  const contentStart = i;
  while (i < raw.length && raw[i] !== "]") {
    i++;
  }
  if (i >= raw.length) return null;

  const content = raw.substring(contentStart, i);
  i++; // skip ']'

  return { code, content, endIndex: i };
}
