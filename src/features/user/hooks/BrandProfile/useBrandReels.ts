import { useEffect, useState } from "react";
import { getBrandReels } from "../../services/BrandProfile";

const useBrandReels = (brandId: number) => {
  const [response, setResponse] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!brandId) return;

    setLoading(true);
    setError(false);
    
    getBrandReels(brandId)
      .then((res: any) => {
        if (res.success) {
            setResponse(res.data);
        }
        setLoading(false);
      })
      .catch((err: any) => {
        console.error("DEBUG: useBrandReels Catch -", err.message);
        setError(true);
        setLoading(false);
      });
  }, [brandId]);

  return { response, loading, error };
};

export default useBrandReels;
