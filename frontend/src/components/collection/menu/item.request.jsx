import ActionManager from "@utils/action.manager.jsx";
import {NavLink} from "react-router";
import ExampleMenuItem from "@components/collection/menu/item.example.jsx";
import Request from "@components/request/request.jsx";

export default function RequestMenuItem({request}){

	const handleToggleMenu = (event) => {
		console.log(event);
	}

	function getRequestIcon(){
		const method = Request.getMethod(request.method.toLowerCase());
		if(!method) return null;

		return <span style={{fontWeight: 600, color: method.color, fontSize: "9px", marginTop: "2px"}}>
			{method.name}
		</span>
	}

	return (<div className="menu-item request-menu-item">
		<div className="main-item">
			{request.examples.length > 0 && <span className="dd-cion dropdown-icon" onClick={handleToggleMenu}></span>}

			<NavLink className="item" title={request.name} to={`request/${request._id}`}>
				<div className="icon">{getRequestIcon()}</div>
				<div className="label">{request.name}</div>
			</NavLink>

			<div className="item-side">
				<ActionManager am={Request.am(request)}/>
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