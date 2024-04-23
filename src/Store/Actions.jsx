import * as config from '../Config/Config'
import { createAsyncThunk } from "@reduxjs/toolkit";
import * as types from "./types"
import axios from 'axios';

export const getPlayerInfo = createAsyncThunk(
    types.GET_PLAYER_INFO,
    async (_, { rejectWithValue }) => {
        let apiUrl = `${config.GET_PLAYER_INFO}?playerTag=29PUGJQ9P`;
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