import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/authServices';
import { RegisterRequest, LoginRequest } from '@/types/auth';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner'; // or your preferred toast library

export const useRegister = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);

  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (response) => {
      setUser(response.data.user);
      toast.success(response.message);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
    },
    onSettled: () => {
      setLoading(false);
    },
  });
};

export const useLogin = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (response) => {
      setUser(response.data.user);
      toast.success(response.message);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
    },
    onSettled: () => {
      setLoading(false);
    },
  });
};