import { useSyncExternalStore } from 'react';

function subscribe() {
  return () => undefined;
}

export function useClientOnlyValue<S, C>(server: S, client: C): S | C {
  const isClient = useSyncExternalStore(subscribe, () => true, () => false);
  return isClient ? client : server;
}
