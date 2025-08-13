export interface User {
  id: number;
  username: string;
  email: string;
}

export interface UserLogin {
  username: string;
  email: string;
  password: string;
}
