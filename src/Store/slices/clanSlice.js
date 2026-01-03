import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { 
  GET_CLAN_INFO, 
  SEARCH_CLANS,
  GET_CLAN_WAR_INFO, 
  GET_CLAN_CURRENT_WAR_INFO,
  GET_CLAN_CAPITAL_RAID_SEASONS_INFO,
  GET_CLAN_CURRENT_WAR_LEAGUE_GROUP_INFO,
} from '../../Config/Config';

// Async thunk for fetching clan data
export const fetchClan = createAsyncThunk(
  'clan/fetchClan',
  async (clanTag, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${GET_CLAN_INFO}?clanTag=${clanTag}`);
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ error: true, message: error.message });
    }
  }
);

// Async thunk for searching clans by name and filters
export const searchClans = createAsyncThunk(
  'clan/searchClans',
  async (searchParams, { rejectWithValue }) => {
    try {
      // Build query string from params
      const params = new URLSearchParams();
      
      if (searchParams.name) params.append('name', searchParams.name);
      if (searchParams.warFrequency) params.append('warFrequency', searchParams.warFrequency);
      if (searchParams.locationId) params.append('locationId', searchParams.locationId);
      if (searchParams.minMembers) params.append('minMembers', searchParams.minMembers);
      if (searchParams.maxMembers) params.append('maxMembers', searchParams.maxMembers);
      if (searchParams.minClanPoints) params.append('minClanPoints', searchParams.minClanPoints);
      if (searchParams.minClanLevel) params.append('minClanLevel', searchParams.minClanLevel);
      if (searchParams.labelIds) params.append('labelIds', searchParams.labelIds);
      if (searchParams.limit) params.append('limit', searchParams.limit);
      
      const response = await axios.get(`${SEARCH_CLANS}?${params.toString()}`);
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ error: true, message: error.message });
    }
  }
);

// Async thunk for fetching war log
export const fetchWarLog = createAsyncThunk(
  'clan/fetchWarLog',
  async (clanTag, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${GET_CLAN_WAR_INFO}?clanTag=${clanTag}`);
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ error: true, message: error.message });
    }
  }
);

// Async thunk for fetching current war
export const fetchCurrentWar = createAsyncThunk(
  'clan/fetchCurrentWar',
  async (clanTag, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${GET_CLAN_CURRENT_WAR_INFO}?clanTag=${clanTag}`);
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ error: true, message: error.message });
    }
  }
);

// Async thunk for fetching capital raid seasons
export const fetchCapitalRaidSeasons = createAsyncThunk(
  'clan/fetchCapitalRaidSeasons',
  async (clanTag, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${GET_CLAN_CAPITAL_RAID_SEASONS_INFO}?clanTag=${clanTag}`);
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ error: true, message: error.message });
    }
  }
);

