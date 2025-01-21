import {DeleteOutlined} from "@ant-design/icons";
import {Checkbox, Input} from 'antd';
import {useContext} from "react";
import {RequestContext} from "@contexts/request.jsx";
import _ from "lodash";

export default function RequestEditorHeaders(){
	let {headers, setHeaders} = useContext(RequestContext);

	const handleInputChange = (index, field, value) => {
		const headers_dup = _.cloneDeep(headers);
		headers_dup[index][field] = value;

		// If the last row is being edited, add a new empty row
		if(index === headers.length - 1){
			headers_dup.push({selected: 0, key: '', value: '', content: ''});
		}
		setHeaders(headers_dup);
	};

	const handleRemoveRow = (index) => {
		const headers_dup = _.cloneDeep(headers);
		headers_dup.splice(index, 1);
		setHeaders(headers_dup);
	};

	return (
		<div className="request-editor-params request-editor-headers">
			<h3 className="title">Headers</h3>
			<div className="params-table">
				<div className="table-header">
					<div></div>
					<div>Key</div>
					<div>Value</div>
					<div>Description</div>
					<div></div>
				</div>
				<div className="table-body">
					{headers.map((row, index) => {
						let prefixName = 'request_headers';
						let actionHtml = !(index === headers.length - 1) ?
							<DeleteOutlined className="remove-icon" size='16'
											onClick={() => handleRemoveRow(index)}/> : '';
						let selectedHtml = !(index === headers.length - 1) ?
							<Checkbox name={`${prefixName}_selected_${index}`} checked={row.selected}
									  disabled={row.disabled ? true : false} onChange={(e) =>
								handleInputChange(index, "selected", e.target.checked)
							}/> : '';

						if(row.disabled){
							actionHtml = '';
						}

						return (
							<div className={`row ${row.disabled ? "disabled" : ""}`} key={index}>
								<div className="col selected-col">
									{selectedHtml}
								</div>
								<div className="col key-col">
									<Input placeholder="Key" variant="borderless" name={`${prefixName}_key_${index}`}
										   value={row.key}
										   onChange={(e) => handleInputChange(index, "key", e.target.value)}
										   disabled={row.disabled ? true : false}
									/>
								</div>
								<div className="col value-col">
									<Input placeholder="Value" variant="borderless"
										   name={`${prefixName}_value_${index}`} value={row.value}
										   onChange={(e) => handleInputChange(index, "value", e.target.value)}
										   disabled={row.disabled ? true : false}
									/>
								</div>
								<div className="col content-col">
									<Input placeholder="Description" variant="borderless"
										   name={`${prefixName}_content_${index}`} value={row.content}
										   onChange={(e) => handleInputChange(index, "content", e.target.value)}
											disabled={row.disabled ? true : false}
									/>
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


