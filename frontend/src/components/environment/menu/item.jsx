import {NavLink, useNavigate} from "react-router";
import ActionManager from "@utils/action.manager.jsx";
import {toast} from "react-toastify";
import React, {useContext, useState} from "react";
import {WorkspaceContext} from "@contexts/workspace.jsx";
import EnvironmentService from "@services/environment.js";
import AppDeleteModal from "@components/app/modal/delete.jsx";
import {CodeSandboxOutlined} from "@ant-design/icons";

export default function EnvironmentMenuItem({environment, globalEnv}){
	const {workspace, setEnvironments} = useContext(WorkspaceContext);
	const navigate = useNavigate();
	const [deleteEnvironmentVisible, setDeleteEnvironmentVisible] = useState(false);

	const handleDelete = async() => {
		setDeleteEnvironmentVisible(false);
		const result = await EnvironmentService.delete(environment);

		if(result.code === 0){
			setEnvironments(prev => {
				return prev.filter(e => e._id !== environment._id);
			});
			toast.success(result.message);
			navigate(`environment/${globalEnv._id}`);
		} else {
			toast.error(result.message);
		}
	}

	const handleDuplicate = async() => {
		const result = await EnvironmentService.duplicate(environment);

		if(result.code === 0){
			setEnvironments(prev => [...prev, result.data.environment]);
			toast.success(result.message);
			navigate(`environment/${result.data.environment._id}`);
		} else {
			toast.error(result.message);
		}
	}

	const actionManagers = [
		{key: `duplicate_${environment?._id}`, label: "Duplicate", onClick: handleDuplicate},
		{
			key: `delete_${environment._id}`,
			label: "Delete",
			onClick: () => setDeleteEnvironmentVisible(true),
			danger: 1
		},
	]

	return (
		<div className="environment-menu-item">
			<NavLink className="item" title={environment.name} to={`environment/${environment._id}`}>
				<div className="icon"><CodeSandboxOutlined/></div>
				<div className="label">{environment.name}</div>
			</NavLink>

			<div className="item-side">
				{environment.scope === 1 && workspace?.can?.editable && <ActionManager am={actionManagers}/>}
			</div>
			<AppDeleteModal
				title={`Delete environment "${environment?.name}"?`}
				content={"Deleting this environment is permanent. All associated variables will be lost forever."}
				visible={deleteEnvironmentVisible}
				setVisible={setDeleteEnvironmentVisible}
				callback={handleDelete}
			/>
		</div>
	)
}