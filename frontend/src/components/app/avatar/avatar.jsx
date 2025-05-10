import {Avatar, Tooltip} from "antd";

export default function AppUserAvatar({username, showName}){

	const color = stringToColor(username);
	return (
		<div className="app-user-avatar">
			{showName && <Tooltip title={username} placement="top">
				<Avatar
					style={{
						backgroundColor: color,
						verticalAlign: 'middle',
					}}
					size="small"
				>
					{username.charAt(0).toUpperCase()}
				</Avatar>
			</Tooltip>}
			{!showName && <Avatar
				style={{
					backgroundColor: color,
					verticalAlign: 'middle',
				}}
				size="small"
			>
				{username.charAt(0).toUpperCase()}
			</Avatar>}
		</div>
	)
}

var stringToColor = (string, saturation = 100, lightness = 75) => {
	let hash = 0;
	for (let i = 0; i < string.length; i++) {
		hash = string.charCodeAt(i) + ((hash << 5) - hash);
		hash = hash & hash;
	}
	return `hsl(${(hash % 360)}, ${saturation}%, ${lightness}%)`;
}