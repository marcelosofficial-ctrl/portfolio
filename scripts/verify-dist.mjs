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

function requireLanguagePair(label, englishHtml, japaneseHtml, englishPath, japanesePath) {
  if (!englishHtml || !japaneseHtml) return;

  for (const [side, html] of [['English', englishHtml], ['Japanese', japaneseHtml]]) {
    for (const alternate of ['hreflang="en"', 'hreflang="ja"', 'hreflang="x-default"']) {
      if (!html.includes(alternate)) fail(`${label} ${side} page is missing language alternate: ${alternate}`);
      else pass(`${label} ${side} language alternate: ${alternate}`);
    }
    if (!html.includes('class="language-toggle"')) fail(`${label} ${side} page is missing the top-bar language toggle`);
    else pass(`${label} ${side} top-bar language toggle`);
    if (!html.includes('>ENG</span>') || !html.includes('>日本語</span>')) fail(`${label} ${side} language toggle is missing ENG / 日本語 labels`);
    else pass(`${label} ${side} language toggle labels`);
  }

  const expectedJapaneseHref = `/portfolio${japanesePath}`;
  const expectedEnglishHref = `/portfolio${englishPath}`;
  if (!englishHtml.includes(`href="${expectedJapaneseHref}"`) || !englishHtml.includes('data-language-choice="ja"')) {
    fail(`${label} English page does not switch directly to ${expectedJapaneseHref}`);
  } else pass(`${label} English → Japanese route-aware switch`);

  if (!japaneseHtml.includes(`href="${expectedEnglishHref}"`) || !japaneseHtml.includes('data-language-choice="en"')) {
    fail(`${label} Japanese page does not switch directly to ${expectedEnglishHref}`);
  } else pass(`${label} Japanese → English route-aware switch`);
}

const routes = [
  'index.html',
  'ja/index.html',
  'about/index.html',
  'ja/about/index.html',
  'contact/index.html',
  'ja/contact/index.html',
  'resume/index.html',
  'ja/resume/index.html',
  'resume/support/index.html',
  'ja/resume/support/index.html',
  'resume/software/index.html',
  'ja/resume/software/index.html',
  'projects/vektordeck/index.html', 'projects/reseller-ai/index.html',
  'projects/crashscope/index.html', 'projects/reelshelf/index.html',
  'projects/rainmeter-clock/index.html',
  'projects/exactartifact/index.html',
  'projects/gaptrace/index.html',
  'projects/configtrace/index.html',
  '404.html',
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
  '239/239',
  '0.2365%',
  '1.1.0 RELEASED',
  '48 TESTS · 0 WARNINGS',
  '0.6.1 · relocation-safe dual-provider build',
  'EasyFLix',
  'Software engineering, QA / automation and technical systems roles.'
]);

const japaneseHome = readRoute('ja/index.html');
requireContent('Japanese homepage', japaneseHome, [
  '<html lang="ja">',
  'ソフトウェアと',
  '現場の不便や複雑さを、信頼して使えるソフトウェアに変える。',
  '実際の課題から生まれたプロジェクト。',
  '現在、公開の連絡窓口はLinkedInにまとめています。',
  'ケーススタディ（英語）',
  'class="language-toggle"'
]);

const about = readRoute('about/index.html');
requireContent('about page', about, [
  'I build useful systems, then make them trustworthy.',
  'Software / QA résumé',
  'CrashScope 1.1 released',
  'VektorDeck 1.0',
  'EasyFLix · pre-1.0 ReelShelf'
]);

const japaneseAbout = readRoute('ja/about/index.html');
requireContent('Japanese about page', japaneseAbout, [
  '<html lang="ja">',
  '実用的な仕組みをつくり、信頼して使えるところまで仕上げる。',
  '現場経験からソフトウェアへ。',
  '5言語でのコミュニケーション',
  'ソフトウェア / QA 職務プロフィール'
]);

const contact = readRoute('contact/index.html');
requireContent('contact page', contact, [
  'Let’s talk about useful work.',
  'LINKEDIN · CURRENT ROUTE',
  'Software / QA résumé'
]);

const japaneseContact = readRoute('ja/contact/index.html');
requireContent('Japanese contact page', japaneseContact, [
  '<html lang="ja">',
  'まずは、取り組みたいことを聞かせてください。',
  '現在の公開連絡窓口はLinkedInです。',
  '採用・転職について',
  '職務プロフィールを見る'
]);

