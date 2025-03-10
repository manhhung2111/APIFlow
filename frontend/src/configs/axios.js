import axios from "axios";

const showOverlay = () => document.getElementById("axios-overlay").style.display = "flex";
const hideOverlay = () => document.getElementById("axios-overlay").style.display = "none";

const instance = axios.create({
	baseURL: "http://localhost:8080/",
});

instance.defaults.withCredentials = true;

// Add a request interceptor
instance.interceptors.request.use(
	function(config){
		showOverlay()
		return config;
	},
	function(error){
		// Do something with request error
		hideOverlay();

		return Promise.reject(error);
	}
);

// Add a response interceptor
instance.interceptors.response.use(
	function(response){
		// Any status code that lie within the range of 2xx cause this function to trigger
		// Do something with response data
		hideOverlay();
		return response.data;
	},
	function(error){
		// Any status codes that falls outside the range of 2xx cause this function to trigger
		// Do something with response error
		hideOverlay();

		if(error.response.status === 401){
			// window.location.href = "/login";
		} else if(error.response.status === 403){
			// window.location.href = "/forbidden";
		}
		 else if (error.response.status === 404){
			window.location.href = "/notfound"
		}
		return error?.response?.data || Promise.reject(error);
	}
);

export default instance;