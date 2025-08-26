import { useState } from "react";
import type { BillFormProps } from "../types/BillFormProps";
import { v4 as uuidv4 } from "uuid";
import type { Bill } from "../types/Bill";

function BillInputForm({ onAddBill }: BillFormProps) {

    const [billName, setBillName] = useState("");
    const [billAmount, setBillAmount] = useState<number | "">("");
    const [dueDate, setDueDate] = useState("");

    /**
     * Handles the form submission event.
     * Prevents the default form submission behavior and logs the current state values.
     * @param e The form submission event.
     */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // prevents page reload
        console.log({ billName, billAmount, dueDate });
        

        // create a full Bill object
        const newBill: Bill = {
            id: uuidv4(),             // unique ID
            name: billName,
            totalAmount: billAmount || 0,
            paidAmount: 0,            // default
            dueDate: dueDate || undefined,
        };

        onAddBill(newBill);
        
        // optionally reset form
        setBillName("");
        setBillAmount("");
        setDueDate("");
    };


    return (
        <form onSubmit={handleSubmit} className="bill-form">
            <fieldset className="input-group bill-input-group">
                <label htmlFor="billName">Bill Name:</label>
                <input 
                    required
                    className="bill-input"
                    type="text"
                    id="billName"
                    name="billName"
                    value={billName}
                    onChange={(e) => setBillName(e.target.value)}
                />
                <label htmlFor="billAmount">Amount:</label>
                <input className="bill-input"
                    type="number"
                    id="billAmount"
                    name="billAmount"
                    placeholder="0"
                    value={billAmount}
                    onChange={(e) => {
                        const value = e.target.value;
                        if (value === "") {
                            setBillAmount("");
                        } else {
                            const numberValue = Number(value);
                            // Only update state if the value is a valid number
                            if (!isNaN(numberValue)) {
                                setBillAmount(numberValue);
                            }
                        }
                    }}
                />
                <label htmlFor="dueDate">Due Date:</label>
                <input className="bill-input"
                    type="date"
                    id="dueDate"
                    name="dueDate"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                />
                <button type="submit">Add Bill</button>
            </fieldset>
        </form>
    );
}



export default BillInputForm;