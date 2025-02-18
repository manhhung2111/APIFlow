import {AuthorizationFactory} from "@services/authorization";
import {RequestBodyFactory} from "@services/request";
import {Code, HTMLInput} from "@ap/core";


export default class RequestServiceReader{
	private METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"];
	private MAX_ROWS = 50;

	private _method: string = "GET";
	private _url: string = "";
	private _params: Array<any> = [];
	private _path_variables: Array<any> = [];
	private _authorization: AuthorizationFactory | null = null;
	private _cookies: Array<object> = [];
	private _headers: Array<any> = [];
	private _body: RequestBodyFactory | null = null;
	private _environment: Array<object> = [];
	private _scripts: object = {};

	public readMethod(){
		this._method = HTMLInput.inputInline("method");

		if (!this.METHODS.includes(this._method)){
			throw new Code(`The request method is not supported yet.`);
		}

		return this;
	}

	public readURL(){
		this._url = HTMLInput.inputInlineNoLimit("url");

		if (this._url.length > 2047){
			throw new Code("The URL is too long, as it exceeds the maximum limit of 2047 characters.");
		}

		return this;
	}

	public readParams(){
		let data = Buffer.from(HTMLInput.inputRaw("params"), 'base64').toString('utf8');
		let params = JSON.parse(data);

		let temp = [];

		for (let index = 0; index < params.length - 1; index++) {
			const selected = params[index].selected;
			const key = params[index].key;
			const value = params[index].value;
			const content = params[index].content;

			temp.push({selected, key, value, content});
		}

		this._params = temp;

		return this;
	}

	public readPathVariables(){
		const query_prefix = "request_path_params";
		const path_variables: Array<any> = [];

		for (let index = 0; index < this.MAX_ROWS; index++){
			const key = HTMLInput.inputInline(`${query_prefix}_key_${index}`);
			const value = HTMLInput.inputInline(`${query_prefix}_value_${index}`);
			const description = HTMLInput.inputInline(`${query_prefix}_description_${index}`);

			if (!key && !value) break;

			path_variables.push({
				"key": key,
				"value": value,
				"description": description,
			});
		}

		this._path_variables = path_variables;

		return this;
	}

	public readAuthorization(){
		const auth_type = HTMLInput.inputInt("authorization_type");

		const authorization = new AuthorizationFactory(auth_type);
		authorization.read();
		this._authorization = authorization;

		return this;
	}

	public readCookies(){
		let cookies_jar = HTMLInput.inputInlineNoLimit("cookies");
		if (!cookies_jar) return this;

		const cookies = JSON.parse(atob(cookies_jar));

		cookies?.forEach((cookie: {name: string, value: string, expires: number}) => {
			if (cookie.expires && cookie.expires < Date.now()) return;

			this._cookies.push({name: cookie.name, value: cookie.value});
		});

		return this;
	}

	public readHeaders(){
		let data = Buffer.from(HTMLInput.inputRaw("headers"), 'base64').toString('utf8');
		let headers = JSON.parse(data);

		let temp = [];

		for (let index = 0; index < headers.length - 1; index++) {
			const selected = headers[index].selected;
			const key = headers[index].key;
			const value = headers[index].value;
			const content = headers[index].content;

			temp.push({selected, key, value, content});
		}

		this._headers = temp;

		return this;
	}

	public readBody(){
		const body_type = HTMLInput.inputInt("body_type");

		const body = new RequestBodyFactory(body_type);
		body.read();

		this._body = body;
		return this;
	}

	public readEnvironment(){
		return this;
	}

	public readScripts(){
		let data = Buffer.from(HTMLInput.inputRaw("scripts"), 'base64').toString('utf8');

		this._scripts = JSON.parse(data);
		return this;
	}


	public getMethod(): string{
		return this._method;
	}

	public getURL(): string{
		return this._url;
	}

	public getParams(){
		return this._params;
	}

	public getPathVariables(){
		return this._path_variables;
	}

	public getAuthorization(){
		return this._authorization!.release();
	}

	public getCookies(){
		return this._cookies;
	}

	public getHeaders(){
		return this._headers;
	}

	public getBody(){
		return this._body!.release();
	}

	public getEnvironment(){
		return this._environment;
	}

	public getScripts(){
		return this._scripts;
	}
}