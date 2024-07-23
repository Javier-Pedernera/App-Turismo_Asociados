import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../reducers/userReducer';
import { thunk } from 'redux-thunk';
import categoryReducer from '../reducers/categoryReducer';

const store = configureStore({
  reducer: {
    user: userReducer,
    categories: categoryReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;