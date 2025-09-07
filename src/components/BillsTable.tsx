import React from "react";
import BillRow from "./BillRow";
import type { BillsTableProps } from "./types/BillsTableProps";
import type { Bill } from "./types/Bill";

export default function BillsTable({
  processedBills,
  onRequestDelete,
  onRequestEdit,
  onRequestRecordPayment,
  daysAhead
}: Readonly<BillsTableProps>) {

  const [showFuture, setShowFuture] = React.useState(false);

  return (
    <table className="bills-table">
      <thead>
        <tr>
          <th>Quick Actions</th>
          <th>Bill Name</th>
          <th>Amount Remaining</th>
          <th>Due Date</th>
          <th>Amount Paid / Total</th>
          <th>Progress</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        {processedBills.upcoming.map((bill: Bill) => (
  <BillRow 
    key={bill.id} 
    bill={bill} 
    onRequestDelete={onRequestDelete}
    onRequestEdit={onRequestEdit}
    onRequestRecordPayment={onRequestRecordPayment}
  />
))}

{processedBills.future.length > 0 && (
  <tr className="future-bills-row">
    <td colSpan={5}>
      {processedBills.future.length} more bills due after {daysAhead} days
      <button onClick={() => setShowFuture(!showFuture)}>
        {showFuture ? "Hide" : "Show"}
      </button>
    </td>
  </tr>
)}

{showFuture && processedBills.future.map(bill => (
    <BillRow 
    key={bill.id} 
    bill={bill} 
    onRequestDelete={onRequestDelete}
    onRequestEdit={onRequestEdit}
    onRequestRecordPayment={onRequestRecordPayment}
  />
))}

{processedBills.noDueDateUnpaid.map(bill => (
    <BillRow 
    key={bill.id} 
    bill={bill} 
    onRequestDelete={onRequestDelete}
    onRequestEdit={onRequestEdit}
    onRequestRecordPayment={onRequestRecordPayment}
  />
))}

      </tbody>
    </table>
  );
}
