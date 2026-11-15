interface SectionProps {
  /** Small label above the title. */
  eyebrow: React.ReactNode;
  title: string;
  className?: string;
  children: React.ReactNode;
}

/** A titled block within a page: eyebrow, stencil heading, then the content. */
export function Section({ eyebrow, title, className, children }: SectionProps) {
  return (
    <section className={className}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="headline mt-1 mb-6 text-5xl">{title}</h2>
      {children}
    </section>
  );
}
