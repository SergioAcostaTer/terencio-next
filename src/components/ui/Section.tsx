import type { HTMLAttributes, ReactNode } from "react";

type SectionProps = {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  id?: string;
  narrow?: boolean;
} & HTMLAttributes<HTMLElement>;

export default function Section({
  children,
  className = "",
  containerClassName = "",
  id,
  narrow = false,
  ...rest
}: SectionProps) {
  return (
    <section
      id={id}
      className={`py-12 md:py-16 ${className}`}
      {...rest}
    >
      <div className={`mx-auto ${narrow ? "max-w-4xl" : "max-w-6xl"} px-4 lg:px-6 ${containerClassName}`}>
        {children}
      </div>
    </section>
  );
}
