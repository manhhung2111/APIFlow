import {NavLink} from "react-router";
import ActionManager from "@utils/action.manager.jsx";

export default function AppMasterMenuItem(props) {
	let {icon, label, link, items, am} = props

	const handleToggleMenu = (event) => {
		console.log(event);
	}

	return (
		<div className="app-master-menu-item -collapsed">
			{items && <span className="dd-cion dropdown-icon" onClick={handleToggleMenu}></span>}

			<NavLink className="item" title={label} to={link}>
				<div className="item-label">
					<span className="icon">{icon}</span>
					<span className="label">label</span>
				</div>
				{am && <div className="side">
					<ActionManager am={am}/>
				</div>}
			</NavLink>

			<div className="sub-items">

			</div>
		</div>
	)
}