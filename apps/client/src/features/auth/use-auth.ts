import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { useAuthStore } from "@/store/auth.store";
import * as authApi from "./api";
import type { LoginInput, RegisterInput } from "./schemas";

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { error?: string } | undefined;
    return data?.error ?? "Something went wrong";
  }
  return "Something went wrong";
}

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (input: LoginInput) => authApi.login(input),
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      toast.success("Welcome back!");
      navigate("/dashboard");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ email, password, name }: RegisterInput) =>
      authApi.register({
        email,
        password,
        name: name && name.length > 0 ? name : undefined,
      }),
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      toast.success("Account created!");
      navigate("/dashboard");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  return () => {
    logout();
    navigate("/login");
    toast.info("Signed out");
  };
}
