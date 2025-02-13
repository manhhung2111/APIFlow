import {useContext, useState} from "react";
import {WorkspaceContext} from "@contexts/workspace.jsx";
import {Button, Form, Input} from "antd";
import TextEditor from "@components/app/editor/text.editor.jsx";

export default function WorkspaceDisplayOverview() {
	const {workspace, setWorkspace}  = useContext(WorkspaceContext);

	const [name, setName] = useState(workspace.name || "");
	const [content, setContent] = useState(workspace.content || "");

	const handleChangeContent = (quill, quillRef) => {
		if(quill){
			quill.on('text-change', (delta, oldDelta, source) => {
				console.log('Text change!');
				console.log(quill.getText()); // Get text only
				console.log(quill.getContents()); // Get delta contents
				console.log(quill.root.innerHTML); // Get innerHTML using quill
				console.log(quillRef.current.firstChild.innerHTML); // Get innerHTML using quillRef
			});
		}
	}

	const handleCancel = () => {

	}

	return (
		<div className="workspace-display-overview">
			<div className="main">
				<div className="row">
					<Input className="workspace-name" placeholder={"Workspace name"} value={name}
						   onChange={(value) => setName(value)}/>
				</div>
				<div className="row">
					<TextEditor handleChange={handleChangeContent}/>
				</div>
				<div className="footer">
					<Button className="submit-btn" color="geekblue" variant="solid" htmlType="submit">
						Save
					</Button>
					<Button color="default" variant="filled" onClick={handleCancel}>
						Cancel
					</Button>
				</div>
			</div>
			<div className="sidebar">
				<div className="row">
					<h5>Create by</h5>
					<p>Hoang Manh Hung</p>
				</div>
				<div className="row">
					<h5>Created at</h5>
					<p>{workspace.created_at}</p>
				</div>
				<div className="row">
					<h5>Last updated at</h5>
					<p>{workspace.updated_at}</p>
				</div>
			</div>
		</div>
	)
}