import http from '@/utils/http';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: { data: FavoriteInfo[] } = {
	data: []
};

export const favoriteListSlice = createSlice({
	name: 'favoriteList',
	initialState,
	reducers: {
		set: (state, { payload }: PayloadAction<FavoriteInfo[]>) => {
			state.data = payload;
		}
	}
});

export const getFavoriteList = () => {
	return (dispatch: any) =>
		http.get<FavoriteInfo[]>('/project/favorite/list').then(res => {
			dispatch(favoriteListSlice.actions.set(res.data!));
		});
};

export const { set } = favoriteListSlice.actions;

export default favoriteListSlice.reducer;
