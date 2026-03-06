export type Branded<T, B extends string> = T & { readonly __brand: B };

export const toBranded =
  <B extends string>() =>
  <T>(value: T): Branded<T, B> =>
    value as Branded<T, B>;

export type MessageId = Branded<number, 'MessageId'>;