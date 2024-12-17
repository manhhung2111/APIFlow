import {UserOutlined} from "@ant-design/icons";
import {NavLink} from "react-router";

export default function WorkspaceList(){
	const workspaces = [
		{id: 1, name: "Workspace 1"},
		{id: 2, name: "Workspace 2"},
	];

	return (
		<div className="workspace-list">
			{workspaces.map(workspace => (
				<NavLink key={`workspace-${workspace.id}`} to={`workspace/${workspace.id}`} className="workspace-item">
					<UserOutlined/> {workspace.name}
				</NavLink>
			))}
		</div>
	);
};