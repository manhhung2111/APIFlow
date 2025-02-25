import {Breadcrumb, Button, Skeleton} from 'antd';
import HttpIcon from "@assets/icons/http.jsx";
import {NavLink} from "react-router";
import {EditOutlined, EnterOutlined, SaveOutlined} from "@ant-design/icons";
import {useContext} from "react";
import {RequestContext} from "@contexts/request.jsx";
import ActionManager from "@utils/action.manager.jsx";
import {Typography } from 'antd';
import {WorkspaceContext} from "@contexts/workspace.jsx";

const { Paragraph } = Typography;

export default function RequestDisplayHeader(){
	const {request, requestFolder, handleSave, actionManagers, name, handleChangeName} = useContext(RequestContext);
	const {activeCollection} = useContext(WorkspaceContext);

	const constructBreadCrumbs = () => {
		const breadCrumbs = [{
			title: <HttpIcon style={{fontSize: "30px", marginRight: "5px", color: "#1F509A"}}/>,
		}];

		breadCrumbs.push({
			title: <NavLink
				to={`/workspace/${request.workspace_id}/collection/${activeCollection?._id}`}>{activeCollection?.name}</NavLink>
		});

		if(requestFolder){
			breadCrumbs.push({type: 'separator'});
			breadCrumbs.push({
				title: <NavLink to={`/workspace/${request.workspace_id}/folder/${requestFolder?._id}`}>{requestFolder?.name}</NavLink>
			});
		}

		breadCrumbs.push({type: 'separator'});
		breadCrumbs.push({
			title: <Paragraph
				editable={{
					icon: <EditOutlined />,
					tooltip: 'Click to edit request',
					onChange: handleChangeName,
					enterIcon: <EnterOutlined />,
					autoSize: {minRows: 1, maxRows: 2},
				}}
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
				items={constructBreadCrumbs(request, requestFolder, activeCollection)}
			/>}
			{!request && <Skeleton.Input className="rdh-actions" active/>}
			{request &&
				<div>
					<Button color="default" variant="text" icon={<SaveOutlined style={{fontSize: "14px"}}/>}
							onClick={handleSave}>
						Save
					</Button>
					<ActionManager am={actionManagers}/>
				</div>
			}
		</div>
	);
};