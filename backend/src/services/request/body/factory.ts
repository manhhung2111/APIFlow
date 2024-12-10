import {RequestBody, RequestFormData, RequestFormEncoded, RequestFormNone, RequestFormRaw} from "@services/request";
import {Code} from "@ap/core";

export default class RequestBodyFactory{
	private _body: RequestBody | null = null;

	public constructor(request_body_type: number){
		if (request_body_type === RequestBody.None){
			this._body = new RequestFormNone();
		} else if (request_body_type === RequestBody.FormEncoded){
			this._body = new RequestFormEncoded();
		} else if (request_body_type === RequestBody.FormData){
			this._body = new RequestFormData();
		} else if (request_body_type === RequestBody.FormRaw){
			this._body = new RequestFormRaw();
		} else{
			throw new Code("Invalid Request body type");
		}
	}

	public read(){
		this._body!.readData();
	}

	public release(){
		const object = this._body!.release();
		return {
			body_type: object.type,
			body_data: object.data,
		};
	}
}