import type { AtomConfig } from 'src/@types/config';
import type { IconConfiguration } from 'src/models';

export abstract class AbstractJsonGenerator {
  protected constructor(protected readonly atomConfig: AtomConfig, protected readonly iconConfig: IconConfiguration) {}
}
