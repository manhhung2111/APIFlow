import {Button, Skeleton, Tabs} from "antd";
import "./styles/menu.scss";
import {UserOutlined} from "@ant-design/icons";
import CollectionIcon from "@assets/icons/collection.jsx";
import {BaseLabel} from "@utils/text.jsx";
import {useContext, useState} from "react";
import {AppContext} from "@contexts/app.jsx";
import Menu from "@utils/menu/menu.jsx";
import EnvironmentMenu from "@components/environment/menu/menu.jsx";
import FolderEnvironmentIcon from "@assets/icons/folder.environment.jsx";
import {WorkspaceContext} from "@contexts/workspace.jsx";
import {NavLink} from "react-router";
import WorkspaceNewSelectForm from "@components/workspace/form/select.jsx";
import CollectionMenu from "@components/collection/menu/menu.jsx";

export default function MasterMenu(){
	const {workspace, activeMenuKey, setActiveMenuKey} = useContext(WorkspaceContext);

	const [newModalVisibility, setNewModalVisibility ] = useState(false);

	const items = [
		{
			label: <BaseLabel icon={<CollectionIcon style={{fontSize: "16px"}}/>} title={"Collections"}/>,
			key: 1,
			children: workspace ? <CollectionMenu /> : <Skeleton active/>
		},
		{
			label: <BaseLabel icon={<FolderEnvironmentIcon style={{fontSize: "16px"}}/>} title={"Environments"}/>,
			key: 2,
			children: workspace ? <EnvironmentMenu /> : <Skeleton active/>
		},
	];

	return (
		<div className={"master-menu"}>
			<div className="menu-header">
				<div className="left-section">
					{workspace && <NavLink to={`/workspace/${workspace._id}`} ><UserOutlined /> {workspace.name}</NavLink>}
					{!workspace && <Skeleton.Input active={true} style={{width: "200px"}}/>}
				</div>

				<div className="right-section">
					{workspace && <>
						<Button size={"small"} color="default" variant="filled" onClick={() => setNewModalVisibility(true)}>New</Button>
						<Button size={"small"} color="default" variant="filled">Import</Button>
					</>}
					{!workspace && <Skeleton.Button active={true} style={{width: "110px"}}/>}
				</div>
			</div>
			<div className="menu-main">
				<Tabs
					tabPosition={"left"}
					items={items}
					activeKey={activeMenuKey}
					onChange={(key) => setActiveMenuKey(key)}
				/>
			</div>
			<WorkspaceNewSelectForm
				visible={newModalVisibility}
				setVisible={setNewModalVisibility}
			/>
		</div>
	);
}