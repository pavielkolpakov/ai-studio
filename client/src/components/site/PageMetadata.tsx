import { useLocation } from "react-router-dom";
import { SEO_PAGES, SITE_URL } from "@/data/seo";

export function PageMetadata() {
  const { pathname } = useLocation();
  const path = pathname.replace(/\/+$/, "") || "/";
  const page = SEO_PAGES[path];

  if (!page) {
    return <><title>Page not found | Neuronetis</title><meta name="robots" content="noindex" /></>;
  }

  const url = `${SITE_URL}${path}`;
  return (
    <>
      <title>{page.title}</title>
      <meta name="description" content={page.description} />
      <link rel="canonical" href={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Neuronetis" />
      <meta property="og:title" content={page.title} />
      <meta property="og:description" content={page.description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={`${SITE_URL}/NN.png`} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={page.title} />
      <meta name="twitter:description" content={page.description} />
      <meta name="twitter:image" content={`${SITE_URL}/NN.png`} />
    </>
  );
}
