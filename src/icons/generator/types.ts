import type { IconThemeGenerator } from 'src/icons/generator/IconThemeGenerator';
import type { AtomConfig } from 'src/@types/config';
import type { IconConfiguration } from 'src/models';

export type IconGenerator = {};

export abstract class JsonGenerator implements IconGenerator {
  protected constructor(
    protected readonly jsonGenerator: IconThemeGenerator,
    protected readonly options: AtomConfig,
    protected readonly iconConfig: IconConfiguration
  ) {}
}
