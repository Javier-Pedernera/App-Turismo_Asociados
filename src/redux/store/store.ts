import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../reducers/userReducer';
import categoryReducer from '../reducers/categoryReducer';
import promotionReducer from '../reducers/promotionReducer';
import branchReducer from '../reducers/branchReducer';
import touristPointReducer from '../reducers/touristPointReducer';

const store = configureStore({
  reducer: {
    user: userReducer,
    categories: categoryReducer,
    promotions: promotionReducer,
    branch: branchReducer,
    touristPoints: touristPointReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;