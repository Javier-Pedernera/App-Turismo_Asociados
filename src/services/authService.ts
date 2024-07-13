// import axios from "axios";
import { UserData } from "../redux/types/types";

const mockUser = [
    { username: 'javierpedernera@gmail.com', password: '123' },
    { username: 'pablocharras@gmail.com', password: '1234' }
  ];
  interface User {
    firstName: string;
    lastName: string;
    email: string;
    gender: string;
    password: string;
  }
  
  const mockUsers: User[] = [];

  interface LoginResponse {
    success: boolean;
    message: string;
  }
//   export const loginUser = async (username: string, password: string): Promise<LoginResponse> => {
//     try {
//       const response = await axios.post<LoginResponse>(`${API_URL}/login`, { username, password });
//       return response.data;
//     } catch (error) {
//       throw new Error('Login failed');
//     }
//   };
  export const login = async (username: string, password: string): Promise<LoginResponse> => {
    const user = mockUser.find(user => user.username === username && user.password === password);
    if (user) {
      return { success: true, message: 'Login successful' };
    } else {
      throw new Error('Invalid username or password');
    }
  };
  
  export const register = async (user: User) => {
    const userExists = mockUsers.some(existingUser => existingUser.email === user.email);
    if (userExists) {
      throw new Error('User already exists');
    } else {
      mockUsers.push(user);
      return { success: true, message: 'Registration successful' };
    }
  };

//   const API_URL = 'https://tu-backend-url.com/api'; // URL de tu backend

// export const registerUser = async (userData: UserData) => {
//   try {
//     const response = await axios.post(`${API_URL}/register`, userData);
//     return response.data;
//   } catch (error) {
//     throw new Error('Registration failed'); // Manejar errores según corresponda
//   }
// };
  