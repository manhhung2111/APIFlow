import AppCodeBlock from "@components/app/editor/code.block.jsx";
import Request from "@components/request/request.jsx";
import {useContext} from "react";
import {RequestContext} from "@contexts/request.jsx";
import TimeUtils from "@utils/time.js";

export default function RequestSidebarInfo(){
	const {request} = useContext(RequestContext);

	return <div className="request-sidebar-info">
		<div className="section">
			<div className="label">ID</div>
			<div className="value id">
				{request?._id}
			</div>
		</div>
		<div className="section">
			<div className="label">Created on</div>
			<div className="value">
				{TimeUtils.formatDate(request?.created_at)}
			</div>
		</div>
		<div className="section">
			<div className="label">Last updated</div>
			<div className="value">
				{TimeUtils.formatDate(request?.updated_at)}
			</div>
		</div>
	</div>
}