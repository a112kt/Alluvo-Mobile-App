import { useState, useCallback, useRef } from "react";
import { getForYouReels, getFollowingReels, Reel, ReelsMeta } from "../services";

export type ReelFeedType = "forYou" | "following";

interface ReelsState {
  data: Reel[];
  meta: ReelsMeta | null;
  isLoading: boolean;
  isLoadingMore: boolean;
  isSwitchingFeed: boolean;
  error: string | null;
}

const initialState: ReelsState = {
  data: [],
  meta: null,
  isLoading: false,
  isLoadingMore: false,
  isSwitchingFeed: false,
  error: null,
};

export function useReels(feedType: ReelFeedType = "forYou") {
  const [state, setState] = useState<ReelsState>(initialState);
  const pageRef = useRef(1);
  const isFetchingRef = useRef(false);

  const fetchFn = feedType === "forYou" ? getForYouReels : getFollowingReels;

  const fetch = useCallback(
    async (pageIndex = 1, append = false) => {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;

      setState((prev) => ({
        ...prev,
        isLoading: !append,
        isLoadingMore: append,
        isSwitchingFeed: !append && prev.data.length > 0,
        error: null,
      }));

      try {
        const res = await fetchFn({ pageIndex, pageSize: 10 });
        if (res?.success) {
          setState((prev) => ({
            ...prev,
            data: append ? [...prev.data, ...res.data.data] : res.data.data,
            meta: res.data.meta,
            isLoading: false,
            isLoadingMore: false,
            isSwitchingFeed: false,
          }));
          pageRef.current = pageIndex;
        } else {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            isLoadingMore: false,
            isSwitchingFeed: false,
            error: (typeof res?.message === "string" ? res.message : res?.message?.en) || "Failed to load reels",
          }));
        }
      } catch (err: any) {
        setState((prev) => ({
          ...prev,
          error: err?.message ?? "Something went wrong",
          isLoading: false,
          isLoadingMore: false,
          isSwitchingFeed: false,
        }));
      } finally {
        isFetchingRef.current = false;
      }
    },
    [feedType]
  );

  /** Load first page */
  const load = useCallback(() => fetch(1, false), [fetch]);

  /** Load next page (infinite scroll) */
  const loadMore = useCallback(() => {
    if (state.meta?.hasNextPage && !isFetchingRef.current) {
      fetch(pageRef.current + 1, true);
    }
  }, [fetch, state.meta]);

  /** Refresh (back to page 1) */
  const refresh = useCallback(() => fetch(1, false), [fetch]);

  return {
    ...state,
    load,
    loadMore,
    refresh,
  };
}
