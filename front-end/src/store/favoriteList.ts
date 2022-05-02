import { PageConfig, WithPage } from '@/@types/props';
import http from '@/utils/http';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: { value: WithPage<ProjectInfo[]> } = {
	value: {
		count: 0,
		list: []
	}
};

export const favoriteListSlice = createSlice({
	name: 'favoriteList',
	initialState,
	reducers: {
		set: (state, { payload }: PayloadAction<WithPage<ProjectInfo[]>>) => {
			state.value = payload;
		}
	}
});

export const getFavoriteList = (pageConfig?: Omit<Partial<PageConfig>, 'count'>) => {
	return (dispatch: any) =>
		http.get<WithPage<ProjectInfo[]>>('/project/favorite/list', pageConfig).then(res => {
			dispatch(favoriteListSlice.actions.set(res.data!));
		});
};
('');

export const { set } = favoriteListSlice.actions;

export default favoriteListSlice.reducer;
