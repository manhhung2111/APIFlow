import axios from "axios";

const instance = axios.create({
	baseURL: "http://localhost:8081/",
});

// Add a request interceptor
instance.interceptors.request.use(
	function(config){
		const token = JSON.parse(localStorage.getItem("account"))?.token;
		if(token) config.headers.Authorization = `Bearer ${token}`;
		// Do something before request is sent
		return config;
	},
	function(error){
		// Do something with request error
		return Promise.reject(error);
	}
);

// Add a response interceptor
instance.interceptors.response.use(
	function(response){
		nProgress.done();
		// Any status code that lie within the range of 2xx cause this function to trigger
		// Do something with response data
		return response.data;
	},
	function(error){
		nProgress.done();
		// Any status codes that falls outside the range of 2xx cause this function to trigger
		// Do something with response error
		if(error.response.status === 401){
			return "Unauthorized user";
		}
		return error?.response?.data || Promise.reject(error);
	}
);

export default instance;