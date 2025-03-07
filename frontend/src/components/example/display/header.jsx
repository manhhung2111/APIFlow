import {Breadcrumb, Button, Skeleton, Typography} from "antd";
import {NavLink} from "react-router";
import {EditOutlined, EnterOutlined, SaveOutlined} from "@ant-design/icons";
import BookmarkIcon from "@assets/icons/bookmark.jsx";
import {useContext} from "react";
import {WorkspaceContext} from "@contexts/workspace.jsx";
import {ExampleContext} from "@contexts/example.jsx";

const {Paragraph} = Typography;

export default function ExampleDisplayHeader(){
	const {
		example,
		request,
		exampleFolder,
		handleSave,
		actionManagers,
		name,
		handleChangeName
	} = useContext(ExampleContext);
	const {activeCollection, workspace} = useContext(WorkspaceContext);

	const constructBreadCrumbs = () => {
		const breadCrumbs = [{
			title: <BookmarkIcon style={{fontSize: "16px", marginRight: "5px"}}/>,
		}];

		breadCrumbs.push({
			title: <NavLink
				to={`/workspace/${example?.workspace_id}/collection/${activeCollection?._id}`}>{activeCollection?.name}</NavLink>
		});

		if(exampleFolder){
			breadCrumbs.push({type: 'separator'});
			breadCrumbs.push({
				title: <NavLink
					to={`/workspace/${example?.workspace_id}/folder/${exampleFolder?._id}`}>{exampleFolder?.name}</NavLink>
			});
		}

		breadCrumbs.push({type: 'separator'});
		breadCrumbs.push({
			title: <NavLink
				to={`/workspace/${example?.workspace_id}/request/${example?.request_id}`}>{request?.name}</NavLink>
		});

		breadCrumbs.push({type: 'separator'});
		breadCrumbs.push({
			title: <Paragraph
				editable={workspace?.can?.editable ? {
					icon: <EditOutlined/>,
					tooltip: 'Click to edit example name',
					onChange: handleChangeName,
					enterIcon: <EnterOutlined/>,
					autoSize: {minRows: 1, maxRows: 2},
				} : null}
			>
				{name}
			</Paragraph>
		});

		return breadCrumbs;
	}

	return (
		<div className='request-display-header'>
			{!request && <Skeleton.Input style={{width: 300}} active/>}
			{request && <Breadcrumb
				className="rdh-breadcrumb"
				separator=""
				items={constructBreadCrumbs(example, request, exampleFolder, activeCollection)}
			/>}
			{!request && <Skeleton.Input className="rdh-actions" active/>}
			{request && workspace?.can?.editable &&
				<div>
					<Button color="default" variant="text" icon={<SaveOutlined style={{fontSize: "14px"}}/>}
							onClick={handleSave}>
						Save
					</Button>
				</div>
			}
		</div>
	);
}