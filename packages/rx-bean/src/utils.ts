import { useEffect, useState } from "react";
import { distinctUntilChanged, Observable } from "rxjs";

export const useStateFromObservable = <T>(
  observable: Observable<T>,
  defaultValue: T
) => {
  const [state, setState] = useState<T | undefined>(defaultValue);
  useEffect(() => {
    const subscription = observable
      .pipe(distinctUntilChanged())
      .subscribe((value) => setState(value));
    return () => subscription.unsubscribe();
  }, [observable]);
  return state;
};
