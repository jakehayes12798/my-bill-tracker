/**
 * src\App.tsx
 * App.tsx owns the logic, which means it's naturally going to be the most complex piece.
 * For that reason, the design goal is separation of concerns: keep UI components dumb and focused on presentation,
 * while App.tsx manages state and business logic.
 * 
 * By assigning away all the presentation, App.tsx can focus solely on logic and state.
 */

import { useState, useMemo, useCallback } from "react";
import "./App.css";
import BillInputForm from "./components/BillInputForm";
import type { Bill } from "./components/types/Bill";
import { handleDeleteBill, handleEditBill, handleRecordPayment, sortBills } from "./utils/billUtils";
import BillsTable from "./components/BillsTable";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

function App() {

  const [bills, setBills] = useState<Bill[]>([]);
  const sortedBills = useMemo(() => sortBills(bills), [bills]); // sorts whenever the bills array changes

  // ---------- Handlers for CRUD (useCallback for stable refs)
  const addBill = useCallback((b: Bill) => setBills(prev => [...prev, b]), []);

  const confirmDelete = useCallback((id: string) => {
    setBills(prev => deleteBillUtil(prev, id));
  }, []);

  const applyEdit = useCallback((id: string, fields: Partial<Bill>) => {
    setBills(prev => prev.map(b => b.id === id ? editBillUtil(b, fields) : b));
  }, []);

  const applyPayment = useCallback((id: string, amount: number) => {
    setBills(prev => prev.map(b => b.id === id ? recordPaymentUtil(b, amount) : b));
  }, []);

  // ------------ Dialog states
  const [deleteTarget, setDeleteTarget] = useState<Bill | null>(null);
  const openDelete = (bill: Bill) => (console.log("Opening delete for", bill), setDeleteTarget(bill));
  const closeDelete = () => setDeleteTarget(null);
  const onConfirmDelete = () => {
    if (!deleteTarget) return;
    confirmDelete(deleteTarget.id);
    closeDelete();
  };

  const [editTarget, setEditTarget] = useState<Bill | null>(null);
  const openEdit = (bill: Bill) => (console.log("Opening edit for", bill), setEditTarget(bill));
  const closeEdit = () => setEditTarget(null);
  const onConfirmEdit = (updatedFields: Partial<Bill>) => {
    if (!editTarget) return;
    applyEdit(editTarget.id, updatedFields);
    closeEdit();
  };

  const [paymentTarget, setPaymentTarget] = useState<Bill | null>(null);
  const openPayment = (bill: Bill) => (console.log("Opening payment for", bill), setPaymentTarget(bill));
  const closePayment = () => setPaymentTarget(null);
  const onConfirmPayment = (amount: number) => {
    if (!paymentTarget) return;
    applyPayment(paymentTarget.id, amount);
    closePayment();
  };

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
        onRequestEdit={(bill) => {/* open edit dialog with bill */}}
        onRequestRecordPayment={(bill) => {/* open payment dialog */}}
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
          <Button onClick={closeDelete}>Cancel</Button>
          <Button onClick={onConfirmDelete} color="error" variant="contained">I'm Sure; Delete</Button>
        </DialogActions>
      </Dialog>

  </div>
);

}

export default App;
