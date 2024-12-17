import {Button, Input, Modal} from "antd";
import WorkspaceList from "@components/workspace/board/list";
import {useNavigate} from "react-router";

export default function WorkspaceSelectionModal(props){
	const {modalState, toggleModalState, setSearchTerm} = props;
	const navigate = useNavigate();

	return (
		<Modal
			style={{top: 48, left: 40}}
			open={modalState}
			closable={false}
			afterClose={() => toggleModalState(false)}
			footer={null}
			mask={false}
			className={"workspace-selection-modal"}
		>
			<div className={"modal-header"}>
				<Input placeholder="Search workspaces" onChange={(e) => setSearchTerm(e.target.value)}/>;
				<Button color="default" variant="filled" onClick={() => {
					navigate("workspace/create");
				}}>
					Create Workspace
				</Button>
			</div>
			<div className={"modal-main"}>
				<h6>Recently visited</h6>
				<WorkspaceList/>
			</div>
		</Modal>
	)
}