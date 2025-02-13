import {WorkspaceContext} from "@contexts/workspace.jsx";
import {useContext} from "react";
import {Button, ColorPicker, Mentions} from "antd";

export default function WorkspaceDisplaySettings(){
	const {workspace, setWorkspace} = useContext(WorkspaceContext);

	const options = [
		{value: "mason", label: "Mason"},
		{value: "ngoclinh", label: "Ngoc Linh"}
	]

	const handleSelectEditor = (option) => {

	}

	const handleSelectCommenters = (option) => {

	}

	const handleSelectViewers = (option) => {

	}

	return (
		<div className="workspace-display-settings">
			<div className="section">
				<h3>Workspace members</h3>
				<p>Manage access list of your workspace</p>
				<div className="row">
					<h4>Editors</h4>
					<Mentions
						autoSize
						style={{width: '100%'}}
						options={options}
						onSelect={(option) => handleSelectEditor(option)}
						placeholder={"Use @ to add an user"}
					/>
				</div>
				<div className="row">
					<h4>Commenters</h4>
					<Mentions
						autoSize
						style={{width: '100%'}}
						options={options}
						onSelect={(option) => handleSelectCommenters(option)}
						placeholder={"Use @ to add an user"}
					/>
				</div>
				<div className="row">
					<h4>Viewers</h4>
					<Mentions
						autoSize
						style={{width: '100%'}}
						options={options}
						onSelect={(option) => handleSelectViewers(option)}
						placeholder={"Use @ to add an user"}
					/>
				</div>
			</div>
			<div className="section">
				<h3>Workspace theme</h3>
				<p>Make the workspace unique by having its theme reflect its content and your team's identity. These
					changes will reflect for all your members.</p>

				<div className="color-row">
					<div className="left-section">
						<div className="title">Accent color</div>
						<div className="subtitle">Color for buttons and highlights.</div>
					</div>
					<div className="right-section">
						<ColorPicker showText allowClear size="small"/>
					</div>
				</div>

				<div className="color-row">
					<div className="left-section">
						<div className="title">Theme color</div>
						<div className="subtitle">Overall interface color.</div>
					</div>
					<div className="right-section">
						<ColorPicker allowClear size="small"/>
					</div>
				</div>
			</div>
			<div className="section">
				<h3>Delete workspace</h3>
				<p>Once deleted, a workspace is gone forever along with its data.</p>
				<Button color="danger" variant="filled" className="delete-btn">
					Delete Workspace
				</Button>
			</div>
		</div>
	)
}