// import { InputHTMLAttributes, ReactNode } from "react";

// interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
//   label: string;
//   icon?: ReactNode;
//   containerClassName?: string;
// }

// export default function Input({
//   label,
//   icon,
//   containerClassName = "",
//   className = "",
//   required,
//   ...props
// }: InputProps) {
//   return (
//     <div className={containerClassName}>
//       <label className="mb-2 block text-[13px] font-semibold text-gray-800">
//         {label} {required && <span className="text-red-500">*</span>}
//       </label>
//       <div className="relative">
//         <input
//           className={`w-full rounded-lg border px-4 py-3 text-sm text-gray-700 outline-none placeholder:text-gray-300 focus:ring-1 ${className}`}
//           required={required}
//           {...props}
//         />
//         {icon && (
//           <button type="button" className="absolute right-4 top-[14px] text-gray-400">
//             {icon}
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }
import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function Input({ label, ...props }: InputProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <input
        {...props}
        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
      />
    </div>
  );
}