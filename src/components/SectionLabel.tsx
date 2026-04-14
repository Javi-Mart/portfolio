type SectionLabelProps = {
  eyebrow: string;
  title: string;
  body?: string;
};

export function SectionLabel({ eyebrow, title, body }: SectionLabelProps) {
  return (
    <div className="section-label">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {body ? <p className="section-copy">{body}</p> : null}
    </div>
  );
}
