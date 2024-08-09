import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store/store';

export const selectTouristPoints = (state: RootState) => state.touristPoints.touristPoints;

export const getMemoizedTouristPoints = createSelector(
  [selectTouristPoints],
  (touristPoints) => touristPoints
);

export const selectRatings = (state: RootState) => state.touristPoints.ratings;

export const getMemoizedRatings = createSelector(
  [selectRatings],
  (ratings) => ratings
);