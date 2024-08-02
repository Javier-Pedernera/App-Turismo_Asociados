import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Branch } from '../types/types';

export interface BranchState {
  branches: Branch[] | null;
}

const initialState: BranchState = {
  branches: null,
};

const branchSlice = createSlice({
  name: 'branch',
  initialState,
  reducers: {
    setBranches: (state, action: PayloadAction<Branch[]>) => {
      return {
        ...state,
        branches: action.payload,
      };
    },
    clearBranches: (state) => {
      state.branches = null;
    },
  },
});

export const { setBranches, clearBranches } = branchSlice.actions;
export default branchSlice.reducer;
