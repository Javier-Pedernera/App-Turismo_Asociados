// src/actions/promotionActions.ts
import { Dispatch } from 'redux';
import { Promotion } from '../types/types';
import { setPromotions, addPromotion, updatePromotion, deletePromotion } from '../reducers/promotionReducer';
import axios from 'axios';

// const API_URL = 'https://app-turismo-backend.vercel.app';
// const API_URL = 'http://192.168.100.4:5000';
const API_URL = process.env.EXPO_PUBLIC_API_URL;
export const fetchPromotions = () => {
    return async (dispatch: Dispatch) => {
      try {
        const response = await axios.get(`${API_URL}/promotions`);
        dispatch(setPromotions(response.data));
      } catch (error:any) {
        console.error('Error fetching promotions:', error.message);
        if (axios.isAxiosError(error)) {
          console.error('Axios error details:', error.toJSON());
        }
      }
    };
  };

export const createPromotion = (promotion: Promotion) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await axios.post(`${API_URL}/promotions`, promotion);
      dispatch(addPromotion(response.data));
    } catch (error) {
      console.error('Error creating promotion:', error);
    }
  };
};

export const modifyPromotion = (promotion: Promotion) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await axios.put(`${API_URL}/promotions/${promotion.promotion_id}`, promotion);
      dispatch(updatePromotion(response.data));
    } catch (error) {
      console.error('Error updating promotion:', error);
    }
  };
};

export const removePromotion = (promotion_id: number) => {
  return async (dispatch: Dispatch) => {
    try {
      await axios.delete(`${API_URL}/promotions/${promotion_id}`);
      dispatch(deletePromotion(promotion_id));
    } catch (error) {
      console.error('Error deleting promotion:', error);
    }
  };
};
