import {useDebounce, useToggle} from "@uidotdev/usehooks";
import {Button} from "antd";
import {useNavigate} from "react-router";
import {DownOutlined, UpOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";
import WorkspaceSelectionModal from "./modal.jsx";

export default function SuperHeaderNavs(){
	const [modalState, toggleModalState] = useToggle(false);
	const [search_term, setSearchTerm] = useState("");
	const debouncedSearchTerm = useDebounce(search_term, 500);
	const navigate = useNavigate();

	useEffect(() => {
		console.log(`Search workspaces with ${debouncedSearchTerm}`);
	}, [debouncedSearchTerm])

	return (
		<div className="super-header-navs">
			<Button type="text" onClick={() => navigate("/")}>Home</Button>
			<Button type="text" onClick={() => toggleModalState(!modalState)}
					icon={modalState ? <UpOutlined/> : <DownOutlined/>} iconPosition={"end"}>
				Workspace
			</Button>

			<WorkspaceSelectionModal
				modalState={modalState}
				setModalState={toggleModalState}
				setSearchTerm={setSearchTerm}
			/>
		</div>
	);
};