import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { useUserSettings } from "features/settings/model";
import { useAuthSession } from "../model/authSession";
import SessionGate from "./SessionGate";

const { loadUserSettings } = vi.hoisted(() => ({
  loadUserSettings: vi.fn<() => Promise<Record<string, string>>>(),
}));
vi.mock("features/settings/api/userSettings", () => ({
  loadUserSettings,
  saveUserSetting: vi.fn(),
}));
vi.mock("./LoginScreen", () => ({ default: () => <div>Sign in</div> }));
vi.mock("./ProfilePickerScreen", () => ({
  default: () => <div>Choose profile</div>,
}));

function deferredSettings() {
  let resolve!: (settings: Record<string, string>) => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<Record<string, string>>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

const initialAuth = useAuthSession.getState();
let host: HTMLDivElement;
let root: Root;

function ready(profileId = 1, revision = 1) {
  useAuthSession.setState({
    status: "ready",
    revision,
    ownerUser: { id: 1 } as Plex.UserData,
    activeProfile: {
      id: profileId,
      title: `Profile ${profileId}`,
      isOwner: profileId === 1,
      protected: false,
      restricted: false,
    },
  });
}

function Content() {
  const size = useUserSettings((state) => state.settings.LIBRARY_CARD_SIZE);
  return <main>Card size: {size}</main>;
}

const render = () => act(async () => root.render(
  <SessionGate><Content /></SessionGate>,
));
const spinner = () => host.querySelector('[role="progressbar"]');

beforeEach(() => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  localStorage.clear();
  vi.resetAllMocks();
  useAuthSession.setState({ ...initialAuth, initialize: vi.fn() });
  useUserSettings.getState().reset();
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
});

afterEach(async () => {
  await act(async () => root.unmount());
  host.remove();
  useAuthSession.setState(initialAuth, true);
  useUserSettings.getState().reset();
  vi.unstubAllGlobals();
});

it("keeps the same connected spinner from authentication through profile settings", async () => {
  const settings = deferredSettings();
  vi.mocked(loadUserSettings).mockReturnValue(settings.promise);
  await render();
  const initialSpinner = spinner();
  expect(initialSpinner?.isConnected).toBe(true);
  expect(loadUserSettings).not.toHaveBeenCalled();

  await act(async () => ready());
  expect(loadUserSettings).toHaveBeenCalledTimes(1);
  expect(spinner()).toBe(initialSpinner);
  expect(initialSpinner?.isConnected).toBe(true);
  expect(host.querySelector("main")).toBeNull();

  await act(async () => settings.resolve({ LIBRARY_CARD_SIZE: "80" }));
  expect(spinner()).toBeNull();
  expect(host.querySelector("main")?.textContent).toBe("Card size: 80");
});

it("discards an unfinished settings load when authentication restarts for another profile", async () => {
  const previous = deferredSettings();
  const current = deferredSettings();
  vi.mocked(loadUserSettings)
    .mockReturnValueOnce(previous.promise)
    .mockReturnValueOnce(current.promise);
  ready();
  await render();
  const initialSpinner = spinner();

  await act(async () => useAuthSession.setState({ status: "initializing" }));
  await act(async () => previous.resolve({ LIBRARY_CARD_SIZE: "180" }));
  expect(useUserSettings.getState().profileKey).toBeNull();
  expect(host.querySelector("main")).toBeNull();
  expect(spinner()).toBe(initialSpinner);

  await act(async () => ready(2, 2));
  expect(spinner()).toBe(initialSpinner);
  expect(loadUserSettings).toHaveBeenCalledTimes(2);
  await act(async () => current.resolve({ LIBRARY_CARD_SIZE: "60" }));
  expect(useUserSettings.getState().profileKey).toBe("1:2");
  expect(host.querySelector("main")?.textContent).toBe("Card size: 60");
});

it("reloads settings for a new session revision even when the profile is unchanged", async () => {
  const refreshed = deferredSettings();
  vi.mocked(loadUserSettings)
    .mockResolvedValueOnce({ LIBRARY_CARD_SIZE: "80" })
    .mockReturnValueOnce(refreshed.promise);
  ready();
  await render();
  expect(host.querySelector("main")?.textContent).toBe("Card size: 80");

  await act(async () => ready(1, 2));
  expect(host.querySelector("main")).toBeNull();
  expect(spinner()).not.toBeNull();
  expect(loadUserSettings).toHaveBeenCalledTimes(2);
  await act(async () => refreshed.resolve({ LIBRARY_CARD_SIZE: "100" }));
  expect(host.querySelector("main")?.textContent).toBe("Card size: 100");
});

it("allows cached settings after a failure and retries the failed load", async () => {
  const retried = deferredSettings();
  vi.mocked(loadUserSettings)
    .mockResolvedValueOnce({ LIBRARY_CARD_SIZE: "90" })
    .mockRejectedValueOnce(new Error("Unavailable"))
    .mockReturnValueOnce(retried.promise);
  ready();
  await render();
  await act(async () => ready(1, 2));
  expect(host.querySelector("main")?.textContent).toBe("Card size: 90");
  expect(host.querySelector('[role="alert"]')?.textContent)
    .toContain("Cached settings are being used.");

  await act(async () => host.querySelector<HTMLButtonElement>("button")!.click());
  expect(spinner()).not.toBeNull();
  expect(loadUserSettings).toHaveBeenCalledTimes(3);
  await act(async () => retried.resolve({ LIBRARY_CARD_SIZE: "120" }));
  expect(host.querySelector('[role="alert"]')).toBeNull();
  expect(host.querySelector("main")?.textContent).toBe("Card size: 120");
});

it.each([
  ["signedOut", "Sign in"],
  ["selectingProfile", "Choose profile"],
  ["error", "Authentication failed."],
] as const)("does not load profile settings while %s", async (status, text) => {
  ready();
  useAuthSession.setState({ status });
  await render();
  expect(host.textContent).toContain(text);
  expect(loadUserSettings).not.toHaveBeenCalled();
  expect(host.querySelector("main")).toBeNull();
});
