export default abstract class RequestBody{
	public static None: number = 0;
	public static FormData: number = 1;
	public static FormEncoded: number = 2;
	public static FormRaw: number = 3;

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