import { useEffect, useState } from "react";
import { getBrandInfo } from "../../services/BrandProfile";

const useBrandInfo = (brandId: number) => {
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!brandId) return;

    setLoading(true);
    setError(false);
    
    getBrandInfo(brandId)
      .then((res) => {
        setResponse(res.data); 
        setLoading(false);
      })
      .catch((err) => {
        console.error("DEBUG: Hook Catch -", err.message);
        setError(true);
        setLoading(false);
      });
  }, [brandId]);

  return { response, loading, error };
};

export default useBrandInfo;

