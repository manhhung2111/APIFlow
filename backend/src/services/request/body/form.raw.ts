import {RequestBody} from "@services/request";

export default class RequestFormRaw extends RequestBody {
	protected type = RequestBody.FormRaw;
	readData(): void{
	}

}