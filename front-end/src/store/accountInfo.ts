import { toCapitalize } from '@/utils';
import { SESSION_KEY } from '@/utils/keys';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: { data: StoreAccountInfo } = {
	data: JSON.parse(sessionStorage.getItem(SESSION_KEY)!) ?? {
		email: '',
		firstName: '',
		lastName: '',
		fullName: '',
		avatar: '',
		department: '',
		position: ''
	}
};

export const accountInfoSlice = createSlice({
	name: 'accountInfo',
	initialState,
	reducers: {
		get: state => {
			const { firstName, lastName } = state.data;
			const fullName = `${toCapitalize(firstName)} ${toCapitalize(lastName)}`;
			state.data = { ...state.data, fullName };
		},
		set: (state, { payload }: PayloadAction<Partial<StoreAccountInfo>>) => {
			const fullName = `${toCapitalize(payload.firstName!)} ${toCapitalize(payload.lastName!)}`;
			const newInfo = { ...state.data, ...payload, fullName };

			state.data = newInfo;
			sessionStorage.setItem(SESSION_KEY, JSON.stringify(newInfo));
		}
	}
});

export const { get, set } = accountInfoSlice.actions;

export default accountInfoSlice.reducer;
