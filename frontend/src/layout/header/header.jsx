import SuperHeaderNavs from "./navigation/navigation";
import SuperHeaderSearch from "./search/search";
import SuperHeaderSide from "./side/side";
import "./styles/header.scss";
import "./styles/modal.scss";

export default function SuperHeader(){
	return (
		<div className="super-header">
			<SuperHeaderNavs/>
			<SuperHeaderSearch/>
			<SuperHeaderSide/>
		</div>
	);
}