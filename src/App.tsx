/**
 * src\App.tsx
 * @author Jake Hayes
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
import { deleteBillUtil, editBillUtil, recordPaymentUtil, sortBills } from "./utils/billUtils";
import BillsTable from "./components/BillsTable";
import RecordPaymentDialog from "./components/dialogs/RecordPaymentDialog";
import DeleteBillDialog from "./components/dialogs/DeleteBillDialog";
import EditBillDialog from "./components/dialogs/EditBillDialog";
import Footer from "./components/Footer";
import { billsTable } from "./data_management/airtableClient";
import AppHeader from "./components/AppHeader";
import { airtableCreateBill, airtableDeleteBill, airtableUpdateBill } from "./utils/airtableUtils";

export default function App() {

  const [bills, setBills] = useState<Bill[]>([]);
  const sortedBills = useMemo(() => sortBills(bills), [bills]); // sorts whenever the bills array changes

  
  useEffect(() => {
    billsTable
      .select({ view: "Grid view" }) // or any Airtable view you made
      .all()
      .then((records) => {
      const mapped: Bill[] = records.map((r) => {
        console.log(
          `Found record id ${r.getId()} | Name: ${r.get("Name")} | Due: ${r.get("DueDate")}`
        ); 
        return {
        id: String(r.getId()),
        name: String(r.fields.Name || ""),          // <- force it to a string
        totalAmount: Number(r.fields.TotalAmount) || 0,
        paidAmount: Number(r.fields.PaidAmount) || 0,
        dueDate: r.fields.DueDate || undefined,
        website: r.fields.Website || undefined,
        apiIntegration: r.fields.ApiIntegration || undefined,
      };
      });

    setBills(mapped);
    }).catch((err) => console.error(err));
  }, []);

  // ---------- Handlers for CRUD (useCallback for stable refs)
  const confirmDelete = useCallback(async (id: string) => {
    try {
      await airtableDeleteBill(id); // <-- Airtable API
      setBills(prev => deleteBillUtil(prev, id));
    } catch (err) {
      console.error("Failed to delete bill:", err);
    }
}, []);

  /**
   * Applies edits to a specific bill by mapping over any bills with the same id on fields passed in.
   * @param id The id of the bill to edit.
   * @param fields The fields to edit.
   */
  const applyEdit = useCallback(async (id: string, fields: Partial<Bill>) => {
      try {
    const updated = await airtableUpdateBill(id, fields); // <-- Airtable API call
    setBills(prev => prev.map(b => b.id === id ? updated : b));
  } catch (err) {
    console.error("Failed to update bill:", err);
  }
  }, []);


  const applyPayment = useCallback(
      async (bill: Bill, amount: number, date: string) => {
    try {
      const updated = await airtableUpdateBill(bill.id, 
        {
          paidAmount: bill.paidAmount + amount,
        }
    );
      setBills(prev => prev.map(b => b.id === bill.id ? updated : b));
    } catch (err) {
      console.error("Failed to record payment:", err);
    }
  }, []);

  // ------------ Dialog states

  /** Delete Bill Functions (most of the logic is in {@link DeleteBillDialog}) */
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
  const onConfirmEdit = (editValues: Partial<Bill>) => {
    if (!editTarget) return;
    applyEdit(editTarget.id, editValues);
    closeEdit();
  };


  /* Payment Dialog Helpers */
  const [paymentTarget, setPaymentTarget] = useState<Bill | null>(null);
  const openPayment = (bill: Bill) => {
    console.log("Opening payment for bill:", bill.id, bill.name);
    setPaymentTarget(bill);
  };
  const closePayment = () => setPaymentTarget(null);
  const onConfirmRecordPayment = async (paymentAmount: number, datePaid: string) => {
    console.log("Confirming payment for target:", paymentTarget?.id, paymentTarget, paymentAmount, datePaid);
    if (!paymentTarget) return;
    await applyPayment(paymentTarget, paymentAmount, datePaid);
    console.log("Confirmed payment for target:", paymentTarget);
    closePayment();
  };




  const handleAddBill = useCallback(async (bill: Omit<Bill, 'id'>) => {
    try {
      // Use the Airtable API to create a new bill
      const newBill = await airtableCreateBill(bill);
      // Add the newly created bill to the bills list
      setBills(prev => [...prev, newBill]);
    } catch (err) {
      console.error("Failed to create bill:", err);
    }
  }, []);


  return (
    <div className="app">
      <AppHeader />
      <main className="app-main">
        <BillInputForm onAddBill={handleAddBill} />
        <BillsTable
        bills={sortedBills}
        onRequestDelete={(bill) => openDelete(bill)}
        onRequestEdit={(bill) => openEdit(bill)}
        onRequestRecordPayment={(bill) => openPayment(bill)}
      />
      </main>



      {/* Payment dialog */
      !!paymentTarget && (
        <RecordPaymentDialog
          paymentTarget={paymentTarget}
          onConfirmRecordPayment={onConfirmRecordPayment}
          closePayment={closePayment}
          isOpenDialog={!!paymentTarget}
        />
      )}

      {/* Edit dialog */
      !!editTarget && (
        <EditBillDialog
          editTarget={editTarget}
          closeEdit={closeEdit}
          onConfirmEdit={onConfirmEdit}
          isOpenDialog={!!editTarget}
        />
      )}

      {/* Delete dialog */
      !!deleteTarget && (
        <DeleteBillDialog
          deleteTarget={deleteTarget}
          closeDelete={closeDelete}
          onConfirmDelete={onConfirmDelete}
          isOpenDialog={!!deleteTarget}
        />
      )}

      <Footer />
  </div>
);

}