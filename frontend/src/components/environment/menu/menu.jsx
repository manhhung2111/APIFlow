import "../styles/menu.scss";
import {useContext} from "react";
import {WorkspaceContext} from "@contexts/workspace.jsx";
import {useNavigate} from "react-router";
import {toast} from "react-toastify";
import EnvironmentService from "@services/environment.js";
import EmptyMenu from "@assets/images/empty.menu.svg";
import {Button} from "antd";
import EnvironmentMenuItem from "@components/environment/menu/item.jsx";

export default function EnvironmentMenu(){
	const {workspace, environments, setEnvironments} = useContext(WorkspaceContext);

	const navigate = useNavigate();

	const handleAddEnvironment = async() => {
		const result = await EnvironmentService.create(workspace._id);

		if(result?.code === 0){
			toast.success(result?.message);
			setEnvironments(prev => [...prev, result.data.environment]);
			navigate(`/workspace/${workspace._id}/environment/${result?.data?.environment._id}`);
		} else {
			toast.error(result?.message);
		}
	}

	const globalEnv = environments.find(e => e.scope === 0);
	const envs = environments.filter(e => e.scope === 1);

	return (
		<div className="environment-master-menu">
			<EnvironmentMenuItem environment={globalEnv}/>
			<hr/>
			{workspace && envs?.length === 0 && <div className="empty-collections">
				<img src={EmptyMenu} alt={"Empty collection"}/>
				<h4>You don’t have any environments.</h4>
				<p>An environment is a set of variables that allows you to switch the context of your requests.</p>
				<Button variant={"outlined"} onClick={handleAddEnvironment}>
					Create Environment
				</Button>
			</div>}
			{workspace && envs.length > 0 && <div className="group-items">
				{envs.map(env => {
					return <EnvironmentMenuItem environment={env} key={env._id} globalEnv={globalEnv}/>
				})}
			</div>}
		</div>
	)
}