import {Button, Input, Select, Space} from "antd";
import {SendOutlined} from "@ant-design/icons";

export default function RequestEditorUrl(){
	const requestMethods = [
		{value: "get", label: "GET"},
		{value: "put", label: "PUT"},
		{value: "post", label: "POST"},
		{value: "delete", label: "DELETE"}
	]

	return (
		<div className="request-editor-url">
			<Space.Compact className="editor-url">
				<Select
					showSearch
					placeholder="Search to Select"
					optionFilterProp="label"

					defaultValue="get"
					options={requestMethods}
				/>
				<Input className="url" placeholder="Enter URL or paste text"/>
			</Space.Compact>
			<Button className="editor-action" type="primary"> <SendOutlined /> Send</Button>
		</div>
	)
};