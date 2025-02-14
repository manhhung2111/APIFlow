import {Modal} from "antd";
import CollectionIcon from "@assets/icons/collection.jsx";
import EnvironmentIcon from "@assets/icons/environment.jsx";
import '../styles/form.scss';
import {useContext} from "react";
import CollectionService from "@services/collection.js";
import {WorkspaceContext} from "@contexts/workspace.jsx";
import {toast} from "react-toastify";
import EnvironmentService from "@services/environment.js";
import {useNavigate} from "react-router";

export default function WorkspaceNewSelectForm({ visible, setVisible }) {
	const {workspace} = useContext(WorkspaceContext);
	const navigate = useNavigate();


	const handleCardClick = async (type) => {
		let result = null;
		let link = "";

		if (type === "Collection") {
			result = await CollectionService.create(workspace._id);
			link = `/workspace/${workspace._id}/collection/${result?.data?.collection._id}`;
		} else if (type === "Environment") {
			result = await EnvironmentService.create(workspace._id);
			link = `/workspace/${workspace._id}/environment/${result?.data?.environment._id}`;
		}

		if (result?.code === 0) {
			toast.success(result?.message);
			setVisible(false);
			navigate(link);
		} else {
			toast.error(result?.message);
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
						<CollectionIcon />
						<h5>Collection</h5>
						<p>
							Create a collection to organize, document and share your API requests with others.
						</p>
					</div>
					<div className="card" onClick={() => handleCardClick("Environment")}>
						<EnvironmentIcon />
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
