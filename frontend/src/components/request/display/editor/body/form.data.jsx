import {DeleteOutlined} from "@ant-design/icons";
import {Checkbox, Input, Select} from 'antd';
import {useContext} from "react";
import {RequestContext} from "@contexts/request.jsx";
import _ from "lodash";

export default function RequestEditorBodyFormData(){
	let {body, setBody} = useContext(RequestContext);

	const handleInputChange = (index, field, value) => {
		const clone = _.cloneDeep(body);
		clone.data["form_data"][index][field] = value;

		// If the last row is being edited, add a new empty row
		if(index === clone.data["form_data"].length - 1){
			clone.data["form_data"].push({selected: 0, key: '', type: 'text', value: '', content: ''});
			clone.data["form_data"][index]["selected"] = 1;
		}

		if(field === "type"){
			clone.data["form_data"][index]["value"] = "";
		}

		setBody(clone);
	};

	const handleRemoveRow = (index) => {
		const clone = _.cloneDeep(body);
		clone.data["form_data"].splice(index, 1);
		setBody(clone);
	};

	console.log(body)
	return (
		<div className="request-editor-body-form-data">
			<div className="request-form-data-table">
				<div className="table-header">
					<div></div>
					<div>Key</div>
					<div>Value</div>
					<div>Description</div>
					<div></div>
				</div>
				<div className="table-body">
					{body.data["form_data"].map((row, index) => {
						let prefixName = 'request_query_body_form_data';
						let actionHtml = !(index === body.data["form_data"].length - 1) ?
							<DeleteOutlined className="remove-icon" size='16' onClick={() => handleRemoveRow(index)}/> : '';
						let selectedHtml = !(index === body.data["form_data"].length - 1) ?
							<Checkbox name={`${prefixName}_selected_${index}`} checked={row.selected} onChange={(e) =>
								handleInputChange(index, "selected", e.target.checked)
							}/> : '';

						return (
							<div className="row" key={index}>
								<div className="col selected-col">
									{selectedHtml}
								</div>
								<div className="col key-type-col">
									<div className="key-col">
										<Input placeholder="Key" variant="borderless"
											   name={`${prefixName}_key_${index}`}
											   value={row.key}
											   onChange={(e) => handleInputChange(index, "key", e.target.value)}/>
									</div>
									<div className="type-col">
										<Select
											value={row.type ?? "text"}
											size={"small"}
											style={{width: 60, fontSize: "12px", height: "100%"}}
											onChange={(value) => handleInputChange(index, "type", value)}
											options={[
												{value: 'text', label: 'Text'},
												{value: 'file', label: 'File'},
											]}
										/>
									</div>
								</div>
								<div className="col value-col">
									{row.type === "text" &&
										<Input placeholder="Value" variant="borderless"
											   name={`${prefixName}_value_${index}`}
											   value={row.value}
											   onChange={(e) => handleInputChange(index, "value", e.target.value)}
										/>
									}
									{row.type === "file" &&
										<input type="file" className="file-upload"
											   id={`file-upload-${index}`}
											   name={`${prefixName}_value_${index}`}
											   onChange={(e) => handleInputChange(index, "value", e.target.files[0])}
										/>
									}
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


