import {Avatar, Button, Typography} from "antd";
import {LogoutOutlined, QuestionCircleOutlined, SettingOutlined, UserOutlined} from "@ant-design/icons";
import {NavLink} from "react-router";
import AccountProfileIcon from "@assets/icons/account.profile.jsx";
import SignOutIcon from "@assets/icons/signout.jsx";

const {Paragraph, Text} = Typography;
export default function AccountModal(){
	const items = [
		{
			label: 'Account Settings',
			key: '1',
			icon: <AccountProfileIcon />
		},
		{
			label: 'Sign Out',
			key: '2',
			icon: <SignOutIcon />
		},
	];

	return (
		<div className="account-modal">
			<div className="am-header">
				<Avatar size="large" icon={<UserOutlined/>} />
				<div className="information">
					<h3>Manh Hung Hoang</h3>
					<Paragraph>
						<Text>manhhung2720@gmail.com</Text>
						<Text>Account managed by APIFlow</Text>
					</Paragraph>
				</div>
			</div>
			<div className="am-main">
				<NavLink className="am-item" to={"account"} viewTransition><SettingOutlined/> Account </NavLink>
				<NavLink className="am-item" to={"docs"}
						 viewTransition><QuestionCircleOutlined/> Documentations</NavLink>
			</div>
			<div className="am-footer">
				<Button danger icon={<LogoutOutlined/>}>Sign Out</Button>
			</div>
		</div>
	)
};