import { useCallback } from "react";
import { Share, Alert } from "react-native";
import * as Linking from "expo-linking";
import { apiCall } from "../../../../services/apiClient";
import { showToast } from "../../../services/toastService";

const REEL_BASE_URL = "https://alluvo.life/reel";

export function useShareReel() {
  const shareReel = useCallback(async (reelId: number, reelTitle?: string) => {
    const url = `${REEL_BASE_URL}/${reelId}`;
    const message = reelTitle
      ? `Check out this reel: ${reelTitle}`
      : "Check out this reel on ALLUVO!";

    try {
      apiCall.post(`/api/Reel/track-share/${reelId}`).catch(() => {});

      const result = await Share.share({ message: `${message}\n${url}` });

      if (result.action === Share.dismissedAction) {
        // User dismissed the share sheet
      }
    } catch (error) {
      console.error("Failed to share reel:", error);
      showToast("Error", "Failed to share reel. Please try again.", undefined, "error");
    }
  }, []);

  return { shareReel };
}
