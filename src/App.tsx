import { useState, useMemo } from "react";
import "./App.css";
import BillInputForm from "./components/BillInputForm";
import type { Bill } from "./types/Bill";
import { sortBills } from "./utils/billUtils";
import { Payment, EditSquare, Delete } from "@mui/icons-material";
import { IconButton, LinearProgress, Tooltip } from "@mui/material";

function App() {

  const [bills, setBills] = useState<Bill[]>([]);
  const sortedBills = useMemo(() => sortBills(bills), [bills]); // sorts whenever the bills array changes

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
      </main>
        <table className="bills-table">
          <thead>
            <tr>
              <th>Actions</th>         {/* Payment */}
              <th>Edit</th>
              <th>Bill Name</th>
              <th>Amount Remaining</th>
              <th>Due Date</th>
              <th>Amount Paid / Total:</th>
              <th>Progress</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {sortedBills.map(bill => (
              <tr key={bill.id} className="bill-item">
                <td>
                  <Tooltip title="Record a payment for this bill">
                      <IconButton
                        className="record-payment-button"
                        onClick={() => handleRecordPayment(bill.id)}
                        color="secondary"
                        disabled={bill.paidAmount >= bill.totalAmount}
                      >
                        <Payment />
                      </IconButton>
                  </Tooltip>
                </td>
                <td>
                    <Tooltip title="Edit this bill">
                      <IconButton
                        className="edit-bill-button"
                        onClick={() => handleEditBill(bill.id)}
                        color="primary"
                      >
                        <EditSquare />
                      </IconButton>
                    </Tooltip>
                </td>
                <td>{bill.name}</td>
                <td>${(bill.totalAmount - bill.paidAmount).toFixed(2)}</td>
                <td>{bill.dueDate || "N/A"}</td>
                <td>{bill.totalAmount > 0 ? `${Math.round(bill.paidAmount)} / ${Math.round(bill.totalAmount)}` : "N/A"}</td>
                <td>
                    <Tooltip title="Payment progress">
                        <LinearProgress
                          variant="determinate" // we know the maximum value
                          value={bill.totalAmount > 0 ? (bill.paidAmount / bill.totalAmount) * 100 : 0}
                        />
                    </Tooltip>
                </td>
                <td>
                    <Tooltip title="Delete this bill">
                      <IconButton
                        className="delete-bill-button"
                        onClick={() => handleDeleteBill(bill.id)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
  </div>
);

}

export default App;
