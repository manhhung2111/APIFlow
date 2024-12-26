import {useDebounce, useToggle} from "@uidotdev/usehooks";
import {Button} from "antd";
import {useNavigate} from "react-router";
import {DownOutlined, UpOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";
import WorkspaceSelectionModal from "./modal.jsx";

export default function SuperHeaderNavs(){
	const [modalState, toggleModalState] = useToggle(false);
	const [searchTerm, setSearchTerm] = useState("");
	const debouncedSearchTerm = useDebounce(searchTerm, 500);
	const navigate = useNavigate();

	useEffect(() => {
		console.log(`Search workspaces with ${debouncedSearchTerm}`);
	}, [debouncedSearchTerm])

	return (
		<div className="super-header-navs">
			<Button type="text" onClick={() => navigate("/")}>Home</Button>
			<Button className={`workspace-btn ${modalState && "active"}`} type="text"
					onClick={() => toggleModalState(!modalState)}
					icon={modalState ? <UpOutlined/> : <DownOutlined/>} iconPosition={"end"}>
				Workspace
			</Button>

			<WorkspaceSelectionModal
				modalState={modalState}
				toggleModalState={toggleModalState}
				setSearchTerm={setSearchTerm}
			/>
		</div>
	);
};