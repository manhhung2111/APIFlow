import {Button, Skeleton, Tabs} from "antd";
import {useContext, useEffect, useState} from "react";
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

export default function CollectionPage(){
	const {
		workspace,
		collections,
		setCollections,
		setFolders,
		setRequests,
		activeCollection,
		setActiveCollection
	} = useContext(WorkspaceContext);

	const [name, setName] = useState("");
	const [content, setContent] = useState("");
	const [authorization, setAuthorization] = useState({type: 1, data: {}});
	const [scripts, setScripts] = useState({
		pre_request: "",
		post_response: ""
	});
	const [variables, setVariables] = useState([]);

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

	const actionManagers = [
		{key: `add_request_${activeCollection?._id}`, label: "Add request", onClick: handleAddRequest},
		{key: `add_folder_${activeCollection?._id}`, label: "Add folder", onClick: handleAddFolder},
		{key: `duplicate_${activeCollection?._id}`, label: "Duplicate",},
		{key: `export_${activeCollection?._id}`, label: "Export",},
		{key: `delete_${activeCollection?._id}`, label: "Delete", onClick: handleDelete, danger: 1},
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
		</div>
	);
}