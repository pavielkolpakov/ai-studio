import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { BookCta } from "./BookCta";
import "./site-design.css";
import { PageMetadata } from "./PageMetadata";

export function SiteLayout() {
  const { pathname, hash } = useLocation();
  const isHome = pathname === "/";
  // Pricing closes with its own decision-oriented CTA — don't stack a second one.
  const hideBookCta = isHome || pathname === "/pricing";

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0 });
      return;
    }
    const frame = requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView({ block: "start" }));
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);

  return (
    <div className="site-shell min-h-dvh bg-background text-foreground">
      <PageMetadata />
      <SiteHeader />
      <Outlet />
      {!isHome && (
        <>
          {!hideBookCta && <BookCta />}
          <SiteFooter />
        </>
      )}
    </div>
  );
}
