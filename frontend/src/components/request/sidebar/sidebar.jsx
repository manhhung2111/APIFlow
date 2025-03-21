import {useToggle} from "@uidotdev/usehooks";
import DocumentIcon from "@assets/icons/document.jsx";
import {InfoCircleOutlined} from "@ant-design/icons";
import {Drawer, Tooltip} from "antd";
import RequestSidebarDocumentation from "@components/request/sidebar/documentation.jsx";
import CodeIcon from "@assets/icons/code.jsx";
import RequestSidebarInfo from "@components/request/sidebar/code.jsx";

export default function RequestSidebar(){
	const [showDocument, setShowDocument] = useToggle(false);
	const [showCode, setShowCode] = useToggle(false);

	const items = [
		{
			icon: <DocumentIcon/>, label: "Documentation", onClick: () => {
				setShowDocument(true)
			}
		},
		{
			icon:  <InfoCircleOutlined/>, label: "Info", onClick: () => {
				setShowCode(true)
			}
		},
	];

	return (
		<div className="request-sidebar">
			{items.map((item, index) => (
				<Tooltip key={`rs-sidebar-${index}`} overlayClassName={"rs-tooltip"} color={"white"} arrow={false}
						 placement="leftTop" title={item.label} onClick={item.onClick}>
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
				<RequestSidebarDocumentation/>
			</Drawer>
			<Drawer
				classNames={{body: "request-documentation-drawer__wrapper", header: "workspace-variable-drawer-header"}}
				title="Request details"
				onClose={() => setShowCode(false)} open={showCode}
				width={450}
			>
				<RequestSidebarInfo/>
			</Drawer>
		</div>
	)
}