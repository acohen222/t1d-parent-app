import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  icon?: ReactNode;
}

const variantMap = {
  primary:   "bg-[#4a7c59] text-white hover:bg-[#3d6b4a] disabled:opacity-40",
  secondary: "bg-white text-[#4a7c59] border border-[#4a7c59] hover:bg-green-50 disabled:opacity-40",
  ghost:     "bg-transparent text-stone-600 hover:bg-stone-100 disabled:opacity-40",
  danger:    "bg-rose-500 text-white hover:bg-rose-600 disabled:opacity-40",
};

const sizeMap = {
  sm: "h-9  px-4 text-sm  rounded-xl gap-1.5",
  md: "h-11 px-5 text-sm  rounded-xl gap-2",
  lg: "h-14 px-6 text-base rounded-2xl gap-2.5 font-semibold",
};

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  fullWidth = false,
  className = "",
  icon,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center font-medium
        transition-colors active:scale-[0.97]
        ${variantMap[variant]}
        ${sizeMap[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
