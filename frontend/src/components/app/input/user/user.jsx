import React, {useContext, useEffect, useState} from 'react';
import {Mentions} from 'antd';
import {AppContext} from "@contexts/app.jsx";

const AppInputUser = ({value, setValue}) => {
	const {users} = useContext(AppContext);
	const [inputValue, setInputValue] = useState();
	const [filteredUsers, setFilteredUsers] = useState(users);

	useEffect(() => {
		if(value && users.length > 0){
			const usernames = value
				.map(id => {
					const user = users.find(user => user._id == id);
					return user ? `@${user.email}` : null;
				})
				.filter(Boolean) // Remove null/undefined values
				.join(" "); // Join usernames with a space

			setInputValue(usernames);
		}
	}, []);

	const handleChange = (text) => {
		const extractedEmails = [...new Set(text.match(/@([\w.-]+@[\w.-]+\.\w+)/g)?.map(e => e.slice(1)) || [])];

		// Map usernames to their corresponding _id values
		const selectedUserIds = extractedEmails
			.map(email => users.find(user => user.email === email)?._id)
			.filter(Boolean); // Remove null/undefined values

		// Update state with the list of user IDs
		setValue(selectedUserIds);
		setInputValue(text);
	};

	const onSearch = (search) => {
		const searchLower = search.toLowerCase();
		const availableUsers = users
			.filter(user => !value.includes(user._id)) // Exclude selected users
			.filter(user => user.email.toLowerCase().includes(searchLower)); // Match search input

		setFilteredUsers(availableUsers);
	};

	return (
		<Mentions
			style={{width: '100%',}}
			options={filteredUsers.map(({email, _id}) => ({
				key: _id,
				value: email,
				className: 'antd-demo-dynamic-option',
				label: (
					<>
						<span>{email}</span>
					</>
				),
			}))}
			onSearch={onSearch}
			onChange={handleChange}
			value={inputValue}
			placeholder={"Type @ to search for users"}
		/>
	);
};

export default AppInputUser;
