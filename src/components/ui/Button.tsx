import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "white" | "danger";
type Size = "sm" | "md" | "lg";

type SharedProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
};

type ButtonAsLink = SharedProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, "className" | "children"> & {
    href: string;
  };

type ButtonAsAnchor = SharedProps &
  Omit<ComponentPropsWithoutRef<"a">, "className" | "children"> & {
    href: string;
  };

type ButtonAsButton = SharedProps &
  Omit<ComponentPropsWithoutRef<"button">, "className" | "children" | "type"> & {
    href?: undefined;
    type?: "button" | "submit" | "reset";
  };

type ButtonProps = ButtonAsLink | ButtonAsAnchor | ButtonAsButton;

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none select-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-green-700 text-white shadow-md hover:bg-green-800 hover:shadow-lg focus:ring-green-600",
  secondary:
    "bg-yellow-400 text-slate-900 shadow-md hover:bg-yellow-300 hover:shadow-lg focus:ring-yellow-400",
  outline:
    "border-2 border-green-700 text-green-800 bg-white hover:bg-green-50 focus:ring-green-600",
  ghost:
    "text-green-700 hover:bg-green-50 focus:ring-green-600",
  white:
    "bg-white text-gray-900 shadow-md hover:bg-gray-50 hover:shadow-lg focus:ring-gray-300",
  danger:
    "bg-red-600 text-white shadow-md hover:bg-red-700 hover:shadow-lg focus:ring-red-600",
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

function cls(variant: Variant, size: Size, extra?: string) {
  return [base, variants[variant], sizes[size], extra].filter(Boolean).join(" ");
}

function isExternal(href: string) {
  return href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:");
}

export default function Button(props: ButtonProps) {
  const variant = props.variant ?? "primary";
  const size = props.size ?? "md";
  const className = cls(variant, size, props.className);

  if ("href" in props && props.href) {
    if (isExternal(props.href) || "target" in props) {
      const { variant: _v, size: _s, className: _c, ...rest } = props as ButtonAsAnchor;
      return <a {...rest} className={className}>{props.children}</a>;
    }
    const { variant: _v, size: _s, className: _c, ...rest } = props as ButtonAsLink;
    return <Link {...rest} className={className}>{props.children}</Link>;
  }

  const { variant: _v, size: _s, className: _c, type, ...rest } = props as ButtonAsButton;
  return (
    <button {...rest} type={type ?? "button"} className={className}>
      {props.children}
    </button>
  );
}
