import { createTheme } from "@mui/material/styles";
export const theme = createTheme({
  palette: { mode: "light", primary: { main: "#204abe", dark: "#17368e", light: "#eaf0ff" }, secondary: { main: "#19a7a1" }, background: { default: "#f5f7fc", paper: "#ffffff" }, success: { main: "#16845b" }, warning: { main: "#c78320" }, error: { main: "#c44755" }, text: { primary: "#17233f", secondary: "#68748d" } },
  shape: { borderRadius: 12 },
  typography: { fontFamily: '"Inter Variable", Inter, sans-serif', h4: { fontWeight: 780, letterSpacing: "-.04em" }, h5: { fontWeight: 750, letterSpacing: "-.03em" }, h6: { fontWeight: 730 }, button: { textTransform: "none", fontWeight: 680 } },
  components: { MuiButton: { defaultProps: { disableElevation: true } }, MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } }, MuiTableCell: { styleOverrides: { head: { color: "#68748d", fontWeight: 700, background: "#f7f8fc" } } } }
});
