import { toCapitalize } from '@/utils';
import { STORAGE_KEY } from '@/utils/keys';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: { value: WithFullName<Account> } = {
	value: JSON.parse(localStorage.getItem(STORAGE_KEY)!) ?? {
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
			const { firstName, lastName } = state.value;
			const fullName = `${toCapitalize(firstName)} ${toCapitalize(lastName)}`;
			state.value = { ...state.value, fullName };
		},
		set: (state, { payload }: PayloadAction<Partial<WithFullName<Account>>>) => {
			const newInfo = { ...state.value, ...payload };
			newInfo.fullName = `${toCapitalize(newInfo.firstName!)} ${toCapitalize(newInfo.lastName!)}`;

			state.value = newInfo;
			localStorage.setItem(STORAGE_KEY, JSON.stringify(newInfo));
		},
		clear: () => {
			localStorage.removeItem(STORAGE_KEY);
			// refresh the page
			location.reload();
		}
	}
});

export const { get, set, clear } = accountInfoSlice.actions;

export default accountInfoSlice.reducer;
