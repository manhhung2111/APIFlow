import {useContext} from "react";
import {WorkspaceContext} from "@contexts/workspace.jsx";
import EmptyCollection from "@assets/images/collection-preview-without-access-light.png";
import CollectionMenuItem from "@components/collection/menu/item.jsx";

export default function CollectionMenu(){
	const {workspace, collections, folders, requests} = useContext(WorkspaceContext);

	return (
		<div className="collections-master-menu">
			{workspace && collections?.length === 0 && <div className="empty-collections">
				<img src={EmptyCollection} alt={"Empty collection"}/>
				<h4>Create a collection for your requests</h4>
				<p>A collection lets you group related requests and easily set common authorization, tests, scripts, and
					variables for all requests in it.</p>
			</div>}
			{workspace && collections?.length > 0 && <div className="group-items">
				{collections.map(collection => {
					const associatedFolders = folders?.filter(folder => folder.collection_id === collection._id) || [];
					const associatedRequests = requests?.filter(request => request.collection_id === collection._id) || [];

					return <CollectionMenuItem key={`collection-${collection._id}`} collection={collection}
											   folders={associatedFolders} requests={associatedRequests}/>;
				})}
			</div>}
		</div>

	)
}