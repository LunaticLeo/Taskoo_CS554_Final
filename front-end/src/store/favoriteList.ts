import http from '@/utils/http';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: { value: ProjectInfo[] } = {
	value: []
};

export const favoriteListSlice = createSlice({
	name: 'favoriteList',
	initialState,
	reducers: {
		set: (state, { payload }: PayloadAction<ProjectInfo[]>) => {
			state.value = payload;
		}
	}
});

export const getFavoriteList = () => {
	return (dispatch: any) =>
		http.get<ProjectInfo[]>('/project/favorite/list').then(res => {
			dispatch(favoriteListSlice.actions.set(res.data!));
		});
};

export const { set } = favoriteListSlice.actions;

export default favoriteListSlice.reducer;
