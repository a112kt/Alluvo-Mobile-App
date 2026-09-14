import { register } from "../services/auth";
import { useMutation } from "@tanstack/react-query";

export function useRegister() {
  return useMutation({
        mutationFn:register,
        onSuccess:(data)=>{
        },
        onError:(error)=>{
        }
    })
}