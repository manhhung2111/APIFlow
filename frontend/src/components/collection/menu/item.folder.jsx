import {NavLink} from "react-router";
import ActionManager from "@utils/action.manager.jsx";
import RequestMenuItem from "@components/collection/menu/item.request.jsx";
import Folder from "@components/folder/folder.jsx";
import {FolderOutlined} from "@ant-design/icons";

export default function FolderMenuItem({folder, requests}) {

	const handleToggleMenu = (event) => {
		console.log(event);
	}

	return (
		<div className="menu-item folder-menu-item">
			<div className="main-item">
				{requests.length > 0 && <span className="dd-cion dropdown-icon" onClick={handleToggleMenu}></span>}

				<NavLink className="item" title={folder.name} to={`folder/${folder._id}`}>
					<div className="icon"><FolderOutlined/></div>
					<div className="label">{folder.name}</div>
				</NavLink>

				<div className="item-side">
					<ActionManager am={Folder.am(folder)}/>
				</div>
			</div>

			<div className="sub-items">
				<div className="group-items">
					{requests.map(request => {
						return <RequestMenuItem key={`request-${request._id}`} request={request}/>
					})}
				</div>
			</div>
		</div>
	);
}