import { devtools } from 'zustand/middleware';
import type { StateCreator, StoreMutatorIdentifier } from 'zustand/vanilla';

export type SliceSetState<T> = (
  partial: Partial<T> | ((state: T) => Partial<T>),
  replace?: boolean,
  action?: string
) => void;

type Mutators = [StoreMutatorIdentifier, unknown][];
type Result<T, Mps extends Mutators, Mcs extends Mutators> = StateCreator<
  T,
  Mps,
  [['zustand/devtools', never], ...Mcs]
>;

export const withDevtools =
  <T>(name: string) =>
  <Mps extends Mutators = [], Mcs extends Mutators = [], U = T>(
    initializer: StateCreator<T, [...Mps, ['zustand/devtools', never]], Mcs, U>
  ): Result<T, Mps, Mcs> =>
    devtools(initializer as never, { name }) as Result<T, Mps, Mcs>;