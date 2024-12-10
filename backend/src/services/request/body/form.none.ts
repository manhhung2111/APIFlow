import {RequestBody} from "@services/request";

export default class RequestFormNone extends RequestBody {
	protected type = RequestBody.None;
	readData(): void{
	}

}