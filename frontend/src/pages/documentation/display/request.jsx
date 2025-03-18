import Request from "@components/request/request.jsx";
import React from "react";
import DocumentationTable from "@pages/documentation/display/table.jsx";
import {Typography} from "antd";
import DocumentationExample from "@pages/documentation/display/example.jsx";
import AppMarkdownEditor from "@components/app/editor/markdown.edtior.jsx";

const {Paragraph} = Typography;

export default function DocumentationRequest({request, folder = null, collection}){

	function getRequestIcon(){
		const method = Request.getMethod(request.method);
		if(!method) return null;

		return <span style={{fontWeight: 600, color: method.color, fontSize: "16px"}}>
			{method.name}
		</span>
	}

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

	const authorizationData = Object.keys(collection.authorization.data).map((key) => ({
		key,
		value: `<${key}>`
	}));

	const authorizationInherit = getInheritAuthMessage();

	return (
		<div className="documentation-request" id={`request-${request._id}`}>
			<h3>
				<div className="icon">{getRequestIcon()}</div>
				{request.name}
			</h3>
			{request.content.length > 0 && <AppMarkdownEditor value={request.content} readOnly={true}/>}
			{request.content.length === 0 &&
				<p className="empty-desc">This request does not have any description...</p>}
			{request.url.length > 0 && <div className="url">
				<Paragraph copyable={{tooltips: false}}>{request.url}</Paragraph>
			</div>}
			{(request.authorization.type === Request.AUTHORIZATION.BasicAuth.value || request.authorization.type === Request.AUTHORIZATION.BearerToken.value) &&
				<DocumentationTable
					title={"Authorization"}
					subtitle={Request.getAuthorization(collection.authorization.type)}
					data={authorizationData}
				/>}
			{request.authorization.type === Request.AUTHORIZATION.InheritAuth.value && authorizationInherit !== null &&
				<DocumentationTable
					title={"Authorization"}
					subtitle={authorizationInherit.type}
					data={authorizationInherit.message}
					type={"message"}
				/>}
			{request.headers.length > 0 && <DocumentationTable
				title={"Request headers"}
				data={request.headers}
			/>}
			{request.params.length > 0 && <DocumentationTable
				title={"Query parameters"}
				data={request.params}
			/>}
			{request.body.type === Request.BODY_TYPES.FormData.value && <DocumentationTable
				title={"Body"}
				subtitle={Request.BODY_TYPES.FormData.label}
				data={request.body.data.form_data}
				isFile={true}
			/>}
			{request.body.type === Request.BODY_TYPES.FormEncoded.value && <DocumentationTable
				title={"Body"}
				subtitle={Request.BODY_TYPES.FormEncoded.label}
				data={request.body.data.form_encoded}
			/>}
			{request.body.type === Request.BODY_TYPES.FormRaw.value && <DocumentationTable
				title={"Body"}
				subtitle={Request.BODY_TYPES.FormRaw.label}
				data={request.body.data.form_raw}
				type={"raw"}
			/>}
			{request.children && request.children.length > 0 && <DocumentationExample examples={request.children}/>}
		</div>
	)
}