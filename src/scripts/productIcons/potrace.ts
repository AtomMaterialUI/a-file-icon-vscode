/** oslllo-potrace, with the types of the part the product icon build uses (the package has no typings) */
type PotraceOptions = { svgSize?: number; threshold?: number; turdSize?: number };
type PotraceInstance = { trace: () => Promise<string> };
type PotraceConstructor = new (image: Buffer | string, options?: PotraceOptions) => PotraceInstance;

// eslint-disable-next-line @typescript-eslint/no-require-imports
const Potrace = require('oslllo-potrace') as PotraceConstructor;

export { Potrace };
