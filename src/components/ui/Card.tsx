import type { HTMLAttributes, ReactNode } from "react";

import clsx from "clsx";
import { twMerge } from "tailwind-merge";

type CardProps = {
  children: ReactNode;
  hover?: boolean;
} & HTMLAttributes<HTMLDivElement>;

export default function Card({
  children,
  className,
  hover = false,
  ...props
}: CardProps) {
  return (
    <div
      className={twMerge(
        clsx(
          "rounded-2xl border border-gray-100 bg-white p-4 shadow-sm md:p-6",
          hover && "transition-shadow duration-300 hover:shadow-md",
        ),
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
