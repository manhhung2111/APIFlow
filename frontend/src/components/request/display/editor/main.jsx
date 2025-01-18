import {Tabs, Button} from "antd";
import RequestEditorParams from "@components/request/display/editor/params.jsx";

export default function RequestEditorUrlMain() {
	const items = [
		{label: "Params", key: 1, children: <RequestEditorParams params={[]}/>},
		{label: "Authorization", key: 2, children: "Authorization"},
		{label: "Headers", key: 3, children: "Headers"},
		{label: "Body", key: 4, children: "Body"},
		{label: "Scripts", key: 5, children: "Scripts"},
		{label: "Settings", key: 6, children: "Settings"},
	]

	const rightSide = {
		right: <Button color="#1F509A" variant="link"> Cookies </Button>
	}
	return (
		<div className="request-editor-url-main">
			<Tabs tabBarExtraContent={rightSide} items={items} size={"small"} tabBarGutter={24}/>
		</div>
	);
}