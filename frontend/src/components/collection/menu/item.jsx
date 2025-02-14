import {useState} from "react";
import ActionManager from "@utils/action.manager.jsx";
import {NavLink, useNavigate} from "react-router";
import CollectionIcon from "@assets/icons/collection.jsx";
import Collection from "@components/collection/collection.jsx";
import FolderMenuItem from "@components/collection/menu/item.folder.jsx";
import RequestMenuItem from "@components/collection/menu/item.request.jsx";
import DropdownIcon from "@assets/icons/drop.down.jsx";

export default function CollectionMenuItem({collection, folders, requests}){
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
					<ActionManager am={[{
						key: `edit_${collection._id}`, label: "Edit", onClick: () => {
							navigate(`collection/${collection._id}`)
						}
					}, ...Collection.am(collection)]}/>
				</div>
			</div>

			{!collapsed && (
				<div className="sub-items">

					{requests.length === 0 && folders.length === 0 &&
						<p className="empty-message">
							This collection is empty <span>Add a request</span> to start working.
						</p>
					}


					<div className="group-items">
						{folders?.length > 0 && folders.map(folder => {
							const associatedRequests = requests.filter(request => request.folder_id === folder._id);
							return <FolderMenuItem key={`folder-${folder._id}`} folder={folder}
												   requests={associatedRequests}/>;
						})}
					</div>
					<div className="group-items">
						{requests?.length > 0 && requests.map(request => {
							if(request.folder_id) return null;
							return <RequestMenuItem key={`request-${request._id}`} request={request}/>;
						})}
					</div>
				</div>
			)}
		</div>
	);
}
