import { Link, NavLink } from "react-router-dom";
import { openCalendlyPopup } from "@/lib/calendly";

const NAV = [
  { to: "/pricing", label: "Pricing" },
  { to: "/about", label: "About" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-background">
      <div className="mx-auto flex h-[72px] max-w-[1200px] items-center justify-between gap-6 px-5 sm:px-10">
        <Link to="/" className="flex items-center gap-3">
          <span className="font-heading text-[18px] font-semibold tracking-[0.01em]">
            Neuronetis
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          <div className="hidden items-center gap-1 sm:flex">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className="rounded-lg px-3.5 py-2 text-sm text-foreground underline-offset-4 transition-colors hover:underline"
              >
                {item.label}
              </NavLink>
            ))}
          </div>
          <button
            onClick={() => openCalendlyPopup()}
            className="btn-primary ml-2 cursor-pointer px-3.5 py-2.5 text-sm sm:ml-3.5 sm:px-[18px]"
          >
            Book a scoping call
          </button>
        </nav>
      </div>
    </header>
  );
}
