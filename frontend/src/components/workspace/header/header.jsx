import {useContext, useEffect, useState} from "react";
import {WorkspaceContext} from "@contexts/workspace.jsx";
import {Select, Skeleton} from "antd";
import DataTableIcon from "@assets/icons/data.table.jsx";
import "../styles/header.scss";

export default function WorkspaceSuperHeader(){
	const {workspace, environments, setActiveEnvironment, activeEnvironment} = useContext(WorkspaceContext);

	const [envOptions, setEnvOptions] = useState([]);
	useEffect(() => {
		const options = [{value: -1, label: "No environment"}];

		environments?.forEach(environment => {
			if(environment.scope === 0) return;

			options.push({
				value: environment._id,
				label: environment.name,
			});
		});

		setEnvOptions(options);
	}, [workspace, environments]);

	function stripHTML(html){
		let doc = new DOMParser().parseFromString(html, "text/html");
		return doc.body.textContent || "";
	}

	return (<div className="workspace-super-header">
		{!workspace && <Skeleton.Input active style={{width: "300px", margin: "4px 4px 4px 16px"}}/>}
		{workspace && <>
			<div className="main">
				<div className="info">
					<h3>{workspace?.name}</h3>
					{workspace?.content && <p className="desc">{stripHTML(workspace.content)}</p>}
				</div>
				<div className="environment-select">
					<Select
						defaultValue={activeEnvironment || -1}
						style={{width: "170px"}}
						onChange={(value) => setActiveEnvironment(value)}
						options={envOptions}
					/>
				</div>
			</div>
			<div className="side_wrapper">
				<div className="side">
					<div className="rs-item">
						<DataTableIcon/>
					</div>
				</div>
			</div>
		</>}
	</div>)

}