import { jsonGenerator } from 'src/helpers/JsonGenerator';

try {
  jsonGenerator.createIconFile();
} catch (error) {
  throw Error('Could not create icon file!');
}
