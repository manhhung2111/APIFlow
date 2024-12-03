export default class Validation{

	/**
	 * Checks if a variable is empty. Supports strings, arrays, objects, and null/undefined.
	 * @param variable The variable to check.
	 * @returns `true` if the variable is empty; otherwise, `false`.
	 */
	static isEmpty(variable: any): boolean{
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


	/**
	 * Validates whether a string is a properly formatted email address.
	 * @param email The email address to validate.
	 * @returns `true` if the email is valid; otherwise, `false`.
	 */
	static validEmail(email: string): boolean{
		const email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return email_regex.test(email);
	}
}
