import { configureStore } from '@reduxjs/toolkit'
import { reducer } from "../Store/Reducers";

const store = configureStore({
    reducer,
})

export default store