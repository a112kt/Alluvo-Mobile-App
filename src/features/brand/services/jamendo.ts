import { API_BASE_URL } from "../../../config/env";
import type { JamendoTrack } from "../types/reelManagement";

const JAMENDO_BASE = "https://api.jamendo.com/v3.0";

function getClientId(): string {
  return process.env.EXPO_PUBLIC_JAMENDO_CLIENT_ID || "";
}

export interface JamendoTracksResponse {
  headers: { status: string; code: number };
  results: Array<{
    id: string;
    name: string;
    artist_name: string;
    duration: number;
    audio: string;
    image: string;
    album_image: string;
  }>;
}

export async function fetchJamendoTracks(
  search?: string,
  limit: number = 20
): Promise<JamendoTrack[]> {
  const clientId = getClientId();
  if (!clientId) {
    return [];
  }

  const params = new URLSearchParams({
    client_id: clientId,
    format: "json",
    limit: limit.toString(),
    tags: "instrumental",
    audio: "low",
    include: "musicinfo",
  });

  if (search && search.trim()) {
    params.append("search", search.trim());
  }

  const res = await fetch(`${JAMENDO_BASE}/tracks/?${params}`);
  const data: JamendoTracksResponse = await res.json();

  if (!data.results) return [];

  return data.results.map((track) => ({
    id: track.id,
    name: track.name,
    artistName: track.artist_name,
    duration: track.duration,
    audioUrl: track.audio,
    imageUrl: track.album_image || track.image,
  }));
}
