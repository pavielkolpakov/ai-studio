import { Link, NavLink } from "react-router-dom";
import { ArrowUpRight, MenuIcon, XIcon } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { openCalendlyPopup } from "@/lib/calendly";

const NAV_LINK_CLASS =
  "header-nav-link";

export function SiteHeader() {
  return (
    <header className="site-header sticky top-0 z-50">
      <div className="header-inner">
        <Link to="/" className="flex items-center gap-3" aria-label="Neuronetis">
          <img src="/logo-mark.png" alt="" className="h-6 w-auto" />
          <span className="font-heading text-[18px] font-semibold tracking-[0.01em]">
            Neuronetis
          </span>
        </Link>

        <nav className="header-navigation" aria-label="Main navigation">
          <div className="header-nav-links hidden md:flex">
            <NavLink to="/" end className={NAV_LINK_CLASS}>Studio</NavLink>
            <NavLink to="/pricing" className={NAV_LINK_CLASS}>
              Pricing
            </NavLink>
            <NavLink to="/about" className={NAV_LINK_CLASS}>
              About
            </NavLink>
          </div>
          <button
            onClick={() => openCalendlyPopup()}
            className="btn-header-cta hidden cursor-pointer text-[13px] md:inline-flex"
          >
            Talk to AI Engineer <ArrowUpRight size={15} aria-hidden="true" />
          </button>

          <Sheet>
            <SheetTrigger
              aria-label="Open menu"
              className="cursor-pointer rounded-lg border border-hairline-strong p-2.5 text-foreground transition-colors hover:border-white/45 md:hidden"
            >
              <MenuIcon className="size-[18px]" />
            </SheetTrigger>

            <SheetContent
              side="top"
              showCloseButton={false}
              className="gap-0 border-hairline bg-background"
            >
              <SheetHeader className="flex h-[72px] flex-row items-center justify-between border-b border-hairline px-5 py-0">
                <SheetTitle className="font-heading text-[18px] font-semibold tracking-[0.01em]">
                  Neuronetis
                </SheetTitle>
                <SheetClose
                  aria-label="Close menu"
                  className="cursor-pointer rounded-lg border border-hairline-strong p-2.5 text-foreground transition-colors hover:border-white/45"
                >
                  <XIcon className="size-[18px]" />
                </SheetClose>
              </SheetHeader>

              <nav className="mobile-navigation flex flex-col px-5 py-4" aria-label="Mobile navigation">
                <SheetClose render={<NavLink to="/" end className="py-2.5 text-[15px] text-foreground" />}>Studio</SheetClose>
                <SheetClose
                  render={
                    <NavLink
                      to="/pricing"
                      className="py-2.5 text-[15px] text-foreground transition-colors hover:text-white"
                    />
                  }
                >
                  Pricing
                </SheetClose>
                <SheetClose
                  render={
                    <NavLink
                      to="/about"
                      className="py-2.5 text-[15px] text-foreground transition-colors hover:text-white"
                    />
                  }
                >
                  About
                </SheetClose>
              </nav>

              <SheetFooter className="px-5 pt-1 pb-6">
                <SheetClose
                  onClick={() => openCalendlyPopup()}
                  className="btn-primary w-full cursor-pointer px-4 py-3 text-sm"
                >
                  Talk to AI Engineer
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </header>
  );
}
