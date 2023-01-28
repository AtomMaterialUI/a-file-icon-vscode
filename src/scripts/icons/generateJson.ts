/**
 * This file is meant to be executed exclusively by npm scripts.
 */

import { createIconFile } from 'src/icons';

try {
  createIconFile();
} catch (error) {
  console.error(error);
  throw Error('Could not create icon file!');
}
