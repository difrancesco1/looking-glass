import { UserResponse } from "./types";

export const getApiUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;

  if (envUrl) {
    return envUrl;
  }

  if (process.env.NODE_ENV === "development") {
    return "http://localhost:8080";
  }

  return "https://grand-archive-looking-glass.vercel.app";
};

// Utility function to check if user is logged in and redirect if not
export const getToken = (): string | null => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    return null;
  }

  return token;
};

// Utility function to handle unauthorized responses
export const handleUnauthorizedResponse = (response: Response): boolean => {
  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem("access_token");
    return true;
  }
  return false;
};

// Utility function to get auth headers
export const getAuthHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
});

export const fetchUser = async (): Promise<UserResponse | null> => {
  const token = getToken();
  if (!token) return null;

  const response = await fetch(`${getApiUrl()}/users/user`, {
    method: "GET",
    headers: getAuthHeaders(token),
  });

  if (response.ok) {
    const userData: UserResponse = await response.json();
    return userData;
  }

  if (handleUnauthorizedResponse(response)) {
    return null;
  }

  throw new Error(`Failed to fetch user: ${response.status}`);
};
