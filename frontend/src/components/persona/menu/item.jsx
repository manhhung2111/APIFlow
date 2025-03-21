import React, {useContext, useState} from "react";
import {WorkspaceContext} from "@contexts/workspace.jsx";
import {NavLink, useNavigate} from "react-router";
import {toast} from "react-toastify";
import PersonaService from "@services/persona.js";
import {UserOutlined} from "@ant-design/icons";
import ActionManager from "@utils/action.manager.jsx";
import AppDeleteModal from "@components/app/modal/delete.jsx";

export default function PersonaMenuItem({item}){
	const {workspace, personas, setPersonas} = useContext(WorkspaceContext);
	const navigate = useNavigate();
	const [deletePersonaVisible, setDeletePersonaVisible] = useState(false);

	const handleDelete = async() => {
		setDeletePersonaVisible(false);
		const result = await PersonaService.delete(item);

		if(result.code === 0){
			const deletedIndex = personas.findIndex(e => e._id === item._id);
			const newPersonas = personas.filter(e => e._id !== item._id);

			setPersonas(newPersonas);

			toast.success(result.message);

			// Redirect logic
			if(newPersonas.length > 0){
				const targetIndex = deletedIndex > 0 ? deletedIndex - 1 : 0;
				const targetPersona = newPersonas[targetIndex];

				navigate(`/workspace/${item.workspace_id}/persona/${targetPersona._id}`);
			} else {
				navigate(`/workspace/${item.workspace_id}`);
			}
		} else {
			toast.error(result.message);
		}
	}

	const handleDuplicate = async() => {
		const result = await PersonaService.duplicate(item);

		if(result.code === 0){
			setPersonas(prev => [...prev, result.data.persona]);
			toast.success(result.message);
			navigate(`persona/${result.data.persona._id}`);
		} else {
			toast.error(result.message);
		}
	}

	const actionManagers = [
		{key: `duplicate_${item?._id}`, label: "Duplicate", onClick: handleDuplicate},
		{
			key: `delete_${item._id}`,
			label: "Delete",
			onClick: () => setDeletePersonaVisible(true),
			danger: 1
		},
	]

	return (
		<div className="environment-menu-item">
			<NavLink className="item" title={item.name} to={`persona/${item._id}`}>
				<div className="icon"><UserOutlined/></div>
				<div className="label">{item.name}</div>
			</NavLink>

			<div className="item-side">
				{workspace?.can?.editable && <ActionManager am={actionManagers}/>}
			</div>
			<AppDeleteModal
				title={`Delete persona "${item?.name}"?`}
				content={"Deleting this persona is permanent. All associated settings will be lost forever."}
				visible={deletePersonaVisible}
				setVisible={setDeletePersonaVisible}
				callback={handleDelete}
			/>
		</div>
	)
}