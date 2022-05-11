import React, { useState } from 'react';

const FormHelperTextProps = { sx: { position: 'absolute', bottom: 0, transform: 'translateY(100%)' } };

const useValidation = () => {
	const count = 3;
	const [error, setError] = useState<boolean[]>(Array(count).fill(false));
	const [helperText, setHelperText] = useState<string[]>(Array(count).fill(''));

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
			FormHelperTextProps,
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
				switchHelperText(0, '');
			}
		}),
		password: (cb?: any) => ({
			error: error[1],
			helperText: helperText[1],
			FormHelperTextProps,
			onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
				cb && cb(e);

				const value = e.target.value;
				if (value.trim() === '') {
					switchError(1, true);
					switchHelperText(1, 'The password cannot be empty.');
					return;
				}
				const isAlphanumeric = /^[0-9a-zA-Z]*$/;
				const number = /[0-9]/;
				const alphabet = /[a-z]/i;
				if (value.length < 8 || value.length > 16) {
					switchError(1, true);
					switchHelperText(1, "Password's length is 8 to 16");
					return;
				}
				if (isAlphanumeric.test(value)) {
					if (number.test(value)) {
						if (!alphabet.test(value)) {
							switchError(1, true);
							switchHelperText(1, 'Password must have letter');
							return;
						}
					} else {
						switchError(1, true);
						switchHelperText(1, 'Password must have number');
						return;
					}
				} else {
					switchError(1, true);
					switchHelperText(1, 'Password can only contain numbers and letters');
					return;
				}

				switchError(1, false);
				switchHelperText(1, ' ');
			}
		}),
		valid: (type: string, cb?: any) => ({
			error: error[2],
			helperText: helperText[2],
			FormHelperTextProps,
			onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
				cb && cb(e);

				const value = e.target.value;
				if (value.trim() === '') {
					switchError(2, true);
					switchHelperText(2, type + ' ' + e.target.id + ' cannot be empty.');
					return;
				}
				switchError(2, false);
				switchHelperText(2, ' ');
			}
		})
	};
};

export default useValidation;
