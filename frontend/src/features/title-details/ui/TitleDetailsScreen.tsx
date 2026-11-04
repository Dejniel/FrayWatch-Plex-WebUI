import {
  Alert,
  Box,
  CircularProgress,
  Collapse,
  Divider,
  Snackbar,
  Typography,
} from "@mui/material";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getResponsiveTranscodeImageProps,
  DETAIL_POSTER_IMAGE_WIDTHS,
  HERO_IMAGE_WIDTHS,
  isMediaWatched,
} from "entities/media/model";
import { CheckCircleRounded } from "@mui/icons-material";
import { durationToText } from "shared/lib/duration";
import { alpha } from "@mui/material/styles";
import { AppDialog } from "shared/ui";
import TitleReviews from "./TitleReviews";
import TitleRatings from "./TitleRatings";
import TitleReviewEditor from "./TitleReviewEditor";
import TitleOverview from "./TitleOverview";
import TitleDetails from "./TitleDetails";
import TitleMedia from "./TitleMedia";
import {
  openMetadataDialog,
  openMetadataMatchDialog,
  getMediaActionCapabilities,
} from "features/media-actions/public";
import { withoutExtra } from "entities/media/model";
import {
  useAuthSession,
  useCanManageServer,
  useServerSession,
} from "features/session/public";
import { useTitleExtras } from "../model/useTitleExtras";
import ExpandableDescription from "./ExpandableDescription";
import { libraryBrowseTo } from "shared/lib/navigation";
import { useTitleDetailsData } from "../model/useTitleDetailsData";
import TitlePrimaryActions from "./TitlePrimaryActions";
import { getReviewMetadataID } from "../model/titleReviewsQuery";
import TitleEpisodes from "./TitleEpisodes";
import TitleDetailsNavigation from "./TitleDetailsNavigation";
import {
  resolveTitleDetailsTab,
  type TitleDetailsTab,
} from "../model/titleDetailsTabs";

