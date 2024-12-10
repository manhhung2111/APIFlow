export default class RequestService {
	private _method: string = "";
	private _url: string = "";
	private _params: Array<object> = [];
	private _authorization: object = {};
	private _cookies: Array<object> = [];
	private _headers: Array<object> = [];
	private _body: object = {};
	private _environment: Array<object> = [];
	private _scripts: object = {};


	public setMethod(method: string){
		this._method = method;
		return this;
	}

	public setURL(url: string){
		this._url = url;
		return this;
	}

	public setParams(params: Array<any>){
		this._params = params.filter(param => param.selected);

		return this;
	}

	public setAuthorization(authorization: object){
		this._authorization = authorization;
		return this;
	}

	public setCookies(cookies: Array<object>){
		this._cookies = cookies;
		return this;
	}

	public setHeaders(headers: Array<any>){
		this._headers = headers.filter(header => header.selected);
		return this;
	}

	public setBody(body: object){
		this._body = body;
		return this;
	}

	public setEnvironment(environment: Array<object>){
		this._environment = environment;
		return this;
	}

	public setScripts(scripts: object){
		this._scripts = scripts;
		return this;
	}


	public async send(){
		// TODO: execute pre-scripts

		// TODO: execute post-scripts
		return {}
	}
}