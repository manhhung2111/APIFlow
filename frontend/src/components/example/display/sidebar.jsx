import {Tooltip} from "antd";
import DocumentIcon from "@assets/icons/document.jsx";
import {InfoCircleOutlined} from "@ant-design/icons";

export default function ExampleSidebar(){
	const items = [
		{icon: <DocumentIcon/>, label: "Documentation"},
		{icon: <InfoCircleOutlined/>, label: "Info"},
	];

	return (<div className="request-sidebar">
		{items.map((item, index) => (
			<Tooltip key={`rs-sidebar-${index}`} overlayClassName={"rs-tooltip"} color={"white"} arrow={false}
					 placement="leftTop" title={item.label}>
				<div className="rs-item">
					{item.icon}
				</div>
			</Tooltip>
		))}
	</div>)
}