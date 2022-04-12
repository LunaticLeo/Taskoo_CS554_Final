import { getStaticData, toCapitalize } from '@/utils';
import { SESSION_KEY } from '@/utils/keys';
import { useEffect, useMemo, useState } from 'react';

const useAccountInfo = (): Account & { fullName: string } => {
	const info = JSON.parse(sessionStorage.getItem(SESSION_KEY)!) as Account;
	const fullName = useMemo(
		() => `${toCapitalize(info.firstName)} ${toCapitalize(info.lastName)}`,
		[info.firstName, info.lastName]
	);
	const [accountInfo, setAccountInfo] = useState<Account>(info);

	useEffect(() => {
		getStaticData('departments', info.department).then(res =>
			setAccountInfo(preVal => ({ ...preVal, department: (<StaticData>res).name }))
		);
		getStaticData('positions', info.position).then(res =>
			setAccountInfo(preVal => ({ ...preVal, position: (<StaticData>res).name }))
		);
	}, []);

	return { ...accountInfo, fullName };
};

export default useAccountInfo;
