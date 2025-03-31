import {useContext} from "react";
import {WorkspaceContext} from "@contexts/workspace.jsx";
import EmptyMenu from "@assets/images/empty.menu.svg";
import CollectionMenuItem from "@components/collection/menu/item.jsx";
import {Button} from "antd";
import CollectionService from "@services/collection.js";
import {toast} from "react-toastify";
import {useNavigate} from "react-router";

export default function CollectionMenu(){
	const {workspace, collections, folders, requests, examples, setCollections, activeCollection} = useContext(WorkspaceContext);
	const navigate = useNavigate();

	const handleAddCollection = async () => {
		const result = await CollectionService.create(workspace._id);

		if (result?.code === 0) {
			toast.success(result?.message);
			setCollections(prev => [...prev, result.data.collection]);
			navigate(`/workspace/${workspace._id}/collection/${result?.data?.collection._id}`);
		} else {
			toast.error(result?.message);
		}
	}

	console.log(`Collection ${activeCollection?.name} - ${requests?.length} requests`);

	return (
		<div className="collections-master-menu">
			{workspace && collections?.length === 0 && <div className="empty-collections">
				<img src={EmptyMenu} alt={"Empty collection"}/>
				<h4>Create a collection for your requests</h4>
				<p>A collection lets you group related requests and easily set common authorization, tests, scripts, and
					variables for all requests in it.</p>
				<Button variant={"outlined"} onClick={handleAddCollection}>
					Create Collection
				</Button>
			</div>}
			{workspace && collections?.length > 0 && <div className="group-items">
				{collections.map(collection => {
					const associatedFolders = folders?.filter(folder => folder.collection_id == collection._id) || [];
					const associatedRequests = requests?.filter(request => request.collection_id == collection._id) || [];
					const associatedExamples = examples?.filter(example => example.collection_id == collection._id) || [];

					return <CollectionMenuItem key={`collection-${collection._id}`} collection={collection}
											   folders={associatedFolders} requests={associatedRequests} examples={associatedExamples}/>;
				})}
			</div>}
		</div>

	)
}