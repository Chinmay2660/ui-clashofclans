import * as types from "./types";

const initialState = {
    playerData: ''
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
        default:
            return state;
    }
}
