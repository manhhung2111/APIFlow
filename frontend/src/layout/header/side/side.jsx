import {Avatar, Dropdown} from "antd";
import {QuestionCircleOutlined, SettingOutlined, UserOutlined} from "@ant-design/icons";
import {NavLink} from "react-router";
import AccountProfileIcon from "@assets/icons/account.profile.jsx";
import SignOutIcon from "@assets/icons/signout.jsx";

export default function SuperHeaderSide(){
	const items = [
		{
			label: 'Account Settings',
			key: '1',
			icon: <AccountProfileIcon style={{fontSize: "14px"}}/>
		},
		{
			label: 'Sign Out',
			key: '2',
			icon: <SignOutIcon style={{fontSize: "14px"}}/>
		},
	];

	return (
		<div className="super-header-side">
			<NavLink to={"helpdesk"} className="shs-item"><QuestionCircleOutlined style={{fontSize: "16px"}}/></NavLink>
			<SettingOutlined style={{fontSize: "16px"}} className="shs-item"/>
			<Dropdown
				trigger={['click']}
				placement="bottomRight"
				className="account-dropdown shs-item"
				menu={{
					items
				}}
			>
				<Avatar style={{ backgroundColor: '#1F509A' }} icon={<UserOutlined/>} size={"small"}/>
			</Dropdown>
		</div>
	);
}