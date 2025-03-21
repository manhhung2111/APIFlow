import {useContext, useEffect, useState} from "react";
import {WorkspaceContext} from "@contexts/workspace.jsx";
import {Drawer, Select, Skeleton} from "antd";
import DataTableIcon from "@assets/icons/data.table.jsx";
import "../styles/header.scss";
import WorkspaceVariablesDrawer from "@components/workspace/header/variable.drawer.jsx";
import {CodeSandboxOutlined, UserOutlined} from "@ant-design/icons";

export default function WorkspaceSuperHeader(){
	const {
		workspace,
		environments,
		personas,
		setActivePersona,
		activePersona,
		setActiveEnvironment,
		activeEnvironment
	} = useContext(WorkspaceContext);
	const [openVariablesDrawer, setOpenVariablesDrawer] = useState(false);

	const [envOptions, setEnvOptions] = useState([]);
	const personasOptions = [{
		value: -1,
		label: "No persona"
	}, ...personas?.map(persona => ({value: persona._id, label: persona.name}))];

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
						prefix={<UserOutlined/>}
						defaultValue={activePersona || -1}
						style={{width: "150px"}}
						onChange={(value) => setActivePersona(value)}
						options={personasOptions}
					/>
				</div>
				<div className="environment-select">
					<Select
						prefix={<CodeSandboxOutlined/>}
						defaultValue={activeEnvironment || -1}
						style={{width: "170px"}}
						onChange={(value) => setActiveEnvironment(value)}
						options={envOptions}
					/>
				</div>
			</div>
			<div className="side_wrapper">
				<div className="side" onClick={() => setOpenVariablesDrawer(true)}>
					<div className="rs-item">
						<DataTableIcon/>
					</div>
				</div>
			</div>
			<Drawer
				classNames={{body: "workspace-variable-drawer__wrapper", header: "workspace-variable-drawer-header"}}
				title="All variables"
				onClose={() => setOpenVariablesDrawer(false)} open={openVariablesDrawer}>
				<WorkspaceVariablesDrawer/>
			</Drawer>
		</>}
	</div>)

}