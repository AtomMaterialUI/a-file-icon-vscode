import { createIconFile } from 'src/icons/generator/jsonGenerator';

try {
  createIconFile();
} catch (error) {
  console.error(error);
  throw Error('Could not create icon file!');
}
