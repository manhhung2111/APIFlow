import {Authorization} from "@services/authorization";
import {Code} from "@ap/core";

export default class JWTAuthorization extends Authorization{
	protected type: number = Authorization.JWTBearerAuth;

	readData(): void{
		throw new Code("System does not support JWT authorization yet");
	}
}