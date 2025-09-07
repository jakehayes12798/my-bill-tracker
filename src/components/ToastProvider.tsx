// src/components/ToastProvider.tsx
import { createContext, useCallback, useContext, useMemo, useState} from "react";
import type { ReactNode } from "react";
import SnackbarToast from "./SnackbarToast";
import type { Toast } from "./SnackbarToast";

type ToastContextType = {
  showToast: (toast: Toast) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = useCallback((newToast: Toast) => {
    setToast(newToast);
  }, []);

  const contextValue = useMemo(
    () => ({ showToast }),
    [showToast]
  );


  return (
    <ToastContext.Provider value={ contextValue }>
      {children}
      <SnackbarToast toast={toast} setToast={setToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
