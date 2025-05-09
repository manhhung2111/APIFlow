import {
	Authorization,
	BasicAuthorization,
	BearerTokenAuthorization,
	InheritAuthorization,
	JWTAuthorization,
	NoAuthorization,
} from "@services/authorization";
import {Code} from "@ap/core";
import APIKeyAuthorization from "@services/authorization/api.key";

export default class AuthorizationFactory{
	private _authorization: Authorization | null = null;

	public constructor(authorization_type: number){
		if (authorization_type === Authorization.NoAuth){
			this._authorization = new NoAuthorization();
		} else if (authorization_type === Authorization.InheritAuth){
			this._authorization = new InheritAuthorization();
		} else if (authorization_type === Authorization.BasicAuth){
			this._authorization = new BasicAuthorization();
		} else if (authorization_type === Authorization.BearerTokenAuth){
			this._authorization = new BearerTokenAuthorization();
		} else if (authorization_type === Authorization.JWTBearerAuth){
			this._authorization = new JWTAuthorization();
		} else if (authorization_type === Authorization.APIKeyAuth){
			this._authorization = new APIKeyAuthorization();
		} else{
			throw new Code("Invalid Authorization type");
		}
	}

	public read(): void{
		this._authorization!.readData();
	}

	public release(){
		const object = this._authorization!.release();
		return {
			type: object.type,
			data: object.data,
		};
	}
}