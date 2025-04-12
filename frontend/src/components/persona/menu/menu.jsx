import {useContext} from "react";
import {WorkspaceContext} from "@contexts/workspace.jsx";
import {useNavigate} from "react-router";
import {toast} from "react-toastify";
import PersonaService from "@services/persona.js";
import EmptyPersona from "@assets/images/empty.persona.svg";
import {Button} from "antd";
import PersonaMenuItem from "@components/persona/menu/item.jsx";

export default function PersonaMenu(){
	const {workspace, personas, setPersonas} = useContext(WorkspaceContext);

	const navigate = useNavigate();

	const handleAddPersona = async() => {
		const result = await PersonaService.create(workspace._id);

		if(result?.code === 0){
			toast.success(result?.message);
			setPersonas(prev => [...prev, result.data.persona]);
			navigate(`/workspace/${workspace._id}/persona/${result?.data?.persona._id}`);
		} else {
			toast.error(result?.message);
		}
	}

	return (
		<div className="persona-master-menu environment-master-menu">
			{workspace && personas?.length === 0 && <div className="empty-collections">
				<img src={EmptyPersona} alt={"Empty Persona"}/>
				<h4>You don’t have any personas.</h4>
				<p>Personas let you switch roles when making API requests. Define one to test different user experiences
					effortlessly.</p>
				<Button variant={"outlined"} onClick={handleAddPersona}>
					Create Persona
				</Button>
			</div>}
			{workspace && personas.length > 0 && <div className="group-items">
				{personas.map((persona, index) => {
					return <PersonaMenuItem item={persona} key={index}/>
				})}
			</div>}
		</div>
	)
}