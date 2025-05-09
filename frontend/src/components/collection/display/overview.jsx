import {Input} from "antd";
import {NavLink} from "react-router";
import {ArrowRightOutlined} from "@ant-design/icons";
import {useContext} from "react";
import {WorkspaceContext} from "@contexts/workspace.jsx";
import TimeUtils from "@utils/time.js";
import AppMarkdownEditor from "@components/app/editor/markdown.edtior.jsx";
import {AppContext} from "@contexts/app.jsx";

export default function CollectionDisplayOverview({collection, name, setName, content, setContent}){
	const {workspace} = useContext(WorkspaceContext);
	const {user} = useContext(AppContext);

	return (
		<div className="collection-display-overview">
			<div className="main">
				<div className="row">
					<Input className="workspace-name" placeholder={"Collection name"} value={name}
						   onChange={(e) => setName(e.target.value)}
						   disabled={!workspace.can?.editable}
					/>
				</div>
				<div className="row">
					<AppMarkdownEditor value={content} onChange={setContent} readOnly={!workspace.can?.editable}
									   height={340}/>
				</div>
				<div className="footer">
					<NavLink to={"documentation"}>View complete documentation <ArrowRightOutlined/></NavLink>
				</div>
			</div>
			<div className="sidebar">
				<div className="row">
					<h5>Create by</h5>
					<p>{user?.email}</p>
				</div>
				<div className="row">
					<h5>Created at</h5>
					<p>{TimeUtils.formatDate(collection.created_at)}</p>
				</div>
				<div className="row">
					<h5>Last updated at</h5>
					<p>{TimeUtils.formatDate(collection.updated_at)}</p>
				</div>
			</div>
		</div>
	)
}