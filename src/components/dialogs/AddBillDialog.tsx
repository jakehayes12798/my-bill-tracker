import { Save } from "@mui/icons-material";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Snackbar, Alert } from "@mui/material";
import { useState } from "react";
import { billSchema } from "../../utils/formSchemas";
import type { Bill } from "../types/Bill";
import { validateBill } from "../../utils/billUtils";



type AddBillDialogProps = Readonly<{
  closeAdd: () => void;
  onConfirmAdd: (newBill: Partial<Bill>) => void;
  isOpenDialog: boolean;
}>;

export default function AddBillDialog({
  closeAdd,
  onConfirmAdd,
  isOpenDialog
}: AddBillDialogProps) {
  const [editValues, setEditValues] = useState<Partial<Bill>>({});
  const [toast, setToast] = useState<{ message: string; severity: "success" | "error" | "info" | "warning" } | null>(null);

  function handleConfirmClick() {
    const errors = validateBill(editValues);
    if (errors.length > 0) {
      setToast({ message: errors.join(", "), severity: "error" });
      return;
    }

    onConfirmAdd(editValues);
    setToast({ message: "Bill added successfully!", severity: "success" });
  }

  return (
    <>
      <Dialog open={isOpenDialog} onClose={closeAdd}>
        <DialogTitle>Add a New Bill</DialogTitle>
        <DialogContent>
          <fieldset>
            {billSchema.filter(f => f.editable).map(({ key, label, type, required }, indexCounter) => (
              <div key={key}>
                <label htmlFor={key}>{label}{required && " *"}:</label>
                <input
                  id={key}
                  name={key}
                  type={type}
                  value={editValues[key] ?? ""}
                  onChange={e =>
                    setEditValues(prev => ({
                      ...prev,
                      [key]: type === "number" ? parseFloat(e.target.value) || 0 : e.target.value
                    }))
                  }
                />
              </div>
            ))}
          </fieldset>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeAdd} color="error" variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleConfirmClick} color="primary" variant="contained" startIcon={<Save />}>
            Save and Add Bill
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Toast */}
      <Snackbar
        open={!!toast}
        autoHideDuration={3000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        {toast && (
          <Alert severity={toast.severity} onClose={() => setToast(null)} sx={{ width: "100%" }}>
            {toast.message}
          </Alert>
        )}
      </Snackbar>
    </>
  );
}
