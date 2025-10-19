import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // pastikan file App.tsx kamu ada di src/

import "./index.css"; // kalau kamu pakai tailwind atau css

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
