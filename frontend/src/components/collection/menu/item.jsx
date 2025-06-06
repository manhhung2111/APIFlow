import React, {useContext, useEffect, useState} from "react";
import ActionManager from "@utils/action.manager.jsx";
import {NavLink, useNavigate, useMatch, useLocation} from "react-router";
import CollectionIcon from "@assets/icons/collection.jsx";
import FolderMenuItem from "@components/collection/menu/item.folder.jsx";
import RequestMenuItem from "@components/collection/menu/item.request.jsx";
import DropdownIcon from "@assets/icons/drop.down.jsx";
import CollectionService from "@services/collection.js";
import {toast} from "react-toastify";
import FolderService from "@services/folder.js";
import {WorkspaceContext} from "@contexts/workspace.jsx";
import AppDeleteModal from "@components/app/modal/delete.jsx";

export default function CollectionMenuItem({collection, folders, requests, examples}){
	const {workspace, setRequests, setFolders, setCollections, setExamples} = useContext(WorkspaceContext);
	const [deleteCollectionVisible, setDeleteCollectionVisible] = useState(false);

	const location = useLocation();

	const isCollectionActive = useMatch(`collection/${collection._id}`);

	// Check if any folder or request link is active
	const isChildActive = folders.some(folder => location.pathname.includes(folder._id)) ||
		requests.some(request => location.pathname.includes(request._id)) || examples.some(example => location.pathname.includes(example._id));

	// If either the collection or any child is active
	const isActive = isCollectionActive || isChildActive;

	// State to track collapsed state
	const [collapsed, setCollapsed] = useState(true);
	// Toggle function

	useEffect(() => {
		if (isActive) {
			setCollapsed(false);
		}
	}, [isActive]);

	const handleToggleMenu = () => {
		setCollapsed((prev) => !prev);
	};
	const navigate = useNavigate();

	const handleNavigate = () => {
		setCollapsed(false);
	}

	const handleAddRequest = async () => {
		const result = await CollectionService.addRequest(collection);

		if (result.code === 0) {
			setRequests(prev => [...prev, result.data.request]);
			navigate(`request/${result.data.request._id}`);
			toast.success(result.message);
		} else {
			toast.error(result.message);
		}
	}

	const handleAddFolder = async () => {
		const result = await FolderService.create(collection);

		if (result.code === 0) {
			setFolders(prev => [...prev, result.data.folder]);
			navigate(`folder/${result.data.folder._id}`);
			toast.success(result.message);
		} else {
			toast.error(result.message);
		}
	}

	const handleDelete = async () => {
		const result = await CollectionService.delete(collection);

		if (result.code === 0) {
			setCollections(prev => {
				return prev.filter(e => e._id !== collection._id);
			});
			toast.success(result.message);
			navigate(`/workspace/${collection.workspace_id}`);
		} else {
			toast.error(result.message);
		}
	}


	const handleDuplicate = async () => {
		const result = await CollectionService.duplicate(collection);

		if (result.code === 0) {
			const newCollection = result.data.collection;
			const newFolders = result.data.folders;
			const newRequests = result.data.requests;
			const newExamples = result.data.examples;

			setFolders(prev => [...prev, ...newFolders]);
			setRequests(prev => [...prev, ...newRequests]);
			setExamples(prev => [...prev, ...newExamples]);
			setCollections(prev => [...prev, newCollection]);

			navigate(`collection/${newCollection._id}`);
			toast.success(result.message);
		} else {
			toast.error(result.message);
		}
	}

	const handleExport = async () => {
		const result = await CollectionService.export(collection);

		if (result.code === 0) {
			toast.success(result.message);

			const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
				JSON.stringify(result.data.collection_export, null, 4)
			)}`;
			const link = document.createElement("a");
			link.href = jsonString;
			link.download = `${collection.name}.collection.json`;

			link.click();
		} else {
			toast.error(result.message);
		}
	}

	const actionManagers = [
		{key: `edit_${collection._id}`, label: "Edit", onClick: () => {navigate(`collection/${collection._id}`)}},
		{key: `add_request_${collection._id}`, label: "Add request",	onClick: handleAddRequest},
		{key: `add_folder_${collection._id}`, label: "Add folder", onClick: handleAddFolder},
		{key: `documentation_${collection._id}`, label: "View documentation", onClick: () => {navigate(`collection/${collection._id}/documentation`)}},
		{key: `duplicate_${collection._id}`, label: "Duplicate", onClick: handleDuplicate},
		{key: `export_${collection._id}`, label: "Export", onClick: handleExport},
		{key: `delete_${collection._id}`, label: "Delete", onClick: () => setDeleteCollectionVisible(true), danger: 1},
	];



	return (
		<div className={`menu-item collection-menu-item ${collapsed ? "-collapsed" : ""}`}>
			<div className="main-item">
                <span className="dd-icon dropdown-icon" onClick={handleToggleMenu}>
                    <DropdownIcon/>
                </span>

				<NavLink className="item" title={collection.name} to={`collection/${collection._id}`}
						 onClick={handleNavigate}>
					<div className="icon"><CollectionIcon/></div>
					<div className="label">{collection.name}</div>
				</NavLink>

				<div className="item-side">
					{workspace?.can?.editable && <ActionManager am={actionManagers}/>}
				</div>
			</div>

			{!collapsed && (
				<div className="sub-items">

					{requests.length === 0 && folders.length === 0 &&
						<p className="empty-message">
							This collection is empty <span onClick={handleAddRequest}>Add a request</span> to start
							working.
						</p>
					}

					<div className="group-items">
						{folders?.length > 0 && folders.map(folder => {
							const associatedRequests = requests.filter(request => request.folder_id == folder._id);
							const associatedExamples = examples.filter(example => example.folder_id == folder._id);

							return <FolderMenuItem key={`folder-${folder._id}`} folder={folder}
												   requests={associatedRequests} examples={associatedExamples}/>;
						})}
					</div>
					<div className="group-items">
						{requests?.length > 0 && requests.map(request => {
							if(request.folder_id) return null;
							const associatedExamples = examples.filter(example => example.request_id == request._id);

							return <RequestMenuItem key={`request-${request._id}`} request={request} examples={associatedExamples}/>;
						})}
					</div>
				</div>
			)}
			<AppDeleteModal
				title={`Delete collection "${collection.name}"?`}
				content={"Deleting this collection is permanent. All its contents, including folders, requests, examples, and all associated runners, will be lost forever."}
				visible={deleteCollectionVisible}
				setVisible={setDeleteCollectionVisible}
				callback={handleDelete}
			/>
		</div>
	);
}
