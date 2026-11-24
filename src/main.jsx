import React from "react";
import { createRoot } from "react-dom/client";
import { CssBaseline, ThemeProvider } from "@mui/material";
import "@fontsource-variable/inter";
import App from "./App";
import bank from "./bank-config";
import { theme } from "./theme/theme";
import "./style.css";
import "./app.css";

document.title = bank.name + " | Digital Banking";
document.documentElement.dataset.bank = bank.theme;
createRoot(document.getElementById("root")).render(
  <React.StrictMode><ThemeProvider theme={theme}><CssBaseline/><App/></ThemeProvider></React.StrictMode>
);
