import {Button, Input} from "antd";
import {NavLink} from "react-router";
import {UserOutlined} from "@ant-design/icons";
import WorkspaceFormCreate from "@components/workspace/form/create.jsx";
import {useContext, useState} from "react";
import {AppContext} from "@contexts/app.jsx";

export default function WorkspaceSelectionModal(props){
	const {setSearchTerm, setDropdownVisible} = props;
	const [createFormVisibility, setCreateFormVisibility] = useState(false);

	const {workspaces} = useContext(AppContext);

	const handleCreateWorkspaceClick = () => {
		setDropdownVisible(false); // Close the dropdown when "Create Workspace" is clicked
		setCreateFormVisibility(true);
	};

	return (
		<div className="workspace-selection-modal">
			<div className="wsm-header">
				<Input placeholder="Search workspaces" onChange={(e) => setSearchTerm(e.target.value)}/>
				<Button color="default" variant="filled" onClick={handleCreateWorkspaceClick}>
					Create Workspace
				</Button>
			</div>
			<div className="wsm-main">
				<h6>Recently visited</h6>
				<div className="workspace-list">
					{workspaces.map(workspace => (
						<NavLink key={`workspace-${workspace.object_id}`} to={`/workspace/${workspace.object_id}`} onClick={() => setDropdownVisible(false)}
								 className="workspace-item">
							<UserOutlined style={{fontSize: "16px"}}/> &nbsp;{workspace.name}
						</NavLink>
					))}
				</div>
			</div>
			<WorkspaceFormCreate
				visible={createFormVisibility}
				setVisible={setCreateFormVisibility}
			/>
		</div>
	)
}