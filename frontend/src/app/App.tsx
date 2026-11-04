import { useEffect } from "react";
import { BigReader } from "shared/ui";
import { LibraryScreen } from "features/library/public";
import { TitleDetailsScreen } from "features/title-details/public";
import { WatchTogetherFeature } from "features/watch-together/public";
import {
  SessionGate,
  useAuthSession,
  useServerSession,
} from "features/session/public";
import { MusicProvider } from "features/music/public";
import { useCatalogScrollRestoration } from "./useCatalogScrollRestoration";
import Startup, { useStartupState } from "./startup/Startup";
import AppRoutes from "./AppRoutes";
import { useBrowseSynchronization } from "./useBrowseSynchronization";

function AppManager() {
  const loading = useStartupState((state) => state.loading);
  const serverName = useServerSession((state) => state.server?.friendlyName);

  useEffect(() => {
    document.title = serverName
      ? `FriWatch - ${serverName}`
      : "FriWatch";
  }, [serverName]);

  if (loading) return <Startup />;

  return (
    <SessionGate>
      <App />
    </SessionGate>
  );
}

function App() {
  useCatalogScrollRestoration();
  const sessionRevision = useAuthSession((state) => state.revision);
  useBrowseSynchronization(sessionRevision);

  useEffect(() => {
    void useServerSession.getState().refresh();
  }, [sessionRevision]);

  return (
    <>
      <BigReader />
      <WatchTogetherFeature />
      <LibraryScreen />
      <TitleDetailsScreen />
      <MusicProvider>
        <AppRoutes />
      </MusicProvider>
    </>
  );
}

export default AppManager;
