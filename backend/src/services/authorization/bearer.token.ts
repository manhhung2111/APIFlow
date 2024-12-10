import {Authorization} from "@services/authorization";
import {HTMLInput} from "@ap/core";

export default class BearerTokenAuthorization extends Authorization{
	protected type: number = Authorization.BearerTokenAuth;

	readData(): void{
		this.data.token = HTMLInput.inputInlineNoLimit("authorization_bearer_token");
	}
}