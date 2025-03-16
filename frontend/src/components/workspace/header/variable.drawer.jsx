import {useContext, useState} from "react";
import {WorkspaceContext} from "@contexts/workspace.jsx";
import {EyeInvisibleOutlined, EyeOutlined} from "@ant-design/icons";

export default function WorkspaceVariablesDrawer(){
	const {variables, activeCollection, activeEnvironment} = useContext(WorkspaceContext);

	const environment = variables.filter(variable => variable.scope === "Environment");
	const globals = variables.filter(variable => variable.scope === "Global");
	const collection = variables.filter(variable => variable.scope === "Collection");
	console.log(variables);

	return (
		<div className="workspace-variable-drawer">
			<div className="section">
				<div className="header">
					<div className="variable-icon environment">E</div>
					<p>Environment</p>
				</div>
				<div className="main">
					{activeEnvironment && environment && environment.length > 0 && <VariablesTable variables={environment}/>}
					{(!activeEnvironment || activeEnvironment == -1) && <p>No environment selected.</p>}
					{activeEnvironment && activeEnvironment != -1 && environment && environment.length === 0 && <p>No variables defined in this environment.</p>}
				</div>
			</div>
			{activeCollection &&
				<div className="section">
					<div className="header">
						<div className="variable-icon collection">C</div>
						<p>Collection</p>
					</div>
					<div className="main">
						{collection && collection.length > 0 && <VariablesTable variables={collection}/>}
						{collection && collection.length === 0 && <p>No variables defined in this collection.</p>}
					</div>
				</div>
			}
			<div className="section">
				<div className="header">
					<div className="variable-icon global">G</div>
					<p>Globals</p>
				</div>
				<div className="main">
					{globals && globals.length > 0 && <VariablesTable variables={globals}/>}
					{globals && globals.length === 0 && <p>No global variables in this workspace.</p>}
				</div>
			</div>
		</div>
	)
}

const VariablesTable = ({variables}) => {
	const [visibility, setVisibility] = useState({});

	const toggleVisibility = (index, value) => {
		setVisibility((prev) => ({ ...prev, [index]: value }));
	};


	return (
		<div className="variables-table">
			{variables.map((variable, index) => {
				const visible = visibility[index];

				return <div className="row" key={index}>
					<div className="key">
						<p>{variable.name}</p>
					</div>
					<div className={`value ${visible ? '' : variable.type}`}>
						<p>{variable.current_value}</p>
						{variable.type === "password" && visible && <EyeOutlined className="action" onClick={() => toggleVisibility(index, false)}/>}
						{variable.type === "password" && !visible && <EyeInvisibleOutlined className="action" onClick={() => toggleVisibility(index, true)}/>}
					</div>
				</div>
			})}
		</div>
	)
}