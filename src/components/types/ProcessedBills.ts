import type { Bill } from "./Bill";

export type ProcessedBills = {
  upcoming: Bill[];
  future: Bill[];
  noDueDateUnpaid: Bill[];
};