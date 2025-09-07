// src/components/SnackbarToast.tsx

import { Snackbar, Alert } from "@mui/material";

/**
 * Type for toast messages used in {@link SnackbarToast}.
 * @param message - The message to display in the toast
 * @param severity - The severity level of the toast (success, error, info, warning)
 * @param duration - Optional duration in milliseconds before the toast auto-hides (default is 3000ms)
 * @jakehayes12798
 */
export type Toast = {
  message: string;
  severity: "success" | "error" | "info" | "warning";
  duration?: number; // optional override
}

type SnackbarToastProps = Readonly<{
  toast?: Toast | null;
  setToast: (toast: Toast | null) => void;
}>;

/**
 * A toast notification component using MUI's Snackbar and Alert.
 * @param toast - The {@link Toast} message and severity to display
 * @param setToast - Function to set the toast state
 * @jakehayes12798
 */
export default function SnackbarToast({
  toast,
  setToast
}: SnackbarToastProps) {

    return (
      <Snackbar
        open={!!toast}
        autoHideDuration={toast?.duration ?? 3000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        
        {toast ? 
        (
          <Alert 
          severity={toast.severity} 
          onClose={() => setToast(null)} 
          sx={{ width: "100%" }}>
            {toast.message}
          </Alert>
        ) 
        : undefined}

      </Snackbar>
    )

}