import {Input} from "antd";
import TextEditor from "@components/app/editor/text.editor.jsx";
import {NavLink} from "react-router";
import {ArrowRightOutlined} from "@ant-design/icons";

export default function CollectionDisplayOverview({collection, name, setName, content, setContent}){

	const handleChangeContent = (quill, quillRef) => {
		if(quill){
			quill.on('text-change', (delta, oldDelta, source) => {
				setContent(quill.root.innerHTML);
			});
		}
	}

	return (
		<div className="collection-display-overview">
			<div className="main">
				<div className="row">
					<Input className="workspace-name" placeholder={"Workspace name"} value={name}
						   onChange={(e) => setName(e.target.value)}/>
				</div>
				<div className="row">
					<TextEditor handleChange={handleChangeContent} value={content}/>
				</div>
				<div className="footer">
					<NavLink to={"documentation"}>View complete documentation <ArrowRightOutlined/></NavLink>
				</div>
			</div>
			<div className="sidebar">
				<div className="row">
					<h5>Create by</h5>
					<p>Hoang Manh Hung</p>
				</div>
				<div className="row">
					<h5>Created at</h5>
					<p>{collection.created_at}</p>
				</div>
				<div className="row">
					<h5>Last updated at</h5>
					<p>{collection.updated_at}</p>
				</div>
			</div>
		</div>
	)
}