const DETAILS_WIDTH = "110rem";
const DETAILS_GUTTER = { xs: 2, sm: 3, md: 4 };
function TitleDetailsScreen() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const canManageServer = useCanManageServer();
  const allowDownloads = useServerSession(
    (state) => state.server?.allowSync === true,
  );
  const [reviewTarget, setReviewTarget] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const sessionRevision = useAuthSession((state) => state.revision);

  const mid = searchParams.get("mid");
  const plexGuid = searchParams.get("pguid");
  const {
    data,
    episodeBrowser,
    languages,
    loadError,
    loading,
    resolvedRatingKey,
    setData,
    subtitles,
  } = useTitleDetailsData(mid, plexGuid);
  const tab = resolveTitleDetailsTab(
    searchParams.get("detailsTab"),
    data?.type,
  );
  const setTab = (nextTab: TitleDetailsTab) =>
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        if (nextTab === "overview") next.delete("detailsTab");
        else next.set("detailsTab", nextTab);
        return next;
      },
      { replace: true },
    );
  const reviewIdentity = `${sessionRevision}:${data?.ratingKey}:${data?.guid}`;
  const writeReview = getReviewMetadataID(data?.guid)
    ? () => setReviewTarget(reviewIdentity)
    : undefined;
  const capabilities = data
    ? getMediaActionCapabilities(data, {
        localItem: true,
        canManageServer,
        allowDownloads,
      })
    : null;
  const {
    extras,
    loading: extrasLoading,
    primaryTrailer,
  } = useTitleExtras(data);

  const closeDetails = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("mid");
    next.delete("pguid");
    next.delete("detailsTab");
    setSearchParams(next);
  };

  useEffect(() => {
    if (!resolvedRatingKey) return;
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        next.delete("pguid");
        next.set("mid", resolvedRatingKey);
        return next;
      },
      { replace: true },
    );
  }, [resolvedRatingKey, setSearchParams]);

  useEffect(() => {
    setReviewTarget(null);
    setNotice(null);
  }, [mid, plexGuid]);

  const remainingExtras = withoutExtra(extras, primaryTrailer);
  const directors = (data?.Director || [])
    .map(({ tag }) => tag)
    .filter(Boolean)
    .join(", ");
  const heroArtwork = data?.art
    ? getResponsiveTranscodeImageProps(data.art, {
        widths: HERO_IMAGE_WIDTHS,
        aspectRatio: 16 / 9,
        sizes: "(max-width: 600px) 100vw, min(90vw, 110rem)",
        fallbackWidth: 1280,
      })
    : null;
  const posterPath = data?.thumb || data?.art;
  const posterArtwork = posterPath
    ? getResponsiveTranscodeImageProps(posterPath, {
        widths: DETAIL_POSTER_IMAGE_WIDTHS,
        aspectRatio: 2 / 3,
        sizes: "(max-width: 600px) min(64vw, 15rem), clamp(11.25rem, 22vw, 17.5rem)",
        fallbackWidth: 480,
      })
    : null;

  const metadataWasSaved = () => setNotice("Metadata saved");

  if (!mid && !plexGuid) return <></>;

  if (loading)
    return (
      <AppDialog
        open
        onClose={closeDetails}
        maxWidth={DETAILS_WIDTH}
        contentSx={{ p: 0 }}
      >
        <Box
          sx={{
            minHeight: "50vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      </AppDialog>
    );

  if (loadError)
    return (
      <AppDialog
        open
        size="compact"
        onClose={closeDetails}
        title="Title unavailable"
      >
        <Alert severity="error">{loadError}</Alert>
      </AppDialog>
    );

  return (
    <AppDialog
      open={Boolean(mid)}
      onClose={closeDetails}
      maxWidth={DETAILS_WIDTH}
      contentSx={{ p: 0, backgroundColor: "background.default" }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          backgroundColor: "background.default",
          pb: { xs: 6, sm: 4 },
          position: "relative",
        }}
      >
        <Box
          component="header"
          sx={{
            width: "100%",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-start",
            justifyContent: { xs: "center", sm: "flex-start" },
            gap: { xs: 3, md: 4 },
            px: DETAILS_GUTTER,
            pt: 5,
            pb: 3,
            position: "relative",
            isolation: "isolate",
          }}
        >
          {heroArtwork && (
            <Box
              component="img"
              {...heroArtwork}
              alt=""
              loading="eager"
              decoding="async"
              sx={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center top",
                filter: "brightness(0.32)",
                zIndex: -2,
              }}
            />
          )}
          <Box
            aria-hidden="true"
            sx={{
              position: "absolute",
              inset: 0,
              background: (theme) =>
                `linear-gradient(180deg, ${alpha(
                  theme.palette.background.default,
                  0,
                )}, ${theme.palette.background.default}, ${
                  theme.palette.background.default
                })`,
              zIndex: -1,
              pointerEvents: "none",
            }}
          />
          <Box
            sx={{
              width: { xs: "min(64vw, 15rem)", sm: "clamp(11.25rem, 22vw, 17.5rem)" },
              flexShrink: 0,
              borderRadius: "10px",
              overflow: "hidden",
              boxShadow: (theme) =>
                `0 20px 25px -5px ${theme.palette.common.black}`,
              position: "relative",
              aspectRatio: "2/3",
              backgroundColor: "#17191e",
            }}
          >
            {posterArtwork && (
              <img
                {...posterArtwork}
                alt={data?.title || ""}
                loading="eager"
                decoding="async"
                style={{
                  width: "100%",
                  aspectRatio: "2/3",
                  backgroundColor: "#00000088",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            )}
          </Box>

          <Box
            sx={{
              width: "100%",
              flex: "1 1 30rem",
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: { xs: "center", sm: "flex-start" },
              justifyContent: "flex-start",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: { xs: "center", sm: "flex-start" },
                justifyContent: "flex-start",
                width: "100%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: { xs: "center", sm: "flex-start" },
                }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: "18px", sm: "24px" },
                    fontWeight: "900",
                    letterSpacing: "0.1em",
                    color: (theme) => theme.palette.primary.main,
                    textTransform: "uppercase",
                  }}
                >
                  {data?.type}
                </Typography>
              </Box>

              <Typography
                sx={{
                  fontSize: { xs: "2rem", sm: "2.5rem" },
                  fontWeight: "bold",
                  mt: 0,
                  mb: { xs: 1, sm: 0 },
                  lineHeight: { xs: 1.2, sm: "normal" },
                  textAlign: { xs: "center", sm: "left" },
                  color: (theme) => theme.palette.text.primary,
                }}
              >
                {data?.title}
              </Typography>

              {directors && (
                <Typography
                  sx={{
                    mt: 0.25,
                    fontSize: "0.8125rem",
                    lineHeight: 1.3,
                    color: "text.secondary",
                    textAlign: { xs: "center", sm: "left" },
                  }}
                >
                  Directed by: {directors}
                </Typography>
              )}

              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: { xs: "center", sm: "flex-start" },
                  mt: 1,
                  mb: 1,
                  gap: 1,
                }}
              >
                {data && isMediaWatched(data) && (
                  <CheckCircleRounded
                    sx={{
                      color: (theme) => theme.palette.primary.light,
                      fontSize: "large",
                    }}
                  />
                )}
                {data?.contentRating && (
                  <Typography
                    sx={{
                      fontSize: "medium",
                      fontWeight: "light",
                      color: (theme) => theme.palette.text.secondary,
                      border: (theme) => `1px solid ${theme.palette.divider}`,
                      borderRadius: "5px",
                      px: 1,
                      py: 0.2,
                    }}
                  >
                    {data?.contentRating}
                  </Typography>
                )}
                {data?.year && (
                  <Typography
                    sx={{
                      fontSize: "medium",
                      fontWeight: "light",
                      color: (theme) => theme.palette.text.secondary,
                    }}
                  >
                    {data?.year}
                  </Typography>
                )}
                {data?.duration &&
                  ["episode", "movie"].includes(data?.type) && (
                    <Typography
                      sx={{
                        fontSize: "medium",
                        fontWeight: "light",
                        color: (theme) => theme.palette.text.secondary,
                      }}
                    >
                      {durationToText(data?.duration)}
                    </Typography>
                  )}
                {data?.type === "show" &&
                  data?.leafCount &&
                  data?.childCount && (
                    <Typography
                      sx={{
                        fontSize: "medium",
                        fontWeight: "light",
                        color: (theme) => theme.palette.text.secondary,
                      }}
                    >
                      {data?.childCount > 1
                        ? `${data?.childCount} Seasons`
                        : `${data?.leafCount} Episode${
                            data?.leafCount > 1 ? "s" : ""
                          }`}
                    </Typography>
                  )}
              </Box>

              <TitleRatings item={data} />

              <Box
                sx={{
                  width: "100%",
                  mt: 2,
                }}
              >
                {data && capabilities && (
                  <TitlePrimaryActions
                    capabilities={capabilities}
                    data={data}
                    onDataChanged={setData}
                    onEditMetadata={() => {
                      if (data) openMetadataDialog(data, metadataWasSaved);
                    }}
                    onMatch={() =>
                      openMetadataMatchDialog(data, () =>
                        setNotice(
                          "Match applied. Plex is refreshing metadata.",
                        ),
                      )
                    }
                    onWriteReview={writeReview}
                  />
                )}
              </Box>

              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: { xs: "center", sm: "flex-start" },
                  flexWrap: "wrap",
                  gap: 0.5,
                  mt: 2,
                }}
              >
                <Typography sx={{ color: "text.secondary" }}>
                  Genres:{" "}
                </Typography>
                {data?.Genre?.slice(0, 5).map((genre, index) => (
                  <Typography
                    component={Link}
                    to={libraryBrowseTo(
                      location,
                      `/library/sections/${data?.librarySectionID}/genre/${genre.id}`,
                    )}
                    key={genre.id}
                    sx={{
                      color: (theme) => theme.palette.text.primary,
                      fontWeight: "medium",
                      cursor: "pointer",
                      "&:hover": {
                        color: (theme) => theme.palette.primary.main,
                        textDecoration: "none",
                      },
                      transition: "all 0.2s ease",
                      textDecoration: "none",
                    }}
                  >
                    {genre.tag}
                    {index + 1 === data?.Genre?.slice(0, 5).length ? "" : ","}
                  </Typography>
                ))}
              </Box>

              <Collapse in={Boolean(languages || subtitles)}>
                <Box sx={{ mt: 1 }}>
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: { xs: "center", sm: "flex-start" },
                      flexWrap: "wrap",
                      gap: 0.5,
                    }}
                  >
                    {languages && languages.length > 0 && (
                      <>
                        <Typography sx={{ color: "text.secondary" }}>
                          Audio:{" "}
                        </Typography>
                        {languages.slice(0, 10).map((lang, index) => (
                          <Typography
                            key={index}
                            sx={{
                              color: (theme) => theme.palette.text.primary,
                              fontWeight: "medium",
                            }}
                          >
                            {lang}
                            {index + 1 === languages.slice(0, 10).length
                              ? ""
                              : ","}
                          </Typography>
                        ))}
                      </>
                    )}
                  </Box>

                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: { xs: "center", sm: "flex-start" },
                      flexWrap: "wrap",
                      gap: 0.5,
                    }}
                  >
                    {subtitles && subtitles.length > 0 && (
                      <>
                        <Typography sx={{ color: "text.secondary" }}>
                          Subtitles:{" "}
                        </Typography>
                        {subtitles.slice(0, 10).map((lang, index) => (
                          <Typography
                            key={index}
                            sx={{
                              color: (theme) => theme.palette.text.primary,
                              fontWeight: "medium",
                            }}
                          >
                            {lang}
                            {index + 1 === subtitles.slice(0, 10).length
                              ? ""
                              : ","}
                          </Typography>
                        ))}
                      </>
                    )}
                  </Box>
                </Box>
              </Collapse>

              <Box sx={{ mt: 1.5, width: "100%", maxWidth: "75ch" }}>
                <ExpandableDescription
                  text={data?.summary}
                  lines={6}
                />
              </Box>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            width: "100%",
            px: DETAILS_GUTTER,
            mt: 1,
          }}
        >
          <TitleDetailsNavigation
            tab={tab}
            type={data?.type}
            onChange={setTab}
            episodes={episodeBrowser}
          />

          <Divider sx={{ mb: 2, width: "100%" }} />

          <Box
            role="tabpanel"
            id={`title-panel-${tab}`}
            aria-labelledby={`title-tab-${tab}`}
            sx={{ width: "100%" }}
          >
            {tab === "overview" && data && (
              <TitleOverview
                data={data}
                trailer={primaryTrailer}
                onShowDetails={() => setTab("details")}
                onShowReviews={() => setTab("reviews")}
              />
            )}
            {tab === "episodes" && data?.type === "show" && (
              <TitleEpisodes
                key={episodeBrowser.identity}
                browser={episodeBrowser}
              />
            )}
            {tab === "details" && data && (
              <TitleDetails
                data={data}
                extras={remainingExtras}
                loadingExtras={extrasLoading}
              />
            )}
            {tab === "reviews" && (
              <TitleReviews data={data} onWriteReview={writeReview} />
            )}
            {tab === "media" && data && <TitleMedia data={data} />}
          </Box>
        </Box>
        {data && reviewTarget === reviewIdentity && (
          <TitleReviewEditor
            key={reviewIdentity}
            item={data}
            onClose={() => setReviewTarget(null)}
          />
        )}
        <Snackbar
          open={Boolean(notice)}
          autoHideDuration={4000}
          onClose={() => setNotice(null)}
          message={notice}
        />
      </Box>
    </AppDialog>
  );
}

export default TitleDetailsScreen;
