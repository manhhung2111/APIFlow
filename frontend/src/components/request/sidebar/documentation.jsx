import React, {useContext} from "react";
import {RequestContext} from "@contexts/request.jsx";
import {Typography} from "antd";
import Request from "@components/request/request.jsx";
import AppMarkdownEditor from "@components/app/editor/markdown.edtior.jsx";
import DocumentationTable from "@pages/documentation/display/table.jsx";
import {WorkspaceContext} from "@contexts/workspace.jsx";

const {Paragraph} = Typography;

export default function RequestSidebarDocumentation(){
	const {
		url,
		content,
		authorization,
		requestFolder: folder,
		params,
		headers,
		body,
		setContent,
		handleChangeContent
	} = useContext(RequestContext);
	const {activeCollection: collection, workspace} = useContext(WorkspaceContext);

	const getInheritAuthMessage = () => {
		if(folder != null && folder.authorization.type === Request.AUTHORIZATION.InheritAuth.value){
			if(collection?.authorization.type === Request.AUTHORIZATION.BasicAuth.value){
				return {
					type: Request.AUTHORIZATION.BasicAuth.label,
					message: <div>This request is using Basic Auth from collection <b>{collection.name}</b></div>
				}
			} else if(collection?.authorization.type === Request.AUTHORIZATION.BearerToken.value){
				return {
					type: Request.AUTHORIZATION.BearerToken.label,
					message: <div>This request is using Bearer Token from collection <b>{collection.name}</b></div>
				}
			} else if(collection?.authorization.type === Request.AUTHORIZATION.JWTBearer.value){
				return {
					type: Request.AUTHORIZATION.JWTBearer.label,
					message: <div>This request is using JWT Token from collection <b>{collection.name}</b></div>
				}
			}
		} else if(folder != null && folder.authorization.type === Request.AUTHORIZATION.BasicAuth.value){
			return {
				type: Request.AUTHORIZATION.BasicAuth.label,
				message: <div>This request is using Basic Auth from folder <b>{folder.name}</b></div>
			}
		} else if(folder != null && folder.authorization.type === Request.AUTHORIZATION.BearerToken.value){
			return {
				type: Request.AUTHORIZATION.BearerToken.label,
				message: <div>This request is using Bearer Token from folder <b>{folder.name}</b></div>
			}
		} else if(folder != null && folder.authorization.type === Request.AUTHORIZATION.JWTBearer.value){
			return {
				type: Request.AUTHORIZATION.JWTBearer.label,
				message: <div>This request is using JWT Token from folder <b>{folder.name}</b></div>
			}
		} else if(folder == null){
			if(collection?.authorization.type === Request.AUTHORIZATION.BasicAuth.value){
				return {
					type: Request.AUTHORIZATION.BasicAuth.label,
					message: <div>This request is using Basic Auth from collection <b>{collection.name}</b></div>
				}
			} else if(collection?.authorization.type === Request.AUTHORIZATION.BearerToken.value){
				return {
					type: Request.AUTHORIZATION.BearerToken.label,
					message: <div>This request is using Bearer Token from collection <b>{collection.name}</b></div>
				}
			} else if(collection?.authorization.type === Request.AUTHORIZATION.JWTBearer.value){
				return {
					type: Request.AUTHORIZATION.JWTBearer.label,
					message: <div>This request is using JWT Token from collection <b>{collection.name}</b></div>
				}
			}
		}

		return null;
	}

	const authorizationData = Object.keys(authorization.data).map((key) => ({
		key,
		value: `<${key}>`
	}));

	const authorizationInherit = getInheritAuthMessage();

	return (
		<div className="documentation-request">
			{url.length > 0 && <div className="url">
				<Paragraph copyable={{tooltips: false}}>{url}</Paragraph>
			</div>}
			<AppMarkdownEditor value={content} onChange={setContent} onBlur={handleChangeContent} readOnly={!workspace.can?.editable}/>
			{(authorization.type === Request.AUTHORIZATION.BasicAuth.value || authorization.type === Request.AUTHORIZATION.BearerToken.value) &&
				<DocumentationTable
					title={"Authorization"}
					subtitle={Request.getAuthorization(authorization.type)}
					data={authorizationData}
				/>}
			{authorization.type === Request.AUTHORIZATION.InheritAuth.value && authorizationInherit !== null &&
				<DocumentationTable
					title={"Authorization"}
					subtitle={authorizationInherit.type}
					data={authorizationInherit.message}
					type={"message"}
				/>}
			{headers.length > 1 && <DocumentationTable
				title={"Request headers"}
				data={headers}
			/>}
			{params.length > 1 && <DocumentationTable
				title={"Query parameters"}
				data={params}
			/>}
			{body.type === Request.BODY_TYPES.FormData.value && <DocumentationTable
				title={"Body"}
				subtitle={Request.BODY_TYPES.FormData.label}
				data={body.data.form_data}
				isFile={true}
			/>}
			{body.type === Request.BODY_TYPES.FormEncoded.value && <DocumentationTable
				title={"Body"}
				subtitle={Request.BODY_TYPES.FormEncoded.label}
				data={body.data.form_encoded}
			/>}
			{body.type === Request.BODY_TYPES.FormRaw.value && <DocumentationTable
				title={"Body"}
				subtitle={Request.BODY_TYPES.FormRaw.label}
				data={body.data.form_raw}
				type={"raw"}
			/>}
		</div>
	)
}