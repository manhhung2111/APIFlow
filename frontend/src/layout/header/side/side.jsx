import {Avatar, Dropdown} from "antd";
import {QuestionCircleOutlined, SettingOutlined, UserOutlined} from "@ant-design/icons";
import AccountModal from "@layout/header/side/modal.jsx";
import {NavLink} from "react-router";

export default function SuperHeaderSide(){

	return (
		<div className="super-header-side">
			<NavLink to={"helpdesk"} className="shs-item"><QuestionCircleOutlined style={{fontSize: "16px"}}/></NavLink>
			<SettingOutlined style={{fontSize: "16px"}} className="shs-item"/>
			<Dropdown
				dropdownRender={() => (<AccountModal />)}
				trigger={['click']}
				placement="bottomRight"
				className="account-dropdown shs-item"
			>
				<Avatar style={{ backgroundColor: '#1F509A' }} icon={<UserOutlined/>} size={"small"}/>
			</Dropdown>
		</div>
	);
}