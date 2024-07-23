import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserData } from '../types/types';
import { UserStorageData } from '../../utils/storage';

export interface UserState {
  userData: UserData | {};
  accessToken: string | null;
}

const initialState: UserState = {
  userData: {},
  accessToken: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginUser: (state, action: PayloadAction<{ token: string; user: UserData }>) => {
      const { token, user } = action.payload;
      state.userData = user;
      state.accessToken = token;
    },
    logOut: (state) => {
      state.userData = {};
      state.accessToken = null;
    },
    setUser: (state, action: PayloadAction<UserStorageData>) => {
      state.userData = action.payload;
    },
  }
});

export const { loginUser, logOut, setUser } = userSlice.actions;
export default userSlice.reducer;
