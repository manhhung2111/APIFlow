import {NavLink, useLocation, useMatch, useNavigate, useParams} from "react-router";
import ActionManager from "@utils/action.manager.jsx";
import RequestMenuItem from "@components/collection/menu/item.request.jsx";
import {FolderOutlined} from "@ant-design/icons";
import React, {useContext, useEffect, useState} from "react";
import DropdownIcon from "@assets/icons/drop.down.jsx";
import FolderService from "@services/folder.js";
import {toast} from "react-toastify";
import {WorkspaceContext} from "@contexts/workspace.jsx";
import AppDeleteModal from "@components/app/modal/delete.jsx";

export default function FolderMenuItem({folder, requests, examples}){
	const {workspace, setRequests, setFolders, setExamples} = useContext(WorkspaceContext);
	const [deleteFolderVisible, setDeleteFolderVisible] = useState(false);

	const location = useLocation();
	const {folder_id} = useParams();

	const isFolderActive = useMatch(`folder/${folder._id}`);

	// Check if any request link is active
	const isChildActive = requests.some(request => location.pathname.includes(request._id)) || examples.some(example => location.pathname.includes(example._id));

	// If either the collection or any child is active
	const isActive = isFolderActive || isChildActive;

	// State to track collapsed state
	const [collapsed, setCollapsed] = useState(true);
	// Toggle function
	const handleToggleMenu = () => {
		setCollapsed((prev) => !prev);
	};
	const navigate = useNavigate();

	const handleNavigate = () => {
		setCollapsed(false);
	}

	useEffect(() => {
		if(isActive){
			setCollapsed(false);
		}
	}, [isActive]);

	const handleAddRequest = async() => {
		const result = await FolderService.addRequest(folder);

		if(result.code === 0){
			setRequests(prev => [...prev, result.data.request]);
			navigate(`request/${result.data.request._id}`);
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
			if(folder_id == folder._id){
				navigate(`collection/${folder.collection_id}`);
			}
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

			navigate(`folder/${newFolder._id}`);
			toast.success(result.message);
		} else {
			toast.error(result.message);
		}
	}

	const actionManagers = [
		{
			key: `edit_${folder?._id}`, label: "Edit", onClick: () => {
				navigate(`folder/${folder?._id}`)
			}
		},
		{key: `add_request_${folder?._id}`, label: "Add request", onClick: handleAddRequest},
		{key: `duplicate_${folder?._id}`, label: "Duplicate", onClick: handleDuplicate},
		{key: `delete_${folder?._id}`, label: "Delete", onClick: () => setDeleteFolderVisible(true), danger: 1},
	];

	console.log(`Folder ${folder.name} - ${requests.length} requests`);

	return (
		<div className={`menu-item folder-menu-item ${collapsed ? "-collapsed" : ""}`}>
			<div className="main-item">
				<span className="dd-icon dropdown-icon" onClick={handleToggleMenu}>
                    <DropdownIcon/>
                </span>

				<NavLink className="item" title={folder.name} to={`folder/${folder._id}`} onClick={handleNavigate}>
					<div className="icon"><FolderOutlined/></div>
					<div className="label">{folder.name}</div>
				</NavLink>

				<div className="item-side">
					{workspace?.can?.editable && <ActionManager am={actionManagers}/>}
				</div>
			</div>

			<div className="sub-items">
				<div className="group-items">
					{requests.length === 0 && <p className="empty-message">
						This folder is empty <span onClick={handleAddRequest}>Add a request</span> to start working.
					</p>}

					{requests.length > 0 && requests.map(request => {
						const associatedExamples = examples.filter(example => example.request_id == request._id);

						return <RequestMenuItem key={`request-${request._id}`} request={request}
												examples={associatedExamples}/>
					})}
				</div>
			</div>
			<AppDeleteModal
				title={`Delete folder "${folder.name}"?`}
				content={"Deleting this folder is permanent. All its contents, including requests and examples, will be lost forever."}
				visible={deleteFolderVisible}
				setVisible={setDeleteFolderVisible}
				callback={handleDelete}
			/>
		</div>
	);
}