import { Dispatch } from 'redux';
import { UserActionTypes, UserData } from '../types/types'; 
import { loginUser, logOut, setUser } from '../reducers/userReducer';
import { loginUserAuth } from '../../services/authService';
import { RootState } from '../store/store';
import axios from 'axios';


const API_URL = 'https://app-turismo-backend.vercel.app';
// const API_URL = 'http://192.168.100.4:5000';

// Acción asíncrona para realizar el login
export const userLogIn = (email: string, password: string) => {
  return async (dispatch: Dispatch) => {
    try {
      const data = await loginUserAuth(email, password);
      dispatch(loginUser(data));
      return data;
    } catch (error) {
      throw error;
    }
  };
};

export const logOutUser = () => {
  return (dispatch: Dispatch) => {
    dispatch(logOut());
  };
};

export const updateUserAction = (updatedUserData: UserData) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    try {
      const state = getState();
      const token = state.user.accessToken;

      if (!token) {
        throw new Error('User not authenticated');
      }
      const { user_id, ...dataToSend } = updatedUserData;

      const response = await axios.put(`${API_URL}/user/${user_id}`, dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log("respuesta del backend",response.status);
      dispatch(setUser(response.data));
      return response;
    } catch (error) {
      throw error;
    }
  };
};