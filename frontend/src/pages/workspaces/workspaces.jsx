import WorkspaceFormCreate from "@components/workspace/form/create.jsx";
import {useContext, useEffect, useState} from "react";
import {Button, Input, Skeleton} from "antd";
import {AppContext} from "@contexts/app.jsx";
import SuperHeader from "@layout/header/header.jsx";
import AppUserAvatar from "@components/app/avatar/avatar.jsx";
import TimeUtils from "@utils/time.js";
import AppUserAvatarGroup from "@components/app/avatar/avatar.group.jsx";
import WorkspaceService from "@services/workspace.js";
import {toast} from "react-toastify";
import ReactPaginate from "react-paginate";
import "./styles/workspaces.scss"
import "./styles/paginate.scss"
import {LeftOutlined, RightOutlined, SearchOutlined, UserOutlined} from "@ant-design/icons";
import {NavLink} from "react-router";

export default function WorkspacesPage(){
	const {user, users} = useContext(AppContext);
	const ITEMS_PER_PAGE = 5;

	const [createFormVisible, setCreateFormVisible] = useState(false);
	const [numberOfWorkspaces, setNumberOfWorkspaces] = useState(0);
	const [workspaces, setWorkspaces] = useState(null);
	const [pageCount, setPageCount] = useState(0);
	const [itemOffset, setItemOffset] = useState(0);

	useEffect(() => {
		// Fetch items from another resources.
		const fetchData = async() => {
			const result = await WorkspaceService.paginate(itemOffset, ITEMS_PER_PAGE);

			if(result.code == 0){
				setWorkspaces([...result.data.workspaces]);
				setNumberOfWorkspaces(result.data.count);
				setPageCount(Math.ceil(result.data.count / ITEMS_PER_PAGE));
			} else {
				toast.error(result.message);
			}
		}

		fetchData();
	}, [itemOffset]);

	const handlePageClick = (event) => {
		const newOffset = event.selected * ITEMS_PER_PAGE % numberOfWorkspaces;
		console.log(event.selected);
		setItemOffset(newOffset);
	};

	return (<div className="workspaces-page">
		<SuperHeader/>
		<div className="main">
			<div className="header">
				<h2>All workspaces</h2>
				<Button className="create-btn" color="default" variant="filled"
						onClick={() => setCreateFormVisible(true)}>Create Workspace</Button>
			</div>
			<div className="description">
				A directory of all workspaces of {user?.name} - {user?.email}
			</div>
			{!workspaces && <Skeleton active style={{marginTop: 16}}/>}
			{workspaces && workspaces.length > 0 && <div className="actions">
				<Input className="search-btn" placeholder="Search workspaces" prefix={<SearchOutlined/>}/>
			</div>}
			{workspaces && workspaces.length > 0 && <div className="workspace-table-items">
				<div className="table-header">
					<div className="name">Workspace name</div>
						<div className="creator">
						Created by
					</div>
					<div className="collaborators">
						Who can access?
					</div>
					<div className="last-updated">
						Last updated
					</div>
				</div>
				{workspaces && workspaces.length > 0 && workspaces.map((workspace, index) => {
					const creator = getUser(workspace?.user_id, users);
					const collaborators = getCollaborators(workspace?.user_id, workspace.editors, workspace.commenters, workspace.viewers, users);

					const content = stripHTML(workspace.content);
					return <Item name={workspace.name} creator={creator} collaborators={collaborators} content={content}
								 id={workspace._id}
								 lastUpdated={workspace.updated_at} key={`workspace_item-${index}`}/>
				})}
			</div>}
			{workspaces && workspaces.length > 0 && <ReactPaginate
				className="react-paginate"
				nextLabel={<RightOutlined/>}
				onPageChange={handlePageClick}
				pageRangeDisplayed={3}
				marginPagesDisplayed={2}
				pageCount={pageCount}
				previousLabel={<LeftOutlined/>}
				pageClassName="page-item"
				pageLinkClassName="page-link"
				previousClassName="page-item page-item-navigate"
				previousLinkClassName="page-link"
				nextClassName="page-item page-item-navigate"
				nextLinkClassName="page-link"
				breakLabel="..."
				breakClassName="page-item"
				breakLinkClassName="page-link"
				containerClassName="pagination"
				activeClassName="active"
				renderOnZeroPageCount={null}
			/>}
		</div>
		<WorkspaceFormCreate visible={createFormVisible} setVisible={setCreateFormVisible}/>
	</div>)
}

const Item = ({name, content, id, creator, collaborators, lastUpdated}) => {

	return (
		<div className="workspace-item">
			<div className="name">
				<p><UserOutlined style={{fontSize: 14, color: "#6b6b6b"}}/>
					<NavLink to={`/workspace/${id}`}>{name}</NavLink>
				</p>
				<p className="desc">{content}</p>
			</div>
			<div className="creator">
				<AppUserAvatar username={creator}/>
				<p>{creator}</p>
			</div>
			<div className="collaborators">
				<AppUserAvatarGroup usernames={collaborators}/>
			</div>
			<div className="last-updated">
				{TimeUtils.formatDateAgo(lastUpdated)}
			</div>
		</div>
	)
}

const getUser = (user_id, users) => {
	for (let i = 0 ; i < users.length ; i++) {
		if(users[i]._id == user_id){
			return users[i].email;
		}
	}

	return "";
}

const getCollaborators = (user_id, editors, commenters, viewers, users) => {
	const mergedList = [...new Set([user_id, ...editors, ...commenters, ...viewers])];
	const result = users
		.filter(user => mergedList.includes(user._id))
		.map(user => user.email);

	return result;
}

function stripHTML(html){
	let doc = new DOMParser().parseFromString(html, "text/html");
	return doc.body.textContent || "";
}