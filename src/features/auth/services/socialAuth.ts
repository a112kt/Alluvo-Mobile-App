import React from "react";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { apiCall } from "../../../../services/apiClient";
import { API_BASE_URL } from "../../../../src/config/env";

WebBrowser.maybeCompleteAuthSession();

const BASE_URL = API_BASE_URL;
const GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID ?? "";
const TIKTOK_CLIENT_KEY = process.env.EXPO_PUBLIC_TIKTOK_CLIENT_KEY ?? "";

const redirectUri = AuthSession.makeRedirectUri({
  scheme: "alluvo",
  path: "callback",
});

// ─── Google ──────────────────────────────────────────────

const googleDiscovery: AuthSession.DiscoveryDocument = {
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenEndpoint: "https://oauth2.googleapis.com/token",
  revocationEndpoint: "https://oauth2.googleapis.com/revoke",
};

export function useGoogleAuthRequest(
  onSuccess: (token: string) => void,
  onError?: (err: any) => void
) {
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: GOOGLE_CLIENT_ID,
      redirectUri,
      usePKCE: true,
      scopes: ["openid", "email", "profile"],
    },
    googleDiscovery
  );

  React.useEffect(() => {
    if (response?.type === "success" && response.params?.code) {
      handleGoogleCode(response.params.code)
        .then((data) => {
          if (data?.data?.token) {
            onSuccess(data.data.token);
          }
        })
        .catch((err) => {
          console.error("Google auth error:", err);
          onError?.(err);
        });
    }
  }, [response]);

  const handleGoogleAuth = async () => {
    try {
      await promptAsync();
    } catch (err) {
      console.error("Google auth prompt error:", err);
      onError?.(err);
    }
  };

  return { handleGoogleAuth, isReady: !!request };
}

async function handleGoogleCode(code: string) {
  const res = await apiCall.post("/api/GoogleMobileAuth/exchange", { code });
  return res.data;
}

// ─── TikTok ──────────────────────────────────────────────

const tiktokDiscovery: AuthSession.DiscoveryDocument = {
  authorizationEndpoint: "https://www.tiktok.com/v2/auth/authorize/",
  tokenEndpoint: "https://open.tiktokapis.com/v2/oauth/token/",
};

export function useTikTokAuthRequest(
  onSuccess: (token: string) => void,
  onError?: (err: any) => void
) {
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: TIKTOK_CLIENT_KEY,
      redirectUri,
      usePKCE: true,
      scopes: ["user.info.basic"],
      responseType: AuthSession.ResponseType.Code,
      extraParams: {
        response_type: "code",
      },
    },
    tiktokDiscovery
  );

  React.useEffect(() => {
    if (response?.type === "success" && response.params?.code) {
      handleTikTokCode(response.params.code)
        .then((data) => {
          if (data?.data?.token) {
            onSuccess(data.data.token);
          }
        })
        .catch((err) => {
          console.error("TikTok auth error:", err);
          onError?.(err);
        });
    }
  }, [response]);

  const handleTikTokAuth = async () => {
    try {
      await promptAsync();
    } catch (err) {
      console.error("TikTok auth prompt error:", err);
      onError?.(err);
    }
  };

  return { handleTikTokAuth, isReady: !!request };
}

async function handleTikTokCode(code: string) {
  const res = await apiCall.post("/api/TikTokMobileAuth/exchange", { code });
  return res.data;
}
