import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { CONTACT_EMAIL, LINKEDIN_URL, LOCATIONS } from "@/data/site";

export function SiteFooter() {
  return <footer className="site-footer"><div className="footer-main"><div><Link to="/" className="footer-brand">Neuronetis</Link><p>Clear thinking.<br />Production AI.</p></div><div className="footer-links"><Link to="/">Home</Link><Link to="/pricing">Pricing</Link><Link to="/about">About</Link></div><div className="footer-contact"><span>Start a conversation</span><a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}<ArrowUpRight size={16} /></a><a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">LinkedIn<ArrowUpRight size={16} /></a></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Neuronetis</span><span>{LOCATIONS}</span><span>Built around your business.</span></div></footer>;
}
