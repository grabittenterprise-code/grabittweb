import Image from "next/image";
import Link from "next/link";

type BrandLogoProps = {
  href?: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
};

export function BrandLogo({
  href = "/",
  className = "",
  imageClassName = "",
  priority = false,
}: BrandLogoProps) {
  return (
    <Link href={href} className={`inline-flex items-center ${className}`.trim()} aria-label="GRABITT home">
      <Image
        src="/brand/grabitt-wordmark.svg"
        alt="GRABITT"
        width={640}
        height={160}
        priority={priority}
        className={`h-auto w-full ${imageClassName}`.trim()}
      />
    </Link>
  );
}
