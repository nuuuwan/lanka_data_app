import { createTheme } from "@mui/material/styles";

export const PRIMARY_COLOR = "#0b6e4f";

export const FONT_FAMILY =
  "'Quicksand', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif";

export const theme = createTheme({
  palette: { mode: "light", primary: { main: PRIMARY_COLOR } },
  typography: { fontFamily: FONT_FAMILY },
});
