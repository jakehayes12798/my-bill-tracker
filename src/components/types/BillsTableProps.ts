import type { Bill } from "../types/Bill";

export type BillsTableProps = {
  bills: Bill[];
  // called when the user wants to delete/edit/record payment — parent decides what UI/action happens
  onRequestDelete: (bill: Bill) => void;
  onRequestEdit: (bill: Bill) => void;
  onRequestRecordPayment: (bill: Bill) => void;
};
