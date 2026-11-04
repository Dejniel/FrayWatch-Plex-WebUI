export type MediaArtworkLayout = "landscape" | "poster" | "square";

export const DEFAULT_CARD_SIZE = 40;
export const MAX_CARD_SIZE = 200;
export const MEDIA_CARD_FOOTER_HEIGHT = 80;

export function normalizeCardSize(value: string | undefined) {
  const parsed = Number(value);
  return Number.isFinite(parsed)
    ? Math.min(MAX_CARD_SIZE, Math.max(0, parsed))
    : DEFAULT_CARD_SIZE;
}

export const mediaCardWidth = (layout: MediaArtworkLayout, size = DEFAULT_CARD_SIZE) =>
  Math.round(layout === "landscape" ? 190 + size * 2.2 : 140 + size * 1.6);

export function mediaCardAspectRatio(layout: MediaArtworkLayout) {
  return layout === "poster" ? 2 / 3 : layout === "square" ? 1 : 16 / 9;
}

function firstPath(...paths: Array<string | null | undefined>) {
  return paths.find((path) => typeof path === "string" && path.trim()) || null;
}

export function mediaArtworkPath(
  item: {
    type: string;
    thumb?: string;
    art?: string;
    parentThumb?: string;
    grandparentThumb?: string;
    composite?: string;
  },
  layout: MediaArtworkLayout,
) {
  if (["artist", "album", "track", "photo", "photoalbum", "clip"].includes(item.type))
    return firstPath(
      item.thumb,
      item.parentThumb,
      item.grandparentThumb,
      item.composite,
      item.art,
    );
  if (layout === "poster") return firstPath(item.thumb, item.art);
  return item.type === "episode" ? firstPath(item.thumb) : firstPath(item.art);
}
