import {WorkspaceContext} from "@contexts/workspace.jsx";
import React, {useContext, useEffect, useState} from "react";
import {Button, ColorPicker} from "antd";
import AppInputUser from "@components/app/input/user/user.jsx";
import {AppContext} from "@contexts/app.jsx";
import WorkspaceService from "@services/workspace.js";
import {toast} from "react-toastify";

export default function WorkspaceDisplaySettings(){
	const {workspace, setWorkspace} = useContext(WorkspaceContext);
	const {users} = useContext(AppContext);
	const [editors, setEditors] = useState(workspace.editors || []);
	const [commenters, setCommenters] = useState(workspace.commenters || []);
	const [viewers, setViewers] = useState(workspace.viewers || []);

	const [hasChanges, setHasChanges] = useState(false);

	useEffect(() => {
		if(
			editors !== workspace.editors ||
			commenters !== workspace.commenters ||
			viewers !== workspace.viewers
		){
			setHasChanges(true);
		} else {
			setHasChanges(false);
		}
	}, [editors, commenters, viewers, workspace]);

	const handleCancel = () => {
		setEditors(workspace.editors || []);
		setCommenters(workspace.commenters || []);
		setViewers(workspace.viewers || []);
		setHasChanges(false);
	};

	// Cancel function
	const handleSave = async () => {
		const editorsList = editors.join(",");
		const commentersList = commenters.join(",");
		const viewersList = viewers.join(",");

		const result = await WorkspaceService.saveAccessList(workspace, editorsList, commentersList, viewersList);
		if (result.code === 0) {
			setWorkspace(result.data.workspace);
			setHasChanges(false);
			toast.success(result.message);
		} else {
			toast.error(result.message);
		}
	};

	return (
		<div className="workspace-display-settings">
			<div className="section">
				<h3>Workspace members</h3>
				<p>Manage access list of your workspace</p>
				<div className="row">
					<h4>Editors</h4>
					<AppInputUser value={editors} setValue={setEditors}/>
				</div>
				<div className="row">
					<h4>Commenters</h4>
					<AppInputUser value={commenters} setValue={setCommenters}/>
				</div>
				<div className="row">
					<h4>Viewers</h4>
					<AppInputUser value={viewers} setValue={setViewers}/>
				</div>

				{hasChanges && (
					<div className="button-row">
						<Button className="save-btn" onClick={handleSave}>Save</Button>
						<Button color="default" variant="filled" onClick={handleCancel}>Cancel</Button>
					</div>
				)}
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