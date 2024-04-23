import * as types from "./types";

const initialState = {
    playerData: '',
    isClanSearch: true,
    clanData: '',
    loader: false,
}

export const reducer = (state = initialState, action) => {
    if (action.type.includes("pending")) {

        return state;
    }

    if (action.type.includes("rejected")) {

        return state;
    }

    switch (action.type) {
        case `${types.GET_PLAYER_INFO}/fulfilled`:
            return {
                ...state,
                playerData: action.payload
            };
        case `${types.GET_PLAYER_INFO}/rejected`:
            return {
                ...state,
                playerData: action.payload
            };
        case `${types.GET_CLAN_INFO}/fulfilled`:
            return {
                ...state,
                clanData: action.payload
            };
        case `${types.GET_CLAN_INFO}/rejected`:
            return {
                ...state,
                clanData: action.payload
            };
        case `${types.SET_CLAN_SEARCH}`:
            return {
                ...state,
                isClanSearch: action.payload
            };
        case `${types.SHOW_LOADER}`:
            return {
                ...state,
                loader: true
            };
        case `${types.HIDE_LOADER}`:
            return {
                ...state,
                loader: false
            };
        default:
            return state;
    }
}
