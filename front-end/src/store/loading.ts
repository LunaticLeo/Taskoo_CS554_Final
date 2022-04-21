import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: { value: boolean } = {
	value: false
};

export const loadingSlice = createSlice({
	name: 'loading',
	initialState,
	reducers: {
		setLoading: (state, { payload }: PayloadAction<boolean>) => {
			state.value = payload;
		}
	}
});

export const { setLoading } = loadingSlice.actions;

export default loadingSlice.reducer;
