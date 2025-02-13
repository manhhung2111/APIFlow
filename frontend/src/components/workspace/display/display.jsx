import {UserOutlined} from "@ant-design/icons";
import {useContext} from "react";
import {WorkspaceContext} from "@contexts/workspace.jsx";
import {Skeleton, Tabs} from "antd";
import '../styles/display.scss';
import WorkspaceDisplayOverview from "@components/workspace/display/overview.jsx";
import WorkspaceDisplaySettings from "@components/workspace/display/settings.jsx";

export default function WorkspaceDisplay() {
	const {workspace} = useContext(WorkspaceContext);

	const items = [
		{label: "Overview", key: 1, children: <WorkspaceDisplayOverview />},
		{label: "Settings", key: 2, children: <WorkspaceDisplaySettings />},
	]

	return (
		<div className="workspace-display">
			<div className="header">
				{workspace && <div className="text">
					<UserOutlined/>
					{workspace.name}
				</div>}
				{!workspace && <Skeleton.Input active={true} />}
			</div>
			<div className="main">
				{!workspace && <div style={{padding: "16px"}} >
					<Skeleton active />
				</div>}
				{workspace && <Tabs
					tabBarGutter={16}
					items={items}
				/>}
			</div>
		</div>
	)
}