import { Alert, Box, CircularProgress, Typography } from "@mui/material";
import React, { useMemo } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { ActionableMediaCard } from "features/media-actions/public";
import { libraryBrowseTo } from "shared/lib/navigation";
import { partitionSearchResults } from "../model/searchResults";
import { usePlexSearch } from "../model/usePlexSearch";
import { useLibraryCardView } from "features/library/public";
import { mediaCardWidth } from "entities/media/model";
import { PAGE_GUTTER } from "shared/ui/layout";

export default function SearchScreen() {
  const { query } = useParams();
  const location = useLocation();
  const search = usePlexSearch(query ?? "");
  const cardView = useLibraryCardView();
  const cardWidth = mediaCardWidth(cardView.layout, cardView.size);
  const { media, directories } = useMemo(
    () => partitionSearchResults(search.results),
    [search.results],
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        height: "100%",
        width: "100%",
        mt: "64px",
        px: PAGE_GUTTER,
        pt: 4,
        pb: 6,
      }}
    >
      <Typography
        variant="h3"
        sx={{ mt: 2, fontSize: { xs: "1.8rem", sm: "3rem" }, overflowWrap: "anywhere" }}
      >
        {query ? (
          <>
            Results for <strong>{query}</strong>
          </>
        ) : (
          "Use Search Bar to Search"
        )}
      </Typography>

      {search.loading && <CircularProgress sx={{ mt: 4 }} />}
      {search.error && <Alert severity="error" sx={{ mt: 3 }}>{search.error}</Alert>}

      <Box
        sx={{
          mt: 2,
          width: "100%",
          display: "grid",
          gridTemplateColumns: `repeat(auto-fill, minmax(min(100%, ${cardWidth}px), 1fr))`,
          gap: 2,
        }}
      >
        {directories.length > 0 && (
          <>
            <Typography variant="h4" sx={{ gridColumn: "1 / -1" }}>
              Categories
            </Typography>

            {directories.map((item) => (
              <DirectoryItem
                key={item.key}
                item={item}
                to={libraryBrowseTo(
                  location,
                  `/library/sections/${item.librarySectionID}/genre/${item.id}`,
                )}
              />
            ))}

            <Box sx={{ gridColumn: "1 / -1" }} />
          </>
        )}

        {!search.loading &&
          media.map((item) => (
            <ActionableMediaCard
              key={item.ratingKey}
              item={item}
              layout={cardView.layout}
              imageSizes={`${cardWidth}px`}
            />
          ))}
      </Box>
    </Box>
  );
}

function DirectoryItem({
  item,
  to,
}: {
  item: Plex.Directory;
  to: React.ComponentProps<typeof Link>["to"];
}) {
  return (
    <Box
      component={Link}
      to={to}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        bgcolor: "rgba(0,0,0,0.1)",
        borderRadius: "8px",
        p: 2,
        background: "#333333",
        cursor: "pointer",
        color: "inherit",
        textDecoration: "none",

        "&:hover": {
          background: "#444444",
        },
        userSelect: "none",
      }}
    >
      <Typography variant="h5">
        {item.librarySectionTitle} - {item.tag}
      </Typography>
    </Box>
  );
}
