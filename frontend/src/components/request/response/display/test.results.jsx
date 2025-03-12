import EmptyMain from '@assets/images/empty.main.svg';
import {useContext} from "react";
import {RequestContext} from "@contexts/request.jsx";

export default function RequestResponseTestResults(){
	const {response} = useContext(RequestContext);

	return (
		<div className="request-response-test-results request-response-content">
			{response && (typeof response.test_results === "string") && <div className="error-message">
				{response.test_results}
			</div>}
			{response && (typeof response.test_results !== "string") && response.test_results?.length === 0 && (
				<div className="empty">
					<img src={EmptyMain} alt={"Empty test results"}/>
					<div className="empty-message" style={{fontSize: "12px"}}>
						There are no tests for this request
					</div>
				</div>
			)}
			<div className="test-cases">
				{response && (typeof response.test_results !== "string") && response.test_results?.length > 0 && response.test_results.map((testResult, index) => {
						let message = testResult.message;
						if (testResult.extra) message += " | " + testResult.extra;

						return (<div className='test-case'>
							<div className={`status ${testResult.status}`}>{testResult.status}</div>
							<p className='message'>{message}</p>
						</div>)
					}
				)}
			</div>
		</div>
	)
}