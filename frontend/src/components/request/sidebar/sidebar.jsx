import {useToggle} from "@uidotdev/usehooks";
import DocumentIcon from "@assets/icons/document.jsx";
import {CommentOutlined, InfoCircleOutlined} from "@ant-design/icons";
import {Drawer, Tooltip} from "antd";

export default function RequestSidebar() {
	const [showDrawer, setShowDrawer] = useToggle(false);
	const items = [
		{icon: <DocumentIcon />, label: "Documentation"},
		{icon: <CommentOutlined />, label: "Comments"},
		{icon: <InfoCircleOutlined />, label: "Info"}
	];

	return (
		<div className="request-sidebar">
			{items.map((item, index) => (
				<Tooltip key={`rs-sidebar-${index}`} overlayClassName={"rs-tooltip"} color={"white"} arrow={false} placement="leftTop" title={item.label} onClick={() => {setShowDrawer(true)}}>
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