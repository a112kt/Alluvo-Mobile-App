import { useMutation } from "@tanstack/react-query"
import { verification } from "../services/auth"
import { AxiosError } from "axios";
import { useDispatch } from "react-redux";
import { setToken } from "../../../Redux/slices/authSlice";
export default function useVerificaion() {
   const dispatch = useDispatch()
return useMutation({
    mutationFn:  verification,
    onSuccess: (data) => {
    dispatch(setToken(data?.data?.token));
    },onError:(error:any)=>{

    }
})
}
