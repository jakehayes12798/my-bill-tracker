import { useState } from "react";
import "./App.css";
import BillInputForm from "./components/billInputForm";
import type { Bill } from "./types/Bill";
import { sortBills } from "./utils/billUtils";

function App() {

  const [bills, setBills] = useState<Bill[]>([]);

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
      <div className="bills-list">
        <ul>
          {sortBills(bills)
          .map(bill => (
            <li key={bill.id}>
              <strong>{bill.name}</strong>: ${bill.totalAmount.toFixed(2)} - Due: {bill.dueDate || "N/A"}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
