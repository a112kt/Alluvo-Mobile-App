import { useState, useEffect, useCallback } from "react";
import { getBrandProducts } from "../../services/BrandProfile";

export default function useBrandProducts(brandId: number) {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    if (!brandId) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await getBrandProducts(brandId);
      // Handle multiple possible shapes:
      // 1. { data: [...], errors: null }   → response.data is array
      // 2. { data: { data: [...] } }       → response.data.data is array
      // 3. Direct array                    → response itself
      let parsed: any[] = [];
      if (Array.isArray(response?.data)) {
        parsed = response.data;
      } else if (Array.isArray(response?.data?.data)) {
        parsed = response.data.data;
      } else if (Array.isArray(response)) {
        parsed = response;
      }
      setProducts(parsed);
    } catch (err: any) {
      setError(err.message || "Failed to fetch products");
      console.error("useBrandProducts error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [brandId]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, isLoading, error, refresh: fetchProducts };
}
