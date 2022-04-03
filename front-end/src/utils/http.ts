import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

type RequestMethod = 'get' | 'post' | 'put' | 'delete';
interface ResponseData<T> {
	code: number;
	message: string;
	data: T;
}
type AxiosHttp = Record<RequestMethod, (path: string, param: Object) => Promise<AxiosResponse<ResponseData<unknown>>>>;

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
		console.log('error: ' + msg);
		return Promise.reject(msg);
	}
);

const http: AxiosHttp = METHODS.reduce((pre, key: RequestMethod) => {
	pre[key] = (path: string, param) => {
		const requestData = {
			method: key,
			url: path,
			[key === 'get' ? 'params' : 'data']: param
		};

		return instance
			.request(requestData)
			.then(res => Promise.resolve(res))
			.catch(err => Promise.reject(err));
	};
	return pre;
}, {} as AxiosHttp);

export default http;
