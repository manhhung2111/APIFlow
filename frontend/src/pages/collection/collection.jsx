import {Button, Skeleton, Tabs} from "antd";
import React, {useContext, useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router";
import CollectionService from "@services/collection.js";
import {WorkspaceContext} from "@contexts/workspace.jsx";
import CollectionIcon from "@assets/icons/collection.jsx";
import './styles/collection.scss';
import CollectionDisplayOverview from "@components/collection/display/overview.jsx";
import CollectionDisplayAuthorization from "@components/collection/display/authorization.jsx";
import CollectionDisplayScripts from "@components/collection/display/scripts.jsx";
import CollectionDisplayVariables from "@components/collection/display/variables.jsx";
import {SaveOutlined} from "@ant-design/icons";
import ActionManager from "@utils/action.manager.jsx";
import {toast} from "react-toastify";
import FolderService from "@services/folder.js";
import _ from "lodash";
import Request from "@components/request/request.jsx";
import AppDeleteModal from "@components/app/modal/delete.jsx";

export default function CollectionPage(){
	const {
		workspace,
		collections,
		setCollections,
		setFolders,
		setRequests,
		activeCollection,
		setActiveCollection,
		setExamples
	} = useContext(WorkspaceContext);

	const [name, setName] = useState("");
	const [content, setContent] = useState("");
	const [authorization, setAuthorization] = useState({type: 1, data: {}});
	const [scripts, setScripts] = useState({
		pre_request: "",
		post_response: ""
	});
	const [variables, setVariables] = useState([]);
	const [deleteCollectionVisible, setDeleteCollectionVisible] = useState(false);

	const {collection_id} = useParams();
	const navigate = useNavigate();
	useEffect(() => {
		async function fetchCollection(){
			const result = await CollectionService.getById(collection_id, workspace._id);

			if(result.code === 0){
				const collection = result.data.collection;
				setActiveCollection(collection);
				setName(collection.name);
				setContent(collection.content);
				setAuthorization(collection.authorization);
				setScripts(collection.scripts);
				setVariables([...collection.variables, {
					selected: 0,
					variable: '',
					initial_value: '',
					current_value: ''
				}]);
			} else {
				console.error(result.message);
			}
		}

		if(workspace){
			setActiveCollection(null);
			fetchCollection();
		}
	}, [collection_id, workspace]);

	const generateItems = () => {
		let authorizationLabel = <div className="collection-tab">Authorization</div>
		if(authorization?.type !== Request.AUTHORIZATION.NoAuth.value){
			authorizationLabel = <div className="collection-tab">Authorization<span className="valid"></span></div>
		}

		let scriptsLabel = <div className="collection-tab">Scripts</div>
		if(scripts.pre_request.length > 0 || scripts.post_response.length > 0){
			scriptsLabel = <div className="collection-tab">Scripts<span className="valid"></span></div>
		}

		let variablesLabel = <div className="collection-tab">Variables</div>
		if(variables?.length > 1){
			variablesLabel = <div className="collection-tab">Variables<span className="valid"></span></div>
		}

		return [
			{
				label: <div className="collection-tab">Overview</div>,
				key: 1,
				children: <CollectionDisplayOverview collection={activeCollection} name={name} setName={setName}
													 content={content}
													 setContent={setContent}/>
			},
			{
				label: authorizationLabel,
				key: 2,
				children: <CollectionDisplayAuthorization collection={activeCollection} authorization={authorization}
														  setAuthorization={setAuthorization}/>
			},
			{
				label: scriptsLabel,
				key: 3,
				children: <CollectionDisplayScripts collection={activeCollection} scripts={scripts}
													setScripts={setScripts}/>
			},
			{
				label: variablesLabel,
				key: 4,
				children: <CollectionDisplayVariables collection={activeCollection} variables={variables}
													  setVariables={setVariables}/>
			},
		]
	}

	const handleSave = async() => {
		const result = await CollectionService.save(activeCollection, name, content, authorization, scripts, variables);

		if(result.code === 0){
			toast.success(result.message);
			const clone = _.cloneDeep(collections);
			for (const e of clone) {
				if(e._id === activeCollection._id){
					e.name = name;
				}
			}
			setCollections(clone);
			setActiveCollection(result.data.collection);
		} else {
			toast.error(result.message);
		}
	}

	const handleAddRequest = async() => {
		const result = await CollectionService.addRequest(activeCollection);

		if(result.code === 0){
			setRequests(prev => [...prev, result.data.request]);
			toast.success(result.message);
		} else {
			toast.error(result.message);
		}
	}

	const handleAddFolder = async() => {
		const result = await FolderService.create(activeCollection);

		if(result.code === 0){
			setFolders(prev => [...prev, result.data.folder]);
			toast.success(result.message);
		} else {
			toast.error(result.message);
		}
	}

	const handleDelete = async() => {
		setDeleteCollectionVisible(false);
		const result = await CollectionService.delete(activeCollection);

		if(result.code === 0){
			setCollections(prev => {
				return prev.filter(e => e._id !== activeCollection._id);
			});
			toast.success(result.message);
			navigate(`/workspace/${activeCollection.workspace_id}`);
		} else {
			toast.error(result.message);
		}
	}

	const handleDuplicate = async() => {
		const result = await CollectionService.duplicate(activeCollection);

		if(result.code === 0){
			const newCollection = result.data.collection;
			const newFolders = result.data.folders;
			const newRequests = result.data.requests;
			const newExamples = result.data.examples;

			setFolders(prev => [...prev, ...newFolders]);
			setRequests(prev => [...prev, ...newRequests]);
			setExamples(prev => [...prev, ...newExamples]);
			setCollections(prev => [...prev, newCollection]);

			navigate(`/workspace/${newCollection.workspace_id}/collection/${newCollection._id}`);
			toast.success(result.message);
		} else {
			toast.error(result.message);
		}
	}

	const handleExport = async() => {
		const result = await CollectionService.export(activeCollection);

		if(result.code === 0){
			toast.success(result.message);

			const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
				JSON.stringify(result.data.collection_export, null, 4)
			)}`;
			const link = document.createElement("a");
			link.href = jsonString;
			link.download = `${activeCollection.name}.collection.json`;

			link.click();
		} else {
			toast.error(result.message);
		}
	}

	const actionManagers = [
		{key: `add_request_${activeCollection?._id}`, label: "Add request", onClick: handleAddRequest},
		{key: `add_folder_${activeCollection?._id}`, label: "Add folder", onClick: handleAddFolder},
		{key: `duplicate_${activeCollection?._id}`, label: "Duplicate", onClick: handleDuplicate},
		{key: `export_${activeCollection?._id}`, label: "Export", onClick: handleExport},
		{
			key: `delete_${activeCollection?._id}`,
			label: "Delete",
			onClick: () => setDeleteCollectionVisible(true),
			danger: 1
		},
	];

	return (
		<div className="collection-page">
			<div className="header">
				{activeCollection && <div className="inner-header">
					<div className="text">
						<CollectionIcon/>
						{activeCollection.name}
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
				{!activeCollection && <Skeleton.Input active={true}/>}
			</div>
			<div className="main">
				{!activeCollection && <div style={{padding: "16px"}}>
					<Skeleton active/>
				</div>
				}
				{activeCollection && <Tabs
					tabBarGutter={16}
					items={generateItems()}
				/>}
			</div>
			<AppDeleteModal
				title={`Delete collection "${activeCollection?.name}"?`}
				content={"Deleting this collection is permanent. All its contents, including folders, requests, examples, and all associated runners, will be lost forever."}
				visible={deleteCollectionVisible}
				setVisible={setDeleteCollectionVisible}
				callback={handleDelete}
			/>
		</div>
	);
}