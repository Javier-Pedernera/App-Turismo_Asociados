import { createSelector } from 'reselect';
import { RootState } from '../store/store';
import { Branch, Rating } from '../types/types';

const getBranches = (state: RootState) => state.branch.branches;
const getBranchRatingsState = (state: RootState) => state.branch.branchRatings;

export const getMemoizedBranches = createSelector(
  [getBranches],
  (branches: Branch[] | null) => branches || []
);

export const getMemoizedBranchRatings = createSelector(
  [getBranchRatingsState],
  (branchRatings) => branchRatings
);
