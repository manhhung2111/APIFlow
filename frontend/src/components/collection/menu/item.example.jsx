import ActionManager from "@utils/action.manager.jsx";
import {NavLink, useNavigate, useParams} from "react-router";
import BookmarkIcon from "@assets/icons/bookmark.jsx";
import {toast} from "react-toastify";
import ExampleService from "@services/example.js";
import {useContext} from "react";
import {WorkspaceContext} from "@contexts/workspace.jsx";

export default function ExampleMenuItem({example}){
	const {workspace, setExamples} = useContext(WorkspaceContext);

	const {example_id} = useParams();
	const navigate = useNavigate();

	const handleDelete = async() => {
		const result = await ExampleService.delete(example);

		if(result.code === 0){
			setExamples(prev => {
				return prev.filter(e => e._id !== example._id);
			});

			if(example_id == example._id){
				navigate(`request/${example.request_id}`);
			}

			toast.success(result.message);
		} else {
			toast.error(result.message);
		}
	}

	const handleDuplicate = async() => {
		const result = await ExampleService.duplicate(example);

		if(result.code === 0){
			const newExample = result.data.example;

			setExamples(prev => [...prev, newExample]);
			navigate(`example/${newExample._id}`);
			toast.success(result.message);
		} else {
			toast.error(result.message);
		}
	}

	const actionManagers = [
		{key: `duplicate_${example?._id}`, label: "Duplicate", onClick: handleDuplicate},
		{key: `delete_${example?._id}`, label: "Delete", danger: 1, onClick: handleDelete},
	]

	return (<div className="menu-item example-menu-item">
		<div className="main-item">
			<span style={{height: 3, width: 3}}>&nbsp;</span>
			<NavLink className="item" title={example.name} to={`example/${example._id}`}>
				<div className="icon"><BookmarkIcon/></div>
				<div className="label">{example.name}</div>
			</NavLink>

			<div className="item-side">
				{workspace?.can?.editable && <ActionManager am={actionManagers}/>}
			</div>
		</div>
	</div>)
}