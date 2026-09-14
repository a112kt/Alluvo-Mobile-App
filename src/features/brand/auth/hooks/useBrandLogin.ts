import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { setToken, setRoles, setBrandStatus, setBrandName } from "../../../../Redux/slices/authSlice";
import { brandLogin } from "../services/brandAuth";
import { getMyBrand } from "../../services/brandDashboard";

function getRolesFromToken(token: string): string[] {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const roles =
      payload.role ??
      payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    if (!roles) return [];
    return Array.isArray(roles) ? roles : [roles];
  } catch {
    return [];
  }
}

export function useBrandLogin() {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: brandLogin,
    onSuccess: async (data) => {
      const token = data?.data?.token;
      if (token) {
        dispatch(setToken(token));
        const roles = getRolesFromToken(token);
        dispatch(setRoles(roles));

        try {
          const brandInfo = await getMyBrand();
          if (brandInfo?.status) dispatch(setBrandStatus(brandInfo.status));
          if (brandInfo?.displayName) dispatch(setBrandName(brandInfo.displayName));
        } catch {
          // Brand info fetch failed, guard will retry
        }
      }
    },
  });
}
