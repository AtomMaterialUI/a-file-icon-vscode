/**
 * Renders logo.png (the Marketplace and Extensions view icon) from logo.svg, so that the two never drift apart.
 * Usage: `bun run build:logo`.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { Resvg } from '@resvg/resvg-js';

/** The size of logo.png: the Marketplace shows it at 128 px, twice that keeps it sharp on high-density screens. */
const LOGO_SIZE = 256;

const root = join(__dirname, '..', '..');
const svg = readFileSync(join(root, 'logo.svg'), 'utf8');
const png = new Resvg(svg, { fitTo: { mode: 'width', value: LOGO_SIZE } }).render().asPng();
writeFileSync(join(root, 'logo.png'), png);
console.log(`logo.png: ${LOGO_SIZE}x${LOGO_SIZE}, ${png.length} bytes`);
