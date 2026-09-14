import { useQuery } from "@tanstack/react-query";
import { getForYouReels } from "../../services";

export const HOME_REELS_QUERY_KEY = ["homeReels"];

export const useHomeReels = () => {
  return useQuery({
    queryKey: HOME_REELS_QUERY_KEY,
    queryFn: () => getForYouReels({ pageIndex: 1, pageSize: 5 }),
  });
};
