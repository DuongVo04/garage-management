import { createTheme } from "@mui/material/styles";

export const getTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      primary: { main: "#6366f1" }
    },
    shape: {
      borderRadius: 12
    }
  });