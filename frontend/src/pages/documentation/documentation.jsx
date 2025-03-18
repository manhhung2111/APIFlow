import {Button, Skeleton} from "antd";
import React, {useContext, useEffect, useState} from "react";
import {WorkspaceContext} from "@contexts/workspace.jsx";
import DocumentIcon from "@assets/icons/document.jsx";
import {useLocation, useNavigate, useParams} from "react-router";
import "./styles/documentation.scss";
import {CloudDownloadOutlined} from "@ant-design/icons";
import NorthEastIcon from "@assets/icons/north.east.jsx";
import CollectionService from "@services/collection.js";
import DocumentationCollection from "@pages/documentation/display/collection.jsx";
import {toast} from "react-toastify";
import DocumentationNavigation from "@pages/documentation/display/navigation.jsx";
import DocumentationFolder from "@pages/documentation/display/folder.jsx";
import DocumentationRequest from "@pages/documentation/display/request.jsx";

export default function DocumentationPage(){
	const {workspace, activeCollection, setActiveCollection} = useContext(WorkspaceContext);
	const navigate = useNavigate();
	const {collection_id} = useParams();
	const [folders, setFolders] = useState(null);
	const [requests, setRequests] = useState(null);

	useEffect(() => {
		async function fetchCollection(){
			const result = await CollectionService.getCollectionAssociatedWithData(collection_id, workspace._id);

			if(result.code === 0){
				const collection = result.data.collection;
				setActiveCollection(collection);

				const [treeRequests, treeFolders] = constructTree(result.data.folders, result.data.requests, result.data.examples);
				setFolders(treeFolders);
				setRequests(treeRequests);
			} else {
				toast.error(result.message);
			}
		}

		if(workspace){
			setActiveCollection(null);
			fetchCollection();
		}
	}, [collection_id, workspace]);

	const location = useLocation(); // Get current URL

	useEffect(() => {
		if (location.hash) {
			const element = document.querySelector(location.hash);
			if (element) {
				element.scrollIntoView({ behavior: "auto", block: "start" });
			}
		}
	}, [location, folders, requests]);

	return (<div className="documentation-page">
		<div className="header">
			{activeCollection && <div className="inner-header">
				<div className="text">
					<DocumentIcon/>
					{activeCollection.name}
				</div>
				<div className="actions">
					<Button color="default" variant="text" icon={<NorthEastIcon/>}
							onClick={() => navigate(`/workspace/${activeCollection.workspace_id}/collection/${activeCollection._id}`)}>
						View Collection
					</Button>

					<Button color="default" variant="text" icon={<CloudDownloadOutlined/>}>
						Export Collection
					</Button>
				</div>
			</div>}
			{!activeCollection && <Skeleton.Input active={true}/>}
		</div>
		{(folders == null || requests == null || activeCollection == null) &&
			<Skeleton active={true} style={{padding: 16}}/>}
		{folders && requests && activeCollection && <div className="main">
			<div className="content-wrapper">
				<div className="content">
					<DocumentationCollection collection={activeCollection}/>
					{folders.map((folder, index) => {
						return <DocumentationFolder collection={activeCollection} folder={folder} key={index}/>
					})}
					{requests && requests.length > 0 && requests.map((request, index) => {
						return <DocumentationRequest request={request} key={index} collection={activeCollection}/>
					})}
				</div>
			</div>
			<div className="navigation">
				<DocumentationNavigation collection={activeCollection} folders={folders} requests={requests}/>
			</div>
		</div>}
	</div>)
}

function constructTree(folders, requests, examples){
	const foldersMap = new Map(folders.map(folder => [folder._id, {...folder, children: []}]));
	const requestsMap = new Map(requests.map(request => [request._id, {...request, children: []}]));

	examples.forEach(example => {
		if(requestsMap.has(example.request_id)){
			requestsMap.get(example.request_id).children.push(example);
		}
	});

	const rootRequests = [];
	requests.forEach(request => {
		if(request.folder_id && foldersMap.has(request.folder_id)){
			foldersMap.get(request.folder_id).children.push(requestsMap.get(request._id));
		} else {
			rootRequests.push(requestsMap.get(request._id));
		}
	});

	return [rootRequests, Array.from(foldersMap.values())];
}