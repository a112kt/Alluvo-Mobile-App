import { login } from "../services/auth";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { setToken } from "../../../Redux/slices/authSlice";
export function useLogin() {
    const dispatch = useDispatch()
  return useMutation({
        mutationFn:login,
        onSuccess:(data)=>{
            dispatch(setToken(data?.data?.token));
        },
        onError:(error:any)=>{

        }
    })
}