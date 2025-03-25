import axios from "@configs/axios.js";

export default class UserService{
	// Method to handle user login
	static async login(form){
		try {
			return await axios.post('/users/login', {...form});
		} catch (error) {
			throw new Error(error.message || 'Login failed');
		}
	}

	// Method to handle user registration
	static async register(email, password){
		try {
			return await axios.post('/users/register', {email, password});
		} catch (error) {
			throw new Error(error.message || 'Register failed');
		}
	}

	// Method to log out the user
	static async logout(){
		try {
			return await axios.delete('/users/logout');
		} catch (error) {
			throw new Error(error?.message || 'Logout failed');
		}
	}

	static async verify(){
		try {
			return await axios.get('/users/verify');
		} catch (error) {
			throw new Error(error?.message || 'Verification failed');
		}
	}

	static async search(query){
		try {
			return await axios.get('/users?query=' + query);
		} catch (error) {
			throw new Error(error?.message || 'Get all users failed');
		}
	}

	static async getAll(){
		try {
			return await axios.get('/users/all');
		} catch (error) {
			throw new Error(error?.message || 'Get all users failed');
		}
	}

	static async googleAuth(credential){
		try {
			return await axios.post('/users/google-auth', {token: credential});
		} catch (error) {
			throw new Error(error?.message || 'Post google credential failed');
		}
	}

	static async forgotPassword(email){
		try {
			return await axios.post('/users/password/forgot', {email: email});
		} catch (error) {
			throw new Error(error?.message || 'Forgot password failed');
		}
	}

	static async resetPassword(password, token){
		try {
			return await axios.post('/users/password/reset', {password: password, token: token});
		} catch (error) {
			throw new Error(error?.message || 'Reset password failed');
		}
	}

	static async verifyEmail(code) {
		try {
			return await axios.post('/users/verify-email', {code: code});
		} catch (error) {
			throw new Error(error?.message || 'Verify email failed');
		}
	}
}
