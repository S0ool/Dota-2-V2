import { createSlice } from '@reduxjs/toolkit';


const languageSlice = createSlice({
	name: 'language',
	initialState: localStorage.getItem('language') || 1,
	reducers: {
		setLanguage: (state, action) => {
			localStorage.setItem('language', action.payload);
			console.log(action.payload)
			return action.payload;
		},
	},
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;