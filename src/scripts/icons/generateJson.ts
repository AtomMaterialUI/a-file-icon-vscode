import { jsonGenerator } from 'src/helpers/JsonGenerator';
import { logger } from 'src/helpers/LoggingService';

try {
  logger.info('Creating json file...');
  jsonGenerator.createIconFile();
} catch (error) {
  logger.error(String(error));
  throw Error('Could not create icon file!');
}
