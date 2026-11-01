import { alpha, createTheme } from "@mui/material";

export const appTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#FFC222",
      dark: "#DFA600",
      light: "#FFD566",
      contrastText: "#17181C",
    },
    secondary: {
      main: "#F43F5E", // Rose
      dark: "#E11D48",
      light: "#FB7185",
    },
    background: {
      default: "#18191D",
      paper: "#202126",
    },
    text: {
      primary: "#F4F4F5",
      secondary: "#BFC1C7",
    },
    success: {
      main: "#10B981",
      dark: "#059669",
      light: "#34D399",
    },
    warning: {
      main: "#F59E0B",
      dark: "#D97706",
      light: "#FBBF24",
    },
    error: {
      main: "#EF4444",
      dark: "#DC2626",
      light: "#F87171",
    },
  },
  typography: {
    fontFamily: '"Inter Variable", sans-serif',
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: '"Inter Variable", sans-serif',
          borderRadius: "4px",
          textTransform: "none",
          fontWeight: 600,
          letterSpacing: "0.025em",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        },
        contained: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
        outlined: {
          backgroundColor: "rgba(32, 33, 38, 0.6)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.2)",
          color: "#fff",
          "&:hover": {
            backgroundColor: "rgba(32, 33, 38, 0.85)",
            border: "1px solid rgba(255,255,255,0.3)",
          },
        },
        text: {
          color: "rgba(255,255,255,0.9)",
          "&:hover": {
            backgroundColor: "rgba(32, 33, 38, 0.5)",
            backdropFilter: "blur(10px)",
            transform: "none",
            boxShadow: "none",
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          width: 40,
          height: 40,
          borderRadius: "4px",
          transition: "all 0.2s ease",
          "&:hover": {
            backgroundColor: "rgba(255,255,255,0.1)",
            transform: "scale(1.05)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(32, 33, 38, 0.9)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "4px",
        },
        elevation1: {
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        },
        elevation2: {
          boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
        },
        elevation6: {
          boxShadow: "0 12px 32px rgba(0,0,0,0.4)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(32, 33, 38, 0.8)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "6px",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 12px 32px rgba(0,0,0,0.4)",
            border: "1px solid rgba(255,255,255,0.2)",
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: "rgba(0,0,0,0.95)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "6px",
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          backgroundColor: "rgba(0,0,0,0.9)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: "4px",
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: "rgba(0,0,0,0.9)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: "4px",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: "3px",
          margin: "2px 4px",
          transition: "all 0.2s ease",
          "&:hover": {
            transform: "translateX(2px)",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(20px)",
          borderRadius: "4px",
          transition: "background-color 0.2s ease",
          "&:hover": {
            backgroundColor: "rgba(255,255,255,0.08)",
          },
          "&.Mui-focused": {
            backgroundColor: "rgba(255,255,255,0.1)",
          },
        },
        notchedOutline: {
          borderColor: "rgba(255,255,255,0.2)",
          transition: "border-color 0.2s ease",
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          "& .MuiSlider-thumb": {
            width: 16,
            height: 16,
            backgroundColor: "currentColor",
            border: "2px solid rgba(255,255,255,0.3)",
            transition: "all 0.2s ease",
          },
          "& .MuiSlider-track": {
            backgroundColor: "currentColor",
            border: "none",
            borderRadius: "4px",
          },
          "& .MuiSlider-rail": {
            backgroundColor: "rgba(255,255,255,0.2)",
            borderRadius: "4px",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: "4px",
          transition: "all 0.2s ease",
          "&:hover": {
            backgroundColor: "rgba(255,255,255,0.15)",
            transform: "scale(1.05)",
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: ({ theme }) => ({
          textTransform: "none",
          fontWeight: 600,
          borderRadius: "4px",
          margin: "0 4px",
          transition: "all 0.2s ease",
          "&:hover": {
            backgroundColor: "rgba(255,255,255,0.08)",
          },
          "&.Mui-selected": {
            backgroundColor: alpha(theme.palette.primary.main, 0.12),
            color: theme.palette.primary.main,
          },
        }),
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: ({ theme }) => ({
          "& .MuiSwitch-switchBase": {
            "&.Mui-checked": {
              "& + .MuiSwitch-track": {
                backgroundColor: theme.palette.primary.main,
              },
            },
          },
          "& .MuiSwitch-track": {
            backgroundColor: "rgba(255,255,255,0.2)",
            borderRadius: "6px",
          },
          "& .MuiSwitch-thumb": {
            backgroundColor: "#fff",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          },
        }),
      },
    },
  },
});
