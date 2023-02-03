import { jsonGenerator } from 'src/helpers/JsonGenerator';

try {
  jsonGenerator.createJsonTheme();
} catch (error) {
  throw Error('Could not create icon file!');
}
