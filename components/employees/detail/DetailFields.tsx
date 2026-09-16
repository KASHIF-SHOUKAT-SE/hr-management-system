import { Pencil, X } from "lucide-react";

const labelClass = "text-[11px] font-medium text-gray-500";
const valueClass = "text-sm font-medium text-gray-900";

export function SectionCard({
  title,
  children,
  isEditing,
  onToggleEdit,
  onSave,
  onCancel,
}: {
  title: string;
  children: React.ReactNode;
  isEditing: boolean;
  onToggleEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        <button type="button" onClick={onToggleEdit} className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-emerald-200 hover:text-emerald-600" aria-label={isEditing ? "Cancel edit" : `Edit ${title}`}>
          {isEditing ? <X className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
        </button>
      </div>
      <div className="p-5">{children}</div>
      {isEditing && (
        <div className="flex justify-end gap-3 border-t border-gray-100 px-5 py-4">
          <button type="button" onClick={onCancel} className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">Cancel</button>
          <button type="button" onClick={onSave} className="rounded-xl bg-[#219653] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1d8650]">Save Changes</button>
        </div>
      )}
    </div>
  );
}

export function InfoField({ label, value }: { label: string; value: string }) {
  return <div className="space-y-1"><div className={labelClass}>{label}</div><div className={valueClass}>{value || "-"}</div></div>;
}

export function InputField({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  selectOptions,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  selectOptions?: string[];
}) {
  const inputClassName = "h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-[#219653] focus:ring-2 focus:ring-[#219653]/10";
  return (
    <label className="space-y-1.5">
      <span className="flex items-center gap-1 text-[11px] font-medium text-gray-500">{label}{required && <span className="text-red-500">*</span>}</span>
      {selectOptions ? <select value={value ?? ""} onChange={(event) => onChange(event.target.value)} className={inputClassName}>{selectOptions.map((option) => <option value={option} key={option}>{option}</option>)}</select> : <input type={type} value={value ?? ""} onChange={(event) => onChange(event.target.value)} className={inputClassName} />}
    </label>
  );
}








