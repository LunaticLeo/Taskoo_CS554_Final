import React, { useState } from 'react';

const useValidation = () => {
	const count = 2;
	const [error, setError] = useState<boolean[]>(Array(count).fill(false));
	const [helperText, setHelperText] = useState<string[]>(Array(count).fill(' '));

	const switchError = (index: number, value: boolean) => {
		setError(preVal => {
			preVal[index] = value;
			return [...preVal];
		});
	};

	const switchHelperText = (index: number, value: string) => {
		setHelperText(preVal => {
			preVal[index] = value;
			return [...preVal];
		});
	};

	return {
		email: (cb?: any) => ({
			error: error[0],
			helperText: helperText[0],
			onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
				cb && cb(e);

				const value = e.target.value;
				if (value.trim() === '') {
					switchError(0, true);
					switchHelperText(0, 'The email cannot be empty.');
					return;
				}
				const reg = /^[0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.-]+([.][a-zA-Z]+){1,2}$/;
				if (!reg.test(e.target.value)) {
					switchError(0, true);
					switchHelperText(0, 'The email is invalid.');
					return;
				}
				switchError(0, false);
				switchHelperText(0, ' ');
			}
		}),
		password: (cb?: any) => ({
			error: error[1],
			helperText: helperText[1],
			onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
				cb && cb(e);

				const value = e.target.value;
				if (value.trim() === '') {
					switchError(1, true);
					switchHelperText(1, 'The password cannot be empty.');
					return;
				}
				// TODO complete password validation
				// const reg = /^[0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.-]+([.][a-zA-Z]+){1,2}$/;
				// if (!reg.test(e.target.value)) {
				// 	switchError(0, true);
				// 	switchHelperText(0, 'The emial is invalid.');
				// 	return;
				// }
				switchError(1, false);
				switchHelperText(1, ' ');
			}
		}),
		valid:(type:string,cb?: any) => ({
			error: error[0],
			helperText: helperText[0],
			onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
				cb && cb(e);

				const value = e.target.value;
				if (value.trim() === '') {
					switchError(0, true);
					switchHelperText(0, type+' '+e.target.id+' cannot be empty.');
					return;
				}
				switchError(0, false);
				switchHelperText(0, ' ');
			}
		})
	};
};

export default useValidation;
