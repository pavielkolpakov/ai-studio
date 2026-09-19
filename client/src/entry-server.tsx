import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "./App";
export { SEO_PAGES, SITE_URL } from "./data/seo";

// This build-only entry renders documents; it is never loaded by Fast Refresh.
// eslint-disable-next-line react-refresh/only-export-components
export function render(path: string, assets: { script: string; styles: string[] }) {
  return "<!doctype html>" + renderToString(
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/png" href="/NN.png" />
        {assets.styles.map((href) => <link key={href} rel="stylesheet" href={href} />)}
      </head>
      <body>
        <div id="root">
          <StrictMode>
            <StaticRouter location={path}><App /></StaticRouter>
          </StrictMode>
        </div>
        <script type="module" src={assets.script} />
      </body>
    </html>,
  );
}
