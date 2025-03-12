import {Skeleton, Tabs} from "antd";
import RequestEditorParams from "@components/request/display/editor/params.jsx";
import RequestEditorAuthorization from "@components/request/display/editor/authorization.jsx";
import RequestEditorHeaders from "@components/request/display/editor/headers.jsx";
import RequestEditorBody from "@components/request/display/editor/body/body.jsx";
import RequestEditorScripts from "@components/request/display/editor/scripts.jsx";
import {useContext} from "react";
import {RequestContext} from "@contexts/request.jsx";
import {WorkspaceContext} from "@contexts/workspace.jsx";
import _ from "lodash";
import Request from "@components/request/request.jsx";

export default function RequestEditorUrlMain(){
	const {request, params, authorization, requestFolder, headers, body, scripts, response} = useContext(RequestContext);
	const {activeCollection} = useContext(WorkspaceContext);

	const generateItems = () => {
		let paramsLabel = <div className="request-editor-tab-label">Params</div>
		if(params.length > 1){
			paramsLabel = <div className="request-editor-tab-label">Params <span className="valid"></span></div>
		}

		let authLabel = <div className="request-editor-tab-label">Authorization</div>
		if(authorization !== null){
			let refactor_auth = _.cloneDeep(authorization);
			if(authorization.type === Request.AUTHORIZATION.InheritAuth.value){
				if(requestFolder?.authorization.type !== Request.AUTHORIZATION.InheritAuth.value){
					refactor_auth.type = requestFolder?.authorization.type;
					refactor_auth.data = requestFolder?.authorization.data;
				} else {
					refactor_auth.type = activeCollection?.authorization.type;
					refactor_auth.data = activeCollection?.authorization.data;
				}
			}

			if(refactor_auth.type !== Request.AUTHORIZATION.NoAuth.value){
				authLabel = <div className="request-editor-tab-label">Authorization<span className="valid"></span></div>
			}
		}

		let headersLabel = <div className="request-editor-tab-label">Headers</div>
		if(headers.length > 1){
			headersLabel = <div className="request-editor-tab-label">Headers <span className="valid"></span></div>
		}

		let bodyLabel = <div className="request-editor-tab-label">Body</div>
		if(body){
			if(body.type === Request.BODY_TYPES.FormData.value && body.data.form_data.length > 1){
				bodyLabel = <div className="request-editor-tab-label">Body<span className="valid"></span></div>
			} else if(body.type === Request.BODY_TYPES.FormEncoded.value && body.data.form_encoded.length > 1){
				bodyLabel = <div className="request-editor-tab-label">Body<span className="valid"></span></div>
			} else if(body.type === Request.BODY_TYPES.FormRaw.value && body.data.form_raw.length > 0){
				bodyLabel = <div className="request-editor-tab-label">Body<span className="valid"></span></div>
			}
		}

		let scriptsLabel = <div className="request-editor-tab-label">Scripts</div>
		if(scripts){
			if(scripts.pre_request.length > 0 || scripts.post_response.length > 0){
				scriptsLabel = <div className="request-editor-tab-label">Scripts<span className="valid"></span></div>
			}

			if (response && typeof response === "string"){
				scriptsLabel = <div className="request-editor-tab-label">Scripts<span className="error"></span></div>
			}

			if (response && typeof response.test_results === "string"){
				scriptsLabel = <div className="request-editor-tab-label">Scripts<span className="error"></span></div>
			}
		}

		return [
			{label: paramsLabel, key: 1, children: <RequestEditorParams/>},
			{label: authLabel, key: 2, children: <RequestEditorAuthorization/>},
			{label: headersLabel, key: 3, children: <RequestEditorHeaders/>},
			{label: bodyLabel, key: 4, children: <RequestEditorBody/>},
			{label: scriptsLabel, key: 5, children: <RequestEditorScripts/>},
		]
	}

	const items = [
		{label: "Params", key: 1, children: <RequestEditorParams/>},
		{label: "Authorization", key: 2, children: <RequestEditorAuthorization/>},
		{label: "Headers", key: 3, children: <RequestEditorHeaders/>},
		{label: "Body", key: 4, children: <RequestEditorBody/>},
		{label: "Scripts", key: 5, children: <RequestEditorScripts/>},
	]

	return (
		<div className="request-editor-url-main">
			{request && <Tabs items={generateItems()} size={"small"} tabBarGutter={16}/>}
			{!request && <div style={{padding: 16}}><Skeleton active={true}/></div>}
		</div>
	);
}