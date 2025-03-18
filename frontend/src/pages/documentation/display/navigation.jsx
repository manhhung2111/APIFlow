import {FolderOutlined} from "@ant-design/icons";
import Request from "@components/request/request.jsx";
import React, {useState} from "react";
import {Anchor} from "antd";
import DropdownIcon from "@assets/icons/drop.down.jsx";

export default function DocumentationNavigation({collection, folders, requests}){
	const [openFolders, setOpenFolders] = useState({});

	function toggleFolder(folderId, event){
		event.preventDefault();
		event.stopPropagation();
		setOpenFolders(prev => ({
			...prev,
			[folderId]: !prev[folderId], // Toggle the folder state
		}));
	}

	function generateAnchors(){
		let items = [];
		items.push({
			key: `collection-${collection._id}`,
			href: `#collection-${collection._id}`,
			title: <div className="item">
				<div className="name">Overview</div>
			</div>,
			className: "collection"
		});

		folders.forEach(folder => {
			let children = [];
			if(folder.children && folder.children.length > 0){
				children = folder.children.map(request => {
					return {
						key: `request-${request._id}`,
						href: `#request-${request._id}`,
						title: <div className={`item ${!openFolders[folder._id] ? "-hidden" : ""}`}>
							<div className="icon">{getRequestIcon(request)}</div>
							<div className="name">{request.name}</div>
						</div>,
						className: `${!openFolders[folder._id] ? "-hidden" : ""}`
					}
				});

			}

			items.push({
				key: `folder-${folder._id}`,
				href: `#folder-${folder._id}`,
				title: <div className={`navigation-item ${(!openFolders[folder._id]) ? "-collapsed" : ""}`}>
					<span className="dd-icon dropdown-icon" onClick={(event) => toggleFolder(folder._id, event)}>
						<DropdownIcon/>
					</span>

					<div className="item">
						<div className="icon"><FolderOutlined/></div>
						<div className="name">{folder.name}</div>
					</div>
				</div>,
				children: children
			});
		});

		let requestsAnchor = requests.map(request => {
			return {
				key: `request-${request._id}`,
				href: `#request-${request._id}`,
				title: <div className="item">
					<div className="icon">{getRequestIcon(request)}</div>
					<div className="name">{request.name}</div>
				</div>
			}
		});

		items.push(...requestsAnchor);

		return items;
	}

	function getRequestIcon(request){
		const method = Request.getMethod(request.method);
		if(!method) return null;

		return <span style={{fontWeight: 600, color: method.color, fontSize: "9px", marginTop: "2px"}}>
			{method.name}
		</span>
	}

	return (<div className="documentation-navigation">
		<Anchor
			replace
			items={generateAnchors()}
		/>
	</div>)
}