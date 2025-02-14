import {NavLink, useNavigate} from "react-router";
import ActionManager from "@utils/action.manager.jsx";
import RequestMenuItem from "@components/collection/menu/item.request.jsx";
import Folder from "@components/folder/folder.jsx";
import {FolderOutlined} from "@ant-design/icons";
import {useState} from "react";
import DropdownIcon from "@assets/icons/drop.down.jsx";

export default function FolderMenuItem({folder, requests}){
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
					<ActionManager am={Folder.am(folder)}/>
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