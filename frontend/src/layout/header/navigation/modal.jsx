import {Button, Input} from "antd";
import {NavLink, useNavigate} from "react-router";
import {UserOutlined} from "@ant-design/icons";

export default function WorkspaceSelectionModal(props){
	const {setSearchTerm} = props;
	const navigate = useNavigate();
	const workspaces = [
		{id: 1, name: "Workspace 1"},
		{id: 2, name: "Workspace 2"},
	];

	return (
		<div className="workspace-selection-modal">
			<div className="wsm-header">
				<Input placeholder="Search workspaces" onChange={(e) => setSearchTerm(e.target.value)}/>
				<Button color="default" variant="filled" onClick={() => {
					navigate("workspace/create");
				}}>
					Create Workspace
				</Button>
			</div>
			<div className="wsm-main">
				<h6>Recently visited</h6>
				<div className="workspace-list">
					{workspaces.map(workspace => (
						<NavLink key={`workspace-${workspace.id}`} to={`workspace/${workspace.id}`}
								 className="workspace-item">
							<UserOutlined style={{fontSize: "16px"}}/> &nbsp;{workspace.name}
						</NavLink>
					))}
				</div>
			</div>
		</div>
	)
}