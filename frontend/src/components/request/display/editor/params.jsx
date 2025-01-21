import {DeleteOutlined} from "@ant-design/icons";
import {Checkbox, Input} from 'antd';
import {useContext, useState} from "react";
import {RequestContext} from "@contexts/request.jsx";
import _ from "lodash";

export default function RequestEditorParams(){
	let {params, setParams, setUrl} = useContext(RequestContext);

	const handleInputChange = (index, field, value) => {
		const params_dup = _.cloneDeep(params);
		params_dup[index][field] = value;

		// If the last row is being edited, add a new empty row
		if(index === params.length - 1){
			params_dup.push({selected: 0, key: '', value: '', content: ''});
		}
		setParams(params_dup);
	};

	const handleRemoveRow = (index) => {
		const params_dup = _.cloneDeep(params);
		params_dup.splice(index, 1);
		setParams(params_dup);
	};

	const buildParams = () => {
		//TODO: build params from URL and vice versa
	}


	return (
		<div className="request-editor-params">
			<h3 className="title">Query Params</h3>
			<div className="params-table">
				<div className="table-header">
					<div></div>
					<div>Key</div>
					<div>Value</div>
					<div>Description</div>
					<div></div>
				</div>
				<div className="table-body">
					{params.map((row, index) => {
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


