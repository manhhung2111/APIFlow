import {Avatar} from "antd";
import {UserOutlined} from "@ant-design/icons";
import {useToggle} from "@uidotdev/usehooks";
import AccountModal from "@layout/header/side/modal.jsx";

export default function SuperHeaderSide(){
	const [modalState, toggleModalState] = useToggle(false);

	return (
		<div className="super-header-side">
			<Avatar icon={<UserOutlined/>} onClick={() => toggleModalState(!modalState)}/>
			<AccountModal
				modalState={modalState}
				toggleModalState={toggleModalState}
			/>
		</div>
	);
}