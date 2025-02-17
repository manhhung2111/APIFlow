import {Button, Skeleton, Tabs} from "antd";
import {useContext, useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router";
import CollectionService from "@services/collection.js";
import {WorkspaceContext} from "@contexts/workspace.jsx";
import CollectionIcon from "@assets/icons/collection.jsx";
import './styles/collection.scss';
import CollectionDisplayOverview from "@components/collection/display/overview.jsx";
import CollectionDisplayAuthorization from "@components/collection/display/authorization.jsx";
import CollectionDisplayScripts from "@components/collection/display/scripts.jsx";
import CollectionDisplayVariables from "@components/collection/display/variables.jsx";
import {SaveOutlined} from "@ant-design/icons";
import Collection from "@components/collection/collection.jsx";
import ActionManager from "@utils/action.manager.jsx";
import {toast} from "react-toastify";

export default function CollectionPage(){
	const {workspace} = useContext(WorkspaceContext);
	const [collection, setCollection] = useState(null);

	const [name, setName] = useState("");
	const [content, setContent] = useState("");
	const [authorization, setAuthorization] = useState({type: 1, data: {}});
	const [scripts, setScripts] = useState({
		pre_request: "",
		post_response: ""
	});
	const [variables, setVariables] = useState([]);

	const {collection_id} = useParams();
	const navigate = useNavigate();
	useEffect(() => {
		async function fetchCollection(){
			const result = await CollectionService.getById(collection_id, workspace._id);

			if(result.code === 0){
				const collection = result.data.collection;
				setCollection(collection);
				setName(collection.name);
				setContent(collection.content);
				setAuthorization(collection.authorization);
				setScripts(collection.scripts);
				setVariables([...collection.variables, {
					selected: 0,
					variable: '',
					initial_value: '',
					current_value: ''
				}]);
			} else {
				console.log(result.message);
			}
		}

		if(workspace){
			fetchCollection();
		}
	}, [collection_id, workspace]);

	const items = [
		{
			label: "Overview",
			key: 1,
			children: <CollectionDisplayOverview collection={collection} name={name} setName={setName} content={content}
												 setContent={setContent}/>
		},
		{
			label: "Authorization",
			key: 2,
			children: <CollectionDisplayAuthorization collection={collection} authorization={authorization}
													  setAuthorization={setAuthorization}/>
		},
		{
			label: "Scripts",
			key: 3,
			children: <CollectionDisplayScripts collection={collection} scripts={scripts} setScripts={setScripts}/>
		},
		{
			label: "Variables",
			key: 4,
			children: <CollectionDisplayVariables collection={collection} variables={variables}
												  setVariables={setVariables}/>
		},
	]

	const handleSave =  async () => {
		const result = await CollectionService.save(collection, name, content, authorization, scripts, variables);

		if (result.code === 0){
			toast.success(result.message);
		} else {
			toast.error(result.message);
		}
	}

	return (
		<div className="collection-page">
			<div className="header">
				{collection && <div className="inner-header">
					<div className="text">
						<CollectionIcon/>
						{collection.name}
					</div>
					<div className="side">
						<Button color="default" variant="text" icon={<SaveOutlined/>} onClick={handleSave}>
							Save
						</Button>
						<ActionManager am={Collection.am(collection, navigate)} />
					</div>
				</div>}
				{!collection && <Skeleton.Input active={true}/>}
			</div>
			<div className="main">
				{!collection && <div style={{padding: "16px"}}>
					<Skeleton active/>
				</div>
				}
				{collection && <Tabs
					tabBarGutter={16}
					items={items}
				/>}
			</div>
		</div>
	);
}