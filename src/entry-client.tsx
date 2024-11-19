import { hydrateRoot } from "react-dom/client";
import { StrictMode } from "react";

import { App } from "./app";

hydrateRoot(
  document.getElementById("root") as HTMLElement,
  <StrictMode>
    <App />
  </StrictMode>
);
