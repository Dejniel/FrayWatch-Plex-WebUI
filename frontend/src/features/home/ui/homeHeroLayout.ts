import { PAGE_GUTTER } from "shared/ui/layout";

export const homeHeroSx = {
  width: "100%",
  minHeight: { xs: "min(560px, 70svh)", sm: "clamp(360px, 56svh, 680px)" },
  position: "relative" as const,
  overflow: "hidden",
  isolation: "isolate",
  backgroundColor: "background.default",
  display: "flex",
  flexDirection: "column" as const,
  justifyContent: "center",
  px: PAGE_GUTTER,
  pt: "88px",
  pb: 10,
};

export const homeHeroContentSx = {
  position: "relative" as const,
  width: "100%",
  maxWidth: "42.5rem",
  zIndex: 2,
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "flex-start",
};
