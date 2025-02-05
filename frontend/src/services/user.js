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
	static async register(name, email, password) {
		try {
			const response = await axios.post('/auth/register', { name, email, password });
			return response.data;
		} catch (error) {
			throw new Error(error.response?.data?.message || 'Registration failed');
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
}
