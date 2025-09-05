import { Payment, EditSquare, Delete } from "@mui/icons-material";
import { Tooltip, IconButton } from "@mui/material";
import LinearProgressWithLabel from "./LinearProgressWithLabel";
import type { Bill } from "./types/Bill";

type BillRowProps = {
  bill: Bill;
  onRequestDelete: (bill: Bill) => void;
  onRequestEdit: (bill: Bill) => void;
  onRequestRecordPayment: (bill: Bill) => void;
};

/**
 * A single row in the bills table, representing one bill and its actions.
 * @param bill
 * @param onRequestDelete
 * @param onRequestEdit
 * @param onRequestRecordPayment
 * @returns A single table row for the bill.
 */
export default function BillRow({
  bill,
  onRequestDelete,
  onRequestEdit,
  onRequestRecordPayment,
}: Readonly<BillRowProps>) {
  return (
    <tr
      key={bill.id}
      className={`bill-item 
        ${bill.paidAmount >= bill.totalAmount ? "bill-paid" : ""}
        ${bill.isBeyondCutoff ? "bill-beyond-cutoff" : ""}
      `}
    >
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
      <td>
        {bill.website ? (
          <a href={bill.website} target="_blank" rel="noopener noreferrer">
            {bill.name}
          </a>
        ) : (
          bill.name
        )}
      </td>
      <td>${(bill.totalAmount - bill.paidAmount).toFixed(2)}</td>
      <td>{bill.dueDate || "N/A"}</td>
      <td>
        {bill.totalAmount > 0
          ? `${bill.paidAmount.toFixed(2)} / ${bill.totalAmount.toFixed(2)}`
          : "N/A"}
      </td>
      <td>
        <Tooltip title="Payment progress">
          <LinearProgressWithLabel
            value={
              bill.totalAmount > 0
                ? (bill.paidAmount / bill.totalAmount) * 100
                : 0
            }
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
  );
}
