type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  copy: string;
  align?: "left" | "center";
};

export function SectionHeading({
  eyebrow,
  title,
  copy,
  align = "left"
}: SectionHeadingProps) {
  const alignment = align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-2xl";

  return (
    <div className={alignment}>
      <p className="section-kicker">{eyebrow}</p>
      <h2 className="text-4xl leading-none text-white sm:text-5xl lg:text-6xl">{title}</h2>
      <p className="mt-5 text-base leading-7 text-white/70 sm:text-lg">{copy}</p>
    </div>
  );
}
