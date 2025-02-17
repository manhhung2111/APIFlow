import {useContext, useEffect, useState} from "react";
import {WorkspaceContext} from "@contexts/workspace.jsx";
import {useNavigate, useParams} from "react-router";
import FolderService from "@services/folder.js";
import FolderDisplayOverview from "@components/folder/display/overview.jsx";
import FolderDisplayAuthorization from "@components/folder/display/authorization.jsx";
import FolderDisplayScripts from "@components/folder/display/scripts.jsx";
import CollectionService from "@services/collection.js";
import {toast} from "react-toastify";
import CollectionIcon from "@assets/icons/collection.jsx";
import {Button, Skeleton, Tabs} from "antd";
import {SaveOutlined} from "@ant-design/icons";
import ActionManager from "@utils/action.manager.jsx";
import Collection from "@components/collection/collection.jsx";
import Folder from "@components/folder/folder.jsx";

export default function FolderPage(){
	const {workspace} = useContext(WorkspaceContext);
	const [folder, setFolder] = useState(null);

	const [name, setName] = useState("");
	const [content, setContent] = useState("");
	const [authorization, setAuthorization] = useState({type: 1, data: {}});
	const [scripts, setScripts] = useState({
		pre_request: "",
		post_response: ""
	});

	const {folder_id} = useParams();
	const navigate = useNavigate();
	useEffect(() => {
		async function fetchFolder(){
			const result = await FolderService.getById(folder_id, workspace._id);

			if(result.code === 0){
				const folder = result.data.folder;
				setFolder(folder);
				setName(folder.name);
				setContent(folder.content);
				setAuthorization(folder.authorization);
				setScripts(folder.scripts);
			} else {
				console.log(result.message);
			}
		}

		if(workspace){
			fetchFolder();
		}
	}, [folder_id, workspace]);

	const items = [
		{
			label: "Overview",
			key: 1,
			children: <FolderDisplayOverview folder={folder} name={name} setName={setName} content={content}
											 setContent={setContent}/>
		},
		{
			label: "Authorization",
			key: 2,
			children: <FolderDisplayAuthorization folder={folder} authorization={authorization}
												  setAuthorization={setAuthorization}/>
		},
		{
			label: "Scripts",
			key: 3,
			children: <FolderDisplayScripts folder={folder} scripts={scripts} setScripts={setScripts}/>
		},
	];

	const handleSave = async() => {
		const result = await FolderService.save(folder, name, content, authorization, scripts);

		if(result.code === 0){
			toast.success(result.message);
		} else {
			toast.error(result.message);
		}
	}

	return (
		<div className="collection-page">
			<div className="header">
				{folder && <div className="inner-header">
					<div className="text">
						<CollectionIcon/>
						{folder.name}
					</div>
					<div className="side">
						<Button color="default" variant="text" icon={<SaveOutlined/>} onClick={handleSave}>
							Save
						</Button>
						<ActionManager am={Folder.am(folder, navigate)}/>
					</div>
				</div>}
				{!folder && <Skeleton.Input active={true}/>}
			</div>
			<div className="main">
				{!folder && <div style={{padding: "16px"}}>
					<Skeleton active/>
				</div>
				}
				{folder && <Tabs
					tabBarGutter={16}
					items={items}
				/>}
			</div>
		</div>
	);
}