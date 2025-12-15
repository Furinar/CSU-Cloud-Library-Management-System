export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  userInfo: {
    id: string;
    username: string;
    email: string;
    role: string;
  }
}

export interface RegisterDTO {
  username: string;
  password: string;
  email: string;
}

export interface LoginDTO {
  username: string;
  password: string;
}
