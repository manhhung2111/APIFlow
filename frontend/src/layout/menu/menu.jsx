import {Button, Tabs} from "antd";
import "./menu.scss";
import {AppstoreOutlined, UserOutlined} from "@ant-design/icons";
import PrimaryMenu from "@layout/menu/primary.jsx";
import CollectionIcon from "@assets/icons/collection.jsx";
import {BaseLabel} from "@utils/text.jsx";
import {useContext} from "react";
import {AppContext} from "@contexts/app.jsx";
import Menu from "@utils/menu/menu.jsx";


export default function MasterMenu(){
	const {menuItems} = useContext(AppContext)
	const {collections, folders, requests, examples} = menuItems;
	const primaryMenuItems = Menu.constructPrimaryMenu(collections, folders, requests, examples);

	const items = [
		{label: <BaseLabel icon={<CollectionIcon  size={16}/>} title={"Collections"}/>, key: 1, children: <PrimaryMenu items={primaryMenuItems}/>},
		{label: <BaseLabel icon={<AppstoreOutlined  size={16}/>} title={"Environments"}/>, key: 2, children: "Content of tab 2"},
	]



	return (
		<div className={"master-menu"}>
			<div className="menu-header">
				<div className="left-section">
					<Button type={"link"} icon={<UserOutlined />}>My Workspace</Button>
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