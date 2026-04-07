import { createTheme } from "@mui/material/styles";

export const getTheme = (mode) =>
    createTheme({
        palette: {
            mode,
            primary: { main: "#6366f1" },
            ...(mode === "dark"
                ? {
                      background: {
                          default: "#0f1117",
                          paper: "#1a1d27",
                      },
                      divider: "rgba(255,255,255,0.08)",
                  }
                : {
                      background: {
                          default: "#f5f6fa",
                          paper: "#ffffff",
                      },
                  }),
        },
        typography: {
            fontFamily: "'Inter', sans-serif",
            h1: { fontWeight: 900 },
            h2: { fontWeight: 900 },
            h3: { fontWeight: 800 },
            h4: { fontWeight: 800 },
            h5: { fontWeight: 700 },
            h6: { fontWeight: 700 },
            button: { textTransform: "none", fontWeight: 600 },
        },
        shape: { borderRadius: 12 },
        components: {
            MuiPaper: {
                styleOverrides: {
                    root: ({ theme }) => ({
                        backgroundImage: "none",
                        ...(theme.palette.mode === "dark" && {
                            borderColor: "rgba(255,255,255,0.08)",
                        }),
                    }),
                },
            },
            MuiTableHead: {
                styleOverrides: {
                    root: ({ theme }) => ({
                        "& .MuiTableCell-head": {
                            backgroundColor:
                                theme.palette.mode === "dark"
                                    ? "rgba(255,255,255,0.05)"
                                    : theme.palette.grey[100],
                            fontWeight: 700,
                        },
                    }),
                },
            },
            MuiChip: {
                styleOverrides: {
                    root: { fontWeight: 600 },
                },
            },
            MuiButton: {
                styleOverrides: {
                    root: { borderRadius: 8 },
                },
            },
        },
    });
