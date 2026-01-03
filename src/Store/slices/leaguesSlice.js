import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {
  GET_LEAGUES,
  GET_LEAGUE_SEASONS,
  GET_LEAGUE_SEASON_RANKINGS,
  GET_WAR_LEAGUES,
  GET_CAPITAL_LEAGUES,
  GET_BUILDER_BASE_LEAGUES,
  GET_PLAYER_LABELS,
  GET_CLAN_LABELS,
  GET_GOLDPASS_CURRENT,
} from '../../Config/Config';

// ========== ASYNC THUNKS ==========

// Fetch all regular leagues
export const fetchLeagues = createAsyncThunk(
  'leagues/fetchLeagues',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(GET_LEAGUES);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: true, message: error.message });
    }
  }
);

// Fetch all war leagues
export const fetchWarLeagues = createAsyncThunk(
  'leagues/fetchWarLeagues',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(GET_WAR_LEAGUES);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: true, message: error.message });
    }
  }
);

// Fetch all capital leagues
export const fetchCapitalLeagues = createAsyncThunk(
  'leagues/fetchCapitalLeagues',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(GET_CAPITAL_LEAGUES);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: true, message: error.message });
    }
  }
);

// Fetch all builder base leagues
export const fetchBuilderBaseLeagues = createAsyncThunk(
  'leagues/fetchBuilderBaseLeagues',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(GET_BUILDER_BASE_LEAGUES);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: true, message: error.message });
    }
  }
);

// Fetch legend league seasons
export const fetchLeagueSeasons = createAsyncThunk(
  'leagues/fetchLeagueSeasons',
  async (leagueId, { rejectWithValue }) => {
    try {
      const response = await axios.get(GET_LEAGUE_SEASONS(leagueId));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: true, message: error.message });
    }
  }
);

// Fetch legend league season rankings
export const fetchSeasonRankings = createAsyncThunk(
  'leagues/fetchSeasonRankings',
  async ({ leagueId, seasonId, limit = 200 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${GET_LEAGUE_SEASON_RANKINGS(leagueId, seasonId)}?limit=${limit}`);
      return { seasonId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: true, message: error.message });
    }
  }
);

// Fetch player labels
export const fetchPlayerLabels = createAsyncThunk(
  'leagues/fetchPlayerLabels',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(GET_PLAYER_LABELS);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: true, message: error.message });
    }
  }
);

// Fetch clan labels
export const fetchClanLabels = createAsyncThunk(
  'leagues/fetchClanLabels',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(GET_CLAN_LABELS);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: true, message: error.message });
    }
  }
);

// Fetch current gold pass season
export const fetchGoldPass = createAsyncThunk(
  'leagues/fetchGoldPass',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(GET_GOLDPASS_CURRENT);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: true, message: error.message });
    }
  }
);

// ========== INITIAL STATE ==========

const initialState = {
  // League lists
  leagues: null,
  warLeagues: null,
  capitalLeagues: null,
  builderBaseLeagues: null,

  // Legend league seasons
  legendSeasons: null,
  seasonRankings: null,
  currentSeasonId: null,

  // Labels
  playerLabels: null,
  clanLabels: null,

  // Gold Pass
  goldPass: null,

  // Loading states
  loading: false,
  error: null,
};

// ========== SLICE ==========

const leaguesSlice = createSlice({
  name: 'leagues',
  initialState,
  reducers: {
    setCurrentSeason: (state, action) => {
      state.currentSeasonId = action.payload;
    },
    clearSeasonRankings: (state) => {
      state.seasonRankings = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Regular Leagues
      .addCase(fetchLeagues.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLeagues.fulfilled, (state, action) => {
        state.loading = false;
        state.leagues = action.payload;
      })
      .addCase(fetchLeagues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // War Leagues
      .addCase(fetchWarLeagues.fulfilled, (state, action) => {
        state.warLeagues = action.payload;
      })

      // Capital Leagues
      .addCase(fetchCapitalLeagues.fulfilled, (state, action) => {
        state.capitalLeagues = action.payload;
      })

      // Builder Base Leagues
      .addCase(fetchBuilderBaseLeagues.fulfilled, (state, action) => {
        state.builderBaseLeagues = action.payload;
      })

      // Legend Seasons
      .addCase(fetchLeagueSeasons.fulfilled, (state, action) => {
        state.legendSeasons = action.payload;
      })

      // Season Rankings
      .addCase(fetchSeasonRankings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSeasonRankings.fulfilled, (state, action) => {
        state.loading = false;
        state.seasonRankings = action.payload.data;
        state.currentSeasonId = action.payload.seasonId;
      })
      .addCase(fetchSeasonRankings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Player Labels
      .addCase(fetchPlayerLabels.fulfilled, (state, action) => {
        state.playerLabels = action.payload;
      })

      // Clan Labels
      .addCase(fetchClanLabels.fulfilled, (state, action) => {
        state.clanLabels = action.payload;
      })

      // Gold Pass
      .addCase(fetchGoldPass.fulfilled, (state, action) => {
        state.goldPass = action.payload;
      });
  },
});

export const { setCurrentSeason, clearSeasonRankings } = leaguesSlice.actions;

// ========== SELECTORS ==========
export const selectLeagues = (state) => state.leagues.leagues;
export const selectWarLeagues = (state) => state.leagues.warLeagues;
export const selectCapitalLeagues = (state) => state.leagues.capitalLeagues;
export const selectBuilderBaseLeagues = (state) => state.leagues.builderBaseLeagues;
export const selectLegendSeasons = (state) => state.leagues.legendSeasons;
export const selectSeasonRankings = (state) => state.leagues.seasonRankings;
export const selectPlayerLabels = (state) => state.leagues.playerLabels;
export const selectClanLabels = (state) => state.leagues.clanLabels;
export const selectGoldPass = (state) => state.leagues.goldPass;
export const selectLeaguesLoading = (state) => state.leagues.loading;
export const selectLeaguesError = (state) => state.leagues.error;

export default leaguesSlice.reducer;

