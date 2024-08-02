import { createSelector } from 'reselect';
import { RootState } from '../store/store';
import { Branch } from '../types/types';

const getBranches = (state: RootState) => state.branch.branches;

export const getMemoizedBranches = createSelector(
  [getBranches],
  (branches: Branch[] | null) => branches || []
);
