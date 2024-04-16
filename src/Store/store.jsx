import { configureStore } from '@reduxjs/toolkit'
import { reducer } from "../Store/Reducers";

const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        immutableCheck: false,
        serializableCheck: false,
    })
})

export default store