import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const ignored = new Set(["node_modules", ".git", ".next", "dist", "cdk.out"]);
const patterns = [
  /AKIA[0-9A-Z]{16}/,
  /-----BEGIN (RSA|EC|OPENSSH|PRIVATE) KEY-----/,
  /sk-[A-Za-z0-9]{20,}/,
];
const findings = [];

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (ignored.has(entry)) continue;
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) walk(full);
    if (stat.isFile() && stat.size < 1_000_000) {
      const text = readFileSync(full, "utf8");
      if (patterns.some((pattern) => pattern.test(text))) findings.push(full);
    }
  }
}

walk(root);

if (findings.length > 0) {
  console.error(`Potential secrets found:\n${findings.join("\n")}`);
  process.exit(1);
}

console.log("No high-confidence secrets detected.");
