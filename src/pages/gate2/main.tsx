import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../../styles/tokens.css";
import "../../styles/app.css";
import "../../styles/slides.css";
import "../shared/page.css";
import "./gate2.css";
import "./phone.css";
import { App } from "./App";

// Scopes this page's styles (gate2.css, phone.css).
document.documentElement.classList.add("gate2");

// ?export: every slide fully drawn, nothing moving, no floating controls.
// Used to make the PDF and the slide screenshots (scripts/gate2-export.mjs).
if (new URLSearchParams(window.location.search).has("export")) document.documentElement.classList.add("is-export");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