const resume = readRoute('resume/index.html');
requireContent('general resume', resume, [
  'Alma', 'VektorDeck', 'CrashScope', 'ReelShelf', '750+', '1,800+',
  'Software / QA', 'QA / automation', '239/239 automated .NET tests', '0.2365% average Agent CPU'
]);

const japaneseResume = readRoute('ja/resume/index.html');
requireContent('Japanese career profile', japaneseResume, [
  '<html lang="ja">',
  'Professional profile · 職務プロフィール',
  '4,000時間以上',
  '239/239件の自動.NETテスト',
  '海外のタイムゾーンや勤務時間にも柔軟に対応'
]);

const supportResume = readRoute('resume/support/index.html');
const japaneseSupportResume = readRoute('ja/resume/support/index.html');
requireContent('Japanese support profile', japaneseSupportResume, [
  '<html lang="ja">',
  'リモートテクニカルサポート · オペレーション · カスタマー対応',
  '問題の切り分け',
  'コーヒー部門マネージャー / カフェ運営',
  '4,000時間以上'
]);

const softwareResume = readRoute('resume/software/index.html');
requireContent('software resume', softwareResume, [
  'Software Engineering · QA · Technical Systems',
  '239/239 automated .NET tests',
  '0.2365% average Agent CPU',
  '94.58 MB peak working set',
  '48 passing tests',
  'zero build warnings',
  'VektorDeck 1.0',
  'Retro Game Vision',
  'EasyFLix'
]);

const japaneseSoftwareResume = readRoute('ja/resume/software/index.html');
requireContent('Japanese software profile', japaneseSoftwareResume, [
  '<html lang="ja">',
  'ソフトウェア開発 · QA · テクニカルシステム',
  '英文PDFをダウンロード',
  '239/239件の自動.NETテスト',
  'localhost限定',
  '48件のテスト'
]);

requireLanguagePair('homepage', home, japaneseHome, '/', '/ja/');
requireLanguagePair('about', about, japaneseAbout, '/about/', '/ja/about/');
requireLanguagePair('contact', contact, japaneseContact, '/contact/', '/ja/contact/');
requireLanguagePair('general career profile', resume, japaneseResume, '/resume/', '/ja/resume/');
requireLanguagePair('support career profile', supportResume, japaneseSupportResume, '/resume/support/', '/ja/resume/support/');
requireLanguagePair('software career profile', softwareResume, japaneseSoftwareResume, '/resume/software/', '/ja/resume/software/');

const reelshelf = readRoute('projects/reelshelf/index.html');
requireContent('ReelShelf case study', reelshelf, [
  'ReelShelf', 'EasyFLix', 'WPF', '.NET 10', 'legally acquired local media',
  'SubDL', 'OpenSubtitles REST API', 'Whisper.net', '48 passing tests', 'Zero build warnings',
  'PORTABLE WIN-X64', '99.36%', 'Cross-language draft translation paused'
]);

const crashscope = readRoute('projects/crashscope/index.html');
requireContent('CrashScope case study', crashscope, [
  '1.1.0 RELEASED',
  '239/239 PASS',
  '0.2365%',
  '91.71 MB',
  '94.58 MB',
  '34.76 MB',
  'ConfigTrace 1.0.1',
  'TWO-PC VALIDATED',
  '1.0.0 → 1.1.0',
  'LOCALHOST',
  'Download 1.1.0'
]);

const configtrace = readRoute('projects/configtrace/index.html');
requireContent('ConfigTrace case study', configtrace, [
  '1.0.1',
  '4.96 MB',
  '4.99 MB',
  '0.91 MB',
  'NOT FOUND',
  'b629c970',
  'Download 1.0.1'
]);
const identityPages = [
  ['homepage', home],
  ['Japanese homepage', japaneseHome],
  ['about page', about],
  ['Japanese about page', japaneseAbout],
  ['general resume', resume],
  ['Japanese career profile', japaneseResume],
  ['support resume', supportResume],
  ['Japanese support profile', japaneseSupportResume],
  ['software resume', softwareResume],
  ['Japanese software profile', japaneseSoftwareResume],
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