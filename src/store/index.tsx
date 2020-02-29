import React, { createContext, useState, SetStateAction, Dispatch as Dispatcher, useContext } from 'react';
import { all } from 'deepmerge';

type Dispatch<S> = Dispatcher<SetStateAction<S>>;
type Context<S> = [S, Dispatch<S>];
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[P] extends ReadonlyArray<infer U>
    ? ReadonlyArray<DeepPartial<U>>
    : DeepPartial<T[P]>;
};

type State = {};

const initialState: State = {};

const reducer = (() => {}) as Dispatch<State>;
const Store = createContext<Context<State>>([initialState, reducer]);

export function Provider({ children }: { children: React.ReactNode }) {
  const [value, setValue] = useState(initialState);

  return <Store.Provider value={[value, setValue]}>{children}</Store.Provider>;
}

export function useStore(): [State, (s: DeepPartial<State>) => void] {
  const [state, setState] = useContext(Store);

  return [state, (s: DeepPartial<State>) => setState(all([state, s]) as State)];
}
