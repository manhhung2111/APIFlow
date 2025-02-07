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

	// Method to fetch user profile
	async getUserProfile() {
		try {
			const response = await axios.get('/user/profile');
			return response.data;
		} catch (error) {
			throw new Error(error.response?.data?.message || 'Failed to fetch user profile');
		}
	}

	// Method to update user profile
	async updateUserProfile(updatedData) {
		try {
			const response = await axios.put('/user/profile', updatedData);
			return response.data;
		} catch (error) {
			throw new Error(error.response?.data?.message || 'Failed to update user profile');
		}
	}

	// Method to log out the user
	async logout() {
		try {
			const response = await axios.post('/auth/logout');
			return response.data;
		} catch (error) {
			throw new Error(error.response?.data?.message || 'Logout failed');
		}
	}

	static async verify() {
		try {
			return await axios.post('/users/verify');
		} catch (error) {
			throw new Error(error?.message || 'Verification failed');
		}
	}
}
