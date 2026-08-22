import { useState } from "react";
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

const SERVICES_MENU = [
  { to: "/audit", label: "AI Audit" },
  { to: "/implementation", label: "Implementation" },
  { to: "/optimization", label: "Optimization" },
];

const NAV_LINK_CLASS =
  "rounded-lg px-3.5 py-2 text-sm text-foreground underline-offset-4 transition-colors hover:underline";

export function SiteHeader() {
  const [servicesOpen, setServicesOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-background">
      <div className="mx-auto flex h-[72px] max-w-[1200px] items-center justify-between gap-6 px-5 sm:px-10">
        <Link to="/" className="flex items-center gap-3">
          <span className="font-heading text-[18px] font-semibold tracking-[0.01em] text-silver-gradient">
            Neuronetis
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          <div className="hidden items-center gap-1 sm:flex">
            <div className="group relative">
              <NavLink to="/services" className={`flex items-center gap-1.5 ${NAV_LINK_CLASS}`}>
                Services
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3 w-3 text-dim-text transition-transform duration-150 group-hover:rotate-180"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </NavLink>
              <div className="invisible absolute top-full left-0 pt-2 opacity-0 transition-opacity duration-150 group-hover:visible group-hover:opacity-100">
                <div className="min-w-[180px] overflow-hidden rounded-xl border border-hairline bg-surface py-1.5 shadow-[0_16px_48px_-16px_rgba(0,0,0,0.6)]">
                  {SERVICES_MENU.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className="block px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-white"
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>
            <NavLink to="/about" className={NAV_LINK_CLASS}>
              About
            </NavLink>
          </div>
          <button
            onClick={() => openCalendlyPopup()}
            className="btn-primary ml-3.5 hidden cursor-pointer px-3.5 py-2.5 text-sm sm:block sm:px-[18px]"
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
                <div className="flex items-center justify-between">
                  <SheetClose
                    render={
                      <NavLink
                        to="/services"
                        className="py-2.5 text-[15px] text-foreground transition-colors hover:text-white"
                      />
                    }
                  >
                    Services
                  </SheetClose>
                  <button
                    type="button"
                    aria-label="Toggle services"
                    aria-expanded={servicesOpen}
                    onClick={() => setServicesOpen((open) => !open)}
                    className="cursor-pointer p-2.5 text-dim-text"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`h-3.5 w-3.5 transition-transform duration-150 ${
                        servicesOpen ? "rotate-180" : ""
                      }`}
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                </div>
                {servicesOpen && (
                  <div className="mb-1 ml-1 flex flex-col border-l border-hairline pl-4">
                    {SERVICES_MENU.map((item) => (
                      <SheetClose
                        key={item.to}
                        render={
                          <NavLink
                            to={item.to}
                            className="py-2 text-sm text-muted-foreground transition-colors hover:text-white"
                          />
                        }
                      >
                        {item.label}
                      </SheetClose>
                    ))}
                  </div>
                )}
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
