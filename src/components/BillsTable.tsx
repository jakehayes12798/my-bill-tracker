import { Payment, EditSquare, Delete } from "@mui/icons-material";
import { Tooltip, IconButton, LinearProgress } from "@mui/material";
import type { BillsTableProps } from "./types/BillsTableProps";

export default function BillsTable({
  bills,
  onRequestDelete,
  onRequestEdit,
  onRequestRecordPayment,
}: Readonly<BillsTableProps>) {
  return (
    <table className="bills-table">
      <thead>
        <tr>
              <th>Quick Actions</th>         {/* Payment, Edit */}
              <th>Bill Name</th>
              <th>Amount Remaining</th>
              <th>Due Date</th>
              <th>Amount Paid / Total:</th>
              <th>Progress</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {bills.map(bill => (
              <tr key={bill.id} className="bill-item">
                <td>
                  <Tooltip title="Record a payment for this bill">
                      <IconButton
                        className="bill-item-button record-payment-button"
                        onClick={() => onRequestRecordPayment(bill)}
                        color="secondary"
                        disabled={bill.paidAmount >= bill.totalAmount}
                      >
                        <Payment />
                      </IconButton>
                  </Tooltip>
                    <Tooltip title="Edit this bill">
                      <IconButton
                        className="bill-item-button edit-bill-button"
                        onClick={() => onRequestEdit(bill)}
                        color="primary"
                      >
                        <EditSquare />
                      </IconButton>
                    </Tooltip>
                </td>
                <td>{bill.name}</td>
                <td>${(bill.totalAmount - bill.paidAmount).toFixed(2)}</td>
                <td>{bill.dueDate || "N/A"}</td>
                <td>{bill.totalAmount > 0 ? `${(bill.paidAmount).toFixed(2)} / ${(bill.totalAmount).toFixed(2)}` : "N/A"}</td>
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
                        className="bill-item-button delete-bill-button"
                        onClick={() => onRequestDelete(bill)}
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

        );
}
