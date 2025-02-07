import axios from "@configs/axios.js";

export default class UserService {
	// Method to handle user login
	static async login(email, password) {
		try {
			return await axios.post('/users/login', {email, password})
		} catch (error) {
			throw new Error(error.message || 'Login failed');
		}
	}

	// Method to handle user registration
	static async register(username, email, password) {
		try {
			return await axios.post('/users/register', {username, email, password});
		} catch (error) {
			throw new Error(error.message || 'Register failed');
		}
	}

	// Method to log out the user
	static async logout() {
		try {
			return await axios.delete('/users/logout');
		} catch (error) {
			throw new Error(error?.message || 'Logout failed');
		}
	}

	static async verify() {
		try {
			return await axios.get('/users/verify');
		} catch (error) {
			throw new Error(error?.message || 'Verification failed');
		}
	}
}
