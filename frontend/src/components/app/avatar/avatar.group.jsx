import {Avatar} from "antd";
import AppUserAvatar from "@components/app/avatar/avatar.jsx";

export default function AppUserAvatarGroup({usernames}){

	return (
		<div className="app-user-avatar-group">
			<Avatar.Group max={{
				count: 6,
				style: {
					color: 'rgb(31, 80, 154)',
					backgroundColor: 'rgba(31, 80, 154,  0.4)',
				},
			}}>
				{usernames.map((username, i) => (
					<AppUserAvatar username={username} key={i} />
				))}
			</Avatar.Group>
		</div>
	)
}