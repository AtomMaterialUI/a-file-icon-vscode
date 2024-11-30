import { dirname, join } from 'node:path';

import type { AtomConfig } from 'src/@types/config';

export const getCustomIconPaths = (options: AtomConfig) => {
  return Object.values(options?.filesAssociations ?? {})
               .filter((v) => v.match(/^[./]+/)) // <- custom dirs have a relative path to the dist folder
               .map((v) => dirname(join(__dirname, v)));
};
