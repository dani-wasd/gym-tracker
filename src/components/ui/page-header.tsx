interface PageHeaderProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
}

/** The poster-sized heading that opens every signed-in page. */
export function PageHeader({ eyebrow, title, subtitle }: PageHeaderProps) {
  return (
    <header>
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="headline mt-2 text-[clamp(3.5rem,13vw,9rem)]">{title}</h1>
      {subtitle && (
        <p className="mt-3 font-display text-2xl leading-none font-bold uppercase tracking-wide text-steel">
          {subtitle}
        </p>
      )}
    </header>
  );
}
