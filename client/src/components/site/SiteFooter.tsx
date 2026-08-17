import { CONTACT_EMAIL, LINKEDIN_URL, LOCATIONS } from "@/data/site";

const LINK_CLASS = "text-[13.5px] text-muted-foreground transition-colors hover:text-white";

export function SiteFooter() {
  return (
    <div className="mx-auto max-w-[1200px] px-5 pb-11 sm:px-10">
      <div className="mt-[72px] flex flex-wrap items-center justify-between gap-6 border-t border-white/[0.09] pt-7">
        <div className="flex items-center gap-[11px]">
          <img src="/logo-mark.png" alt="" className="block h-5 w-auto opacity-80" />
          <span className="text-[13px] text-faint-text">
            © {new Date().getFullYear()} Neuronetis · {LOCATIONS}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-x-[22px] gap-y-2">
          <a href={`mailto:${CONTACT_EMAIL}`} className={LINK_CLASS}>{CONTACT_EMAIL}</a>
          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
            LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
}
