import { useState } from "react";
import { search, Reel, SearchProduct } from "../services";

export interface SearchData {
  reels: Reel[];
  products: SearchProduct[];
}

const useSearch = () => {
  const [text, setText] = useState("");
  const [data, setData] = useState<SearchData>({ reels: [], products: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (query: string): Promise<boolean> => {
    const trimmed = query.trim();
    if (!trimmed) return false;
    setLoading(true);
    setError(null);
    setHasSearched(true);
    try {
      const res = await search(trimmed, 1, 10);
      if (res.success) {
        setData({
          reels: res.data.reels.data,
          products: res.data.products.data,
        });
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err.message || "Search failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setText("");
    setData({ reels: [], products: [] });
    setError(null);
    setLoading(false);
    setHasSearched(false);
  };

  return {
    text,
    setText,
    data,
    loading,
    error,
    hasSearched,
    handleSearch,
    clearSearch,
  };
};

export default useSearch;
