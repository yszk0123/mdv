import "./main.css";

import { createRoot } from "react-dom/client";

import { App } from "./App";

const element = document.getElementById("app");
if (element) {
  createRoot(element).render(<App />);
}
