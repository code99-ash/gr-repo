export type Prettify<T> = {
  [K in keyof T]: T[K];
  // eslint-disable-next-line @typescript-eslint/ban-types
} & {};

type Merge<T, U> = (T extends object
  ? {
      [K in keyof T]: K extends keyof U ? Merge<T[K], U[K]> : T[K];
    }
  : unknown) &
  U;

type ExcludedKeys<A, B> = Exclude<keyof B, keyof A>;

type KeysOnlyInObject<T, U> = ExcludedKeys<T, U>;

export type DeepMerge<T, U> = Omit<Merge<T, U>, KeysOnlyInObject<T, U>>;
