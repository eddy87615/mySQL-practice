import axios from "axios";

const API_URL = "http://localhost:5001/api/auth";

interface AuthResponse {
  message: string;
  token?: string;
  user?: {
    id: number;
    username: string;
    email: string;
  };
}

export const register = async (
  username: string,
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(`${API_URL}/register`, {
    username,
    email,
    password,
  });
  return response.data;
};

export const login = async (
  username: string,
  password: string
): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(`${API_URL}/login`, {
    username,
    password,
  });
  return response.data;
};
