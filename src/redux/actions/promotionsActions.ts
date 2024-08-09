// src/actions/promotionActions.ts
import { Dispatch } from 'redux';
import axios from 'axios';
import { setPromotions, setPromotionsError } from '../reducers/promotionReducer';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const fetchPromotions = () => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await axios.get(`${API_URL}/promotions`);
      dispatch(setPromotions(response.data));
    } catch (firstError: any) {
      console.error('First attempt to fetch promotions failed:', firstError.message);
      if (axios.isAxiosError(firstError)) {
        console.error('Axios error details:', firstError.toJSON());
      }

      // Pequeño retraso antes del segundo intento
      await new Promise(resolve => setTimeout(resolve, 3000));

      try {
        const retryResponse = await axios.get(`${API_URL}/promotions`);
        dispatch(setPromotions(retryResponse.data));
      } catch (secondError: any) {
        console.error('Second attempt to fetch promotions failed:', secondError.message);
        if (axios.isAxiosError(secondError)) {
          console.error('Axios error details:', secondError.toJSON());
        }

        // Dispatch an error action or handle the error as needed
        dispatch(setPromotionsError('Failed to fetch promotions after retry.'));
      }
    }
  };
};



// export const createPromotion = (promotion: Promotion) => {
//   return async (dispatch: Dispatch) => {
//     try {
//       const response = await axios.post(`${API_URL}/promotions`, promotion);
//       dispatch(addPromotion(response.data));
//     } catch (error) {
//       console.error('Error creating promotion:', error);
//     }
//   };
// };

// export const modifyPromotion = (promotion: Promotion) => {
//   return async (dispatch: Dispatch) => {
//     try {
//       const response = await axios.put(`${API_URL}/promotions/${promotion.promotion_id}`, promotion);
//       dispatch(updatePromotion(response.data));
//     } catch (error) {
//       console.error('Error updating promotion:', error);
//     }
//   };
// };

// export const removePromotion = (promotion_id: number) => {
//   return async (dispatch: Dispatch) => {
//     try {
//       await axios.delete(`${API_URL}/promotions/${promotion_id}`);
//       dispatch(deletePromotion(promotion_id));
//     } catch (error) {
//       console.error('Error deleting promotion:', error);
//     }
//   };
// };
