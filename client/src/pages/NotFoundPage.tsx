import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

export function NotFoundPage() {
  return <main className="design-page not-found dot-field"><p className="studio-kicker">404 / Page not found</p><h1>A little off course.</h1><p>This page may have moved. There’s still plenty worth exploring.</p><Link to="/" className="studio-button">Back to Neuronetis <ArrowUpRight size={17} /></Link></main>;
}
