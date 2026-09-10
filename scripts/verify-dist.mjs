import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = new URL('../dist/', import.meta.url);
const root = fileURLToPath(dist);
let failures = 0;

function fail(message) {
  failures += 1;
  console.error(`FAIL  ${message}`);
}

function pass(message) {
  console.log(`PASS  ${message}`);
}

function walk(directory) {
  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const full = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else files.push(full);
  }
  return files;
}

function routeTarget(localPath) {
  const normalized = localPath.replace(/^\/+/, '');
  if (!normalized) return join(root, 'index.html');
  const direct = join(root, normalized);
  if (existsSync(direct) && statSync(direct).isFile()) return direct;
  if (existsSync(direct) && statSync(direct).isDirectory()) return join(direct, 'index.html');
  if (normalized.endsWith('/')) return join(root, normalized, 'index.html');
  if (!normalized.split('/').at(-1)?.includes('.')) return join(root, normalized, 'index.html');
  return direct;
}

function validateWebP(bytes) {
  if (bytes.length < 20) return 'file is too small for a WebP container';
  if (bytes.subarray(0, 4).toString('ascii') !== 'RIFF' || bytes.subarray(8, 12).toString('ascii') !== 'WEBP') {
    return 'invalid RIFF/WEBP signature';
  }
  const declaredSize = bytes.readUInt32LE(4) + 8;
  if (declaredSize !== bytes.length) return `RIFF length declares ${declaredSize} bytes but file contains ${bytes.length}`;

  let offset = 12;
  let imageChunkFound = false;
  while (offset + 8 <= bytes.length) {
    const type = bytes.subarray(offset, offset + 4).toString('ascii');
    const chunkSize = bytes.readUInt32LE(offset + 4);
    const payloadStart = offset + 8;
    const payloadEnd = payloadStart + chunkSize;
    if (payloadEnd > bytes.length) return `${type || 'unknown'} chunk overruns file boundary`;
    if (type === 'VP8 ' || type === 'VP8L' || type === 'VP8X') imageChunkFound = true;
    offset = payloadEnd + (chunkSize % 2);
  }
  if (offset !== bytes.length) return 'trailing or truncated bytes after final WebP chunk';
  if (!imageChunkFound) return 'no VP8/VP8L/VP8X image chunk found';
  return null;
}

function readRoute(route) {
  const file = join(root, route);
  if (!existsSync(file)) return null;
  return readFileSync(file, 'utf8');
}

function requireContent(label, html, required) {
  if (!html) return;
  for (const text of required) {
    if (!html.includes(text)) fail(`${label} is missing required content: ${text}`);
    else pass(`${label} content: ${text}`);
  }
}

const routes = [
  'index.html', 'ja/index.html', 'about/index.html', 'contact/index.html',
  'resume/index.html', 'resume/support/index.html', 'resume/software/index.html',
  'projects/vektordeck/index.html', 'projects/reseller-ai/index.html',
  'projects/crashscope/index.html', 'projects/reelshelf/index.html',
  'projects/rainmeter-clock/index.html', '404.html',
];

for (const route of routes) {
  const file = join(root, route);
  if (!existsSync(file)) fail(`missing generated route: ${route}`);
  else if (statSync(file).size < 400) fail(`generated route is suspiciously small: ${route}`);
  else pass(`route ${route}`);
}

const webpAssets = [
  ['profile/marcelo-profile.webp', 5000],
  ['vektordeck/dashboard.webp', 5000],
  ['vektordeck/intelligence-tour.webp', 5000],
  ['vektordeck/evidence-tour.webp', 5000],
  ['brand/marcelo-lab.webp', 2000],
  ['brand/crashscope.webp', 2000],
  ['brand/reseller.webp', 2000],
  ['brand/vektordeck.webp', 2000],
  ['brand/reelshelf.webp', 2000],
];

