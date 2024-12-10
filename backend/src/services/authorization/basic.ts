import {Authorization} from "@services/authorization";
import {HTMLInput} from "@ap/core";

export default class BasicAuthorization extends Authorization{
	protected type: number = Authorization.BasicAuth;

	readData(): void{
		const username = HTMLInput.inputInline("authorization_basic_username");
		const password = HTMLInput.inputInline("authorization_basic_password");
		this.data.username = username;
		this.data.password = password;
	}
}