// Async thunk for fetching CWL group
export const fetchCWLGroup = createAsyncThunk(
  'clan/fetchCWLGroup',
  async (clanTag, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${GET_CLAN_CURRENT_WAR_LEAGUE_GROUP_INFO}?clanTag=${clanTag}`);
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
  // Current clan being viewed
  currentClan: null,
  // Clan search results
  searchResults: null,
  searchLoading: false,
  searchError: null,
  // War log
  warLog: null,
  warLogLoading: false,
  warLogError: null,
  // Current war
  currentWar: null,
  currentWarLoading: false,
  currentWarError: null,
  // Capital raid seasons
  capitalRaidSeasons: null,
  capitalRaidLoading: false,
  capitalRaidError: null,
  // CWL Group
  cwlGroup: null,
  cwlLoading: false,
  cwlError: null,
  // Loading states
  loading: false,
  // Error states
  error: null,
};

const clanSlice = createSlice({
  name: 'clan',
  initialState,
  reducers: {
    clearCurrentClan: (state) => {
      state.currentClan = null;
      state.error = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = null;
      state.searchError = null;
    },
    clearWarLog: (state) => {
      state.warLog = null;
      state.warLogError = null;
    },
    clearCurrentWar: (state) => {
      state.currentWar = null;
      state.currentWarError = null;
    },
    clearCapitalRaids: (state) => {
      state.capitalRaidSeasons = null;
      state.capitalRaidError = null;
    },
    clearCWL: (state) => {
      state.cwlGroup = null;
      state.cwlError = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch clan
      .addCase(fetchClan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClan.fulfilled, (state, action) => {
        state.loading = false;
        state.currentClan = action.payload;
        state.error = null;
      })
      .addCase(fetchClan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { error: true, message: 'Failed to fetch clan' };
        state.currentClan = null;
      })
      // Search clans
      .addCase(searchClans.pending, (state) => {
        state.searchLoading = true;
        state.searchError = null;
      })
      .addCase(searchClans.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload;
        state.searchError = null;
      })
      .addCase(searchClans.rejected, (state, action) => {
        state.searchLoading = false;
        state.searchError = action.payload || { error: true, message: 'Failed to search clans' };
        state.searchResults = null;
      })
      // Fetch war log
      .addCase(fetchWarLog.pending, (state) => {
        state.warLogLoading = true;
        state.warLogError = null;
      })
      .addCase(fetchWarLog.fulfilled, (state, action) => {
        state.warLogLoading = false;
        state.warLog = action.payload;
        state.warLogError = null;
      })
      .addCase(fetchWarLog.rejected, (state, action) => {
        state.warLogLoading = false;
        state.warLogError = action.payload || { error: true, message: 'War log is private or unavailable' };
        state.warLog = null;
      })
      // Fetch current war
      .addCase(fetchCurrentWar.pending, (state) => {
        state.currentWarLoading = true;
        state.currentWarError = null;
      })
      .addCase(fetchCurrentWar.fulfilled, (state, action) => {
        state.currentWarLoading = false;
        state.currentWar = action.payload;
        state.currentWarError = null;
      })
      .addCase(fetchCurrentWar.rejected, (state, action) => {
        state.currentWarLoading = false;
        state.currentWarError = action.payload || { error: true, message: 'War info unavailable' };
        state.currentWar = null;
      })
      // Fetch capital raid seasons
      .addCase(fetchCapitalRaidSeasons.pending, (state) => {
        state.capitalRaidLoading = true;
        state.capitalRaidError = null;
      })
      .addCase(fetchCapitalRaidSeasons.fulfilled, (state, action) => {
        state.capitalRaidLoading = false;
        state.capitalRaidSeasons = action.payload;
        state.capitalRaidError = null;
      })
      .addCase(fetchCapitalRaidSeasons.rejected, (state, action) => {
        state.capitalRaidLoading = false;
        state.capitalRaidError = action.payload || { error: true, message: 'Capital raids unavailable' };
        state.capitalRaidSeasons = null;
      })
      // Fetch CWL group
      .addCase(fetchCWLGroup.pending, (state) => {
        state.cwlLoading = true;
        state.cwlError = null;
      })
      .addCase(fetchCWLGroup.fulfilled, (state, action) => {
        state.cwlLoading = false;
        state.cwlGroup = action.payload;
        state.cwlError = null;
      })
      .addCase(fetchCWLGroup.rejected, (state, action) => {
        state.cwlLoading = false;
        state.cwlError = action.payload || { error: true, message: 'CWL info unavailable' };
        state.cwlGroup = null;
      });
  },
});

export const { 
  clearCurrentClan, 
  clearSearchResults,
  clearWarLog, 
  clearCurrentWar, 
  clearCapitalRaids,
  clearCWL,
  clearError 
} = clanSlice.actions;

// Selectors
export const selectCurrentClan = (state) => state.clan.currentClan;
export const selectClanLoading = (state) => state.clan.loading;
export const selectClanError = (state) => state.clan.error;
// Search selectors
export const selectSearchResults = (state) => state.clan.searchResults;
export const selectSearchLoading = (state) => state.clan.searchLoading;
export const selectSearchError = (state) => state.clan.searchError;
// War log selectors
export const selectWarLog = (state) => state.clan.warLog;
export const selectWarLogLoading = (state) => state.clan.warLogLoading;
export const selectWarLogError = (state) => state.clan.warLogError;
// Current war selectors
export const selectCurrentWar = (state) => state.clan.currentWar;
export const selectCurrentWarLoading = (state) => state.clan.currentWarLoading;
export const selectCurrentWarError = (state) => state.clan.currentWarError;
// Capital raid selectors
export const selectCapitalRaidSeasons = (state) => state.clan.capitalRaidSeasons;
export const selectCapitalRaidLoading = (state) => state.clan.capitalRaidLoading;
export const selectCapitalRaidError = (state) => state.clan.capitalRaidError;
// CWL selectors
export const selectCWLGroup = (state) => state.clan.cwlGroup;
export const selectCWLLoading = (state) => state.clan.cwlLoading;
export const selectCWLError = (state) => state.clan.cwlError;

export default clanSlice.reducer;
