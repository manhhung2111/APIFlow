import {Checkbox, Input} from "antd";
import {DeleteOutlined, SearchOutlined} from "@ant-design/icons";
import _ from "lodash";
import {useContext, useRef} from "react";
import {WorkspaceContext} from "@contexts/workspace.jsx";

export default function CollectionDisplayVariables({collection, variables, setVariables}){
	const {workspace} = useContext(WorkspaceContext);

	const containerRef = useRef(null);

	const handleInputChange = (index, field, value) => {
		const cloneDeep = _.cloneDeep(variables);
		cloneDeep[index][field] = value;

		// If the last row is being edited, add a new empty row
		if(index === variables.length - 1){
			cloneDeep.push({selected: 0, variable: '', initial_value: '', current_value: ''});
			cloneDeep[index]["selected"] = 1;

			setVariables(cloneDeep);

			setTimeout(() => {
				containerRef.current?.scrollTo({top: containerRef.current.scrollHeight, behavior: "smooth"});
			}, 50);
		} else {
			setVariables(cloneDeep);
		}
	};

	const handleRemoveRow = (index) => {
		const cloneDeep = _.cloneDeep(variables);
		cloneDeep.splice(index, 1);
		setVariables(cloneDeep);
	};

	return (
		<div className="collection-display-variables">
			<p className="subtitle">These variables are specific to this collection and its requests. Learn more
				about <span>collection variables</span></p>
			<Input className="search-btn" placeholder="Filter variables" prefix={<SearchOutlined/>}/>
			<div className="variables-table">
				<div className="table-header">
					<div></div>
					<div>Variable</div>
					<div>Initial value</div>
					<div>Current value</div>
					<div></div>
				</div>
				<div className="table-body">
					{variables.map((row, index) => {
						let actionHtml = !(index === variables.length - 1 || !workspace.can?.editable) ?
							<DeleteOutlined className="remove-icon" size='16'
											onClick={() => handleRemoveRow(index)}/> : '';
						let selectedHtml = !(index === variables.length - 1) ?
							<Checkbox checked={row.selected} onChange={(e) =>
								handleInputChange(index, "selected", e.target.checked)
							} disabled={!workspace.can?.editable}/> : '';

						return (
							<div className="row" key={index}>
								<div className="col selected-col">
									{selectedHtml}
								</div>
								<div className="col key-col">
									<Input placeholder="Key" variant="borderless" value={row.variable}
										   onChange={(e) => handleInputChange(index, "variable", e.target.value)}
										   disabled={!workspace.can?.editable}/>
								</div>
								<div className="col value-col">
									<Input placeholder="Value" variant="borderless" value={row.initial_value}
										   onChange={(e) => handleInputChange(index, "initial_value", e.target.value)}
										   disabled={!workspace.can?.editable}/>
								</div>
								<div className="col content-col">
									<Input placeholder="Description" variant="borderless" value={row.current_value}
										   onChange={(e) => handleInputChange(index, "current_value", e.target.value)}
										   disabled={!workspace.can?.editable}/>
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