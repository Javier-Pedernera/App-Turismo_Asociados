import { Dispatch } from 'redux';
import { setBranches, clearBranches } from '../reducers/branchReducer';
import { RootState } from '../store/store';
import axios from 'axios';
import { Branch } from '../types/types';

// const API_URL = 'https://app-turismo-backend.vercel.app';
// const API_URL = 'http://192.168.100.4:5000';
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const fetchBranches = () => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    try {
      const state = getState();
      const token = state.user.accessToken;
      
      if (!token) {
        throw new Error('User not authenticated');
      }

      const response = await axios.get<Branch[]>(`${API_URL}/branches`);
      console.log(response);
      
      dispatch(setBranches(response.data));
    } catch (error) {
      throw error;
    }
  };
};

export const clearAllBranches = () => {
  return (dispatch: Dispatch) => {
    dispatch(clearBranches());
  };
};
