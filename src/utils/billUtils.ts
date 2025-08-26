import type { Bill } from "../types/Bill";

export function getPercentagePaid(bill: Bill): number {
  if (bill.totalAmount === 0) return 0;
  return (bill.paidAmount / bill.totalAmount) * 100;
}

export function getRemainingAmount(bill: Bill): number {
  return bill.totalAmount - bill.paidAmount;
}

/**
 * Sorts an array of bills based on a specified field and order. Returns a new array (without mutating).
 * @param bills The array of bills to sort.
 * @param sortBy The field to sort by (default is "dueDate").
 * @param ascending Whether to sort in ascending order (default is true).
 * @returns A new array of bills sorted based on the specified criteria.
 */
export function sortBills(bills: Bill[], sortBy: keyof Bill = "dueDate", ascending: boolean = true): Bill[] {
  return bills.slice().sort((a, b) => {
    if (a[sortBy] === undefined) return 1;
    if (b[sortBy] === undefined) return -1;
    if (a[sortBy] === b[sortBy]) return 0;
    if (ascending) {
      return a[sortBy]! < b[sortBy]! ? -1 : 1;
    } else {
      return a[sortBy]! > b[sortBy]! ? -1 : 1;
    }
  });
}