import { ImageSourcePropType } from "react-native";
import { API_BASE_URL, absoluteUrl } from "../config/env";
const PLACEHOLDER: ImageSourcePropType = require("../assests/imgs/no-image-icon-23494.png");

function extractUrl(val: any): string | null {
  if (!val) return null;
  if (typeof val === "string") return val;
  if (typeof val === "object") {
    if (val.url && typeof val.url === "string") return val.url;
    if (val.Url && typeof val.Url === "string") return val.Url;
    if (val.uri && typeof val.uri === "string") return val.uri;
  }
  return null;
}

function isSvgUrl(url: string): boolean {
  return url.trim().toLowerCase().endsWith(".svg");
}

function normalizeUrl(rawUrl: string): string {
  let url = rawUrl;
  if (url.includes("EcoFlex T-Shirt.png") || url.includes("EcoFlex%20T-Shirt.png")) {
    url = "Products/Brand1/Bamboo Breeze Hoodie.png";
  }
  return encodeURI(absoluteUrl(url)).replace(/^http:\/\//i, "https://");
}

/**
 * Tries all known image field names on a product-like object
 * and returns a normalized absolute URL string, or null.
 */
export function getProductImageUri(item: any): string | null {
  if (!item) return null;

  const candidates = [
    Array.isArray(item.mediaUrls) ? extractUrl(item.mediaUrls[0]) : extractUrl(item.mediaUrls),
    Array.isArray(item.productMediaUrls) ? extractUrl(item.productMediaUrls[0]) : extractUrl(item.productMediaUrls),
    Array.isArray(item.imageUrls) ? extractUrl(item.imageUrls[0]) : extractUrl(item.imageUrls),
    extractUrl(item.productImage),
    extractUrl(item.mediaUrl),
    extractUrl(item.imageUrl),
    extractUrl(item.mainImageUrl),
    extractUrl(item.images?.[0]?.url ?? item.images?.[0]?.Url),
    extractUrl(item.image?.url ?? item.image?.Url),
    extractUrl(item.thumbnailUrl),
  ];

  let rawUrl = candidates.find(
    (u) => u && typeof u === "string" && !isSvgUrl(u),
  );

  if (!rawUrl) return null;

  return normalizeUrl(rawUrl);
}

/**
 * Returns ALL image URLs from a product-like object (for carousels/sliders).
 * Handles both string arrays and { Id, Url } object arrays from the backend.
 */
export function getProductAllImageUris(item: any): string[] {
  if (!item) return [];

  const urls: string[] = [];
  const seen = new Set<string>();

  const addUrl = (val: any) => {
    const url = extractUrl(val);
    if (url && typeof url === "string" && !isSvgUrl(url) && !seen.has(url)) {
      seen.add(url);
      urls.push(normalizeUrl(url));
    }
  };

  if (Array.isArray(item.mediaUrls)) {
    item.mediaUrls.forEach(addUrl);
  } else {
    addUrl(item.mediaUrls);
  }

  if (Array.isArray(item.imageUrls)) {
    item.imageUrls.forEach(addUrl);
  } else {
    addUrl(item.imageUrls);
  }

  if (Array.isArray(item.productMediaUrls)) {
    item.productMediaUrls.forEach(addUrl);
  } else {
    addUrl(item.productMediaUrls);
  }

  addUrl(item.images?.[0]?.url ?? item.images?.[0]?.Url);
  addUrl(item.image?.url ?? item.image?.Url);

  return urls;
}

/**
 * Returns a safe ImageSourcePropType for use in <Image> components.
 * Always returns a valid source (real or placeholder).
 */
export function getProductImageSource(item: any): ImageSourcePropType {
  const uri = getProductImageUri(item);
  return uri ? { uri } : PLACEHOLDER;
}

const PLACEHOLDER_REEL: ImageSourcePropType = require("../assests/imgs/reel.png");

/**
 * Candidate field paths for reel thumbnail images, in priority order.
 * SVG URLs are skipped because React Native Image cannot render them.
 */
const REEL_THUMBNAIL_FIELDS: Array<{
  get: (item: any) => string | null | undefined;
  label: string;
}> = [
  { get: (i) => i.thumbnailUrl, label: "thumbnailUrl" },
  { get: (i) => i.thumbnail, label: "thumbnail" },
  { get: (i) => i.coverImage, label: "coverImage" },
  { get: (i) => i.cover, label: "cover" },
  { get: (i) => i.previewImage, label: "previewImage" },
  { get: (i) => i.preview, label: "preview" },
  { get: (i) => i.poster, label: "poster" },
  { get: (i) => i.thumbnail_image, label: "thumbnail_image" },
  { get: (i) => i.thumbnail_url, label: "thumbnail_url" },
  { get: (i) => i.cover_url, label: "cover_url" },
  { get: (i) => i.preview_url, label: "preview_url" },
  { get: (i) => i.image, label: "image" },
  { get: (i) => i.brandImageUrl, label: "brandImageUrl" },
  { get: (i) => i.brandImage, label: "brandImage" },
  { get: (i) => i.products?.[0]?.mediaUrl, label: "products[0].mediaUrl" },
];

export function getReelThumbnailUri(item: any): string | null {
  if (!item) return null;

  for (const field of REEL_THUMBNAIL_FIELDS) {
    const val = field.get(item);
    if (val && typeof val === "string" && !isSvgUrl(val)) {
      return absoluteUrl(val);
    }
  }

  return null;
}

export function getReelThumbnailSource(item: any): ImageSourcePropType {
  const uri = getReelThumbnailUri(item);
  return uri ? { uri } : PLACEHOLDER_REEL;
}

export { PLACEHOLDER, PLACEHOLDER_REEL };
