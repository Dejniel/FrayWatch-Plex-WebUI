import { mediaArtworkPath, mediaCardAspectRatio, mediaCardWidth, normalizeCardSize } from "./mediaArtwork";

it("retains saved card sizes and supports the extended range", () => {
  for (const size of [0, 40, 100, 150, 200])
    expect(normalizeCardSize(String(size))).toBe(size);
  expect(mediaCardWidth("landscape", 40)).toBe(278);
  expect(mediaCardWidth("landscape", 100)).toBe(410);
  expect(mediaCardWidth("landscape", 200)).toBe(630);
  expect(mediaCardWidth("poster", 200)).toBe(460);
});

it("bounds invalid persisted card sizes before computing viewport geometry", () => {
  expect(normalizeCardSize("-20")).toBe(0);
  expect(normalizeCardSize("500")).toBe(200);
  for (const value of [undefined, "unknown", "Infinity"])
    expect(normalizeCardSize(value)).toBe(40);
});

it("prefers a poster thumbnail and falls back to art", () => {
  expect(mediaArtworkPath({ type: "movie", thumb: "/poster", art: "/art" }, "poster"))
    .toBe("/poster");
  expect(mediaArtworkPath({ type: "movie", thumb: "", art: "/art" }, "poster"))
    .toBe("/art");
});

it("uses episode thumbnails and landscape art for other media", () => {
  expect(mediaArtworkPath({ type: "episode", thumb: "/episode", art: "/show" }, "landscape"))
    .toBe("/episode");
  expect(mediaArtworkPath({ type: "movie", thumb: "/poster", art: "/backdrop" }, "landscape"))
    .toBe("/backdrop");
});

it("returns null instead of constructing an image URL from missing artwork", () => {
  expect(mediaArtworkPath({ type: "movie", thumb: "", art: " " }, "landscape"))
    .toBeNull();
});

it("uses album artwork for tracks and photo thumbnails in either orientation", () => {
  expect(mediaArtworkPath({ type: "track", parentThumb: "/album", art: "/artist/background" }, "square"))
    .toBe("/album");
  expect(mediaArtworkPath({ type: "photo", thumb: "/photo", art: "/background" }, "landscape"))
    .toBe("/photo");
  expect(mediaArtworkPath({ type: "photoalbum", composite: "/composite" }, "landscape"))
    .toBe("/composite");
  expect(mediaCardAspectRatio("square")).toBe(1);
});
