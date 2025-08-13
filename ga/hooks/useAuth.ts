// hooks/useAuth.ts
import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { loginUser, registerUser, getCurrentUser } from "../api/user/api";
import { useUserStore } from "@/stores/userStore";
import type {
  LoginRequest,
  RegisterRequest,
  JwtToken,
  UserResponse,
} from "../api/user/types";

// Login mutation
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (tokenData: JwtToken) => {
      if (!tokenData.token) {
        console.error("❌ No token in response:", tokenData);
        throw new Error("No access token received");
      }

      // Store token immediately
      useUserStore.getState().setToken(tokenData.token);

      // Invalidate user query to trigger fresh fetch
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError: (error: Error) => {
      console.error("❌ Login failed:", error);
    },
  });
};

// Register mutation
export const useRegister = () => {
  return useMutation({
    mutationFn: registerUser,
    onError: (error: Error) => {
      console.error("Registration failed:", error);
    },
  });
};

// Current user query
export const useCurrentUser = () => {
  const { token, setUser, logout } = useUserStore();

  const query = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => getCurrentUser(token!),
    enabled: !!token, // Only run if we have a token
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Handle success/error with useEffect-like patterns
  React.useEffect(() => {
    if (query.data && token) {
      // Update Zustand store with user data
      setUser(query.data, token);
    }
  }, [query.data, token, setUser]);

  React.useEffect(() => {
    if (query.error) {
      console.error("Failed to get user:", query.error);
      // Token might be invalid, logout user
      logout();
    }
  }, [query.error, logout]);

  return query;
};

// Logout mutation (clears everything)
export const useLogout = () => {
  const { logout } = useUserStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Call logout API if you have one
      // await logoutApi()
    },
    onSuccess: () => {
      logout();
      queryClient.clear(); // Clear all cached data
    },
    onError: (error: Error) => {
      console.error("Logout failed:", error);
    },
  });
};

// Main auth hook that provides all auth functionality
export const useAuth = () => {
  const { user, token, isAuthenticated } = useUserStore();
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();
  const userQuery = useCurrentUser();

  return {
    // State
    user,
    token,
    isAuthenticated,
    isLoading: userQuery.isLoading || loginMutation.isPending,
    isError:
      userQuery.isError || loginMutation.isError || registerMutation.isError,
    error: userQuery.error || loginMutation.error || registerMutation.error,

    // Actions
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,

    // Async actions (returns promises)
    loginAsync: loginMutation.mutateAsync,
    registerAsync: registerMutation.mutateAsync,
    logoutAsync: logoutMutation.mutateAsync,

    // Status flags
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
};
