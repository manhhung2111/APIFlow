import {Button, Tabs, Skeleton} from "antd";
import "./styles/menu.scss";
import {UserOutlined} from "@ant-design/icons";
import PrimaryMenu from "@layout/menu/primary/primary.jsx";
import CollectionIcon from "@assets/icons/collection.jsx";
import {BaseLabel} from "@utils/text.jsx";
import {useContext, useState} from "react";
import {AppContext} from "@contexts/app.jsx";
import Menu from "@utils/menu/menu.jsx";
import EnvironmentMenu from "@layout/menu/environment/environment.jsx";
import FolderEnvironmentIcon from "@assets/icons/folder.environment.jsx";
import {WorkspaceContext} from "@contexts/workspace.jsx";
import {NavLink} from "react-router";
import WorkspaceNewSelectForm from "@components/workspace/form/select.jsx";

export default function MasterMenu(){
	const {menuItems, environments} = useContext(AppContext)
	const {workspace} = useContext(WorkspaceContext);
	const {collections, folders, requests, examples} = menuItems;

	const primaryMenuItems = Menu.constructPrimaryMenu(collections, folders, requests, examples);
	const [globalEnvItems, environmentItems] = Menu.constructEnvironmentMenu(environments);

	const [newModalVisibility, setNewModalVisibility ] = useState(false);

	const items = [
		{
			label: <BaseLabel icon={<CollectionIcon style={{fontSize: "16px"}}/>} title={"Collections"}/>,
			key: 1,
			children: <PrimaryMenu items={primaryMenuItems}/>
		},
		{
			label: <BaseLabel icon={<FolderEnvironmentIcon style={{fontSize: "16px"}}/>} title={"Environments"}/>,
			key: 2,
			children: <EnvironmentMenu globalEnv={globalEnvItems} environments={environmentItems} />
		},
	]


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
				/>
			</div>
			<WorkspaceNewSelectForm
				visible={newModalVisibility}
				setVisible={setNewModalVisibility}
			/>
		</div>
	);
}