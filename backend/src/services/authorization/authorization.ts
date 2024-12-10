export default abstract class Authorization{
	public static NoAuth: number = 0;
	public static InheritAuth: number = 1;
	public static BasicAuth: number = 2;
	public static BearerTokenAuth: number = 3;
	public static JWTBearerAuth: number = 4;

	protected type: number = 0;
	protected data: any = {};


	public abstract readData(): void;

	public release(){
		return {
			type: this.type,
			data: this.data,
		};
	}
}