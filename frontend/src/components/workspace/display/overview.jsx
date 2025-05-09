import {useContext, useEffect, useState} from "react";
import {WorkspaceContext} from "@contexts/workspace.jsx";
import {Button, Input} from "antd";
import {useParams} from "react-router";
import WorkspaceService from "@services/workspace.js";
import {toast} from "react-toastify";
import TimeUtils from "@utils/time.js";
import AppMarkdownEditor from "@components/app/editor/markdown.edtior.jsx";
import {AppContext} from "@contexts/app.jsx";

export default function WorkspaceDisplayOverview(){
	const {workspace, setWorkspace} = useContext(WorkspaceContext);
	const {user} = useContext(AppContext);
	const {workspace_id} = useParams();

	const [name, setName] = useState(workspace.name || "");
	const [content, setContent] = useState(workspace.content || "");
	const [changed, setChanged] = useState(false);

	useEffect(() => {
		setName(workspace.name);
		setContent(workspace.content || "");
		setChanged(false);
	}, [workspace]);

	useEffect(() => {
		if(content != workspace.content){
			setChanged(true);
		}
	}, [content])

	const handleCancel = () => {
		setContent(workspace.content);
		setName(workspace.name);
	}

	const handleSave = async() => {
		const result = await WorkspaceService.save(workspace, name, content);

		if(result.code === 0){
			toast.success(result.message);
			setWorkspace(result.data.workspace);
			setChanged(false);
		} else {
			toast.error(result.message);
		}
	}

	return (
		<div className="workspace-display-overview">
			<div className="main">
				<div className="row">
					<Input className="workspace-name" placeholder={"Workspace name"} value={name}
						   onChange={(e) => {
							   setName(e.target.value);
							   setChanged(true);
						   }}
						   disabled={!workspace.can?.editable}
					/>

				</div>
				<div className="row">
					<AppMarkdownEditor value={content} onChange={setContent} readOnly={!workspace.can?.editable}
									   height={340}/>
				</div>
				{changed && <div className="footer">
					<Button className="submit-btn" color="geekblue" variant="solid" onClick={handleSave}>
						Save
					</Button>
					<Button color="default" variant="filled" onClick={handleCancel}>
						Cancel
					</Button>
				</div>}
			</div>
			<div className="sidebar">
				<div className="row">
					<h5>Create by</h5>
					<p>{user?.email}</p>
				</div>
				<div className="row">
					<h5>Created at</h5>
					<p>{TimeUtils.formatDate(workspace.created_at)}</p>
				</div>
				<div className="row">
					<h5>Last updated at</h5>
					<p>{TimeUtils.formatDate(workspace.updated_at)}</p>
				</div>
			</div>
		</div>
	)
}