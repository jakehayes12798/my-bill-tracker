// components/BillFormFields.tsx
import type { Bill } from "./types/Bill";
import { billSchema } from "./types/Bill";

type BillFormFieldsProps = Readonly<{
  values: Partial<Bill>;
  setValues: React.Dispatch<React.SetStateAction<Partial<Bill>>>;
  defaultFocusRef?: React.RefObject<HTMLInputElement | null>;
}>;

export default function BillFormFields({ values, setValues, defaultFocusRef }: BillFormFieldsProps) {
    
    return (
    <fieldset>
      {billSchema.filter(f => f.editable).map(({ key, label, type, required, options }, indexCounter) => (
        <div key={key}>
          <label htmlFor={key}>{label}{required && " *"}:</label>
          
        {type === "select" ? (
            <select
              id={key}
              name={key}
              value={values[key]?.toString() ?? "none"}
              onChange={e => setValues(prev => ({ ...prev, [key]: e.target.value }))}
            >
              {options?.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          ) : (
            <input
              id={key}
              name={key}
              type={type}
              value={values[key]?.toString() ?? ""}
              onChange={e =>
                setValues(prev => ({
                  ...prev,
                  [key]: type === "number" ? parseFloat(e.target.value) || 0 : e.target.value
                }))
              }
              ref={indexCounter === 0 ? defaultFocusRef : undefined}
            />
          )}
        </div>
      ))}
    </fieldset>
  );
}
