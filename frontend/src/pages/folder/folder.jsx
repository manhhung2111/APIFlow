import {useContext, useEffect, useState} from "react";
import {WorkspaceContext} from "@contexts/workspace.jsx";
import {useParams} from "react-router";
import FolderService from "@services/folder.js";
import FolderDisplayOverview from "@components/folder/display/overview.jsx";
import FolderDisplayAuthorization from "@components/folder/display/authorization.jsx";
import FolderDisplayScripts from "@components/folder/display/scripts.jsx";
import {toast} from "react-toastify";
import {Button, Skeleton, Tabs} from "antd";
import {FolderOutlined, SaveOutlined} from "@ant-design/icons";
import ActionManager from "@utils/action.manager.jsx";
import _ from "lodash";

export default function FolderPage(){
	const {workspace, folders, setRequests, setFolders} = useContext(WorkspaceContext);
	const [folder, setFolder] = useState(null);

	const [name, setName] = useState("");
	const [content, setContent] = useState("");
	const [authorization, setAuthorization] = useState({type: 1, data: {}});
	const [scripts, setScripts] = useState({
		pre_request: "",
		post_response: ""
	});

	const {folder_id} = useParams();
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
			// Update folder in menu tree
			const clone = _.cloneDeep(folders);
			for (const e of clone) {
				if(e._id === folder._id){
					e.name = name;
				}
			}
			setFolders(clone);
			setFolder(result.data.folder);
		} else {
			toast.error(result.message);
		}
	}

	const handleAddRequest = async() => {
		const result = await FolderService.addRequest(folder);

		if(result.code === 0){
			setRequests(prev => [...prev, result.data.request]);
			toast.success(result.message);
		} else {
			toast.error(result.message);
		}
	}

	const handleDelete = async() => {
		const result = await FolderService.delete(folder);

		if(result.code === 0){
			setFolders(prev => {
				return prev.filter(e => e._id !== folder._id);
			});
			toast.success(result.message);
		} else {
			toast.error(result.message);
		}
	}

	const actionManagers = [
		{key: `add_request_${folder?._id}`, label: "Add request", onClick: handleAddRequest},
		{key: `duplicate_${folder?._id}`, label: "Duplicate",},
		{key: `delete_${folder?._id}`, label: "Delete", onClick: handleDelete, danger: 1},
	];

	return (
		<div className="collection-page">
			<div className="header">
				{folder && <div className="inner-header">
					<div className="text">
						<FolderOutlined/>
						{folder.name}
					</div>
					<div className="side">
						<Button color="default" variant="text" icon={<SaveOutlined/>} onClick={handleSave}>
							Save
						</Button>
						<ActionManager am={actionManagers}/>
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