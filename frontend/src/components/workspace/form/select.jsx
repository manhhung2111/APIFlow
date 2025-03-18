import {Modal} from "antd";
import CollectionIcon from "@assets/icons/collection.jsx";
import '../styles/form.scss';
import {useContext} from "react";
import CollectionService from "@services/collection.js";
import {WorkspaceContext} from "@contexts/workspace.jsx";
import {toast} from "react-toastify";
import EnvironmentService from "@services/environment.js";
import {useNavigate} from "react-router";
import {CodeSandboxOutlined} from "@ant-design/icons";

export default function WorkspaceNewSelectForm({visible, setVisible}){
	const {workspace, setCollections, setEnvironments} = useContext(WorkspaceContext);
	const navigate = useNavigate();

	const handleCardClick = async(type) => {
		if(type === "Collection"){
			const result = await CollectionService.create(workspace._id);

			if(result?.code === 0){
				toast.success(result?.message);
				setVisible(false);
				setCollections(prev => [...prev, result.data.collection]);
				navigate(`/workspace/${workspace._id}/collection/${result?.data?.collection._id}`);
			} else {
				toast.error(result?.message);
			}
		} else if(type === "Environment"){
			const result = await EnvironmentService.create(workspace._id);
			if(result?.code === 0){
				toast.success(result?.message);
				setVisible(false);
				setEnvironments(prev => [...prev, result.data.environment]);
				navigate(`/workspace/${workspace._id}/environment/${result?.data?.environment._id}`);
			} else {
				toast.error(result?.message);
			}
		}
	};

	return (
		<div className="workspace-new-select-form">
			<Modal
				open={visible}
				onCancel={() => setVisible(false)}
				footer={null}
				className="workspace-new-select-form-modal"
			>
				<div className="cards-container">
					<div className="card" onClick={() => handleCardClick("Collection")}>
						<CollectionIcon/>
						<h5>Collection</h5>
						<p>
							Create a collection to organize, document and share your API requests with others.
						</p>
					</div>
					<div className="card" onClick={() => handleCardClick("Environment")}>
						<CodeSandboxOutlined/>
						<h5>Environment</h5>
						<p>
							Define and use sets of variables across multiple API requests using environments.
						</p>
					</div>
				</div>
			</Modal>
		</div>
	);
}
