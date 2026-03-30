import type { HTMLAttributes, ReactNode } from "react";

type SectionProps = {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  id?: string;
} & HTMLAttributes<HTMLElement>;

export default function Section({
  children,
  className = "",
  containerClassName = "",
  id,
  ...rest
}: SectionProps) {
  return (
    <section id={id} className={`py-10 md:py-14 ${className}`} {...rest}>
      <div className={`container mx-auto px-4 ${containerClassName}`}>
        {children}
      </div>
    </section>
  );
}
