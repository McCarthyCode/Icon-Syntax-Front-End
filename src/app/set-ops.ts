export namespace SetOps {
  export const union = <T>(A: Set<T>, B: Set<T>) => new Set<T>([...A, ...B]);
  export const intersection = <T>(A: Set<T>, B: Set<T>) =>
    new Set<T>([...A].filter((i: T) => B.has(i)));
  export const difference = <T>(A: Set<T>, B: Set<T>) =>
    new Set<T>([...A].filter((i: T) => !B.has(i)));
}
