import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {
  GET_LOCATIONS,
  GET_CLAN_RANKINGS,
  GET_PLAYER_RANKINGS,
  GET_CLAN_BUILDER_RANKINGS,
  GET_PLAYER_BUILDER_RANKINGS,
  GET_CAPITAL_RANKINGS,
} from '../../Config/Config';

// ========== ASYNC THUNKS ==========

// Fetch all locations
export const fetchLocations = createAsyncThunk(
  'rankings/fetchLocations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(GET_LOCATIONS);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Fetch player rankings
export const fetchPlayerRankings = createAsyncThunk(
  'rankings/fetchPlayerRankings',
  async ({ locationId = 'global', limit = 200 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${GET_PLAYER_RANKINGS(locationId)}?limit=${limit}`);
      return { data: response.data, locationId };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Fetch clan rankings
export const fetchClanRankings = createAsyncThunk(
  'rankings/fetchClanRankings',
  async ({ locationId = 'global', limit = 200 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${GET_CLAN_RANKINGS(locationId)}?limit=${limit}`);
      return { data: response.data, locationId };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Fetch player builder base rankings
export const fetchBuilderPlayerRankings = createAsyncThunk(
  'rankings/fetchBuilderPlayerRankings',
  async ({ locationId = 'global', limit = 200 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${GET_PLAYER_BUILDER_RANKINGS(locationId)}?limit=${limit}`);
      return { data: response.data, locationId };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Fetch clan builder base rankings
export const fetchBuilderClanRankings = createAsyncThunk(
  'rankings/fetchBuilderClanRankings',
  async ({ locationId = 'global', limit = 200 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${GET_CLAN_BUILDER_RANKINGS(locationId)}?limit=${limit}`);
      return { data: response.data, locationId };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Fetch capital rankings
export const fetchCapitalRankings = createAsyncThunk(
  'rankings/fetchCapitalRankings',
  async ({ locationId = 'global', limit = 200 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${GET_CAPITAL_RANKINGS(locationId)}?limit=${limit}`);
      return { data: response.data, locationId };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ========== INITIAL STATE ==========
const initialState = {
  // Locations
  locations: [],
  locationsLoading: false,
  locationsError: null,
  currentLocationId: 'global',
  
  // Player Rankings (Trophies)
  playerRankings: [],
  playerRankingsLoading: false,
  playerRankingsError: null,
  
  // Clan Rankings (Trophies)
  clanRankings: [],
  clanRankingsLoading: false,
  clanRankingsError: null,
  
  // Player Builder Base Rankings
  builderPlayerRankings: [],
  builderPlayerRankingsLoading: false,
  builderPlayerRankingsError: null,
  
  // Clan Builder Base Rankings
  builderClanRankings: [],
  builderClanRankingsLoading: false,
  builderClanRankingsError: null,
  
  // Capital Rankings
  capitalRankings: [],
  capitalRankingsLoading: false,
  capitalRankingsError: null,
  
  // General loading/error
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
      state.playerRankings = [];
      state.clanRankings = [];
      state.builderPlayerRankings = [];
      state.builderClanRankings = [];
      state.capitalRankings = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Locations
    builder
      .addCase(fetchLocations.pending, (state) => {
        state.locationsLoading = true;
        state.locationsError = null;
      })
      .addCase(fetchLocations.fulfilled, (state, action) => {
        state.locationsLoading = false;
        state.locations = action.payload.items || action.payload || [];
      })
      .addCase(fetchLocations.rejected, (state, action) => {
        state.locationsLoading = false;
        state.locationsError = action.payload;
      });

    // Player Rankings
    builder
      .addCase(fetchPlayerRankings.pending, (state) => {
        state.playerRankingsLoading = true;
        state.loading = true;
        state.playerRankingsError = null;
      })
      .addCase(fetchPlayerRankings.fulfilled, (state, action) => {
        state.playerRankingsLoading = false;
        state.loading = false;
        state.playerRankings = action.payload.data.items || action.payload.data || [];
        state.currentLocationId = action.payload.locationId;
      })
      .addCase(fetchPlayerRankings.rejected, (state, action) => {
        state.playerRankingsLoading = false;
        state.loading = false;
        state.playerRankingsError = action.payload;
        state.error = action.payload;
      });

    // Clan Rankings
    builder
      .addCase(fetchClanRankings.pending, (state) => {
        state.clanRankingsLoading = true;
        state.loading = true;
        state.clanRankingsError = null;
      })
      .addCase(fetchClanRankings.fulfilled, (state, action) => {
        state.clanRankingsLoading = false;
        state.loading = false;
        state.clanRankings = action.payload.data.items || action.payload.data || [];
        state.currentLocationId = action.payload.locationId;
      })
      .addCase(fetchClanRankings.rejected, (state, action) => {
        state.clanRankingsLoading = false;
        state.loading = false;
        state.clanRankingsError = action.payload;
        state.error = action.payload;
      });

    // Builder Player Rankings
    builder
      .addCase(fetchBuilderPlayerRankings.pending, (state) => {
        state.builderPlayerRankingsLoading = true;
        state.loading = true;
        state.builderPlayerRankingsError = null;
      })
      .addCase(fetchBuilderPlayerRankings.fulfilled, (state, action) => {
        state.builderPlayerRankingsLoading = false;
        state.loading = false;
        state.builderPlayerRankings = action.payload.data.items || action.payload.data || [];
      })
      .addCase(fetchBuilderPlayerRankings.rejected, (state, action) => {
        state.builderPlayerRankingsLoading = false;
        state.loading = false;
        state.builderPlayerRankingsError = action.payload;
        state.error = action.payload;
      });

    // Builder Clan Rankings
    builder
      .addCase(fetchBuilderClanRankings.pending, (state) => {
        state.builderClanRankingsLoading = true;
        state.loading = true;
        state.builderClanRankingsError = null;
      })
      .addCase(fetchBuilderClanRankings.fulfilled, (state, action) => {
        state.builderClanRankingsLoading = false;
        state.loading = false;
        state.builderClanRankings = action.payload.data.items || action.payload.data || [];
      })
      .addCase(fetchBuilderClanRankings.rejected, (state, action) => {
        state.builderClanRankingsLoading = false;
        state.loading = false;
        state.builderClanRankingsError = action.payload;
        state.error = action.payload;
      });

    // Capital Rankings
    builder
      .addCase(fetchCapitalRankings.pending, (state) => {
        state.capitalRankingsLoading = true;
        state.loading = true;
        state.capitalRankingsError = null;
      })
      .addCase(fetchCapitalRankings.fulfilled, (state, action) => {
        state.capitalRankingsLoading = false;
        state.loading = false;
        state.capitalRankings = action.payload.data.items || action.payload.data || [];
      })
      .addCase(fetchCapitalRankings.rejected, (state, action) => {
        state.capitalRankingsLoading = false;
        state.loading = false;
        state.capitalRankingsError = action.payload;
        state.error = action.payload;
      });
  },
});

// ========== EXPORTS ==========
export const { setCurrentLocation, clearRankings } = rankingsSlice.actions;

// Selectors
export const selectLocations = (state) => state.rankings.locations;
export const selectLocationsLoading = (state) => state.rankings.locationsLoading;
export const selectCurrentLocationId = (state) => state.rankings.currentLocationId;

export const selectPlayerRankings = (state) => state.rankings.playerRankings;
export const selectClanRankings = (state) => state.rankings.clanRankings;
export const selectBuilderPlayerRankings = (state) => state.rankings.builderPlayerRankings;
export const selectBuilderClanRankings = (state) => state.rankings.builderClanRankings;
export const selectCapitalRankings = (state) => state.rankings.capitalRankings;

export const selectRankingsLoading = (state) => state.rankings.loading;
export const selectRankingsError = (state) => state.rankings.error;

export default rankingsSlice.reducer;
