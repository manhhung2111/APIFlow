import {Avatar, Tooltip} from "antd";

export default function AppUserAvatar({username, email = ""}){

	const color = stringToColor(username);
	return (
		<div className="app-user-avatar">
			<Tooltip title={username} placement="top">
				<Avatar
					style={{
						backgroundColor: color,
						verticalAlign: 'middle',
					}}
					size="small"
				>
					{username.charAt(0).toUpperCase()}
				</Avatar>
			</Tooltip>

		</div>
	)
}

const stringToColor = (str) => {
	let hash = 0;
	for (let i = 0 ; i < str.length ; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	}
	let color = "#";
	for (let i = 0 ; i < 3 ; i++) {
		color += ("00" + ((hash >> (i * 8)) & 0xff).toString(16)).slice(-2);
	}
	return color;
};