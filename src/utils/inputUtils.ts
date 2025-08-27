import { useRef, useEffect } from "react";

/**
 * Custom hook to manage focus for dialog elements.
 * @returns A ref to be attached to the dialog element.
 */
export function useDialogFocus<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    setTimeout(() => {
      ref.current?.focus();
      if (ref.current instanceof HTMLInputElement) {
        ref.current.select();
      }
    }, 0);
  }, []);

  return ref;
}

