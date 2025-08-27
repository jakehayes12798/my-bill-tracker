import { Save } from "@mui/icons-material";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { billEditSchema } from "../../utils/formSchemas";
import type { Bill } from "../types/Bill";
import { useEffect, useRef, useState } from "react";


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

    /** accumulate over {@link billEditSchema} to make Partial<Bill> objects containing ONLY editable fields */
    const [editValues, setEditValues] = useState<Partial<Bill>>(
        billEditSchema.reduce(
            (partialBill, { key }) => {
            partialBill[key] = editTarget[key as keyof Bill] ?? "";
            return partialBill;
        }
        , {} as Record<string, string | number>)
    );

    /**
     * Handles the confirmation click event by passing through to {@link onConfirmEdit}.
     */
    function handleConfirmClick() {
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
          {/* Blow apart the editTarget and create form fields for each of the USER EDITABLE fields that we've defined in the Schema for the bill */}
            <fieldset>
              {billEditSchema.map(({ key, label, type }, indexCounter) => (
                <div key={key}>
                  <label htmlFor={key}>{label}:</label>
                  <input
                    id={key}
                    name={key}
                    type={type}
                    value={editValues[key] ?? ""}
                    onChange={e => setEditValues(prev => ({
                      ...prev,
                      [key]: type === "number" ? parseFloat(e.target.value) || 0 : e.target.value
                    }))}
                    // attach the default ref to the first input
                    ref={indexCounter === 0 ? defaultFocusRef : undefined}
                  />
                </div>
              ))}
            </fieldset>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEdit} color="error" variant="outlined">Cancel</Button>
          <Button onClick={handleConfirmClick} color="primary" variant="contained" startIcon={<Save />}>Save Changes</Button>
        </DialogActions>
      </Dialog>
    );
}