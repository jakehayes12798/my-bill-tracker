import Airtable from "airtable";

const base = new Airtable({ apiKey: import.meta.env.VITE_AIRTABLE_API_KEY }).base(
  import.meta.env.VITE_AIRTABLE_BASE_ID!
);

export const billsTable = base(import.meta.env.VITE_AIRTABLE_BILLS_TABLE!);
