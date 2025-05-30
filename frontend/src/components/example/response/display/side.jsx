import {useContext, useState} from "react";
import {Select} from "antd";
import {ExampleContext} from "@contexts/example.jsx";
import Request from "@components/request/request.jsx";
import {WorkspaceContext} from "@contexts/workspace.jsx";

export default function ExampleResponseSide(){
	const {workspace} = useContext(WorkspaceContext);
	let {responseStatus, setResponseStatus} = useContext(ExampleContext);

	const [options, setOptions] = useState(Request.STATUS_CODES());

	const handleChangeStatus = (value) => {
		setResponseStatus(value);
	}

	const handleSearch = (query) => {
		let temp =  Request.STATUS_CODES().filter(method => {
				return method.label.toLowerCase().includes(query.toLowerCase())
			}
		);
		setOptions(temp);
	};

	return (
		<div className="request-response-side">
			<p className="select-title">Status Code</p>
			<Select
				showSearch
				placeholder="Enter Response Code"
				optionFilterProp="label"
				options={options}
				defaultValue={responseStatus || ""}
				value={responseStatus || ""}
				onChange={handleChangeStatus}
				style={{width: 190, fontSize: 12}}
				disabled={!workspace?.can?.editable}
			/>
		</div>
	)
}