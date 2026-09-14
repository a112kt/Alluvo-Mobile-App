import { useEffect, useState, useCallback } from "react";
import { getBrandReviews } from "../../services/BrandProfile";

const UseBrandReviews = (brandId: number) => {
  const [response, setResponse] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchReviews = useCallback(async () => {
    if (!brandId) return;

    setLoading(true);
    setError(false);
    
    try {
      const res = await getBrandReviews(brandId);
      setResponse(res.data || []);
    } catch (err) {
      console.error("DEBUG: Reviews API Error:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [brandId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return { response, loading, error, refetch: fetchReviews };
};

export default UseBrandReviews;
