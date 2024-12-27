import {useToggle} from "@uidotdev/usehooks";
import DocumentIcon from "@assets/icons/document.jsx";
import {CommentOutlined, InfoCircleOutlined, SettingOutlined} from "@ant-design/icons";
import {Drawer, Tooltip} from "antd";
import '../styles/sidebar.scss'

export default function RequestSidebar() {
	const [showDrawer, setShowDrawer] = useToggle(false);
	const items = [
		{icon: <DocumentIcon />, label: "Documentation", onClick: () => setShowDrawer(true)},
		{icon: <CommentOutlined />, label: "Comments", onClick: () => setShowDrawer(true)},
		{icon: <InfoCircleOutlined />, label: "Info", onClick: () => setShowDrawer(true)}
	];

	return (
		<div className="request-sidebar">
			{items.map((item) => (
				<Tooltip overlayClassName={"rs-tooltip"} color={"white"} arrow={false} placement="leftTop" title={item.label} onClick={() => {setShowDrawer(true)}}>
					<div className="rs-item">
						{item.icon}
					</div>
				</Tooltip>
			))}
			<Drawer title="Basic Drawer" onClose={() => setShowDrawer(false)} open={showDrawer}>
				<p>Some contents...</p>
				<p>Some contents...</p>
				<p>Some contents...</p>
			</Drawer>
		</div>
	)
}