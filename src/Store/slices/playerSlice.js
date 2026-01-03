import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { GET_PLAYER_INFO } from '../../Config/Config';

// Async thunk for fetching player data
export const fetchPlayer = createAsyncThunk(
  'player/fetchPlayer',
  async (playerTag, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${GET_PLAYER_INFO}?playerTag=${playerTag}`);
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ error: true, message: error.message });
    }
  }
);

const initialState = {
  // Current player being viewed (search results, player details page)
  currentPlayer: null,
  // My profile data (cached separately)
  myProfile: null,
  // Loading states
  loading: false,
  myProfileLoading: false,
  // Error states
  error: null,
  myProfileError: null,
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    clearCurrentPlayer: (state) => {
      state.currentPlayer = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setMyProfile: (state, action) => {
      state.myProfile = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch player
      .addCase(fetchPlayer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlayer.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPlayer = action.payload;
        state.error = null;
      })
      .addCase(fetchPlayer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { error: true, message: 'Failed to fetch player' };
        state.currentPlayer = null;
      });
  },
});

export const { clearCurrentPlayer, clearError, setMyProfile } = playerSlice.actions;

// Selectors
export const selectCurrentPlayer = (state) => state.player.currentPlayer;
export const selectMyProfile = (state) => state.player.myProfile;
export const selectPlayerLoading = (state) => state.player.loading;
export const selectPlayerError = (state) => state.player.error;

export default playerSlice.reducer;

