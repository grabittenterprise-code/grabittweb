import { SiteShell } from "@/components/layouts/site-shell";

type PageWrapperProps = {
  children: React.ReactNode;
};

export function PageWrapper({ children }: PageWrapperProps) {
  return <SiteShell>{children}</SiteShell>;
}
