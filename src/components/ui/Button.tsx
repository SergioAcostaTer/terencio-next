import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "white";
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

const baseStyles =
  "inline-flex items-center justify-center rounded-xl font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 disabled:shadow-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-green-700 text-white shadow-lg hover:bg-green-800 hover:shadow-xl focus:ring-green-700",
  secondary:
    "bg-yellow-400 text-slate-950 shadow-lg hover:bg-yellow-300 hover:shadow-xl focus:ring-yellow-400",
  outline:
    "border-2 border-green-700 text-green-800 hover:bg-green-50 focus:ring-green-700",
  ghost: "text-green-700 hover:bg-green-50 focus:ring-green-700",
  white:
    "bg-white text-green-900 shadow-lg hover:bg-gray-50 hover:shadow-xl focus:ring-white",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

function getClasses(variant: Variant, size: Size, className?: string) {
  return [baseStyles, variants[variant], sizes[size], className]
    .filter(Boolean)
    .join(" ");
}

function isExternalHref(href: string) {
  return (
    href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")
  );
}

export default function Button(props: ButtonProps) {
  const variant = props.variant ?? "primary";
  const size = props.size ?? "md";
  const className = getClasses(variant, size, props.className);

  if ("href" in props && props.href) {
    if (isExternalHref(props.href) || "target" in props) {
      const anchorProps = { ...(props as ButtonAsAnchor) };
      delete anchorProps.variant;
      delete anchorProps.size;
      delete anchorProps.className;
      return (
        <a {...anchorProps} className={className}>
          {props.children}
        </a>
      );
    }

    const linkProps = { ...(props as ButtonAsLink) };
    delete linkProps.variant;
    delete linkProps.size;
    delete linkProps.className;
    return (
      <Link {...linkProps} className={className}>
        {props.children}
      </Link>
    );
  }

  const buttonProps = { ...(props as ButtonAsButton) };
  delete buttonProps.variant;
  delete buttonProps.size;
  delete buttonProps.className;
  const type = buttonProps.type ?? "button";
  delete buttonProps.type;

  return (
    <button {...buttonProps} type={type} className={className}>
      {props.children}
    </button>
  );
}
