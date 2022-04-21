import { get } from '@/store/accountInfo';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './useStore';

const useAccountInfo = (): WithFullName<Account> => {
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(get());
	}, []);

	return useAppSelector(state => state.accountInfo.value);
};

export default useAccountInfo;
