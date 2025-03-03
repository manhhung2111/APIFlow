import {useContext} from "react";
import {Tabs} from "antd";
import '@components/request/styles/response/index.scss';
import ExampleResponseHeaders from "@components/example/response/display/headers.jsx";
import ExampleResponseBody from "@components/example/response/display/body.jsx";
import {ExampleContext} from "@contexts/example.jsx";
import ExampleResponseSide from "@components/example/response/display/side.jsx";

export default function ExampleResponse(){
	let {example} = useContext(ExampleContext);

	const items = [
		{label: "Body", key: 1, children: <ExampleResponseBody/>},
		{label: "Headers", key: 3, children: <ExampleResponseHeaders/>},
	];

	if(!example){
		return "";
	}

	return (
		<div className="request-response">
			<div className="rr-header">
				<h3>Response</h3>
				{example && <ExampleResponseSide/>}
			</div>
			{example && <Tabs items={items} size={"small"} tabBarGutter={8}/>}
		</div>
	);
}