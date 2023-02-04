import { IconThemeGenerator } from 'src/icons/generators/IconThemeGenerator';

try {
  const iconThemeGenerator = new IconThemeGenerator();
  iconThemeGenerator.createJsonTheme();
} catch (error) {
  throw Error('Could not create icon file!' + error);
}
