import { toCapitalize } from '@/utils';
import { SESSION_KEY } from '@/utils/keys';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: { value: WithFullName<Account> } = {
	value: JSON.parse(sessionStorage.getItem(SESSION_KEY)!) ?? {
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
			sessionStorage.setItem(SESSION_KEY, JSON.stringify(newInfo));
		}
	}
});

export const { get, set } = accountInfoSlice.actions;

export default accountInfoSlice.reducer;
