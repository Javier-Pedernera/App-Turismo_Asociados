import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Promotion } from '../types/types';

interface PromotionState {
  promotions: Promotion[];
}

const initialState: PromotionState = {
  promotions: [],
};

const promotionSlice = createSlice({
  name: 'promotions',
  initialState,
  reducers: {
    setPromotions: (state, action: PayloadAction<Promotion[]>) => {
      state.promotions = action.payload;
    },
    addPromotion: (state, action: PayloadAction<Promotion>) => {
      state.promotions.push(action.payload);
    },
    updatePromotion: (state, action: PayloadAction<Promotion>) => {
      const index = state.promotions.findIndex(promo => promo.promotion_id === action.payload.promotion_id);
      if (index !== -1) {
        state.promotions[index] = action.payload;
      }
    },
    deletePromotion: (state, action: PayloadAction<number>) => {
      state.promotions = state.promotions.filter(promo => promo.promotion_id !== action.payload);
    },
  },
});

export const { setPromotions, addPromotion, updatePromotion, deletePromotion } = promotionSlice.actions;
export default promotionSlice.reducer;

