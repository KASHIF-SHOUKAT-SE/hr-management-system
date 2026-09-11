// import { ButtonHTMLAttributes, ReactNode } from "react";

// interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
//   variant?: "primary" | "social";
//   icon?: ReactNode;
// }

// export default function Button({
//   variant = "primary",
//   icon,
//   children,
//   className = "",
//   ...props
// }: ButtonProps) {
//   const baseClasses = "w-full rounded-lg transition-colors flex items-center justify-center gap-2 py-3 text-sm";
  
//   const variantClasses = {
//     // Image ke mutabiq disabled/light look
//     primary: "bg-[#f3f4f6] font-semibold text-gray-400", 
//     // Google/Apple buttons ka look
//     social: "border border-gray-200 font-medium text-gray-700 hover:bg-gray-50", 
//   };

//   return (
//     <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
//       {icon}
//       {children}
//     </button>
//   );
// }


import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline";
}

export default function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const base = "w-full py-2.5 rounded-lg text-sm font-medium transition";
  const styles =
    variant === "primary"
      ? "bg-[#0F3D2E] text-white hover:bg-[#0c3125]"
      : "border border-gray-300 text-gray-700 hover:bg-gray-50";

  return (
    <button {...props} className={`${base} ${styles} ${className}`}>
      {children}
    </button>
  );
}