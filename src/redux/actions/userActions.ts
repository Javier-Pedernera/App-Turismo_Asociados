import { Dispatch } from 'redux';
import { UserActionTypes, UserData } from '../types/types'; 
import { loginUser, logOut, setUser } from '../reducers/userReducer';
import { loginUserAuth } from '../../services/authService';
import { RootState } from '../store/store';
import axios from 'axios';


const API_URL = 'http://192.168.100.4:5000';

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
      console.log("respuesta del backend",response.data);
      dispatch(setUser(response.data));
      return response;
    } catch (error) {
      throw error;
    }
  };
};
// export const registerUser = (userData: any) => async (dispatch: Dispatch) => {
//   try {
//     const response = await register(userData);

//     dispatch({
//       type: UserActionTypes.REGISTER_SUCCESS,
//       payload: response, 
//     });

//     return response;
//   } catch (error:any) {
//     dispatch({
//       type: UserActionTypes.REGISTER_FAILURE,
//       payload: error.message, 
//     });
//     throw error;
//   }
// };
// export const updateUserAction = (userData: any) => async (dispatch: Dispatch) => {
//   try {
//     // llamada a la API para actualizar los datos del usuario
//     // const response = await api.updateUser(userData);

//     dispatch(updateUser(userData));
//     return { success: true, message: 'Profile updated successfully' };
//   } catch (error) {
//     console.error(error);
//     return { success: false, message: 'Error updating profile' };
//   }
// };