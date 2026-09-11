"use client";
import { Provider } from "react-redux";
import { store } from "./index";

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Provider store={store}>{children}</Provider>;
}

// export function StoreProvider({ children }: { children: React.ReactNode }) { return children; }

import { Provider } from "react-redux";
import { store } from "./index";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
