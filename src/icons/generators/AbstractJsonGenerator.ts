import type { IconConfiguration } from 'src/models/IconConfiguration';
import type { AtomConfig } from 'src/@types/config';

export abstract class AbstractJsonGenerator {
  protected constructor(protected readonly atomConfig: AtomConfig, protected readonly iconConfig: IconConfiguration) {}
}
