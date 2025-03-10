import {DeleteOutlined} from "@ant-design/icons";
import {Checkbox, Input} from 'antd';
import {useContext, useRef} from "react";
import _ from "lodash";
import AppInputVariable from "@components/app/input/variable/input.jsx";
import {ExampleContext} from "@contexts/example.jsx";
import {WorkspaceContext} from "@contexts/workspace.jsx";

export default function ExampleEditorParams(){
	const {workspace} = useContext(WorkspaceContext);
	let {params, setParams, url, setUrl} = useContext(ExampleContext);
	const containerRef = useRef(null);

	const handleInputChange = (index, field, value) => {
		const params_dup = _.cloneDeep(params);
		params_dup[index][field] = value;

		// If the last row is being edited, add a new empty row
		if(index === params.length - 1){
			params_dup.push({selected: 0, key: '', value: '', content: ''});
			params_dup[index]["selected"] = 1;

			handleBuildUrl(params_dup);
			setParams(params_dup);

			setTimeout(() => {
				containerRef.current?.scrollTo({top: containerRef.current.scrollHeight, behavior: "smooth"});
			}, 50);
		} else {
			handleBuildUrl(params_dup);
			setParams(params_dup);
		}
	};

	const handleRemoveRow = (index) => {
		const params_dup = _.cloneDeep(params);
		params_dup.splice(index, 1);
		handleBuildUrl(params_dup);
		setParams(params_dup);
	};

	const handleBuildUrl = (params) => {
		let queryString = "";

		for (let i = 0 ; i < params.length - 1 ; i++) {
			const row = params[i];
			if(!row.selected) continue;

			if(queryString) queryString += '&';
			if(row.key) queryString += row.key;
			if(row.value) queryString += `=${row.value}`;
		}
		console.log(queryString);
		if(queryString) queryString = '?' + queryString;
		let baseUrl = url.split('?')[0];
		const newUrl = baseUrl + queryString;
		// console.log(newUrl)

		setUrl(newUrl);
	}

	return (
		<div className="request-editor request-editor-params" ref={containerRef}>
			<h3 className="title">Query Params</h3>
			<div className="request-table">
				<div className="table-header">
					<div></div>
					<div>Key</div>
					<div>Value</div>
					<div>Description</div>
					<div></div>
				</div>
				<div className="table-body">
					{params?.length > 0 && params.map((row, index) => {
						let prefixName = 'request_query_params';
						let actionHtml = !(index === params.length - 1 || !workspace?.can?.editable) ?
							<DeleteOutlined className="remove-icon" size='16'
											onClick={() => handleRemoveRow(index)}/> : '';
						let selectedHtml = !(index === params.length - 1) ?
							<Checkbox name={`${prefixName}_selected_${index}`} checked={row.selected} onChange={(e) =>
								handleInputChange(index, "selected", e.target.checked)
							} disabled={!workspace?.can?.editable}/> : '';

						return (
							<div className="row" key={index}>
								<div className="col selected-col">
									{selectedHtml}
								</div>
								<div className="col key-col">
									<AppInputVariable placeholder="Key"
													  setText={(value) => handleInputChange(index, "key", value)}
													  text={row.key} disabled={!workspace?.can?.editable}/>
								</div>
								<div className="col value-col">
									<AppInputVariable placeholder="Value"
													  setText={(value) => handleInputChange(index, "value", value)}
													  text={row.value} disabled={!workspace?.can?.editable}/>
								</div>
								<div className="col content-col">
									<Input placeholder="Description" variant="borderless"
										   name={`${prefixName}_content_${index}`} value={row.content}
										   onChange={(e) => handleInputChange(index, "content", e.target.value)}
										   disabled={!workspace?.can?.editable}/>
								</div>
								<div className="col action-col">
									{actionHtml}
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	)
};


