import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {
  GET_LOCATIONS,
  GET_CLAN_RANKINGS,
  GET_PLAYER_RANKINGS,
  GET_CAPITAL_RANKINGS,
  GET_CLAN_BUILDER_RANKINGS,
  GET_PLAYER_BUILDER_RANKINGS,
} from '../../Config/Config';

// ========== ASYNC THUNKS ==========

// Fetch all locations
export const fetchLocations = createAsyncThunk(
  'rankings/fetchLocations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${GET_LOCATIONS}?limit=100`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: true, message: error.message });
    }
  }
);

// Fetch clan rankings for a location
export const fetchClanRankings = createAsyncThunk(
  'rankings/fetchClanRankings',
  async ({ locationId, limit = 100 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${GET_CLAN_RANKINGS(locationId)}?limit=${limit}`);
      return { locationId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: true, message: error.message });
    }
  }
);

// Fetch player rankings for a location
export const fetchPlayerRankings = createAsyncThunk(
  'rankings/fetchPlayerRankings',
  async ({ locationId, limit = 100 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${GET_PLAYER_RANKINGS(locationId)}?limit=${limit}`);
      return { locationId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: true, message: error.message });
    }
  }
);

// Fetch capital rankings for a location
export const fetchCapitalRankings = createAsyncThunk(
  'rankings/fetchCapitalRankings',
  async ({ locationId, limit = 100 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${GET_CAPITAL_RANKINGS(locationId)}?limit=${limit}`);
      return { locationId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: true, message: error.message });
    }
  }
);

// Fetch builder base clan rankings
export const fetchBuilderClanRankings = createAsyncThunk(
  'rankings/fetchBuilderClanRankings',
  async ({ locationId, limit = 100 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${GET_CLAN_BUILDER_RANKINGS(locationId)}?limit=${limit}`);
      return { locationId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: true, message: error.message });
    }
  }
);

// Fetch builder base player rankings
export const fetchBuilderPlayerRankings = createAsyncThunk(
  'rankings/fetchBuilderPlayerRankings',
  async ({ locationId, limit = 100 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${GET_PLAYER_BUILDER_RANKINGS(locationId)}?limit=${limit}`);
      return { locationId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: true, message: error.message });
    }
  }
);

// ========== INITIAL STATE ==========

const initialState = {
  // Locations list
  locations: null,
  locationsLoading: false,
  locationsError: null,

  // Current rankings data
  clanRankings: null,
  playerRankings: null,
  capitalRankings: null,
  builderClanRankings: null,
  builderPlayerRankings: null,

  // Current location for rankings
  currentLocationId: null,

  // Loading states
  loading: false,
  error: null,
};

// ========== SLICE ==========

const rankingsSlice = createSlice({
  name: 'rankings',
  initialState,
  reducers: {
    setCurrentLocation: (state, action) => {
      state.currentLocationId = action.payload;
    },
    clearRankings: (state) => {
      state.clanRankings = null;
      state.playerRankings = null;
      state.capitalRankings = null;
      state.builderClanRankings = null;
      state.builderPlayerRankings = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Locations
      .addCase(fetchLocations.pending, (state) => {
        state.locationsLoading = true;
        state.locationsError = null;
      })
      .addCase(fetchLocations.fulfilled, (state, action) => {
        state.locationsLoading = false;
        state.locations = action.payload;
      })
      .addCase(fetchLocations.rejected, (state, action) => {
        state.locationsLoading = false;
        state.locationsError = action.payload;
      })

      // Clan Rankings
      .addCase(fetchClanRankings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClanRankings.fulfilled, (state, action) => {
        state.loading = false;
        state.clanRankings = action.payload.data;
        state.currentLocationId = action.payload.locationId;
      })
      .addCase(fetchClanRankings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Player Rankings
      .addCase(fetchPlayerRankings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlayerRankings.fulfilled, (state, action) => {
        state.loading = false;
        state.playerRankings = action.payload.data;
        state.currentLocationId = action.payload.locationId;
      })
      .addCase(fetchPlayerRankings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Capital Rankings
      .addCase(fetchCapitalRankings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCapitalRankings.fulfilled, (state, action) => {
        state.loading = false;
        state.capitalRankings = action.payload.data;
        state.currentLocationId = action.payload.locationId;
      })
      .addCase(fetchCapitalRankings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Builder Clan Rankings
      .addCase(fetchBuilderClanRankings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBuilderClanRankings.fulfilled, (state, action) => {
        state.loading = false;
        state.builderClanRankings = action.payload.data;
        state.currentLocationId = action.payload.locationId;
      })
      .addCase(fetchBuilderClanRankings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Builder Player Rankings
      .addCase(fetchBuilderPlayerRankings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBuilderPlayerRankings.fulfilled, (state, action) => {
        state.loading = false;
        state.builderPlayerRankings = action.payload.data;
        state.currentLocationId = action.payload.locationId;
      })
      .addCase(fetchBuilderPlayerRankings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setCurrentLocation, clearRankings } = rankingsSlice.actions;

// ========== SELECTORS ==========
export const selectLocations = (state) => state.rankings.locations;
export const selectLocationsLoading = (state) => state.rankings.locationsLoading;
export const selectClanRankings = (state) => state.rankings.clanRankings;
export const selectPlayerRankings = (state) => state.rankings.playerRankings;
export const selectCapitalRankings = (state) => state.rankings.capitalRankings;
export const selectBuilderClanRankings = (state) => state.rankings.builderClanRankings;
export const selectBuilderPlayerRankings = (state) => state.rankings.builderPlayerRankings;
export const selectRankingsLoading = (state) => state.rankings.loading;
export const selectRankingsError = (state) => state.rankings.error;
export const selectCurrentLocationId = (state) => state.rankings.currentLocationId;

export default rankingsSlice.reducer;

