import { getApiUrl } from "../api";
import {
  LoginRequest,
  RegisterRequest,
  JwtToken,
  RegisterResponse,
  UserResponse,
} from "./types";

/**
 * Login user with email/username and password
 */
export const loginUser = async (loginData: LoginRequest): Promise<JwtToken> => {
  const response = await fetch(`${getApiUrl()}/api/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to login");
  }

  return response.json();
};

/**
 * Register a new user
 */
export const registerUser = async (
  registerData: RegisterRequest,
): Promise<RegisterResponse> => {
  const response = await fetch(`${getApiUrl()}/api/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(registerData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to register");
  }

  return response.json();
};

/**
 * Get current user information using JWT token
 */
export const getCurrentUser = async (token: string): Promise<UserResponse> => {
  const response = await fetch(`${getApiUrl()}/api/users/user`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to get user");
  }

  return response.json();
};
