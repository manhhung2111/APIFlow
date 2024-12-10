import {AuthorizationFactory} from "@services/authorization";
import {RequestBodyFactory} from "@services/request";
import {Code, HTMLInput} from "@ap/core";

interface ITableStructure{
	selected: boolean,
	key: string,
	value: string,
	description: string,
}

export default class RequestServiceReader{
	private METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"];
	private MAX_ROWS = 50;

	private _method: string = "GET";
	private _url: string = "";
	private _params: Array<ITableStructure> = [];
	private _authorization: AuthorizationFactory | null = null;
	private _cookies: Array<object> = [];
	private _headers: Array<ITableStructure> = [];
	private _body: RequestBodyFactory | null = null;
	private _environment: Array<object> = [];
	private _scripts: object = {};

	public readMethod(){
		this._method = HTMLInput.inputInline("request_method");

		if (!this.METHODS.includes(this._method)){
			throw new Code("The request method is not supported yet.");
		}

		return this;
	}

	public readURL(){
		this._url = HTMLInput.inputInlineNoLimit("request_url");

		if (this._url.length > 2047){
			throw new Code("The URL is too long, as it exceeds the maximum limit of 2047 characters.");
		}

		return this;
	}

	public readParams(){
		const prefix = "request_params";
		const params: Array<ITableStructure> = [];

		for (let index = 0; index < this.MAX_ROWS; index++){
			const selected = HTMLInput.inputInline(`${prefix}_selected_${index}`) == "on";
			const key = HTMLInput.inputInline(`${prefix}_key_${index}`);
			const value = HTMLInput.inputInline(`${prefix}_value_${index}`);
			const description = HTMLInput.inputInline(`${prefix}_description_${index}`);

			params.push({selected, key, value, description});
		}

		this._params = params;

		return this;
	}

	public readAuthorization(){
		const auth_type = HTMLInput.inputInt("request_authorization_type");

		const authorization = new AuthorizationFactory(auth_type);
		authorization.read();
		this._authorization = authorization;

		return this;
	}

	public readCookies(){
		const cookies = JSON.parse(atob(HTMLInput.inputInlineNoLimit("cookies")));

		cookies?.forEach((cookie: {name: string, value: string, expires: number}) => {
			if (cookie.expires && cookie.expires < Date.now()) return;

			this._cookies.push({name: cookie.name, value: cookie.value});
		});

		return this;
	}

	public readHeaders(){
		const prefix = "request_headers";
		const headers: Array<ITableStructure> = [];

		for (let index = 0; index < this.MAX_ROWS; index++){
			const selected = HTMLInput.inputInline(`${prefix}_selected_${index}`) == "on";
			const key = HTMLInput.inputInline(`${prefix}_key_${index}`);
			const value = HTMLInput.inputInline(`${prefix}_value_${index}`);
			const description = HTMLInput.inputInline(`${prefix}_description_${index}`);

			headers.push({"selected": selected, "key": key, "value": value, "description": description});
		}

		this._headers = headers;


		return this;
	}

	public readBody(){
		const body_type = HTMLInput.inputInt("request_body_type");

		const body = new RequestBodyFactory(body_type);
		body.read();

		this._body = body;
		return this;
	}

	public readEnvironment(){
		return this;
	}

	public readScripts(){
		const pre_script = HTMLInput.inputInlineNoLimit("request_pre_script");
		const post_script = HTMLInput.inputInlineNoLimit("request_post_script");

		this._scripts = {"pre_script": pre_script, "post_script": post_script};
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