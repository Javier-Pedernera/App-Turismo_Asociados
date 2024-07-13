import { Dispatch } from 'redux';
import { login, register } from '../../services/authService'; 
import { UserActionTypes } from '../types/types'; 

// Acción asíncrona para realizar el login
export const loginUser = (username: string, password: string) => async (dispatch: Dispatch) => {
  try {
    const response = await login(username, password);
    console.log("respuesta del login",response);
    
    dispatch({
      type: UserActionTypes.LOGIN_SUCCESS,
      payload: response,
    });

    return response;
  } catch (error:any) {
    dispatch({
      type: UserActionTypes.LOGIN_FAILURE,
      payload: error.message,
    });
    throw error;
  }
};

export const registerUser = (userData: any) => async (dispatch: Dispatch) => {
  try {
    const response = await register(userData);

    dispatch({
      type: UserActionTypes.REGISTER_SUCCESS,
      payload: response, 
    });

    return response;
  } catch (error:any) {
    dispatch({
      type: UserActionTypes.REGISTER_FAILURE,
      payload: error.message, // Opcional: puedes manejar errores de registro aquí
    });
    throw error; // Propaga el error para manejarlo en el componente que llama a esta acción
  }
};