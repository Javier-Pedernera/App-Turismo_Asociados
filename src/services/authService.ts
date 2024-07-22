import axios from "axios";
import { LoginResponse, UserData } from "../redux/types/types";
import { clearUserData } from "../utils/storage";
import { logOut } from "../redux/reducers/userReducer";
import { Dispatch } from "@reduxjs/toolkit";

// Local
// const API_URL = 'http://192.168.100.4:5000';

// dev
const API_URL = 'https://app-turismo-backend.vercel.app';
  
  export const loginUserAuth = async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await axios.post<LoginResponse>(`${API_URL}/login`, { email, password });
      console.log(response.data);
      return response.data;
      
      
    } catch (error) {
      throw new Error('Login failed');
    }
  };
  
export const registerUser = async (userData: UserData) => {
  try {
    console.log("datos del formulario en el registro",userData);
    
    const response = await axios.post(`${API_URL}/signup`, userData);
    console.log("response del back",response);
    console.log(response.status);
    
    console.log("response.data del back",response.data);
    return response;
  } catch (error) {
    throw new Error('Registration failed'); // Manejar errores según corresponda
  }
};

export const logoutUser = () => {
  return async (dispatch: Dispatch) => {
    try {
      await clearUserData();
      dispatch(logOut());
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
};

export const sendPasswordResetEmail = async (email: string) => {
  try {
    console.log("envio email para recuperar contraseña");
    
    // const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
    // return response.data;
  } catch (error) {
    throw new Error('Error al enviar el correo de recuperación.');
  }
};

// Función para restablecer la contraseña
export const resetPassword = async (token: string, newPassword: string) => {
  console.log("envio contraseña para cambiar");

  // const response = await axios.post(`${API_URL}/auth/reset-password/${token}`, { password: newPassword });
  // return response.data;
};