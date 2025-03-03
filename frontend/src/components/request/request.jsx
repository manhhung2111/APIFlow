export default class Request{
	static AUTHORIZATION = {
		InheritAuth: {value: 0, label: "Inherit auth from parent"},
		NoAuth: {value: 1, label: "No Auth"},
		BasicAuth: {value: 2, label: "Basic Auth"},
		BearerToken: {value: 3, label: "Bearer Token"},
		JWTBearer: {value: 4, label: "JWT Bearer"}
	};

	static METHODS = {
		GET: {value: "GET", label: <div style={{color: "#007F31", fontWeight: 600}}>GET</div>},
		POST: {value: "POST", label: <div style={{color: "#AD7A03", fontWeight: 600}}>POST</div>},
		PUT: {value: "PUT", label: <div style={{color: "#0053B8", fontWeight: 600}}>PUT</div>},
		DELETE: {value: "DELETE", label: <div style={{color: "#8E1A10", fontWeight: 600}}>DELETE</div>}
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

	static STATUS_CODES = function() {
		const http_status_codes = {
			100: "Continue", 101: "Switching Protocols", 102: "Processing", 103: "Early Hints",
			200: "OK", 201: "Created", 202: "Accepted", 203: "Non-Authoritative Information",
			204: "No Content", 205: "Reset Content", 206: "Partial Content", 207: "Multi-Status",
			208: "Already Reported", 226: "IM Used", 300: "Multiple Choices", 301: "Moved Permanently",
			302: "Found", 303: "See Other", 304: "Not Modified", 305: "Use Proxy", 307: "Temporary Redirect",
			308: "Permanent Redirect", 400: "Bad Request", 401: "Unauthorized", 402: "Payment Required",
			403: "Forbidden", 404: "Not Found", 405: "Method Not Allowed", 406: "Not Acceptable",
			407: "Proxy Authentication Required", 408: "Request Timeout", 409: "Conflict", 410: "Gone",
			411: "Length Required", 412: "Precondition Failed", 413: "Payload Too Large", 414: "URI Too Long",
			415: "Unsupported Media Type", 416: "Range Not Satisfiable", 417: "Expectation Failed",
			418: "I'm a teapot", 421: "Misdirected Request", 422: "Unprocessable Entity", 423: "Locked",
			424: "Failed Dependency", 425: "Too Early", 426: "Upgrade Required", 428: "Precondition Required",
			429: "Too Many Requests", 431: "Request Header Fields Too Large", 451: "Unavailable For Legal Reasons",
			500: "Internal Server Error", 501: "Not Implemented", 502: "Bad Gateway", 503: "Service Unavailable",
			504: "Gateway Timeout", 505: "HTTP Version Not Supported", 506: "Variant Also Negotiates",
			507: "Insufficient Storage", 508: "Loop Detected", 510: "Not Extended", 511: "Network Authentication Required"
		};

		return Object.entries(http_status_codes).map(([code, name]) => ({
			label: `${code} ${name}`,
			value: `${code} ${name}`
		}));
	};
}