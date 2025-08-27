# Commenting Standard for React + TypeScript

<sub>Created: 2025/08/27 10:19:16
<br/>Last modified: 2025/08/27 10:30:26
</sub>

## Table of Contents <!-- omit from toc -->
- [Commenting Standard for React + TypeScript](#commenting-standard-for-react--typescript)
  - [1. State Variables](#1-state-variables)
  - [2. Derived State / Calculated Values](#2-derived-state--calculated-values)
  - [3. Handlers / Functions](#3-handlers--functions)
  - [4. useEffect / useMemo / useCallback](#4-useeffect--usememo--usecallback)
  - [5. JSX / UI Components](#5-jsx--ui-components)
  - [6. Utility Functions](#6-utility-functions)
  - [General Notes / Best Practices:](#general-notes--best-practices)

## 1. State Variables

- **What to include:**  
  - Purpose of the state (what does it represent?)  
  - Units/format (string, number, boolean, date)  
  - Any special constraints or default values  
- **Example:**

```ts
// Currently selected bill for editing; null if no modal is open
const [editTarget, setEditTarget] = useState<Bill | null>(null);
```

## 2. Derived State / Calculated Values

- **What to include:**
  - How it is calculated
  - Dependencies (which state or props it relies on)
- **Example:**

```ts
// Remaining balance for the selected payment; derived from totalAmount - paidAmount
const remainingBalance = getRemainingBalance(paymentTarget);
```

## 3. Handlers / Functions

- **What to include:**
  - Purpose / intent
  - Input parameters (types, units)
  - Side effects or state changes
  - What it calls / delegates to
- **Example:**

```ts
// Handles saving of edits for a bill
// updatedFields: Partial<Bill> representing changes from the edit form
// Updates App state and closes the modal
const onConfirmEdit = (updatedFields: Partial<Bill>) => {
  if (!editTarget) return;
  applyEdit(editTarget.id, updatedFields);
  closeEdit();
};
```

## 4. useEffect / useMemo / useCallback

- **What to include:**
  - What triggers this effect/memo
  - Purpose of the effect/memo
  - Expected side effects or returns
- **Example:**

```ts
// Whenever a new bill is selected for editing, initialize form fields
useEffect(() => {
  if (!editTarget) return;
  const initialValues: Record<string, string | number> = {};
  billEditSchema.forEach(({ key }) => {
    initialValues[key] = editTarget[key as keyof Bill] ?? "";
  });
  setEditValues(initialValues);
}, [editTarget]);
```

## 5. JSX / UI Components

- **What to include:**
  - Purpose of the component/element
  - Any dynamic behavior or props dependencies
- **Example:**

```tsx
{/* Payment modal: opens when a bill is selected for payment */}
<Dialog open={!!paymentTarget} onClose={closePayment}>
```

## 6. Utility Functions

- **What to include:**
  - Purpose of the function
  - Input and output types
  - Side effects (if any)
- **Example:**

```ts
/**
 * Calculates the remaining balance of a bill
 * @param bill The bill to calculate
 * @returns Remaining amount to be paid
 */
export function getRemainingBalance(bill: Bill): number {
  return bill.totalAmount - bill.paidAmount;
}
```

## General Notes / Best Practices:
- Keep comments concise, but informative; avoid restating obvious code.
- Use /** */ for JSDoc style for functions and utilities.
- Use // for inline comments, single lines, or small explanations.
- Focus on why, not just what. The code shows what, the comment explains why.