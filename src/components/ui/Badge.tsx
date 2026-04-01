import type { HTMLAttributes, ReactNode } from "react";

import clsx from "clsx";
import { twMerge } from "tailwind-merge";

type BadgeVariant = "success" | "warning" | "neutral" | "danger" | "inverse";

type BadgeProps = {
  children: ReactNode;
  variant?: BadgeVariant;
} & HTMLAttributes<HTMLSpanElement>;

const badgeVariants: Record<BadgeVariant, string> = {
  success: "bg-green-50 text-green-700 ring-1 ring-green-100",
  warning: "bg-yellow-50 text-yellow-800 ring-1 ring-yellow-100",
  neutral: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
  danger: "bg-red-50 text-red-700 ring-1 ring-red-100",
  inverse: "bg-white/95 text-slate-900 ring-1 ring-white/70",
};

export default function Badge({
  children,
  className,
  variant = "success",
  ...props
}: BadgeProps) {
  return (
    <span
      className={twMerge(
        clsx(
          "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.18em]",
          badgeVariants[variant],
        ),
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
