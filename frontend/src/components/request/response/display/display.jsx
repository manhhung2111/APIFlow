import {useContext} from "react";
import {RequestContext} from "@contexts/request.jsx";
import {Tabs} from "antd";
import RequestResponseSide from "@components/request/response/display/side.jsx";
import '@components/request/styles/response/index.scss';
import RequestResponseBody from "@components/request/response/display/body.jsx";
import RequestResponseHeaders from "@components/request/response/display/headers.jsx";
import RequestResponseCookies from "@components/request/response/display/cookies.jsx";
import RequestResponseTestResults from "@components/request/response/display/test.results.jsx";
import EmptyResponse from "@assets/images/empty.response.svg"

export default function RequestResponse(){
	let {response, request} = useContext(RequestContext);

	const items = [
		{label: "Body", key: 1, children: <RequestResponseBody />},
		{label: "Cookies", key: 2, children: <RequestResponseCookies />},
		{label: "Headers", key: 3, children: <RequestResponseHeaders />},
		{label: "Test Results", key: 4, children: <RequestResponseTestResults />},
	];

	if (!request){
		return "";
	}

	return (
		<div className="request-response">
			<div className="rr-header">
				<h3>Response</h3>
				{response && <RequestResponseSide />}
			</div>
			{!response && <div className="empty-response">
				<img className="empty-response-img" src={EmptyResponse} alt="Empty Response"/>
				<p>Click Send to get a response</p>
			</div>}
			{response && <Tabs items={items} size={"small"} tabBarGutter={8}/>}
		</div>
	);
}