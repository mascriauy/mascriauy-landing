import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Transecta from "./Transecta";
import "./linea.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Transecta />
  </StrictMode>
);
