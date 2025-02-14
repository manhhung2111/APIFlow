import ActionManager from "@utils/action.manager.jsx";
import {NavLink} from "react-router";
import BookmarkIcon from "@assets/icons/bookmark.jsx";
import Example from "@components/example/example.jsx";

export default function ExampleMenuItem({example}) {

	return (<div className="menu-item example-menu-item">
		<NavLink className="item" title={example.name} to={`example/${example._id}`}>
			<div className="item-label">
				<span className="request-icon"><BookmarkIcon /></span>
				<span className="label">{example.name}</span>
			</div>
			<div className="item-side">
				<ActionManager am={Example.am(example)}/>
			</div>
		</NavLink>
	</div>)
}