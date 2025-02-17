import {DeleteOutlined} from "@ant-design/icons";
import {Checkbox, Input} from 'antd';
import {useContext, useRef} from "react";
import {RequestContext} from "@contexts/request.jsx";
import _ from "lodash";

export default function RequestEditorParams(){
	let {params, setParams, url, setUrl} = useContext(RequestContext);
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
		params.forEach(row => {
			if (!row.selected) return;

			if (queryString) queryString += '&';
			if (row.key) queryString += row.key;
			if (row.value) queryString += `=${row.value}`;
		});

		if (queryString) queryString = '?' + queryString;
		let baseUrl = url.split('?')[0];
		const newUrl = baseUrl + queryString;

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
						let actionHtml = !(index === params.length - 1) ?
							<DeleteOutlined className="remove-icon" size='16' onClick={() => handleRemoveRow(index)}/> : '';
						let selectedHtml = !(index === params.length - 1) ?
							<Checkbox name={`${prefixName}_selected_${index}`} checked={row.selected} onChange={(e) =>
								handleInputChange(index, "selected", e.target.checked)
							}/> : '';

						return (
							<div className="row" key={index}>
								<div className="col selected-col">
									{selectedHtml}
								</div>
								<div className="col key-col">
									<Input placeholder="Key" variant="borderless" name={`${prefixName}_key_${index}`}
										   value={row.key}
										   onChange={(e) => handleInputChange(index, "key", e.target.value)}/>
								</div>
								<div className="col value-col">
									<Input placeholder="Value" variant="borderless"
										   name={`${prefixName}_value_${index}`} value={row.value}
										   onChange={(e) => handleInputChange(index, "value", e.target.value)}/>
								</div>
								<div className="col content-col">
									<Input placeholder="Description" variant="borderless"
										   name={`${prefixName}_content_${index}`} value={row.content}
										   onChange={(e) => handleInputChange(index, "content", e.target.value)}/>
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


