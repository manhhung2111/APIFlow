import {Authorization} from "@services/authorization";
import {HTMLInput} from "@ap/core";

export default class BasicAuthorization extends Authorization{
	protected type: number = Authorization.BasicAuth;

	readData(): void{
		const username = HTMLInput.inputInline("username");
		const password = HTMLInput.inputInline("password");
		this.data.username = username;
		this.data.password = password;
	}
}