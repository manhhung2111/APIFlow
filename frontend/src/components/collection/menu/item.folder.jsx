import {NavLink, useNavigate} from "react-router";
import ActionManager from "@utils/action.manager.jsx";
import RequestMenuItem from "@components/collection/menu/item.request.jsx";
import Folder from "@components/folder/folder.jsx";
import {FolderOutlined} from "@ant-design/icons";
import {useContext, useState} from "react";
import DropdownIcon from "@assets/icons/drop.down.jsx";
import FolderService from "@services/folder.js";
import {toast} from "react-toastify";
import {WorkspaceContext} from "@contexts/workspace.jsx";

export default function FolderMenuItem({folder, requests}){
	const {setRequests, setFolders} = useContext(WorkspaceContext);
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
		{
			key: `edit_${folder?._id}`, label: "Edit", onClick: () => {
				navigate(`folder/${folder?._id}`)
			}
		},
		{key: `add_request_${folder?._id}`, label: "Add request", onClick: handleAddRequest},
		{key: `duplicate_${folder?._id}`, label: "Duplicate",},
		{key: `delete_${folder?._id}`, label: "Delete", onClick: handleDelete, danger: 1},
	];

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
					<ActionManager am={actionManagers}/>
				</div>
			</div>

			<div className="sub-items">
				<div className="group-items">
					{requests.length === 0 && <p className="empty-message">
						This folder is empty <span>Add a request</span> to start working.
					</p>}

					{requests.length > 0 && requests.map(request => {
						return <RequestMenuItem key={`request-${request._id}`} request={request}/>
					})}
				</div>
			</div>
		</div>
	);
}