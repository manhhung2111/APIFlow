import SuperHeaderNavs from "@components/header/navs";
import SuperHeaderSearch from "@components/header/search";
import SuperHeaderSide from "@components/header/side";


export default function SuperHeader(){
	return (
		<div className="super-header">
			<SuperHeaderNavs/>
			<SuperHeaderSearch/>
			<SuperHeaderSide/>
		</div>
	);
}