import { Save } from "@mui/icons-material";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { billSchema } from "../types/Bill";
import type { Bill } from "../types/Bill";
import { useEffect, useRef, useState } from "react";
import { validateBill } from "../../utils/billUtils";
import BillFormFields from "../BillFormFields";
import { useToast } from "../ToastProvider";


type EditBillDialogProps = Readonly<{
  editTarget: Bill;
  closeEdit: () => void;
  onConfirmEdit: (editValues: Partial<Bill>) => void;
  isOpenDialog: boolean;
}>;

/**
 * EditBillDialog component for editing a bill. The props are of type {@link EditBillDialogProps}.
 * @param editTarget - The bill being edited
 * @param closeEdit - Callback to close the dialog
 * @param onConfirmEdit - Callback to confirm the edit
 * @param isOpenDialog - Flag to control the dialog open state
 * @returns The dialog component.
 * @jakehayes12798
 */
export default function EditBillDialog({
  editTarget,
  closeEdit,
  onConfirmEdit,
  isOpenDialog
}: EditBillDialogProps) {

    /** accumulate over {@link billSchema} to make Partial<Bill> objects containing ONLY editable fields */
    const [editValues, setEditValues] = useState<Partial<Bill>>(
        billSchema.filter(f => f.editable).reduce(
            (partialBill, { key }) => {
            const value = editTarget[key];
            if (typeof value === "string" || typeof value === "number") {
              partialBill[key] = value;
            } else {
              partialBill[key] = ""; // or 0, or undefined, as appropriate
            }
            return partialBill;
        }
        , {} as Record<string, string | number>)
    );


    const { showToast } = useToast();

    /**
     * Handles the confirmation click event by passing through to {@link onConfirmEdit}.
     */
    function handleConfirmClick() {
      const errors = validateBill(editValues);
      if (errors.length > 0) {
        showToast({ message: errors.join(", "), severity: "error" });
        return;
      }
      onConfirmEdit(editValues);
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
        <Dialog open={isOpenDialog} onClose={closeEdit}>
        <DialogTitle>Edit {editTarget.name}</DialogTitle>
        <DialogContent>
          <BillFormFields values={editValues} setValues={setEditValues} defaultFocusRef={defaultFocusRef} />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEdit} color="error" variant="outlined">Cancel</Button>
          <Button onClick={handleConfirmClick} color="primary" variant="contained" startIcon={<Save />}>Save Changes</Button>
        </DialogActions>
        </Dialog>
    );
}