import {RequestBody} from "@services/request/index";
import axios from "axios";
import {Code} from "@ap/core";
import FormData from "form-data";

export default class RequestService{
	private _method: string = "";
	private _url: string = "";
	private _params: Array<any> = [];
	private _path_variables: Array<any> = [];
	private _authorization: any = {};
	private _cookies: Array<object> = [];
	private _headers: Array<any> = [];
	private _body: {type?: number, data?: any} = {};
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

	public setPathVariables(path_variables: Array<any>){
		this._path_variables = path_variables;
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

	public setBody(body: {type: number, data: any}){
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
		let url = this.convertRequestUrl();
		let headers = this.convertRequestHeaders();
		let body = this.convertRequestBody();

		try{
			const startTime = performance.now();
			const response = await axios({
				method: this._method,
				url: url,
				headers: headers,
				data: this._method === "GET" ? undefined : body,
			});

			const endTime = performance.now();
			const duration = endTime - startTime;

			// Calculate request and response size
			const request_size = {headers: this.calculateSize(headers), body: this.calculateSize(body)};
			const response_size = {headers: this.calculateSize(response.headers), body: this.calculateSize(response.data)};

			return {...response, time: duration, request_size, response_size};
		} catch (error){
			if (axios.isAxiosError(error)) {
				throw error;
			}
			throw new Code((error as Error).message);
		}
	}


	private convertRequestBody(){
		let request_body: any = null;

		if (this._body.type == RequestBody.FormData){
			const form_data = new FormData();

			Object.values(this._body.data).forEach((row) => {
				if (typeof row === "object" && row !== null && "key" in row && "value" in row){
					const {key, value} = row as {key: string; value: string | Express.Multer.File[]};
					if (Array.isArray(value)){
						for (const file of value){
							form_data.append(key, file.buffer, {filename: file.originalname});
						}
					} else{
						form_data.append(key, value);
					}
				}
			});

			request_body = form_data;
		} else if (this._body.type == RequestBody.FormEncoded){
			request_body = new URLSearchParams(this._body.data as Record<string, string>).toString();
		} else if (this._body.type == RequestBody.FormRaw){
			request_body = JSON.stringify(this._body.data);
		}


		return request_body;
	}

	private convertRequestHeaders(){
		const headers: any = {};
		this._headers.forEach((header) => {
			headers[header.key] = header.value;
		});

		if (this._body.type == RequestBody.FormData){
			delete headers["Content-Type"];
		} else if (this._body.type == RequestBody.FormEncoded){
			headers["Content-Type"] = "application/x-www-form-urlencoded";
		} else if (this._body.type == RequestBody.FormRaw){
			headers["Content-Type"] = headers["Content-Type"] || "application/json";
		}

		return headers;
	}

	private convertRequestUrl(){
		let url = this._url;

		for (const variable of this._path_variables){
			const value = encodeURIComponent(variable.value);
			url = url.replace(new RegExp(`:${variable.key}`, "g"), value);
		}

		const [base_url, queries] = url.split("?");
		const params = new URLSearchParams(queries || "");

		this._params.forEach((param) => {
			if (!param.selected) return;
			params.set(param.key, param.value);
		});

		url = `${base_url}?${params.toString()}`;

		return url;
	}

	private calculateSize(data: any) {
		try {
			return JSON.stringify(data)?.length || 0;
		} catch {
			return 0;
		}
	}
}