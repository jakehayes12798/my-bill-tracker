export interface Bill {
  id: string;                // unique ID for React + data (like a GUID in SQL)
  name: string;              // REQUIRED (NVARCHAR equivalent)
  dueDate?: string;          // OPTIONAL (ISO date string, e.g. "2025-09-01")
  totalAmount: number;       // REQUIRED (decimal, but JS/TS only has number)
  paidAmount: number;        // defaults to 0
  website?: string;          // OPTIONAL payment link
  apiIntegration?: string;   // OPTIONAL placeholder for future integration
}


