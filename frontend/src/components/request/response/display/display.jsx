import {useContext} from "react";
import {RequestContext} from "@contexts/request.jsx";
import {Tabs} from "antd";
import RequestResponseSide from "@components/request/response/display/side.jsx";
import '@components/request/styles/response/index.scss';
import RequestResponseBody from "@components/request/response/display/body.jsx";
import RequestResponseHeaders from "@components/request/response/display/headers.jsx";
import RequestResponseCookies from "@components/request/response/display/cookies.jsx";
import RequestResponseTestResults from "@components/request/response/display/test.results.jsx";

export default function RequestResponse(){
	let {response} = useContext(RequestContext);

	const items = [
		{label: "Body", key: 1, children: <RequestResponseBody />},
		{label: "Cookies", key: 2, children: <RequestResponseCookies />},
		{label: "Headers", key: 3, children: <RequestResponseHeaders />},
		{label: "Test Results", key: 4, children: <RequestResponseTestResults />},
	];

	return (
		<div className="request-response">
			<div className="rr-header">
				<h3>Response</h3>
				<RequestResponseSide />
			</div>
			<Tabs items={items} size={"small"} tabBarGutter={8}/>
		</div>
	);
}