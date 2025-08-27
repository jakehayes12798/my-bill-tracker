// utils/formSchemas.ts

/**
 * Schema for editing a bill. More fields can be added as needed. Any field added to this schema will be exposed and editable by users directly, so be careful.
 * Note that this schema's value types must be string|number for compatibility with <edit-dialog>'s <input value>
*/
export const billEditSchema = [
  { key: "name", label: "Bill Name", type: "text" },
  { key: "totalAmount", label: "Amount", type: "number" },
  { key: "paidAmount", label: "Amount Paid", type: "number" },
  { key: "dueDate", label: "Due Date", type: "date" },
] as const;
