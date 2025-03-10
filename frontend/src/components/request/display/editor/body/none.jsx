import {Empty} from "antd";

export default function RequestEditorBodyNone(){

	return (
		<Empty
		image={Empty.PRESENTED_IMAGE_SIMPLE}
		description={
			<div className="empty-message" style={{fontSize: "12px"}}>
				This request does not have a body
			</div>
		}
	>
	</Empty>)
}