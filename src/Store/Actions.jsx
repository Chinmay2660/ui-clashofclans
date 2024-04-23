import * as config from '../Config/Config'
import { createAsyncThunk } from "@reduxjs/toolkit";
import * as types from "./types"
import axios from 'axios';

export const getPlayerInfo = createAsyncThunk(
    types.GET_PLAYER_INFO,
    async (playerTag, { rejectWithValue }) => {
        let apiUrl = `${config.GET_PLAYER_INFO}?playerTag=${playerTag}`;
        try {
            const response = await axios.get(apiUrl);
            return response.data;
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

export const getClanInfo = createAsyncThunk(
    types.GET_CLAN_INFO,
    async (clanTag, { rejectWithValue }) => {
        let apiUrl = `${config.GET_CLAN_INFO}?clanTag=${clanTag}`;
        try {
            const response = await axios.get(apiUrl);
            return response.data;
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

export const setIsClanSearch = (payload) => ({
    type: types.SET_CLAN_SEARCH,
    payload: payload,
});