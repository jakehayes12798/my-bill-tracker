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
import type { Bill } from "./components/types/Bill";
import { deleteBillUtil, processBills } from "./utils/billUtils";
import BillsTable from "./components/BillsTable";
import RecordPaymentDialog from "./components/dialogs/RecordPaymentDialog";
import DeleteBillDialog from "./components/dialogs/DeleteBillDialog";
import EditBillDialog from "./components/dialogs/EditBillDialog";
import Footer from "./components/Footer";
import { billsTable } from "./data_management/airtableClient";
import AppHeader from "./components/AppHeader";
import { airtableCreateBill, airtableDeleteBill, airtableUpdateBill } from "./utils/airtableUtils";
import AddBillDialog from "./components/dialogs/AddBillDialog";
import DaysAheadDropdown from "./components/DaysAheadDropdown";

export default function App() {

  const [bills, setBills] = useState<Bill[]>([]);
  const [daysAhead, setDaysAhead] = useState<number>(60);
  const sortedBills = useMemo(() => processBills(bills, daysAhead), [bills, daysAhead]); // sorts whenever the bills array changes

  
  useEffect(() => {
    billsTable
      .select({ view: "Grid view" }) // or any Airtable view you made
      .all()
      .then((records) => 
      {
        const asString = (val: unknown): string | undefined => 
          val != null ? String(val) : undefined;

        const mapped: Bill[] = records.map((r) => ({
          id: String(r.getId()),
          name: asString(r.fields.Name) || "",
          totalAmount: Number(r.fields.TotalAmount) || 0,
          paidAmount: Number(r.fields.PaidAmount) || 0,
          dueDate: asString(r.fields.DueDate),
          website: asString(r.fields.Website),
          apiIntegration: asString(r.fields.ApiIntegration),
      }));

    setBills(mapped);
    }).catch((err) => console.error(err));
  }, []);

  // ---------- Handlers for CRUD (useCallback for stable refs)

  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);

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
      date; // TODO: use this value to store payment records
      // For now, just update the paidAmount on the bill
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


  const closeAdd = () => setIsAddDialogOpen(false);

  const onConfirmAdd = (newBill: Partial<Bill>) => {
    const fullBill = newBill as Omit<Bill, "id">;
    // validate required fields
    if (fullBill.name && fullBill.name.trim().length > 0) {
      handleAddBill(fullBill);
    } else {
      console.error("Bill must have a name");
    }
  };

  /**
   * Handles adding a new bill, including support for recurring monthly bills.
   * If the bill is recurring monthly, it creates 12 bills with incremented due dates.
   * Otherwise, it creates a single bill.
   * @param bill The bill to add (without an id).
   */
const handleAddBill = useCallback(async (bill: Omit<Bill, "id">) => {
  try {
    if (bill.recurrence === "monthly" && bill.dueDate) {
      // Parse base date
      const startDate = new Date(bill.dueDate);
      const newBills: Omit<Bill, "id">[] = [];

      for (let i = 0; i < 12; i++) {
        const due = new Date(startDate);
        due.setMonth(due.getMonth() + i);

        newBills.push({ ...bill, dueDate: due.toISOString().split("T")[0] });
      }

      // Batch insert
      const created = await Promise.all(newBills.map(b => airtableCreateBill(b)));
      setBills(prev => [...prev, ...created]);
    } else {
      // Normal single bill
      const newBill = await airtableCreateBill(bill);
      setBills(prev => [...prev, newBill]);
    }
  } catch (err) {
    console.error("Failed to create bill:", err);
  }
}, []);



  return (
    <div className="app">
      <AppHeader />
      <main className="app-main">
        {/* Filter selector */}
        <DaysAheadDropdown daysAhead={daysAhead} setDaysAhead={setDaysAhead} />

        <BillsTable
          processedBills={sortedBills}
          onRequestDelete={(bill) => openDelete(bill)}
          onRequestEdit={(bill) => openEdit(bill)}
          onRequestRecordPayment={(bill) => openPayment(bill)}
          daysAhead={daysAhead}
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

      {/* Add dialog */
      isAddDialogOpen && (
      <AddBillDialog
        closeAdd={closeAdd}
        onConfirmAdd={onConfirmAdd}
        isOpenDialog={isAddDialogOpen}
      />)}

      {/* Add a bill via floating button */}
      <button
        className="fab"
        onClick={() => {
          setIsAddDialogOpen(true);
        }}
      >
        +
      </button>

      <Footer />
  </div>
);

}