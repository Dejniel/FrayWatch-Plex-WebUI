import { Box, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import React, { useEffect, useState } from "react";

function ExpandableDescription({
  text,
  lines = 4,
  color = "text.secondary",
}: {
  text?: string;
  lines?: number;
  color?: string;
}) {
  const textRef = React.useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [truncated, setTruncated] = useState(false);

  useEffect(() => {
    setExpanded(false);
  }, [text]);

  useEffect(() => {
    const element = textRef.current;
    if (!element) return;
    let frame = 0;

    const measure = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        setTruncated(
          !expanded && element.scrollHeight > element.clientHeight + 1,
        );
      });
    };

    measure();
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(element);
    window.addEventListener("resize", measure);

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [expanded, lines, text]);

  if (!text) return null;

  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      <Typography
        ref={textRef}
        component="div"
        sx={{
          fontSize: "1rem",
          fontWeight: "normal",
          lineHeight: 1.5,
          maxInlineSize: "100%",
          color,
          ...(expanded
            ? {}
            : {
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: lines,
                WebkitBoxOrient: "vertical",
              }),
        }}
      >
        {text}
      </Typography>

      {truncated && !expanded && (
        <Box
          component="button"
          type="button"
          aria-label="Expand description"
          onClick={() => setExpanded(true)}
          sx={{
            position: "absolute",
            right: 0,
            bottom: 0,
            height: "1.5em",
            border: 0,
            pl: 3,
            pr: 0,
            py: 0,
            font: "inherit",
            lineHeight: 1.5,
            color: "primary.main",
            background: (theme) =>
              `linear-gradient(90deg, ${alpha(
                theme.palette.background.default,
                0,
              )}, ${theme.palette.background.default} 28%, ${
                theme.palette.background.default
              } 100%)`,
            cursor: "pointer",
            "&:hover": { color: "primary.light" },
            "&:focus-visible": {
              outline: "2px solid",
              outlineColor: "primary.main",
              outlineOffset: 2,
            },
          }}
        >
          [expand]
        </Box>
      )}
    </Box>
  );
}

export default ExpandableDescription;
