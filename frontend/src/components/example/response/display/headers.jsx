import {useContext, useRef} from "react";
import {ExampleContext} from "@contexts/example.jsx";
import _ from "lodash";
import {DeleteOutlined} from "@ant-design/icons";
import AppInputVariable from "@components/app/input/variable/input.jsx";
import {WorkspaceContext} from "@contexts/workspace.jsx";

export default function ExampleResponseHeaders(){
	const {workspace} = useContext(WorkspaceContext);
	let {responseHeaders: headers, setResponseHeaders: setHeaders} = useContext(ExampleContext);
	const containerRef = useRef(null);

	const handleInputChange = (index, field, value) => {
		const headers_dup = _.cloneDeep(headers);
		headers_dup[index][field] = value;

		// If the last row is being edited, add a new empty row
		if(index === headers.length - 1){
			headers_dup.push({key: '', value: ''});

			setHeaders(headers_dup);
			setTimeout(() => {
				containerRef.current?.scrollTo({top: containerRef.current.scrollHeight, behavior: "smooth"});
			}, 50);
		} else {
			setHeaders(headers_dup);
		}
	};

	const handleRemoveRow = (index) => {
		const headers_dup = _.cloneDeep(headers);
		headers_dup.splice(index, 1);
		setHeaders(headers_dup);
	};

	return (
		<div className="example-response-headers request-response-content" ref={containerRef}>
			<div className="request-table">
				<div className="table-header">
					<div></div>
					<div>Key</div>
					<div>Value</div>
					<div></div>
				</div>
				<div className="table-body">
					{headers.map((row, index) => {
						let actionHtml = !(index === headers.length - 1 || !workspace?.can?.editable) ?
							<DeleteOutlined className="remove-icon" size='16'
											onClick={() => handleRemoveRow(index)}/> : '';

						if(row.disabled){
							actionHtml = '';
						}

						return (
							<div className={`row ${row.disabled ? "disabled" : ""}`} key={index}>
								<div className="col selected-col">
								</div>
								<div className="col key-col">
									<AppInputVariable placeholder="Key"
													  setText={(value) => handleInputChange(index, "key", value)}
													  text={row.key} disabled={!workspace?.can?.editable}/>

									{/*<Input placeholder="Key" variant="borderless" name={`${prefixName}_key_${index}`}*/}
									{/*	   value={row.key}*/}
									{/*	   onChange={(e) => handleInputChange(index, "key", e.target.value)}*/}
									{/*	   disabled={row.disabled ? true : false}*/}
									{/*/>*/}
								</div>
								<div className="col value-col">
									{/*<Input placeholder="Value" variant="borderless"*/}
									{/*	   name={`${prefixName}_value_${index}`} value={row.value}*/}
									{/*	   onChange={(e) => handleInputChange(index, "value", e.target.value)}*/}
									{/*	   disabled={row.disabled ? true : false}*/}
									{/*/>*/}
									<AppInputVariable placeholder="Value"
													  setText={(value) => handleInputChange(index, "value", value)}
													  text={row.value} disabled={!workspace?.can?.editable}/>

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
	);
}