import {Avatar} from "antd";
import {UserOutlined} from "@ant-design/icons";
import {useToggle} from "@uidotdev/usehooks";

export default function SuperHeaderSide(){
	const [modalState, toggleModalState] = useToggle(false);

	return (
		<div className="super-header-side">
			<Avatar size="large" icon={<UserOutlined/>} onClick={() => toggleModalState(!modalState)}/>

		</div>
	);
}