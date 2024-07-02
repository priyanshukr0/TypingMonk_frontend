import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './slices/gameSlice'

export const store = configureStore({
    reducer: {
        mainGame: counterReducer,
    },
})