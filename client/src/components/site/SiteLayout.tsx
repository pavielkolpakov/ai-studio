import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { BookCta } from "./BookCta";

export function SiteLayout() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <SiteHeader />
      <Outlet />
      {!isHome && (
        <>
          <BookCta />
          <SiteFooter />
        </>
      )}
    </div>
  );
}
