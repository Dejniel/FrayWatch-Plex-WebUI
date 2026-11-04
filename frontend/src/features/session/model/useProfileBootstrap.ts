import { useEffect, useState } from "react";
import { useUserSettings } from "features/settings/model";
import { useAuthSession } from "./authSession";
import { plexProfileKey } from "./profileIdentity";

export function useProfileBootstrap() {
  const profileKey = useAuthSession((state) =>
    state.status === "ready"
      ? plexProfileKey(state.ownerUser, state.activeProfile)
      : null,
  );
  const revision = useAuthSession((state) => state.revision);
  const status = useUserSettings((state) => state.status);
  const loadedProfileKey = useUserSettings((state) => state.profileKey);
  const error = useUserSettings((state) => state.error);
  const initialize = useUserSettings((state) => state.initialize);
  const [startedBootstrap, setStartedBootstrap] = useState<string | null>(null);
  const bootstrapKey = profileKey ? `${revision}:${profileKey}` : null;

  useEffect(() => {
    useUserSettings.getState().reset();
    setStartedBootstrap(bootstrapKey);
    if (profileKey) void initialize(profileKey);
    return () => useUserSettings.getState().reset();
  }, [bootstrapKey, initialize, profileKey]);

  const pending =
    !profileKey ||
    startedBootstrap !== bootstrapKey ||
    loadedProfileKey !== profileKey ||
    status === "idle" ||
    status === "loading";

  return {
    pending,
    error: !pending && status === "error" ? error : null,
    retry: () => {
      if (profileKey) void initialize(profileKey);
    },
  };
}
