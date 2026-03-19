type SectionShellProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
  tight?: boolean;
};

export function SectionShell({ children, className = "", id, tight = false }: SectionShellProps) {
  return (
    <section id={id} className={`${tight ? "py-14 sm:py-20" : "section-space"} ${className}`}>
      {children}
    </section>
  );
}
