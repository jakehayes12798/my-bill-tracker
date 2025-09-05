import type { Bill } from "../types/Bill";
import type { ProcessedBills } from "./ProcessedBills";

export type BillsTableProps = {
  processedBills: ProcessedBills;
  // called when the user wants to delete/edit/record payment — parent decides what UI/action happens
  onRequestDelete: (bill: Bill) => void;
  onRequestEdit: (bill: Bill) => void;
  onRequestRecordPayment: (bill: Bill) => void;
  daysAhead: number; // number of days ahead to show "upcoming" bills
};
