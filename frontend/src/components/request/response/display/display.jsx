import {useContext} from "react";
import {RequestContext} from "@contexts/request.jsx";
import {Tabs} from "antd";
import RequestResponseSide from "@components/request/response/display/side.jsx";
import '@components/request/styles/response/index.scss';
import RequestResponseBody from "@components/request/response/display/body.jsx";

export default function RequestResponse(){
	let {response} = useContext(RequestContext);

	const items = [
		{label: "Body", key: 1, children: <RequestResponseBody />},
		{label: "Cookies", key: 2, children: "Cookies"},
		{label: "Headers", key: 3, children: "Headers"},
		{label: "Test results", key: 4, children: "Test results"},
	];

	const rightSide = {
		right: <RequestResponseSide />
	}

	return (
		<div className="request-response">
			<h3>Response</h3>
			<Tabs tabBarExtraContent={rightSide} items={items} size={"small"} tabBarGutter={8}/>
		</div>
	);
}