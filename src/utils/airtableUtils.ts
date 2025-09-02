import type { Bill } from "../components/types/Bill";
import { billsTable } from "../data_management/airtableClient";

export async function airtableCreateBill(bill: Omit<Bill, 'id'>): Promise<Bill> {
  const record = await billsTable.create({

      Name: bill.name,
      Notes: bill.notes,
      TotalAmount: bill.totalAmount,
      PaidAmount: bill.paidAmount,
      DueDate: bill.dueDate,

  });

  return {
    id: record.id, // Airtable auto-assigned record ID
    name: record.get("Name") as string,
    notes: record.get("Notes") as string | undefined,
    totalAmount: record.get("TotalAmount") as number,
    paidAmount: record.get("PaidAmount") as number,
    dueDate: record.get("DueDate") as string | undefined,
  };
}

export async function airtableUpdateBill(id: string, updates: Partial<Omit<Bill, 'id'>>): Promise<Bill> {
  const record = await billsTable.update([
    {
      id,
      fields: {
        ...(updates.name && { Name: updates.name }),
        ...(updates.notes && { Notes: updates.notes }),
        ...(updates.totalAmount !== undefined && { TotalAmount: updates.totalAmount }),
        ...(updates.paidAmount !== undefined && { PaidAmount: updates.paidAmount }),
        ...(updates.dueDate && { DueDate: updates.dueDate }),
      },
    },
  ]);

  const updated = record[0];

  return {
    id: updated.id,
    name: updated.fields.Name as string,
    notes: updated.fields.Notes as string | undefined,
    totalAmount: updated.fields.TotalAmount as number,
    paidAmount: updated.fields.PaidAmount as number,
    dueDate: updated.fields.DueDate as string | undefined,
  };
}


export async function airtableDeleteBill(id: string): Promise<void> {
  await billsTable.destroy(id);
}
