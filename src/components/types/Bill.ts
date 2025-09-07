// src/components/types/Bill.ts
// Defines the Bill interface and billSchema for validation and form generation
// @jakehayes12798


/**
 * Represents a bill with various properties.
 * @param id - Unique identifier for the bill (AirTable rec ID)
 * @param name - Name of the bill (required)
 * @param dueDate - Due date of the bill (optional, ISO date string)
 * @param totalAmount - Total amount of the bill (required)
 * @param paidAmount - Amount paid towards the bill (defaults to 0)
 * @param website - Optional payment link for the bill
 * @param apiIntegration - Placeholder for future API integration
 * @param notes - Optional notes about the bill
 * @param isBeyondCutoff - Derived property indicating if the bill is beyond a certain cutoff date
 * @param isPaid - Derived property indicating if the bill is fully paid
 * @param recurrence - Optional recurrence pattern for the bill (e.g., "monthly")
 * @jakehayes12798
 */
export interface Bill {
  id: string;                 // AirTable rec ID for identification
  name: string;               // REQUIRED (NVARCHAR equivalent)
  dueDate?: string;           // OPTIONAL (ISO date string, e.g. "2025-09-01")
  totalAmount: number;        // REQUIRED (decimal, but JS/TS only has number)
  paidAmount: number;         // defaults to 0
  website?: string;           // OPTIONAL payment link
  apiIntegration?: string;    // OPTIONAL placeholder for future integration
  notes?: string              // OPTIONAL notes
  isBeyondCutoff?: boolean;   // derived property, not stored in Airtable
  isPaid?: boolean;           // derived property, not stored in Airtable

  recurrence?: "monthly" | "none"; // OPTIONAL recurrence pattern
}



type BillSchemaField =
{
      key: keyof Bill;
      label: string;
      type: "text" | "number" | "date" | "select";
      editable: boolean;
      required: boolean;
      options?: string[]; // only for select types, so it's optional here
    };

/**
 * Schema for editing and validating bills.
 * - editable: whether the field should show up in user-facing forms
 * - required: whether the field must be filled before saving
 * - options: for select fields, the available options
 * @jakehayes12798
 */
export const billSchema: BillSchemaField[] = [
  { key: "id", label: "ID", type: "text", editable: false, required: false },
  { key: "name", label: "Bill Name", type: "text", editable: true, required: true },
  { key: "totalAmount", label: "Amount", type: "number", editable: true, required: true },
  { key: "paidAmount", label: "Amount Paid", type: "number", editable: true, required: false },
  { key: "dueDate", label: "Due Date", type: "date", editable: true, required: false },
  { key: "website", label: "Payment Website Link", type: "text", editable: true, required: false },
  { key: "recurrence", label: "Recurring?", type: "select", editable: true, required: false, options: ["none", "monthly"] },
];



