import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const webRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const appRoot = path.join(webRoot, 'app');

// Route groups do not appear in URLs; every static shared-nav link must exist.
function findPages(folder = appRoot, segments = []) {
  const routes = [];
  for (const item of fs.readdirSync(folder, { withFileTypes: true })) {
    if (item.isFile() && /^page\.(tsx|ts|jsx|js)$/.test(item.name)) {
      routes.push('/' + segments.join('/'));
    } else if (item.isDirectory() && !item.name.startsWith('_')) {
      const nextSegments = item.name.startsWith('(') && item.name.endsWith(')')
        ? segments : [...segments, item.name];
      routes.push(...findPages(path.join(folder, item.name), nextSegments));
    }
  }
  return routes;
}

const pages = new Set(findPages());
const filesToAudit = [
  'lib/workspace/navigation.ts',
  'app/dashboard/layout.tsx',
  'app/dashboard/settings/page.tsx',
  'app/dashboard/page.tsx',
  'app/dashboard/history/page.tsx',
  'app/dashboard/plans/page.tsx',
  'app/dashboard/progress/page.tsx',
  'app/journey/layout.tsx',
  'app/journey/[id]/page.tsx',
  'components/workspace/WorkspaceMobileNavigation.tsx',
];
const hrefs = new Set();

for (const file of filesToAudit) {
  const contents = fs.readFileSync(path.join(webRoot, file), 'utf8');
  const regexp = /(?:\bhref\b|\broute\b)\s*(?:=|:)\s*["'](\/[^"'?#]*)/g;
  for (const match of contents.matchAll(regexp)) {
    hrefs.add(match[1].replace(/\/+$/, '') || '/');
  }
}
const broken = [...hrefs].filter(href => !pages.has(href));
if (broken.length) {
  console.error('Missing workspace navigation routes:');
  for (const href of broken) console.error(' - ' + href);
  process.exitCode = 1;
} else {
  console.log('Validated ' + hrefs.size + ' workspace navigation links.');
}
