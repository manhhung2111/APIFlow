import React, {useContext, useEffect, useState} from "react";
import {WorkspaceContext} from "@contexts/workspace.jsx";
import {NavLink, useNavigate, useParams} from "react-router";
import FolderService from "@services/folder.js";
import FolderDisplayOverview from "@components/folder/display/overview.jsx";
import FolderDisplayAuthorization from "@components/folder/display/authorization.jsx";
import FolderDisplayScripts from "@components/folder/display/scripts.jsx";
import {toast} from "react-toastify";
import {Breadcrumb, Button, Skeleton, Tabs} from "antd";
import {FolderOutlined, SaveOutlined} from "@ant-design/icons";
import ActionManager from "@utils/action.manager.jsx";
import _ from "lodash";
import Request from "@components/request/request.jsx";
import AppDeleteModal from "@components/app/modal/delete.jsx";

export default function FolderPage(){
	const {
		workspace,
		folders,
		setRequests,
		setFolders,
		activeCollection,
		setActiveCollection,
		setExamples,
	} = useContext(WorkspaceContext);
	const [folder, setFolder] = useState(null);
	const [name, setName] = useState("");
	const [content, setContent] = useState("");
	const [authorization, setAuthorization] = useState({type: 1, data: {}});
	const [scripts, setScripts] = useState({
		pre_request: "",
		post_response: ""
	});
	const [deleteFolderVisible, setDeleteFolderVisible] = useState(false);

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
				setActiveCollection(result.data.collection);
			} else {
				console.error(result.message);
			}
		}

		if(workspace){
			setFolder(null);
			fetchFolder();
		}
	}, [folder_id, workspace]);

	const generateItems = () => {
		let authorizationLabel = <div className="collection-tab">Authorization</div>
		if(authorization?.type !== Request.AUTHORIZATION.NoAuth.value){
			authorizationLabel = <div className="collection-tab">Authorization<span className="valid"></span></div>
		}

		let scriptsLabel = <div className="collection-tab">Scripts</div>
		if(scripts.pre_request.length > 0 || scripts.post_response.length > 0){
			scriptsLabel = <div className="collection-tab">Scripts<span className="valid"></span></div>
		}

		return [
			{
				label: <div className="collection-tab">Overview</div>,
				key: 1,
				children: <FolderDisplayOverview folder={folder} name={name} setName={setName} content={content}
												 setContent={setContent}/>
			},
			{
				label: authorizationLabel,
				key: 2,
				children: <FolderDisplayAuthorization folder={folder} authorization={authorization}
													  setAuthorization={setAuthorization}
													  folderCollection={activeCollection}/>
			},
			{
				label: scriptsLabel,
				key: 3,
				children: <FolderDisplayScripts folder={folder} scripts={scripts} setScripts={setScripts}/>
			},
		];

	}

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
		setDeleteFolderVisible(false);
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

	const handleDuplicate = async() => {
		const result = await FolderService.duplicate(folder);

		if(result.code === 0){
			const newFolder = result.data.folder;
			const newRequests = result.data.requests;
			const newExamples = result.data.examples;

			setFolders(prev => [...prev, newFolder]);
			setRequests(prev => [...prev, ...newRequests]);
			setExamples(prev => [...prev, ...newExamples]);

			navigate(`/workspace/${newFolder.workspace_id}/folder/${newFolder._id}`);
			toast.success(result.message);
		} else {
			toast.error(result.message);
		}
	}

	const actionManagers = [
		{key: `add_request_${folder?._id}`, label: "Add request", onClick: handleAddRequest},
		{key: `duplicate_${folder?._id}`, label: "Duplicate", onClick: handleDuplicate},
		{key: `delete_${folder?._id}`, label: "Delete", onClick: () => setDeleteFolderVisible(true), danger: 1},
	];

	return (
		<div className="collection-page">
			<div className="header">
				{folder && <div className="inner-header">
					<div className="text">
						<Breadcrumb
							separator=""
							items={[
								{
									title: <FolderOutlined style={{marginTop: "3px", marginRight: "5px"}}/>,
								},
								{
									title: <NavLink
										to={`/workspace/${folder?.workspace_id}/collection/${activeCollection?._id}`}>{activeCollection?.name}</NavLink>,
								},
								{type: 'separator'},
								{
									title: folder.name,
								},
							]}
						/>
					</div>
					<div className="side">
						{workspace?.can?.editable && <>
							<Button color="default" variant="text" icon={<SaveOutlined/>} onClick={handleSave}>
								Save
							</Button>
							<ActionManager am={actionManagers}/>
						</>}
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
					items={generateItems()}
				/>}
			</div>
			<AppDeleteModal
				title={`Delete folder "${folder?.name}"?`}
				content={"Deleting this folder is permanent. All its contents, including requests and examples, will be lost forever."}
				visible={deleteFolderVisible}
				setVisible={setDeleteFolderVisible}
				callback={handleDelete}
			/>
		</div>
	);
}