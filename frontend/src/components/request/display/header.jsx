import {Breadcrumb, Button, Dropdown, Skeleton} from 'antd';
import HttpIcon from "@assets/icons/http.jsx";
import {NavLink} from "react-router";
import {DeleteOutlined, EditOutlined, SaveOutlined} from "@ant-design/icons";
import {useContext} from "react";
import {RequestContext} from "@contexts/request.jsx";
import ActionManager from "@utils/action.manager.jsx";

const constructBreadCrumbs = (request, folder, collection) => {
	const breadCrumbs = [{
		title: <HttpIcon style={{fontSize: "30px", marginRight: "5px", color: "#1F509A"}}/>,
	}];

	breadCrumbs.push({title: <NavLink to={`/workspace/${request.workspace_id}/collection/${collection?._id}`}>{collection?.name}</NavLink>});

	if(folder){
		breadCrumbs.push({type: 'separator'});
		breadCrumbs.push({title: <NavLink to={`/workspace/${request.workspace_id}/folder/${folder?._id}`}>{folder?.name}</NavLink>});
	}

	breadCrumbs.push({type: 'separator'});
	breadCrumbs.push({title: <NavLink to={`/workspace/${request.workspace_id}/request/${request?._id}`}>{request?.name}</NavLink>});

	return breadCrumbs;
}

export default function RequestDisplayHeader(){
	const {request, requestFolder, requestCollection, handleSave, actionManagers} = useContext(RequestContext);

	return (
		<div className='request-display-header'>
			{!request && <Skeleton.Input style={{width: 300}} active/>}
			{request && <Breadcrumb
				className="rdh-breadcrumb"
				separator=""
				items={constructBreadCrumbs(request, requestFolder, requestCollection)}
			/>}
			{!request && <Skeleton.Input className="rdh-actions" active/>}
			{request &&
				<div>
					<Button color="default" variant="text" icon={<SaveOutlined style={{fontSize: "14px"}}/>} onClick={handleSave}>
						Save
					</Button>
					<ActionManager am={actionManagers}/>
				</div>
			}
		</div>
	);
};