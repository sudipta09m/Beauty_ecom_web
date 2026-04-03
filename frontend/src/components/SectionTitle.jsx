export default function SectionTitle({ eyebrow, title, copy }) {
  return (
    <div className="section-heading">
      <p className="section-heading__eyebrow">{eyebrow}</p>
      <h2 className="section-heading__title">{title}</h2>
      {copy ? <p className="section-heading__copy">{copy}</p> : null}
    </div>
  );
}
