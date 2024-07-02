import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: 0,
    gameState: 'waiting for input',
    isUserLoggedIn: false,
    textData: [],
    testSettings: {
        testName: "10",
        testType: "word",
        isPunc: false,
        isNum: false,
    },
    userEmail: '',
}

export const gameSlice = createSlice({
    name: 'gameSlice',
    initialState,
    reducers: {
        updateGameState: (state, action) => {
            state.gameState = action.payload;
        },
        updateTextData: (state, action) => {
            state.textData = action.payload;
        },
        updateTestSettings: (state, action) => {
            const { key, value } = action.payload;
            state.testSettings[key] = value;
        },
        setUserLogin: (state, action) => {
            state.isUserLoggedIn = action.payload;
        },
        updateUserEmail: (state, action) => {
            state.userEmail = action.payload;
        }
    }

})

export const { updateGameState, updateTextData, updateTestSettings, setUserLogin, updateUserEmail } = gameSlice.actions;
export default gameSlice.reducer; 