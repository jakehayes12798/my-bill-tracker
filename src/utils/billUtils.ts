import { Bill } from "../types/Bill";

export function getPercentagePaid(bill: Bill): number {
  if (bill.totalAmount === 0) return 0;
  return (bill.paidAmount / bill.totalAmount) * 100;
}

export function getRemainingAmount(bill: Bill): number {
  return bill.totalAmount - bill.paidAmount;
}
