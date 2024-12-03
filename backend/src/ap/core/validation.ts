export default class Validation{

	public static isEmpty(variable: any): boolean{
		if (variable === null || variable === undefined){
			return true;
		}

		if (typeof variable === "string" && variable.trim().length === 0){
			return true;
		}

		if (Array.isArray(variable) && variable.length === 0){
			return true;
		}

		if (typeof variable === "object" && Object.keys(variable).length === 0){
			return true;
		}
		return false;
	}

	public static validEmail(email: string): boolean{
		const email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return email_regex.test(email);
	}

	public static isInt(variable: any){
		if (typeof variable === "number"){
			return Number.isInteger(variable);
		}

		if (typeof variable === "string"){
			const parsed = parseInt(variable, 10);
			return !isNaN(parsed) && parsed.toString() === variable.trim();
		}

		return false;
	}
}
