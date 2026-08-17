import { Link, NavLink } from "react-router-dom";
import { openCalendlyPopup } from "@/lib/calendly";

const SERVICES_MENU = [
  { to: "/audit", label: "AI Audit" },
  { to: "/implementation", label: "Implementation" },
  { to: "/optimization", label: "Optimization" },
];

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
            className="btn-primary ml-2 cursor-pointer px-3.5 py-2.5 text-sm sm:ml-3.5 sm:px-[18px]"
          >
            Talk to an AI Engineer
          </button>
        </nav>
      </div>
    </header>
  );
}
