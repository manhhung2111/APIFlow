import ActionManager from "@utils/action.manager.jsx";
import {NavLink, useLocation, useMatch, useNavigate, useParams} from "react-router";
import ExampleMenuItem from "@components/collection/menu/item.example.jsx";
import Request from "@components/request/request.jsx";
import DropdownIcon from "@assets/icons/drop.down.jsx";
import {useContext, useEffect, useState} from "react";
import RequestService from "@services/request.jsx";
import {toast} from "react-toastify";
import {WorkspaceContext} from "@contexts/workspace.jsx";
import _ from "lodash";
import ExampleService from "@services/example.js";
import FolderService from "@services/folder.js";

export default function RequestMenuItem({request, examples: requestExamples}){
	const {setExamples, requests, setRequests} = useContext(WorkspaceContext);
	const [collapsed, setCollapsed] = useState(true);
	// Toggle function
	const handleToggleMenu = () => {
		setCollapsed((prev) => !prev);
	};
	const navigate = useNavigate();
	const {request_id} = useParams();

	const location = useLocation();

	// Check if any request link is active
	const isChildActive = requestExamples.some(example => location.pathname.includes(example._id));

	useEffect(() => {
		if(isChildActive){
			setCollapsed(false);
		}
	}, [isChildActive]);

	const handleNavigate = () => {
		setCollapsed(false);
	}

	function getRequestIcon(){
		const method = Request.getMethod(request.method);
		if(!method) return null;

		return <span style={{fontWeight: 600, color: method.color, fontSize: "9px", marginTop: "2px"}}>
			{method.name}
		</span>
	}

	const handleAddExample = async () => {
		const result = await ExampleService.createFromRequest(request);

		if (result.code === 0) {
			setExamples(prev => [...prev, result.data.example]);
			navigate(`example/${result.data.example._id}`);
			toast.success(result.message);
		} else {
			toast.error(result.message);
		}
	}

	const handleDelete = async () => {
		const result = await RequestService.delete(request);

		if (result.code === 0) {
			setRequests(prev => prev.filter(e => e._id != request._id));

			if (request_id == request._id) {
				if (request.folder_id) {
					navigate(`folder/${request.folder_id}`);
				} else {
					navigate(`collection/${request.collection_id}`);
				}
			}

			toast.success(result.message);
		} else {
			toast.error(result.message);
		}
	}

	const handleDuplicate = async () => {
		const result = await RequestService.duplicate(request);

		if(result.code === 0){
			const newRequest = result.data.request;
			const newExamples = result.data.examples;

			setRequests(prev => [...prev, newRequest]);
			setExamples(prev => [...prev, ...newExamples]);

			navigate(`request/${newRequest._id}`);
			toast.success(result.message);
		} else {
			toast.error(result.message);
		}
	}

	const actionManagers = [
		{key: `add_example_${request?._id}`, label: "Add example", onClick: handleAddExample},
		{key: `documentation_${request?._id}`, label: "View documentation"},
		{key: `duplicate_${request?._id}`, label: "Duplicate", onClick: handleDuplicate},
		{key: `delete_${request?._id}`, label: "Delete", danger: 1, onClick: handleDelete},
	]


	return (<div className={`menu-item request-menu-item ${collapsed ? "-collapsed" : ""}`}>
		<div className="main-item">
			<span className="dd-cion dropdown-icon" onClick={handleToggleMenu}>
				{requestExamples?.length > 0 && <DropdownIcon/>}
			</span>
			{requestExamples?.length === 0 && <span style={{height: 14, width: 14}}>&nbsp;</span>}

			<NavLink className="item" title={request.name} to={`request/${request._id}`} onClick={handleNavigate}>
				<div className="icon">{getRequestIcon()}</div>
				<div className="label">{request.name}</div>
			</NavLink>

			<div className="item-side">
				<ActionManager am={actionManagers}/>
			</div>
		</div>

		<div className="sub-items">
			<div className="group-items">
				{requestExamples?.map(example => {
					return <ExampleMenuItem key={`example-${example._id}`} example={example}/>
				})}
			</div>
		</div>
	</div>)
}