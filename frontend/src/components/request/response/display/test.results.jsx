import {Empty} from "antd";
import EmptyMain from '@assets/images/empty.main.svg';

export default function RequestResponseTestResults(){


	return (
		<div className="request-response-test-results">
			<div className="empty">
				<img src={EmptyMain} alt={"Empty test results"}/>
				<div className="empty-message" style={{fontSize: "12px"}}>
					There are no tests for this request
				</div>
			</div>
		</div>
	)
}