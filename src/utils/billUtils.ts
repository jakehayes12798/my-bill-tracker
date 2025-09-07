import type { Bill } from "../components/types/Bill";
import type { ProcessedBills } from "../components/types/ProcessedBills";
import { billSchema } from "../components/types/Bill";

export function getPercentagePaid(bill: Bill): number {
  if (bill.totalAmount === 0) return 0;
  return (bill.paidAmount / bill.totalAmount) * 100;
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
      return a[sortBy] < b[sortBy] ? -1 : 1;
    } else {
      return a[sortBy] > b[sortBy] ? -1 : 1;
    }
  });
}

/**
 * Applies more granular processing logic to the bills array for display purposes.
 * @param bills 
 * @param daysFromToday Number of days from today to consider for "upcoming" bills (default is 60).
 * @returns A new array of bills processed according to the specified logic.
 */
export function processBills(bills: Bill[], daysFromToday: number = 60) : ProcessedBills {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() + daysFromToday);

  const byDate = (a: Bill, b: Bill) =>
    new Date(a.dueDate ?? "").getTime() - new Date(b.dueDate ?? "").getTime();

  const upcoming = bills.filter(
    b => b.dueDate && new Date(b.dueDate) <= cutoff
  ).sort(byDate);

  const future = bills.filter(
    b => b.dueDate && new Date(b.dueDate) > cutoff
  ).sort(byDate);

  const noDueDateUnpaid = bills.filter(
    b => !b.dueDate && b.paidAmount < b.totalAmount
  );

  return { upcoming, future, noDueDateUnpaid };
}


/**
 * Deletes a bill from the list of bills.
 * @param bills The current array of bills.
 * @param billIdToDelete The ID of the bill to be deleted.
 * @returns A new array of bills with the specified bill removed.
 */
export function deleteBillUtil(bills: Bill[], billIdToDelete: string): Bill[] {
  return bills.filter(bill => bill.id !== billIdToDelete);
}

/**
 * Records a payment for a given bill.
 * @param bill The bill to record the payment for.
 * @param paidAmount The amount being paid.
 * @param datePaid The date the payment was made. (TODO: use this value to store payment records)
 * @returns A new bill object with the updated paid amount.
 * @throws Error if the paid amount exceeds the total amount of the bill.
 */
export function recordPaymentUtil(bill: Bill, paidAmount: number, datePaid: string): Bill {
  const newPaidAmount = bill.paidAmount + paidAmount;
  if (newPaidAmount > bill.totalAmount) {
    throw new Error("Paid amount cannot exceed total amount");
  }
  datePaid;
  return { ...bill, paidAmount: newPaidAmount };
}

/**
 * Edits a bill by applying the provided updated fields.
 * @param bill The original bill object.
 * @param updatedFields An object containing the fields to be updated.
 * @returns A new bill object with the updated fields applied.
 */
export function editBillUtil(bill: Bill, updatedFields: Partial<Bill>): Bill {
  return { ...bill, ...updatedFields };
}

/**
 * Gets the remaining balance for a bill.
 * @param bill The bill to get the remaining balance for.
 * @returns The remaining balance of the bill.
 */
export function getRemainingBalance(bill: Bill): number {
  return bill.totalAmount - bill.paidAmount;
}

/**
 * Validates a bill object against the bill schema.
 * @param values The bill values to validate.
 * @returns An array of error messages for any validation failures.
 */
export function validateBill(values: Partial<Bill>) {
  const errors: string[] = [];

  for (const field of billSchema) {
    if (field.required && field.editable) {
      const val = values[field.key as keyof Bill];
      if (val === undefined || val === null || val === "" || (field.type === "number" && Number(val) <= 0)) {
        errors.push(`${field.label} is required`);
      }
    }
  }

  return errors;
}
