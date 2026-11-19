import { IconThemeGenerator } from 'src/icons/generators/IconThemeGenerator';
import { ProductThemeGenerator } from 'src/icons/generators/ProductThemeGenerator';
import { ProductIconGenerator } from 'src/productIcons/ProductIconGenerator';
import { ColorThemeGenerator } from 'src/themes/ColorThemeGenerator';

const iconThemeGenerator = new IconThemeGenerator();
iconThemeGenerator.createJsonTheme();

const productThemeGenerator = new ProductThemeGenerator();
productThemeGenerator.createJsonTheme();

new ColorThemeGenerator().createJsonThemes();

new ProductIconGenerator().createJsonTheme();
