import SuperHeader from "@layout/header/header.jsx";
import MasterMenu from "@layout/menu/menu.jsx";

export default function HomePage(){

	return (
		<>
			<SuperHeader/>
			<div id="body">
				<div className={"master-menu-wrapper"}>
					<MasterMenu />
				</div>
				<div className={"master-main-wrapper"}>

				</div>
			</div>
		</>
	);
}