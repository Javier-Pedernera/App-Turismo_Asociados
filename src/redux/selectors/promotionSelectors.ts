import { createSelector } from 'reselect';
import { RootState } from '../store/store';
import { Promotion } from '../types/types';

const getPromotions = (state: RootState) => state.promotions.promotions;

export const getMemoizedPromotions = createSelector(
  [getPromotions],
  (promotions: Promotion[]) => {
    return promotions.slice();
  }
);