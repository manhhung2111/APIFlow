import {useToggle} from "@uidotdev/usehooks";
import DocumentIcon from "@assets/icons/document.jsx";
import {CommentOutlined, InfoCircleOutlined} from "@ant-design/icons";
import {Drawer, Tooltip} from "antd";
import RequestSidebarDocumentation from "@components/request/sidebar/documentation.jsx";

export default function RequestSidebar() {
	const [showDocument, setShowDocument] = useToggle(false);


	const items = [
		{icon: <DocumentIcon />, label: "Documentation"},
		{icon: <CommentOutlined />, label: "Comments"},
		{icon: <InfoCircleOutlined />, label: "Info"}
	];



	return (
		<div className="request-sidebar">
			{items.map((item, index) => (
				<Tooltip key={`rs-sidebar-${index}`} overlayClassName={"rs-tooltip"} color={"white"} arrow={false} placement="leftTop" title={item.label} onClick={() => {setShowDocument(true)}}>
					<div className="rs-item">
						{item.icon}
					</div>
				</Tooltip>
			))}
			<Drawer
				classNames={{body: "request-documentation-drawer__wrapper", header: "workspace-variable-drawer-header"}}
				title="Documentation"
				onClose={() => setShowDocument(false)} open={showDocument}
				width={450}
			>
				<RequestSidebarDocumentation />
			</Drawer>
		</div>
	)
}