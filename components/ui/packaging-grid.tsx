type GridProps = {
  children: React.ReactNode;
  className?: string;
};

export function TwoCol({ children, className = "" }: GridProps) {
  return <div className={`grid gap-10 lg:grid-cols-2 ${className}`}>{children}</div>;
}

export function ThreeCol({ children, className = "" }: GridProps) {
  return <div className={`grid gap-8 lg:grid-cols-3 ${className}`}>{children}</div>;
}

export function Asymmetric({ children, className = "" }: GridProps) {
  return (
    <div className={`grid gap-12 lg:grid-cols-[1.25fr_0.75fr] ${className}`}>
      {children}
    </div>
  );
}
