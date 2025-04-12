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

	const generateItems = () => {
		let testResultsLabel = <div className="response-tab-label">Test Results</div>;
		if(response && typeof response.test_results === "string"){
			testResultsLabel = <div className="response-tab-label">Test Results
				<span className="error-badge"></span>
			</div>;
		} else if(response && typeof response.test_results !== "string" && response.test_results?.length > 0){
			const passedTests = response.test_results.reduce((count, test) => {
				return test.status === "passed" ? count + 1 : count;
			}, 0);

			if(passedTests === response.test_results.length){
				testResultsLabel = <div className="response-tab-label">Test Results
					<span className="passed">{`(${passedTests}/${passedTests})`}</span>
				</div>;
			} else {
				testResultsLabel = <div className="response-tab-label">Test Results
					<span
						className="error">{`(${response.test_results.length - passedTests}/${response.test_results.length})`}</span>
				</div>;
			}
		}

		let headersLabel = <div className="response-tab-label">Headers</div>;
		if(Object.keys(response.headers).length > 0){
			headersLabel = <div className="response-tab-label">Headers <span
				className="passed">{`(${Object.keys(response.headers).length})`}</span></div>
		}

		return [
			{label: <div className="response-tab-label">Body</div>, key: 1, children: <RequestResponseBody/>},
			{label: <div className="response-tab-label">Cookies</div>, key: 2, children: <RequestResponseCookies/>},
			{label: headersLabel, key: 3, children: <RequestResponseHeaders/>},
			{label: testResultsLabel, key: 4, children: <RequestResponseTestResults/>},
		]
	}

	if(!request){
		return "";
	}

	return (
		<div className="request-response">
			<div className="rr-header">
				<h3>Response</h3>
				{response && !(typeof response === "string") && <RequestResponseSide/>}
			</div>
			{response && typeof response === "string" && <div className="error-message">
				{response}
			</div>}

			{!response && !(typeof response === "string") && <div className="empty-response">
				<img className="empty-response-img" src={EmptyResponse} alt="Empty Response"/>
				<p>Click Send to get a response</p>
			</div>}
			{response && !(typeof response === "string") &&
				<Tabs items={generateItems()} size={"small"} tabBarGutter={16}/>}
		</div>
	);
}