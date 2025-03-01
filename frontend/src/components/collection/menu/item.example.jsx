import ActionManager from "@utils/action.manager.jsx";
import {NavLink} from "react-router";
import BookmarkIcon from "@assets/icons/bookmark.jsx";

export default function ExampleMenuItem({example}){

	return (<div className="menu-item example-menu-item">
		<div className="main-item">
			<span style={{height: 3, width: 3}}>&nbsp;</span>
			<NavLink className="item" title={example.name} to={`example/${example._id}`}>
				<div className="icon"><BookmarkIcon/></div>
				<div className="label">{example.name}</div>
			</NavLink>

			<div className="item-side">
				<ActionManager am={[]}/>
			</div>
		</div>
	</div>)
}