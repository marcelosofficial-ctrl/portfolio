import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
let failures = 0;

function fail(message) {
  failures += 1;
  console.error(`FAIL  ${message}`);
}

function pass(message) {
  console.log(`PASS  ${message}`);
}

function requireFile(relativePath, minimumBytes = 1) {
  const file = join(root, relativePath);
  if (!existsSync(file)) {
    fail(`missing artifact: ${relativePath}`);
    return null;
  }
  const size = statSync(file).size;
  if (size < minimumBytes) {
    fail(`${relativePath} is only ${size} bytes (minimum ${minimumBytes})`);
    return null;
  }
  return { file, size, bytes: readFileSync(file) };
}

function validatePng(relativePath, width, height, minimumBytes) {
  const artifact = requireFile(relativePath, minimumBytes);
  if (!artifact) return;
  const { bytes, size } = artifact;
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (bytes.length < 24 || !bytes.subarray(0, 8).equals(signature)) {
    fail(`${relativePath} has an invalid PNG signature`);
    return;
  }
  const actualWidth = bytes.readUInt32BE(16);
  const actualHeight = bytes.readUInt32BE(20);
  if (actualWidth !== width || actualHeight !== height) {
    fail(`${relativePath} is ${actualWidth}x${actualHeight}; expected ${width}x${height}`);
    return;
  }
  pass(`artifact ${relativePath} (${actualWidth}x${actualHeight}, ${size} bytes)`);
}

function validatePdf(relativePath, minimumBytes) {
  const artifact = requireFile(relativePath, minimumBytes);
  if (!artifact) return;
  const { bytes, size } = artifact;
  if (bytes.subarray(0, 5).toString('ascii') !== '%PDF-') {
    fail(`${relativePath} has an invalid PDF header`);
    return;
  }
  const tail = bytes.subarray(Math.max(0, bytes.length - 2048)).toString('latin1');
  if (!tail.includes('%%EOF')) {
    fail(`${relativePath} is missing the PDF EOF marker`);
    return;
  }
  pass(`artifact ${relativePath} (${size} bytes)`);
}

validatePng('brand/social.png', 1200, 630, 10_000);
validatePng('brand/favicon.png', 64, 64, 500);
validatePng('brand/apple-touch-icon.png', 180, 180, 1_000);
validatePdf('resume/Marcelo_Ellwanger_Software_QA_Resume.pdf', 20_000);

if (failures) {
  console.error(`\nArtifact verification failed with ${failures} issue(s).`);
  process.exit(1);
}

console.log('\nArtifact verification passed.');
