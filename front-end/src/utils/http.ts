import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const METHODS: RequestMethod[] = ['get', 'post', 'put', 'delete'];
const DEFAULT_CONFIG: AxiosRequestConfig = {
	baseURL: '/api'
};
const instance: AxiosInstance = axios.create(DEFAULT_CONFIG);

// Response interecptors
instance.interceptors.response.use(
	res => (res.status >= 200 && res.status < 300 ? res.data : Promise.reject('Request error, please try again later!')),
	err => {
		const msg = err?.response?.data ?? err;
		console.error(msg);
		return Promise.reject(msg);
	}
);

const http: AxiosHttp = METHODS.reduce((pre, key: RequestMethod) => {
	pre[key] = async <T = any>(path: string, param?: Object) => {
		const requestData = {
			method: key,
			url: path,
			[key === 'get' ? 'params' : 'data']: param
		};

		return (await instance
			.request(requestData)
			.then(res => Promise.resolve(res))
			.catch(err => Promise.reject(err))) as ResponseData<T>;
	};
	return pre;
}, {} as AxiosHttp);

export default http;
