/**
 * src\App.tsx
 * App.tsx owns the logic, which means it's naturally going to be the most complex piece.
 * For that reason, the design goal is separation of concerns: keep UI components dumb and focused on presentation,
 * while App.tsx manages state and business logic.
 * 
 * By assigning away all the presentation, App.tsx can focus solely on logic and state.
 */

import { useState, useMemo, useCallback, useEffect } from "react";
import "./App.css";
import BillInputForm from "./components/BillInputForm";
import type { Bill } from "./components/types/Bill";
import { deleteBillUtil, editBillUtil, getRemainingBalance, recordPaymentUtil, sortBills } from "./utils/billUtils";
import BillsTable from "./components/BillsTable";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { Save } from "@mui/icons-material";
import { billEditSchema } from "./utils/formSchemas";

function App() {

  const [bills, setBills] = useState<Bill[]>([]);
  const sortedBills = useMemo(() => sortBills(bills), [bills]); // sorts whenever the bills array changes

  // ---------- Handlers for CRUD (useCallback for stable refs)
  const confirmDelete = useCallback((id: string) => {
    setBills(prev => deleteBillUtil(prev, id));
  }, []);

  const applyEdit = useCallback((id: string, fields: Partial<Bill>) => {
    setBills(prev => prev.map(b => b.id === id ? editBillUtil(b, fields) : b));
  }, []);

  const applyPayment = useCallback((id: string, amount: number, date: string) => {
    setBills(prev => prev.map(b => b.id === id ? recordPaymentUtil(b, amount, date) : b));
  }, []);

  // ------------ Dialog states
  /* Delete Bill Functions */
  const [deleteTarget, setDeleteTarget] = useState<Bill | null>(null);
  const openDelete = (bill: Bill) => (setDeleteTarget(bill));
  const closeDelete = () => setDeleteTarget(null);
  const onConfirmDelete = () => {
    if (!deleteTarget) return;
    confirmDelete(deleteTarget.id);
    closeDelete();
  };

  /* Edit Dialog Helpers */
  // State: The bill we are editing right now; null if no modal is open
  const [editTarget, setEditTarget] = useState<Bill | null>(null);
  // State: the form field values being edited
  // Note: must be string|number for compatibility with <payment-dialog>'s <input value>
  const [editValues, setEditValues] = useState<Partial<Bill>>({});
  /**
   * Opens the edit dialog for a specific bill and sets {@link editTarget} to that bill.
   * @param bill The bill to edit.
   * @returns void
   */
  const openEdit = (bill: Bill) => (setEditTarget(bill));
  /**
   * Closes the edit dialog and sets {@link editTarget} to null.
   * @returns void
   */
  const closeEdit = () => setEditTarget(null);
  const onConfirmEdit = () => {
    if (!editTarget) return;
    applyEdit(editTarget.id, editValues);
    closeEdit();
  };
  useEffect(() => {
  if (editTarget) {
    const initialValues: Record<string, string | number> = {};
    billEditSchema.forEach(({ key }) => {
      initialValues[key] = editTarget[key as keyof Bill] ?? "";
    });
    setEditValues(initialValues);
  }
}, [editTarget]);


  /* Record Payment Functions */
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [datePaid, setDatePaid] = useState(new Date().toISOString().split("T")[0]);
  const [paymentTarget, setPaymentTarget] = useState<Bill | null>(null);
  const openPayment = (bill: Bill) => (setPaymentTarget(bill));
  const closePayment = () => setPaymentTarget(null);
  const onConfirmPayment = () => {
    if (!paymentTarget) return;
    applyPayment(paymentTarget.id, paymentAmount, datePaid);
    closePayment();
  };
  useEffect(() => {
    if (paymentTarget) {
      setPaymentAmount(getRemainingBalance(paymentTarget));
      setDatePaid(new Date().toISOString().split("T")[0]);
    }
  }, [paymentTarget]);

/** This was removed for using getElementById - that's not best practice. 
   * Handles the saving of edited bill information.
  const handleEditFormSave = () => {
  if (!editTarget) return;

  const formData = new FormData(document.getElementById("edit-form") as HTMLFormElement);
  const updatedFields: Partial<Bill> = {};

  billEditSchema.forEach(({ key, type }) => {
    const value = formData.get(key);
    if (value === null) return;

    if (type === "number") updatedFields[key] = parseFloat(value as string);
    else updatedFields[key] = value as string;
  });

  onConfirmEdit(updatedFields);
};

/**
 * Handles the saving of recorded payment information.
 * @returns void

const handleRecordPaymentFormSave = () => {
  if(!paymentTarget) return;

  const formData = new FormData(document.getElementById("payment-form") as HTMLFormElement);
  const paymentAmount = parseFloat(formData.get("payment-amount") as string);
  const datePaid = formData.get("date-paid") as string;

  onConfirmPayment(paymentAmount, datePaid);
};
*/

  /**
   * Handles the addition of a new bill to the state.
   * @param bill The bill object containing name, amount, and due date.
   */
  const handleAddBill = (bill: Bill) => {
    console.log("Adding bill: ", { billName: bill.name, billAmount: bill.totalAmount, dueDate: bill.dueDate });
    // Add the bill to the state array.
    setBills((prevBills) => [...prevBills, bill]);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="title">My Bill Tracker</h1>
        <p className="subtitle">A simple way to track your monthly bills and expenses</p>
      </header>
      <main className="app-main">
        <BillInputForm onAddBill={handleAddBill} />
        <BillsTable
        bills={sortedBills}
        onRequestDelete={(bill) => openDelete(bill)}
        onRequestEdit={(bill) => openEdit(bill)}
        onRequestRecordPayment={(bill) => openPayment(bill)}
      />
      </main>

      {/* Delete dialog */}
      <Dialog open={!!deleteTarget} onClose={closeDelete}>
        <DialogTitle>Delete bill?</DialogTitle>
        <DialogContent>
          {deleteTarget && <div>
            <div><strong>{deleteTarget.name}</strong></div>
            <div>Paid: ${deleteTarget.paidAmount.toFixed(2)}</div>
            <div>Total: ${deleteTarget.totalAmount.toFixed(2)}</div>
          </div>}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDelete} color="error" variant="outlined">Cancel</Button>
          <Button onClick={onConfirmDelete} color="error" variant="contained">I'm Sure; Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Payment dialog */}
      <Dialog id="payment-dialog" open={!!paymentTarget} onClose={closePayment}>
          <DialogTitle>Record Payment for {paymentTarget?.name}</DialogTitle>
          <DialogContent>
            {paymentTarget && (
              <fieldset>
                <label htmlFor="payment-amount">Payment Amount:</label>
                <input
                  type="number"
                  id="payment-amount"
                  name="payment-amount"
                  min="0"
                  max={getRemainingBalance(paymentTarget)}
                  step="0.01"
                  autoFocus
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(parseFloat(e.target.value))}
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
            <Button onClick={onConfirmPayment} color="primary" variant="contained">Confirm Payment</Button>
          </DialogActions>
      </Dialog>

      {/* Edit dialog */}
      <Dialog open={!!editTarget} onClose={closeEdit}>
        <DialogTitle>Edit {editTarget?.name}</DialogTitle>
        <DialogContent>
          {/* Blow apart the editTarget and create form fields for each of the USER EDITABLE fields that we've defined in the Schema for the bill */}
          {editTarget && (
            <fieldset>
              {billEditSchema.map(({ key, label, type }) => (
                <div key={key}>
                  <label htmlFor={key}>{label}:</label>
                  <input
                    id={key}
                    name={key}
                    type={type}
                    value={editValues[key] ?? ""}
                    onChange={e => setEditValues(prev => ({
                      ...prev,
                      [key]: type === "number" ? parseFloat(e.target.value) : e.target.value
                    }))}
                  />

                </div>
              ))}
            </fieldset>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEdit} color="error" variant="outlined">Cancel</Button>
          <Button onClick={onConfirmEdit} color="primary" variant="contained" startIcon={<Save />}>Save Changes</Button>
        </DialogActions>
      </Dialog>

  </div>
);

}

export default App;
