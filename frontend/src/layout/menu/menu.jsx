import {Button, Tabs} from "antd";
import "./menu.scss";
import {AppstoreOutlined, UserOutlined} from "@ant-design/icons";
import PrimaryMenu from "@layout/menu/primary.jsx";
import CollectionIcon from "@assets/icons/collection.jsx";

export default function MasterMenu(){

	const items = [
		{label: <IconWrapper icon={<CollectionIcon  size={16}/>} title={"Collections"}/>, key: 1, children: <PrimaryMenu />},
		{label: <IconWrapper icon={<AppstoreOutlined  size={16}/>} title={"Environments"}/>, key: 2, children: "Content of tab 2"},
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

function IconWrapper(props){
	const {icon, title} = props;

	return (
		<div className='icon-wrapper'>
			{icon}
			<div className='title'>{title}</div>
		</div>
	)
}