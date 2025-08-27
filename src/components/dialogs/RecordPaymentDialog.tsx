import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { getRemainingBalance } from "../../utils/billUtils";
import type { Bill } from "../types/Bill";
import { useEffect, useRef, useState } from "react";

type RecordPaymentDialogProps = Readonly<{
    paymentTarget: Bill;
    onConfirmRecordPayment: (amount: number, date: string) => void;
    closePayment: () => void;
    isOpenDialog: boolean
}>

/**
 * Record a payment for a specific bill. This does not have the ability to create actual transactions, only record user-provided transactions.
 * Params are of type {@link RecordPaymentDialogProps}
 * @param paymentTarget - The target bill for the payment
 * @param onConfirmRecordPayment - Callback function to handle payment confirmation
 * @param closePayment - Callback function to close the dialog
 * @param isOpenDialog - Boolean flag to control the dialog's open state
 * @returns The rendered dialog component
 */
export default function RecordPaymentDialog({
    paymentTarget,
    onConfirmRecordPayment,
    closePayment,
    isOpenDialog
}: RecordPaymentDialogProps) {

    /* Record Payment Functions */
    const [paymentAmount, setPaymentAmount] = useState(getRemainingBalance(paymentTarget));
    const [datePaid, setDatePaid] = useState(new Date().toISOString().split("T")[0]);
    const remainingBalance = getRemainingBalance(paymentTarget);

    /**
     * Handles the confirmation of the payment dialog by clamping the payment amount to the remaining balance.
     */
    function handleConfirmClick() {
    const clampedAmount = Math.min(paymentAmount, remainingBalance);
    onConfirmRecordPayment(clampedAmount, datePaid);
    }

    /**
     * Handles the input change event for the payment amount field.
     * @param e The change event from the input field
     */
    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>)
    {
        const userInputText = e.target.value;
        const sanitizedInput = userInputText.replace(/[^0-9.]/g, "");
        const parsed = parseFloat(sanitizedInput);
        setPaymentAmount(Math.min(isNaN(parsed) ? 0 : parsed, remainingBalance));
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
        <Dialog id="payment-dialog" open={isOpenDialog} onClose={closePayment} /* slotProps={slotProps} */>
            <DialogTitle>Record Payment for {paymentTarget?.name}</DialogTitle>
            <DialogContent>
                {paymentTarget && (
                    <fieldset>
                    <label htmlFor="payment-amount">Payment Amount:</label>
                    <input
                        /* autoFocus -- only works when the element is MOUNTED, not when it's SHOWN; use inputRef instead */
                        id="payment-amount"
                        name="payment-amount"
                        onChange={handleInputChange}
                        min="0"
                        max={getRemainingBalance(paymentTarget)}
                        ref={defaultFocusRef}
                        step="0.01"
                        type="number"
                        value={paymentAmount}
                    />
                    <p>Remaining: ${getRemainingBalance(paymentTarget)}</p>
                    <label htmlFor="date-paid">Date Paid:</label>
                    <input
                        type="date"
                        id="date-paid"
                        name="date-paid"
                        value={datePaid}
                        onChange={e => setDatePaid(e.target.value)}// defaults to today
                    />
                    </fieldset>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={closePayment} color="error" variant="outlined">Cancel</Button>
                <Button onClick={handleConfirmClick} color="primary" variant="contained">Confirm Payment</Button>
            </DialogActions>
        </Dialog>
    );

}