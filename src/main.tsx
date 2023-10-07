import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./tailwind.css";
import { NavigationProvider } from "./context/NavigationContext.tsx";
import { BoardProvider } from "./context/BoardContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <NavigationProvider>
      <BoardProvider>
        <App />
      </BoardProvider>
    </NavigationProvider>
  </React.StrictMode>
);
