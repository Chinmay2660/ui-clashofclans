import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isClanSearch: false,
  globalLoader: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSearchMode: (state, action) => {
      state.isClanSearch = action.payload;
    },
    toggleSearchMode: (state) => {
      state.isClanSearch = !state.isClanSearch;
    },
    showGlobalLoader: (state) => {
      state.globalLoader = true;
    },
    hideGlobalLoader: (state) => {
      state.globalLoader = false;
    },
  },
});

export const { 
  setSearchMode, 
  toggleSearchMode, 
  showGlobalLoader, 
  hideGlobalLoader 
} = uiSlice.actions;

// Selectors
export const selectIsClanSearch = (state) => state.ui.isClanSearch;
export const selectGlobalLoader = (state) => state.ui.globalLoader;

export default uiSlice.reducer;

