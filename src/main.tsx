import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/tokens.css";
import "./styles/app.css";
import "./styles/slides.css";
import "./styles/phone.css";
import { App } from "./App";

// Scopes this deck's phone layout (styles/phone.css). The /customer/ and
// /financials/ pages never set it, so they are untouched by it.
document.documentElement.classList.add("root-deck");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
