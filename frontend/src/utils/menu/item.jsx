import {NavLink} from "react-router";
import ActionManager from "@utils/action.manager.jsx";

export default function MasterMenuItem(props){
	const {title, url, am} = props;

	return (
		<div className="master-menu-item">
			<NavLink to={url}>{title}</NavLink>
			<ActionManager am={am}/>
		</div>
	)
}