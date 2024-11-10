import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className="bg-slate-900 w-full h-svh flex items-center justify-center">
      <img
        alt="Logo sportboxd, imagem com nome do site escrito"
        className="h-20"
        src="sportboxd.svg"
      />
    </div>
  </StrictMode>
);
