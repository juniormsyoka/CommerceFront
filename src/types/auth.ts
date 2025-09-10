export interface RegisterDto {
  username: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  token?: string;
  userId?: string;
  message?: string;
}