for (const [asset, minimumBytes] of webpAssets) {
  const file = join(root, asset);
  if (!existsSync(file)) {
    fail(`missing critical asset: ${asset}`);
    continue;
  }
  const size = statSync(file).size;
  const bytes = readFileSync(file);
  const structureError = validateWebP(bytes);
  if (size < minimumBytes) fail(`${asset} is only ${size} bytes`);
  else if (structureError) fail(`${asset}: ${structureError}`);
  else pass(`asset ${asset} (${size} bytes)`);
}

const qr = join(root, 'portfolio-qr.svg');
if (!existsSync(qr)) fail('missing portfolio QR code');
else {
  const qrText = readFileSync(qr, 'utf8');
  if (!qrText.includes('<svg')) fail('portfolio QR is not valid SVG text');
  else if (!qrText.includes('viewBox="0 0 41 41"')) fail('portfolio QR is missing the verified four-module quiet-zone geometry');
  else if (!/fill=["']#(?:fff|ffffff)["']/i.test(qrText)) fail('portfolio QR is missing its explicit white scan background');
  else pass('portfolio QR scan-safe SVG geometry');
}

const home = readRoute('index.html');
requireContent('homepage', home, [
  'Software &amp; Systems Developer',
  'Software / QA Résumé',
  'VektorDeck 1.0',
  '185',
  '0.2657%',
  'V0.1 BETA READY',
  '48 TESTS · 0 WARNINGS',
  '0.6.1 · relocation-safe dual-provider build',
  'EasyFLix',
  'Software engineering, QA / automation and technical systems roles.'
]);

const japaneseHome = readRoute('ja/index.html');
requireContent('Japanese homepage', japaneseHome, [
  '<html lang="ja">',
  'ソフトウェアと',
  '現実の「使いにくい」を、信頼できるソフトウェアに変えます。',
  '実際の課題から作ったもの。',
  '現在の公開連絡先はLinkedInです。',
  'ケーススタディ（英語）',
  'hreflang="en"'
]);

if (home && japaneseHome) {
  for (const [label, html] of [['English homepage', home], ['Japanese homepage', japaneseHome]]) {
    for (const alternate of ['hreflang="en"', 'hreflang="ja"', 'hreflang="x-default"']) {
      if (!html.includes(alternate)) fail(`${label} is missing language alternate: ${alternate}`);
      else pass(`${label} language alternate: ${alternate}`);
    }
  }
  if (!home.includes('data-language-choice="ja"')) fail('English homepage is missing the Japanese language switch');
  else pass('English homepage exposes Japanese language switch');
  if (!japaneseHome.includes('data-language-choice="en"')) fail('Japanese homepage is missing the English language switch');
  else pass('Japanese homepage exposes English language switch');
}

const about = readRoute('about/index.html');
requireContent('about page', about, [
  'I build useful systems, then make them trustworthy.',
  'Software / QA résumé',
  'CrashScope v0.1 beta ready',
  'VektorDeck 1.0',
  'EasyFLix · pre-1.0 ReelShelf'
]);

const resume = readRoute('resume/index.html');
requireContent('general resume', resume, [
  'Alma', 'VektorDeck', 'CrashScope', 'ReelShelf', '750+', '1,800+',
  'Software / QA', 'QA / automation', '185 automated .NET tests', '0.2657% average Agent CPU'
]);

const softwareResume = readRoute('resume/software/index.html');
requireContent('software resume', softwareResume, [
  'Software Engineering · QA · Technical Systems',
  '185 automated .NET tests',
  '0.2657% average Agent CPU',
  '95.83 MB peak working set',
  '48 passing tests',
  'zero build warnings',
  'VektorDeck 1.0',
  'Retro Game Vision',
  'EasyFLix'
]);

const reelshelf = readRoute('projects/reelshelf/index.html');
requireContent('ReelShelf case study', reelshelf, [
  'ReelShelf', 'EasyFLix', 'WPF', '.NET 10', 'legally acquired local media',
  'SubDL', 'OpenSubtitles REST API', 'Whisper.net', '48 passing tests', 'Zero build warnings',
  'PORTABLE WIN-X64', '99.36%', 'Cross-language draft translation paused'
]);

const crashscope = readRoute('projects/crashscope/index.html');
requireContent('CrashScope case study', crashscope, [
  'V0.1 BETA READY',
  '185',
  '0.2657%',
  '93 MB',
  '95.83 MB',
  'RYZEN 5 7500F',
  'RADEON RX 9070 XT',
  'FIRST PUBLIC BETA VALIDATED · RELEASE IN PREPARATION',
  'Auto Assist / Everyday Mode',
  'Privacy-safe support bundles',
  'LOCALHOST ONLY',
  'PUBLIC RELEASE · COMING SOON'
]);

const identityPages = [
  ['homepage', home],
  ['Japanese homepage', japaneseHome],
  ['about page', about],
  ['general resume', resume],
  ['software resume', softwareResume],
];
for (const [label, html] of identityPages) {
  if (!html) continue;
  if (/\bJunior\b/i.test(html)) fail(`${label} still contains stale "Junior" self-labeling`);
  else pass(`${label} has no stale Junior self-label`);
}

/* Privacy guard: LinkedIn is the deliberate public contact route. Until a separate
   public email is configured, generated pages must contain no literal email address
   and no mailto links. */
const generatedHtml = walk(root).filter((file) => file.endsWith('.html'));
const emailPattern = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const mailtoPattern = /mailto:/i;
for (const htmlFile of generatedHtml) {
  const html = readFileSync(htmlFile, 'utf8');
  const page = relative(root, htmlFile).replaceAll('\\', '/');
  if (emailPattern.test(html)) fail(`${page} contains a literal email address while no public email is configured`);
  if (mailtoPattern.test(html)) fail(`${page} contains a mailto link while no public email is configured`);
}
if (!generatedHtml.some((file) => emailPattern.test(readFileSync(file, 'utf8')))) pass('generated HTML contains no literal email addresses');
if (!generatedHtml.some((file) => mailtoPattern.test(readFileSync(file, 'utf8')))) pass('generated HTML contains no mailto links');

if (home) {
  for (const requiredMeta of [
    '<link rel="canonical"',
    'property="og:title"',
    'property="og:description"',
    'property="og:image"',
    'name="twitter:card"',
    'application/ld+json',
    'Software and Systems Developer',
    'QA automation',
    'Release engineering'
  ]) {
    if (!home.includes(requiredMeta)) fail(`homepage metadata is missing: ${requiredMeta}`);
    else pass(`homepage metadata: ${requiredMeta}`);
  }
}

let checkedLinks = 0;
for (const htmlFile of generatedHtml) {
  const html = readFileSync(htmlFile, 'utf8');
  const page = relative(root, htmlFile).replaceAll('\\', '/');

  const references = html.matchAll(/\b(?:href|src)=["']([^"']+)["']/g);
  for (const match of references) {
    const raw = match[1];
    if (!raw || raw.startsWith('#') || /^(?:https?:|mailto:|tel:|data:|javascript:|\/\/)/i.test(raw)) continue;
    const clean = raw.split('#')[0].split('?')[0];
    if (!clean) continue;

    let target;
    if (clean === '/portfolio' || clean === '/portfolio/') target = join(root, 'index.html');
    else if (clean.startsWith('/portfolio/')) target = routeTarget(clean.slice('/portfolio/'.length));
    else if (clean.startsWith('/')) target = routeTarget(clean.slice(1));
    else {
      const absolute = resolve(dirname(htmlFile), clean);
      if (existsSync(absolute) && statSync(absolute).isDirectory()) target = join(absolute, 'index.html');
      else target = absolute;
    }

    checkedLinks += 1;
    if (!existsSync(target)) fail(`${page} references missing local target: ${raw}`);
  }
}
if (checkedLinks > 0) pass(`${checkedLinks} generated local href/src references resolved`);

if (failures) {
  console.error(`\nPortfolio verification failed with ${failures} issue(s).`);
  process.exit(1);
}
console.log('\nPortfolio verification passed.');