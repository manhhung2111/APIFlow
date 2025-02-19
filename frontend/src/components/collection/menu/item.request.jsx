import ActionManager from "@utils/action.manager.jsx";
import {NavLink, useNavigate} from "react-router";
import ExampleMenuItem from "@components/collection/menu/item.example.jsx";
import Request from "@components/request/request.jsx";
import DropdownIcon from "@assets/icons/drop.down.jsx";
import {useState} from "react";

export default function RequestMenuItem({request}){

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

	const actionManagers = [
		{key: `add_example_${request?._id}`, label: "Add example"},
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

			<NavLink className="item" title={request.name} to={`request/${request._id}`}>
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