import {Authorization} from "@services/authorization";
import {Code, HTMLInput} from "@ap/core";

export default class InheritAuthorization extends Authorization{
	protected type: number = Authorization.InheritAuth;

	readData(): void{
		throw new Code("System does not support inherit authorization yet");
	}
}