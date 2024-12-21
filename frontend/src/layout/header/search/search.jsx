import {Button} from "antd";
import {SearchOutlined} from "@ant-design/icons";
import {useToggle} from "@uidotdev/usehooks";
import UniversalSearchModal from "./modal.jsx";

export default function SuperHeaderSearch(){
	const [modalState, toggleModalState] = useToggle(false);


	return (
		<div className="super-header-search">
			<Button icon={<SearchOutlined />} iconPosition={"start"} className="shs-btn"
					onClick={() => toggleModalState(true)}>
				Search APIFlow
			</Button>

			<UniversalSearchModal
				modalState={modalState}
				toggleModalState={toggleModalState}
			/>
		</div>
	);
}