import {Avatar, Button, Dropdown, Modal, Typography} from "antd";
import {LogoutOutlined, QuestionCircleOutlined, SettingOutlined, UserOutlined} from "@ant-design/icons";
import {NavLink} from "react-router";

const {Paragraph, Text} = Typography;
export default function AccountModal(props){
	const {modalState, toggleModalState} = props;

	return (
		<>
			<div className="am-header">
				<Avatar size="large" icon={<UserOutlined/>} onClick={() => toggleModalState(!modalState)}/>
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
		</>
	)
}