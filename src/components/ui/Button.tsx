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

// All buttons use pill shape (border-radius: 50px) per brand guidelines
const variantMap = {
  primary:   "bg-[#2E7FD4] text-white font-[800] hover:bg-[#1A5FA8] disabled:opacity-45 transition-colors",
  secondary: "bg-transparent text-[#2E7FD4] border-2 border-[#2E7FD4] hover:bg-[#E8F2FB] disabled:opacity-45 transition-colors",
  ghost:     "bg-[#E8F2FB] text-[#1A5FA8] font-[700] hover:bg-[#B8D4EE] disabled:opacity-45 transition-colors",
  danger:    "bg-[#FDE8E8] text-[#A32D2D] hover:bg-[#fbd0d0] disabled:opacity-45 transition-colors",
};

const sizeMap = {
  sm: "h-9  px-[18px] text-sm  rounded-[50px] gap-1.5",
  md: "h-11 px-6      text-sm  rounded-[50px] gap-2",
  lg: "h-14 px-6      text-base rounded-[50px] gap-2.5",
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
      style={{ fontFamily: "var(--font-display)" }}
      className={`
        inline-flex items-center justify-center font-semibold
        transition-all active:scale-[0.97]
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
