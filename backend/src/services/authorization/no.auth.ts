import {Authorization} from "@services/authorization";

export default class NoAuthorization extends Authorization{
	protected type: number = Authorization.NoAuth;

	readData(): void{}
}