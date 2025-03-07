import {Avatar, Dropdown} from "antd";
import {QuestionCircleOutlined, SettingOutlined, UserOutlined} from "@ant-design/icons";
import {NavLink, useNavigate} from "react-router";
import AccountProfileIcon from "@assets/icons/account.profile.jsx";
import SignOutIcon from "@assets/icons/signout.jsx";
import {useContext, useState} from "react";
import {AppContext} from "@contexts/app.jsx";
import UserService from "@services/user.js";
import {toast} from "react-toastify";
import UserAccountSettings from "@components/user/account.settings.jsx";

export default function SuperHeaderSide(){
	const {setUser} = useContext(AppContext);
	const navigate = useNavigate();

	const [open, setOpen] = useState(false);


	const handleSignOut = async () => {
		const response = await UserService.logout();

		if (response.code === 0) {
			localStorage.removeItem("authenticated"); // Remove authentication flag
			setUser(null); // Clear user context
			toast.success("Logout successfully");
			navigate("/login"); // Redirect to login page
		} else {
			toast.error("Logout unsuccessfully");
		}
	};

	const items = [
		{
			label: 'Account Settings',
			key: '1',
			icon: <AccountProfileIcon style={{fontSize: "14px"}}/>,
			onClick: () => setOpen(true),
		},
		{
			label: 'Sign Out',
			key: '2',
			icon: <SignOutIcon style={{fontSize: "14px"}}/>,
			onClick: handleSignOut,
		},
	];

	return (
		<div className="super-header-side">
			<QuestionCircleOutlined style={{fontSize: "16px"}} className="shs-item"/>
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
			<UserAccountSettings open={open} setOpen={setOpen} />
		</div>
	);
}