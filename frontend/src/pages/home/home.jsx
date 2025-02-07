import SuperHeader from "@layout/header/header.jsx";
import TeamWork from "@assets/images/team.work.svg";
import {Button} from "antd";
import './styles/home.scss'
import {NavLink} from "react-router";
import NorthEastIcon from "@assets/icons/north.east.jsx";
import {BarChartOutlined, TeamOutlined, UserOutlined} from "@ant-design/icons";
import {useContext} from "react";
import {AppContext} from "@contexts/app.jsx";
import EmptyMain from "@assets/images/empty.main.svg";
import Analytics from "@assets/images/analytics.svg";
import FlowChart from "@assets/images/flowchart.svg";
import Integration from "@assets/images/integration.svg";
import MenuBook from "@assets/images/menu.book.svg";
import PasswordAuthorization from "@assets/images/password.authorization.svg";
import QuickReference from "@assets/images/quick.reference.svg";

export default function HomePage(){
	let {workspaces} = useContext(AppContext);

	return (
		<div className="home-page master-page">
			<SuperHeader/>
			<div className="page-main" id="page-main">
				<div className="master-menu">
					<div className="menu-section">
						<img src={TeamWork} alt={"Team work image"}/>
						<h4>APIFlow works best with teams</h4>
						<p>Collaborate in real-time and establish a single source of truth for all API workflows.</p>
						<Button className="cta-btn" color="default" variant="outlined">Create Team</Button>
					</div>
					<div className="menu-section">
						<NavLink className="link-btn" to={"/workspaces"}> <UserOutlined/> Workspaces</NavLink>
						<NavLink className="link-btn" to={"/teams"}><TeamOutlined/> Teams</NavLink>
						<NavLink className="link-btn" to={"/reports"}><BarChartOutlined/> Reports</NavLink>
					</div>
					<div className="menu-section">
						<NavLink className="link-ref" to={"/introduction"}>What is APIFlow <NorthEastIcon/> </NavLink>
						<NavLink className="link-ref" to={"/doc"}>Learning Center <NorthEastIcon/></NavLink>
						<NavLink className="link-ref" to={"/reports"}>Reports <NorthEastIcon/></NavLink>
					</div>
				</div>
				<div className="master-main">
					<div className="display-section">
						<div className="ds-header">
							<h2>Recently visited workspaces</h2>
						</div>
						{workspaces.length > 0 &&
							<div className="workspace-list">
								<div className="list-item">
									<div className="icon">
										<UserOutlined/>

									</div>
								</div>
							</div>
						}
						{workspaces.length === 0 &&
							<div className="empty-workspaces">
								<img className="empty-image" src={EmptyMain} alt={"Empty main"}/>
								<p>Join a team or create a workspace to start collaborating</p>
							</div>}
					</div>
					<div className="display-section">
						<div className="ds-header">
							<h2>Discover what you can do in APIFlow</h2>
							<p>Explore the full potential of APIFlow with collection templates.</p>
						</div>
						<div className="templates">
							<div className="card">
								<div className="avatar">
									<img src={MenuBook} alt={"Rest api basics"}/>
								</div>
								<h4>Rest API basics</h4>
								<p>Get up to speed with testing REST APIs on APIFlow.</p>
							</div>
							<div className="card">
								<div className="avatar"><img src={Integration} alt={"Integration"}/></div>
								<h4>Integration testing basics</h4>
								<p>Verify if your APIs work as expected.</p>
							</div>
							<div className="card">
								<div className="avatar"><img src={QuickReference} alt={"Api documentation"}/></div>
								<h4>API documentation</h4>
								<p>Create beautiful API documentation using Markdown.</p>
							</div>
							<div className="card">
								<div className="avatar"><img src={FlowChart} alt={"api scenario testing"}/></div>
								<h4>API scenario testing</h4>
								<p>Test API scenarios by iterating through a data set and triggering workflows based on
									responses.</p>
							</div>
							<div className="card">
								<div className="avatar"><img src={Analytics} alt={"Data visualization"}/></div>
								<h4>Data visualization</h4>
								<p>Turn complex response data into an easy-to-understand visualization.</p>
							</div>
							<div className="card">
								<div className="avatar"><img src={PasswordAuthorization} alt={"Authorization methods"}/>
								</div>
								<h4>Authorization methods</h4>
								<p>Learn more about different authorization types and quickly set up auth helpers for
									your API in APIFlow.</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}