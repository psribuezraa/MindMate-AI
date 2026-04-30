import { ArrowRight } from 'lucide-react';

export default function GuidedIntentionCard({
  icon,
  iconVariant = 'sage',
  title,
  description,
  ctaLabel = 'BEGIN',
  illustration,
  onClick,
}) {
  return (
    <div
      className="intention-card"
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`Start ${title}`}
    >
      <div className={`intention-card-icon ${iconVariant}`}>
        {icon}
      </div>
      <h4>{title}</h4>
      <p>{description}</p>
      <button className="intention-card-cta">
        {ctaLabel} <ArrowRight size={14} />
      </button>
      {illustration && (
        <span className="intention-card-illustration" aria-hidden="true">
          {illustration}
        </span>
      )}
    </div>
  );
}
