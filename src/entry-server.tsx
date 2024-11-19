import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { HelmetProvider } from "react-helmet-async";

import { App } from "./app";

export function render(url: string) {
  const helmetContext = {};
  const app = (
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </HelmetProvider>
  );

  const html = renderToString(app);
  // @ts-ignore
  const { helmet } = helmetContext as any;

  return { html, helmet };
}
