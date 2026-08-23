import { Link, NavLink } from "react-router-dom";
import { MenuIcon, XIcon } from "lucide-react";
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
  "rounded-lg px-3.5 py-2 text-sm text-foreground underline-offset-4 transition-colors hover:underline";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-background">
      <div className="mx-auto flex h-[72px] max-w-[1200px] items-center justify-between gap-6 px-5 sm:px-10">
        <Link to="/" className="flex items-center gap-3">
          <span className="font-heading text-[18px] font-semibold tracking-[0.01em]">
            Neuronetis
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          <div className="hidden items-center gap-1 sm:flex">
            <NavLink to="/pricing" className={NAV_LINK_CLASS}>
              Pricing
            </NavLink>
            <NavLink to="/about" className={NAV_LINK_CLASS}>
              About
            </NavLink>
          </div>
          <button
            onClick={() => openCalendlyPopup()}
            className="btn-primary ml-3.5 hidden cursor-pointer px-3 py-2 text-sm sm:block sm:px-[18px]"
          >
            Talk to an AI Engineer
          </button>

          <Sheet>
            <SheetTrigger
              aria-label="Open menu"
              className="cursor-pointer rounded-lg border border-hairline-strong p-2.5 text-foreground transition-colors hover:border-white/45 sm:hidden"
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

              <nav className="flex flex-col px-5 py-4">
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
                  Talk to an AI Engineer
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </header>
  );
}
