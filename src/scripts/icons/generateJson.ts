import { IconThemeGenerator } from 'src/icons/generators/IconThemeGenerator';
import { ProductThemeGenerator } from 'src/icons/generators/ProductThemeGenerator';

const iconThemeGenerator = new IconThemeGenerator();
iconThemeGenerator.createJsonTheme();

const productThemeGenerator = new ProductThemeGenerator();
productThemeGenerator.createJsonTheme();
