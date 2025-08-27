import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import type { Bill } from "../types/Bill";
import { useRef, useEffect } from "react";

type DeleteBillDialogProps = Readonly<{
    deleteTarget: Bill;
    closeDelete: () => void;
    onConfirmDelete: () => void;
    isOpenDialog: boolean;
}>;

/**
 * Confirm deletion of a bill. The props are of type {@link DeleteBillDialogProps}.
 * @param deleteTarget - The bill to delete
 * @param closeDelete - Callback to close the dialog
 * @param onConfirmDelete - Callback to confirm deletion
 * @param isOpenDialog - Whether the dialog is open
 * @returns The rendered dialog component
 * @jakehayes12798
 */
export default function DeleteBillDialog ({
    deleteTarget,
    closeDelete,
    onConfirmDelete,
    isOpenDialog
}: DeleteBillDialogProps) {


        /** Reference to the default focus input field. */
    const defaultFocusRef = useRef<HTMLButtonElement>(null);

    /** automatically focuses the {@link defaultFocusRef} when the dialog is opened. */
    useEffect(() => {
        if (isOpenDialog) {
            setTimeout(() => {
                defaultFocusRef.current?.focus();
            }, 0);
        }
    }, [isOpenDialog]);

    return (
      <Dialog open={isOpenDialog} onClose={closeDelete}>
        <DialogTitle>Delete bill?</DialogTitle>
        <DialogContent>
          {deleteTarget && <div>
            <div><strong>{deleteTarget.name}</strong></div>
            <div>Paid: ${deleteTarget.paidAmount.toFixed(2)}</div>
            <div>Total: ${deleteTarget.totalAmount.toFixed(2)}</div>
          </div>}
        </DialogContent>
        <DialogActions>
          <Button ref={defaultFocusRef} onClick={closeDelete} color="error" variant="outlined">Cancel</Button>
          <Button onClick={onConfirmDelete} color="error" variant="contained">I'm Sure; Delete</Button>
        </DialogActions>
      </Dialog>
    );
}