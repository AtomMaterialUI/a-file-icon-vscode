import { jsonGenerator } from 'src/icons/generator/IconThemeGenerator';

try {
  jsonGenerator.createJsonTheme();
} catch (error) {
  throw Error('Could not create icon file!');
}
