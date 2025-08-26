import type { Bill } from "../components/types/Bill";

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

/**
 * Deletes a bill from the list of bills.
 * @param bills The current array of bills.
 * @param billIdToDelete The ID of the bill to be deleted.
 * @returns A new array of bills with the specified bill removed.
 */
export function handleDeleteBill(bills: Bill[], billIdToDelete: string): Bill[] {
  return bills.filter(bill => bill.id !== billIdToDelete);
}

/**
 * Records a payment for a given bill.
 * @param bill The bill to record the payment for.
 * @param paidAmount The amount being paid.
 * @returns A new bill object with the updated paid amount.
 * @throws Error if the paid amount exceeds the total amount of the bill.
 */
export function handleRecordPayment(bill: Bill, paidAmount: number): Bill {
  const newPaidAmount = bill.paidAmount + paidAmount;
  if (newPaidAmount > bill.totalAmount) {
    throw new Error("Paid amount cannot exceed total amount");
  }
  return { ...bill, paidAmount: newPaidAmount };
}

/**
 * Edits a bill by applying the provided updated fields.
 * @param bill The original bill object.
 * @param updatedFields An object containing the fields to be updated.
 * @returns A new bill object with the updated fields applied.
 */
export function handleEditBill(bill: Bill, updatedFields: Partial<Bill>): Bill {
  return { ...bill, ...updatedFields };
}