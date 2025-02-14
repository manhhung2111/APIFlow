import {FolderOutlined} from "@ant-design/icons";
import ActionManager from "@utils/action.manager.jsx";
import Folder from "@components/folder/folder.jsx";
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

		return <span style={{fontWeight: 600, color: method.color}}>
			{method.name}
		</span>
	}

	return (<div className="menu-item request-menu-item">
		{request.examples.length && <span className="dd-cion dropdown-icon" onClick={handleToggleMenu}></span>}

		<NavLink className="item" title={request.name} to={`request/${request._id}`}>
			<div className="item-label">
				<span className="request-icon">{getRequestIcon()}</span>
				<span className="label">{request.name}</span>
			</div>
			<div className="item-side">
				<ActionManager am={Request.am(request)}/>
			</div>
		</NavLink>

		<div className="sub-items">
			<div className="group-items">
				{request.examples.map(example => {
					return <ExampleMenuItem key={`example-${example._id}`} example={example}/>
				})}
			</div>
		</div>
	</div>)
}