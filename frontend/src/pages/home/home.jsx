import SuperHeader from "@layout/header/header.jsx";
import MasterMenu from "@layout/menu/menu.jsx";
import RequestSidebar from "@components/request/sidebar/sidebar.jsx";
import './styles/styles.scss';

export default function HomePage(){

	return (
		<>
			<SuperHeader/>
			<div id="body">
				<div className={"master-menu-wrapper"}>
					<MasterMenu />
				</div>
				<div className="master-main-wrapper">
					<div className="header">ABC</div>
					<div className="main">

						<div className="sidebar">
							<RequestSidebar />
						</div>
					</div>
				</div>
			</div>
		</>
	);
}