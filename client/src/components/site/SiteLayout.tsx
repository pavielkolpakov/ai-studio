import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { BookCta } from "./BookCta";

export function SiteLayout() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  // Pricing closes with its own decision-oriented CTA — don't stack a second one.
  const hideBookCta = isHome || pathname === "/pricing";

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <div className="min-h-dvh bg-background text-foreground">
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
