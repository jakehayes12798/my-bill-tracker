import { Save } from "@mui/icons-material";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import type { Bill } from "../types/Bill";
import { validateBill } from "../../utils/billUtils";
import BillFormFields from "../BillFormFields";
import { useToast } from "../ToastProvider";



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
  const { showToast } = useToast();

  function handleConfirmClick() {
    const errors = validateBill(editValues);
    if (errors.length > 0) {
      showToast({ message: errors.join(", "), severity: "error" });
      return;
    }

    onConfirmAdd(editValues);
    showToast({ message: "Bill added successfully!", severity: "success" });
  }


    /** Reference to the default focus input field. */
    const defaultFocusRef = useRef<HTMLInputElement>(null);

    /** automatically focuses the {@link defaultFocusRef} when the dialog is opened. */
    useEffect(() => {
        if (isOpenDialog) {
            setTimeout(() => {
                defaultFocusRef.current?.focus();
                defaultFocusRef.current?.select();
            }, 0);
        }
    }, [isOpenDialog]);

  return (
      <Dialog open={isOpenDialog} onClose={closeAdd}>
        <DialogTitle>Add a New Bill</DialogTitle>
        <DialogContent>
          <BillFormFields values={editValues} setValues={setEditValues} defaultFocusRef={defaultFocusRef} />
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
  );
}
