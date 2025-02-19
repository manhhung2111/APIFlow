import {Authorization} from "@services/authorization";
import {Code, HTMLInput} from "@ap/core";

export default class JWTAuthorization extends Authorization{
	protected type: number = Authorization.JWTBearerAuth;

	readData(): void{
		this.data = {
			algorithm: HTMLInput.inputInline("algorithm"),
			secret: HTMLInput.inputInline("secret"),
			payload: HTMLInput.inputNoSafe("payload"),
		}
	}
}