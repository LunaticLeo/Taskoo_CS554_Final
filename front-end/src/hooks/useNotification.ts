import { OptionsObject, useSnackbar, VariantType } from 'notistack';
import { Notification } from '@/@types/props';

const useNotification = (): Notification => {
	const { enqueueSnackbar } = useSnackbar();

	const types: VariantType[] = ['default', 'success', 'error', 'warning', 'info'];

	return types.reduce((pre, cur) => {
		pre[cur] = (msg: string, options?: OptionsObject) => enqueueSnackbar(msg, { variant: cur, ...options });
		return pre;
	}, {} as Notification);
};

export default useNotification;
