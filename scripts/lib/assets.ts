/**
 * Static asset copying
 */

import fs from 'fs';
import path from 'path';
import { mkdirp } from 'mkdirp';
import { ROOT_DIR, DIST_DIR, STATIC_ASSETS } from './config';

/** Copy static assets from root to dist */
export async function copyAssets(): Promise<void> {
  for (const asset of STATIC_ASSETS) {
    const src = path.join(ROOT_DIR, asset);
    const dest = path.join(DIST_DIR, asset);
    
    if (!fs.existsSync(src)) {
      console.warn(`Warning: Asset not found: ${asset}`);
      continue;
    }
    
    const stat = fs.statSync(src);
    if (stat.isDirectory()) {
      await mkdirp(dest);
      const files = fs.readdirSync(src);
      for (const file of files) {
        fs.copyFileSync(path.join(src, file), path.join(dest, file));
      }
    } else {
      fs.copyFileSync(src, dest);
    }
    console.log(`Copied: ${asset}`);
  }
}
