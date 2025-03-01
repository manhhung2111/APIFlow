import ActionManager from "@utils/action.manager.jsx";
import {NavLink, useNavigate} from "react-router";
import ExampleMenuItem from "@components/collection/menu/item.example.jsx";
import Request from "@components/request/request.jsx";
import DropdownIcon from "@assets/icons/drop.down.jsx";
import {useContext, useState} from "react";
import RequestService from "@services/request.jsx";
import {toast} from "react-toastify";
import {WorkspaceContext} from "@contexts/workspace.jsx";
import _ from "lodash";

export default function RequestMenuItem({request}){
	const {requests, setRequests} = useContext(WorkspaceContext);
	const [collapsed, setCollapsed] = useState(true);
	// Toggle function
	const handleToggleMenu = () => {
		setCollapsed((prev) => !prev);
	};
	const navigate = useNavigate();

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
		const result = await RequestService.addExample(request);

		if (result.code === 0) {
			const clone = _.cloneDeep(requests);
			for (let i = 0; i < clone.length; i += 1) {
				if (clone[i]._id == request._id) {
					clone[i] = result.data.request;
				}
			}

			setRequests(prev => clone);
			toast.success(result.message);
		} else {
			toast.error(result.message);
		}
	}

	const actionManagers = [
		{key: `add_example_${request?._id}`, label: "Add example", onClick: handleAddExample},
		{key: `documentation_${request?._id}`, label: "View documentation"},
		{key: `duplicate_${request?._id}`, label: "Duplicate",},
		{key: `delete_${request?._id}`, label: "Delete", danger: 1},
	]


	return (<div className={`menu-item request-menu-item ${collapsed ? "-collapsed" : ""}`}>
		<div className="main-item">
			<span className="dd-cion dropdown-icon" onClick={handleToggleMenu}>
				{request?.examples.length > 0 && <DropdownIcon/>}
			</span>
			{request?.examples.length === 0 && <span style={{height: 14, width: 14}}>&nbsp;</span>}

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
				{request.examples.map(example => {
					return <ExampleMenuItem key={`example-${example._id}`} example={example}/>
				})}
			</div>
		</div>
	</div>)
}