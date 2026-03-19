type LabelBlockProps = {
  label: string;
  title?: string;
  copy?: string;
  className?: string;
};

export function LabelBlock({ label, title, copy, className = "" }: LabelBlockProps) {
  return (
    <div className={`label-block rounded-2xl px-5 py-4 ${className}`}>
      <p className="text-xs uppercase tracking-[0.38em] text-white/55">{label}</p>
      {title ? <p className="mt-3 text-lg text-white/90">{title}</p> : null}
      {copy ? <p className="mt-3 text-sm leading-6 text-white/60">{copy}</p> : null}
    </div>
  );
}
