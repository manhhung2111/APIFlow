import {useContext} from "react";
import {AppContext} from "@contexts/app.jsx";
import {Modal} from "antd";

export default function UserAccountSettings({open, setOpen}) {
	const {user, setUser} = useContext(AppContext);


	const handleCancel = () => {
		setOpen(false);
	}

	return (
		<div className="user-account-settings">
			<Modal title="Account Settings" open={open} onCancel={handleCancel} footer={null}>
				user account settings
			</Modal>
		</div>
	)
}