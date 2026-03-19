type TypeProps = {
  children: React.ReactNode;
  className?: string;
};

export function Eyebrow({ children, className = "" }: TypeProps) {
  return (
    <p className={`text-xs uppercase tracking-[0.45em] text-white/55 ${className}`}>
      {children}
    </p>
  );
}

export function Display({ children, className = "" }: TypeProps) {
  return (
    <h1 className={`font-serif text-5xl leading-[0.95] text-white/95 sm:text-6xl lg:text-[5rem] ${className}`}>
      {children}
    </h1>
  );
}

export function Body({ children, className = "" }: TypeProps) {
  return <p className={`text-base leading-8 text-white/65 sm:text-lg ${className}`}>{children}</p>;
}
