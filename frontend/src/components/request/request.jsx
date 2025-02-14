export default class Request{
	static AUTHORIZATION = {
		InheritAuth: {value: 0, label: "Inherit auth from parent"},
		NoAuth: {value: 1, label: "No Auth"},
		BasicAuth: {value: 2, label: "Basic Auth"},
		BearerToken: {value: 3, label: "Bearer Token"},
		JWTBearer: {value: 4, label: "JWT Bearer"}
	};

	static METHODS = {
		GET: {value: "get", label: "GET"},
		PUT: {value: "put", label: "PUT"},
		POST: {value: "post", label: "POST"},
		DELETE: {value: "delete", label: "DELETE"}
	}

	static BODY_TYPES = {
		None: {value: 0, label: "none"},
		FormData: {value: 1, label: "form-data"},
		FormEncoded: {value: 2, label: "x-www-form-urlencoded"},
		FormRaw: {value: 3, label: "raw"}
	}

	static getMethod(method){
		if(method === this.METHODS.GET.value){
			return {name: "GET", color: '#007F31'}
		} else if(method === this.METHODS.POST.value){
			return {name: "POST", color: '#AD7A03'}
		} else if(method === this.METHODS.PUT.value){
			return {name: "PUT", color: '#0053B8'}
		} else if(method === this.METHODS.DELETE.value){
			return {name: "DEL", color: '#8E1A10'}
		}

		return null;
	}


	static am(request) {

	}
}