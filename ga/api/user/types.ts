export interface LoginRequest {
  login: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface JwtToken {
  token: string;
  type: string;
  expires: string;
}

export interface RegisterResponse {
  status: string;
  message: string;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
}
