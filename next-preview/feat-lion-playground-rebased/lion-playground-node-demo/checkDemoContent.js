/**
 * Checks demo content before it is handed to the sandbox.
 *
 * Why this exists: when the sandbox runs on the *same* origin (the extension deployment, which has no second
 * host), a demo has this origin's privileges — it can read cookies and storage, and no CSP directive covers a
 * navigation. There is no browser-enforced boundary in that case, so what is left is what the content is
 * allowed to contain. This reports what a demo actually does, so that running it is a reviewed decision
 * instead of a blind one.
 *
 * What this is NOT: a boundary. The repo's own precedent says it best, about the same-origin sanitizer:
 * "do NOT treat it as a security boundary — it is regex based defence-in-depth, not a control". A dynamic or
 * obfuscated payload walks straight past any pattern list; the boundary is a second origin, and next to it the
 * policy the worker sets on the documents it serves. This check is what makes the weaker deployment
 * *reviewable*, and it is deliberately honest about that in its own test suite.
 */

/**
 * @typedef {{file: string, line: number, rule: string, severity: 'blocked-by-policy' | 'needs-review', snippet: string}} Finding
 * @typedef {{ok: boolean, findings: Finding[], checked: number}} ContentReport
 */

/**
 * The patterns, as data so a test can name the one it exercises.
 *
 * `blocked-by-policy` marks what the document's policy is expected to cover — a network call, storage access —
 * so a finding there means "check the policy still covers this". `needs-review` marks what neither the policy
 * nor the origin can cover, and which therefore needs a human decision: a navigation, a popup, an external
 * script tag.
 * @type {{rule: string, severity: 'blocked-by-policy' | 'needs-review', pattern: RegExp}[]}
 */
export const CONTENT_RULES = [
  { rule: 'network-fetch', severity: 'blocked-by-policy', pattern: /\bfetch\s*\(/ },
  { rule: 'network-xhr', severity: 'blocked-by-policy', pattern: /\bXMLHttpRequest\b/ },
  { rule: 'network-websocket', severity: 'blocked-by-policy', pattern: /\bWebSocket\b/ },
  { rule: 'network-beacon', severity: 'blocked-by-policy', pattern: /\bsendBeacon\b/ },
  { rule: 'network-eventsource', severity: 'blocked-by-policy', pattern: /\bEventSource\b/ },
  { rule: 'storage-local', severity: 'blocked-by-policy', pattern: /\blocalStorage\b/ },
  { rule: 'storage-session', severity: 'blocked-by-policy', pattern: /\bsessionStorage\b/ },
  { rule: 'storage-indexeddb', severity: 'blocked-by-policy', pattern: /\bindexedDB\b/ },
  { rule: 'cookie-read', severity: 'blocked-by-policy', pattern: /\bdocument\s*\.\s*cookie\b/ },
  { rule: 'eval', severity: 'blocked-by-policy', pattern: /\beval\s*\(|\bnew\s+Function\s*\(/ },
  { rule: 'external-script', severity: 'needs-review', pattern: /<script[^>]+src\s*=\s*["']?https?:/i },
  { rule: 'external-link', severity: 'needs-review', pattern: /<link[^>]+href\s*=\s*["']?https?:/i },
  { rule: 'form-action', severity: 'needs-review', pattern: /<form[^>]+action\s*=\s*["']?https?:/i },
  { rule: 'css-url-external', severity: 'needs-review', pattern: /url\(\s*["']?https?:/i },
  { rule: 'navigation', severity: 'needs-review', pattern: /\blocation\s*\.\s*(href|assign|replace)\s*[=(]/ },
  { rule: 'popup', severity: 'needs-review', pattern: /\bwindow\s*\.\s*open\s*\(/ },
  { rule: 'import-external', severity: 'needs-review', pattern: /\bimport\s*\(\s*["'`]https?:/ },
];

/**
 * @param {{[name: string]: {content: string} | string}} files
 * @returns {ContentReport}
 */
export function checkDemoContent(files) {
  /** @type {Finding[]} */
  const findings = [];
  let checked = 0;

  for (const [name, file] of Object.entries(files || {})) {
    const content = typeof file === 'string' ? file : file?.content;
    if (typeof content !== 'string') continue;
    checked += 1;
    const lines = content.split('\n');
    lines.forEach((text, index) => {
      for (const { rule, severity, pattern } of CONTENT_RULES) {
        if (!pattern.test(text)) continue;
        findings.push({
          file: name,
          line: index + 1,
          rule,
          severity,
          snippet: text.trim().slice(0, 120),
        });
      }
    });
  }

  return { ok: findings.length === 0, findings, checked };
}

/**
 * A one-line summary for a reviewer, so a run says what it is about to do instead of only doing it.
 * @param {ContentReport} report
 * @returns {string}
 */
export function describeContentReport(report) {
  if (report.ok) return `content check: ${report.checked} file(s), nothing to review`;
  const bySeverity = report.findings.reduce((counts, finding) => {
    counts[finding.severity] = (counts[finding.severity] || 0) + 1;
    return counts;
  }, /** @type {Record<string, number>} */ ({}));
  const parts = Object.entries(bySeverity).map(([severity, count]) => `${count} ${severity}`);
  return `content check: ${report.checked} file(s), ${parts.join(', ')}`;
}

/**
 * Whether a run may proceed, given the posture.
 *
 * With the sandbox on its own origin (the upstream design, `PLAYGROUND_SANDBOX_BASE_URL`) the browser is the
 * boundary, so the content check is information for a reviewer rather than a gate. With the sandbox on this
 * origin — an explicit opt-in, for a deployment where a second host is impossible — nothing but the policy the
 * worker sets and this review stands between a demo and this origin's cookies and storage, so there the
 * findings block. The posture is *configured*, never inferred from a url: inferring it is how a deployment ends
 * up insecure by accident.
 * @param {{report: ContentReport, sameOriginSandbox: boolean}} options
 * @returns {{allow: boolean, reason: string}}
 */
export function decideRun({ report, sameOriginSandbox }) {
  if (!sameOriginSandbox) {
    return {
      allow: true,
      reason: report.ok
        ? 'sandbox on its own origin: the browser is the boundary, content check found nothing'
        : `sandbox on its own origin: the browser is the boundary; ${report.findings.length} finding(s) for review`,
    };
  }
  if (report.ok) {
    return { allow: true, reason: 'same-origin opt-in: content check found nothing to review' };
  }
  const summary = report.findings
    .map(finding => `${finding.file}:${finding.line} ${finding.rule}`)
    .join(', ');
  return {
    allow: false,
    reason: `same-origin opt-in: content check flagged ${report.findings.length} thing(s) — ${summary}`,
  };
}

export default { CONTENT_RULES, checkDemoContent, describeContentReport, decideRun };
