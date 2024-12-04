export default class Code extends Error{
	static ERROR = -1;
	static SUCCESS = 0;

	static UNKNOWN_ERROR = "Unknown error.";
	static INVALID_AUTHORIZATION = "You don't have permission to access this resource.";
	static INVALID_DATA = "Invalid data.";

	protected code: number;
	protected data: object;

	constructor(message: string){
		super(message);
		this.code = Code.ERROR;
		this.data = {};
	}

	static success(message = "", data = {}){
		const code = new Code(message);
		code.code = Code.SUCCESS;
		code.data = data;
		return code;
	}

	static error(message = "", data = {}){
		const code = new Code(message);
		code.code = Code.ERROR;
		code.data = data;
		return code;
	}

	toJSON(){
		return {
			code: this.code,
			data: this.data,
			message: this.message,
		};
	}
}
