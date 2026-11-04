import { Box, Typography } from "@mui/material";
import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import SettingsInfo from "./SettingsInfo";
import SettingsPlayback from "./SettingsPlayback";
import SettingsAccount from "./SettingsAccount";
import SettingsPlexHome from "./SettingsPlexHome";
import SettingsSharing from "./SettingsSharing";
import SettingsLibrariesAdmin from "./SettingsLibrariesAdmin";
import SettingsServer from "./SettingsServer";
import { useCanManageServer } from "features/session/public";
import { CONTENT_COLUMN_WIDTH, PAGE_GUTTER } from "shared/ui/layout";

function SettingsScreen() {
  const canManageServer = useCanManageServer();

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: CONTENT_COLUMN_WIDTH,
        mx: "auto",
        display: "grid",
        gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "240px minmax(0, 1fr)" },
        alignItems: "start",
        gap: { xs: 2, md: 3 },
        pt: "88px",
        px: PAGE_GUTTER,
        pb: 3,
      }}
    >
      <Box
        sx={{
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#181818",
          padding: "10px",
          borderRadius: "10px",
        }}
      >
        <SettingsDivider title="General" />
        <SettingsItem title="Account" link="/settings/account" />
        <SettingsItem title="Plex Home" link="/settings/plex-home" />
        <SettingsItem title="Playback" link="/settings/experience-playback" />
        <SettingsItem title="About" link="/settings/info" />
        {canManageServer && (
          <>
            <SettingsDivider title="Manage" />
            <SettingsItem title="Plex server" link="/settings/server" />
            <SettingsItem title="Libraries" link="/settings/manage-libraries" />
            <SettingsItem title="Sharing" link="/settings/sharing" />
          </>
        )}
      </Box>

      <Box
        sx={{
          width: "100%",
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          backgroundColor: "#18181855",
          p: { xs: 2, sm: 3 },
          borderRadius: "10px",
        }}
      >
        <Routes>
          <Route path="/info" element={<SettingsInfo />} />
          <Route path="/account" element={<SettingsAccount />} />
          <Route path="/plex-home" element={<SettingsPlexHome />} />
          <Route path="/sharing" element={<SettingsSharing />} />
          <Route path="/server" element={<SettingsServer />} />
          <Route
            path="/manage-libraries"
            element={<SettingsLibrariesAdmin />}
          />

          <Route path="/experience-playback" element={<SettingsPlayback />} />
          <Route
            path="/experience-recommendations"
            element={<Navigate to="/settings/experience-playback" replace />}
          />
          <Route
            path="/experience-libraries"
            element={<Navigate to="/settings/manage-libraries" replace />}
          />
        </Routes>
      </Box>
    </Box>
  );
}

export default SettingsScreen;

function SettingsDivider({ title }: { title: string }) {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        padding: "5px",
        borderRadius: "10px",
      }}
    >
      <Typography
        sx={{
          color: "#AAA",
          fontSize: "1.2rem",
          userSelect: "none",
        }}
      >
        {title}
      </Typography>
    </Box>
  );
}

function SettingsItem({ title, link }: { title: string; link: string }) {
  const { pathname } = useLocation();

  return (
    <Link to={link}>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          padding: "5px",
          borderRadius: "10px",
          pl: "18px",

          transition: "all 0.3s ease",

          "&:hover": {
            backgroundColor: "#333",
          },
        }}
      >
        <Typography
          sx={{
            color: (theme) =>
              pathname === link
                ? theme.palette.primary.main
                : theme.palette.text.primary,
            fontSize: "1rem",
            userSelect: "none",
          }}
        >
          {title}
        </Typography>
      </Box>
    </Link>
  );
}
