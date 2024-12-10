import {RequestBody} from "@services/request";

export default class RequestFormEncoded extends RequestBody{
	protected type = RequestBody.FormEncoded;

	readData(): void{
	}

}