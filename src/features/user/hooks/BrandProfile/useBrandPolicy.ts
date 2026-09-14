import { useEffect, useState } from "react";
import { getBrandPolicy } from "../../services/BrandProfile";

const UseBrandPolicy = (brandId: number) => {
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!brandId) return;

    setLoading(true);
    setError(false);
    
    getBrandPolicy(brandId)
      .then((res) => {
        setResponse(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("DEBUG: Policy API Error:", err.response?.status, err.response?.data || err.message);
        setError(true);
        setLoading(false);
      });
  }, [brandId]);

  return { response, loading, error };
};

export default UseBrandPolicy;
