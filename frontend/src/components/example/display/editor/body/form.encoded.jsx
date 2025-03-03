import {useContext, useRef} from "react";
import _ from "lodash";
import {DeleteOutlined} from "@ant-design/icons";
import {Checkbox, Input} from "antd";
import AppInputVariable from "@components/app/input/variable/input.jsx";
import {ExampleContext} from "@contexts/example.jsx";

export default function ExampleEditorBodyFormEncoded(){
	let {body, setBody} = useContext(ExampleContext);
	const containerRef = useRef(null);

	const handleInputChange = (index, field, value) => {
		const clone = _.cloneDeep(body);
		clone.data["form_encoded"][index][field] = value;

		// If the last row is being edited, add a new empty row
		if(index === clone.data["form_encoded"].length - 1){
			clone.data["form_encoded"].push({selected: 0, key: '', value: '', content: ''});
			clone.data["form_encoded"][index]["selected"] = 1;

			setBody(clone);
			setTimeout(() => {
				containerRef.current?.scrollTo({top: containerRef.current.scrollHeight, behavior: "smooth"});
			}, 50);
		} else {
			setBody(clone);
		}
	};

	const handleRemoveRow = (index) => {
		const clone = _.cloneDeep(body);
		clone.data["form_encoded"].splice(index, 1);
		setBody(clone);
	};

	return (
		<div className="request-editor-body-form-encoded" ref={containerRef}>
			<div className="request-table">
				<div className="table-header">
					<div></div>
					<div>Key</div>
					<div>Value</div>
					<div>Description</div>
					<div></div>
				</div>
				<div className="table-body">
					{body.data["form_encoded"].map((row, index) => {
						let prefixName = 'request_body_encoded';
						let actionHtml = !(index === body.data["form_encoded"].length - 1) ?
							<DeleteOutlined className="remove-icon" size='16'
											onClick={() => handleRemoveRow(index)}/> : '';
						let selectedHtml = !(index === body.data["form_encoded"].length - 1) ?
							<Checkbox name={`${prefixName}_selected_${index}`} checked={row.selected} onChange={(e) =>
								handleInputChange(index, "selected", e.target.checked)
							}/> : '';

						return (
							<div className="row" key={index}>
								<div className="col selected-col">
									{selectedHtml}
								</div>
								<div className="col key-col">
									{/*<Input placeholder="Key" variant="borderless" name={`${prefixName}_key_${index}`}*/}
									{/*	   value={row.key}*/}
									{/*	   onChange={(e) => handleInputChange(index, "key", e.target.value)}/>*/}
									<AppInputVariable placeholder="Key"
													  setText={(value) => handleInputChange(index, "key", value)}
													  text={row.key}/>
								</div>
								<div className="col value-col">
									{/*<Input placeholder="Value" variant="borderless"*/}
									{/*	   name={`${prefixName}_value_${index}`} value={row.value}*/}
									{/*	   onChange={(e) => handleInputChange(index, "value", e.target.value)}/>*/}
									<AppInputVariable placeholder="Value"
													  setText={(value) => handleInputChange(index, "value", value)}
													  text={row.value}/>
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
}