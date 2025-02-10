import {Button, Tabs, Skeleton} from "antd";
import "./styles/menu.scss";
import {UserOutlined} from "@ant-design/icons";
import PrimaryMenu from "@layout/menu/primary/primary.jsx";
import CollectionIcon from "@assets/icons/collection.jsx";
import {BaseLabel} from "@utils/text.jsx";
import {useContext} from "react";
import {AppContext} from "@contexts/app.jsx";
import Menu from "@utils/menu/menu.jsx";
import EnvironmentMenu from "@layout/menu/environment/environment.jsx";
import FolderEnvironmentIcon from "@assets/icons/folder.environment.jsx";
import {WorkspaceContext} from "@contexts/workspace.jsx";
import {NavLink} from "react-router";

export default function MasterMenu(){
	const {menuItems, environments} = useContext(AppContext)
	const {collections, folders, requests, examples} = menuItems;

	const primaryMenuItems = Menu.constructPrimaryMenu(collections, folders, requests, examples);
	const [globalEnvItems, environmentItems] = Menu.constructEnvironmentMenu(environments);

	const {workspace} = useContext(WorkspaceContext);
	console.log(workspace);
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
					<Button size={"small"} color="default" variant="filled">New</Button>
					<Button size={"small"} color="default" variant="filled">Import</Button>
				</div>
			</div>
			<div className="menu-main">
				<Tabs
					tabPosition={"left"}
					items={items}
				/>
			</div>
		</div>
	);
}