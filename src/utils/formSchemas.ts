// utils/formSchemas.ts

/**
 * Schema for editing and validating bills.
 * - editable: whether the field should show up in user-facing forms
 * - required: whether the field must be filled before saving
 */
export const billSchema = [
  { key: "id", label: "ID", type: "text", editable: false, required: false },
  { key: "name", label: "Bill Name", type: "text", editable: true, required: true },
  { key: "totalAmount", label: "Amount", type: "number", editable: true, required: true },
  { key: "paidAmount", label: "Amount Paid", type: "number", editable: true, required: false },
  { key: "dueDate", label: "Due Date", type: "date", editable: true, required: false },
  { key: "website", label: "Payment Website Link", type: "text", editable: true, required: false }
] as const;
