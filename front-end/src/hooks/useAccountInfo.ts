import { get } from '@/store/accountInfo';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './useStore';

const useAccountInfo = (): StoreAccountInfo => {
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(get());
	}, []);

	return useAppSelector(state => state.accountInfo.data);
};

export default useAccountInfo;
