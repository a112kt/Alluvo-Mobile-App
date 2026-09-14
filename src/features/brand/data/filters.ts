import type { FilterPreset } from "../types/reelManagement";

export const FILTER_PRESETS: FilterPreset[] = [
  {
    id: "normal",
    name: "Normal",
    icon: "sparkles-outline",
    overlayColors: ["transparent", "transparent"],
    overlayOpacity: 0,
  },
  {
    id: "golden_hour",
    name: "Golden Hour",
    icon: "sunny-outline",
    overlayColors: ["rgba(255,170,0,0.15)", "rgba(255,100,50,0.08)"],
    overlayOpacity: 0.15,
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    icon: "flash-outline",
    overlayColors: ["rgba(255,0,128,0.12)", "rgba(0,255,255,0.12)"],
    overlayOpacity: 0.20,
  },
  {
    id: "clarendon",
    name: "Clarendon",
    icon: "eye-outline",
    overlayColors: ["rgba(0,180,255,0.1)", "rgba(255,0,180,0.06)"],
    overlayOpacity: 0.12,
  },
  {
    id: "crema",
    name: "Crema",
    icon: "leaf-outline",
    overlayColors: ["rgba(230,200,160,0.15)", "rgba(200,160,120,0.1)"],
    overlayOpacity: 0.15,
  },
  {
    id: "retro_vhs",
    name: "Retro VHS",
    icon: "videocam-outline",
    overlayColors: ["rgba(20,50,200,0.12)", "rgba(180,0,100,0.08)"],
    overlayOpacity: 0.18,
  },
  {
    id: "willow",
    name: "Willow B&W",
    icon: "moon-outline",
    overlayColors: ["rgba(0,0,0,0.3)", "rgba(50,50,50,0.2)"],
    overlayOpacity: 0.35,
  },
  {
    id: "valencia",
    name: "Valencia",
    icon: "rose-outline",
    overlayColors: ["rgba(255,225,120,0.12)", "rgba(255,150,150,0.08)"],
    overlayOpacity: 0.12,
  },
  {
    id: "sunset",
    name: "Sunset",
    icon: "flame-outline",
    overlayColors: ["rgba(255,80,0,0.12)", "rgba(100,0,150,0.1)"],
    overlayOpacity: 0.15,
  },
];

export function getFilterById(id: string): FilterPreset {
  return FILTER_PRESETS.find((f) => f.id === id) || FILTER_PRESETS[0];
}
