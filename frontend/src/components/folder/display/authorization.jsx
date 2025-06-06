import _ from "lodash";
import {Empty, Input, Select} from "antd";
import CodeEditor from "@components/app/editor/code.editor.jsx";
import Request from "@components/request/request.jsx";
import AppInputVariable from "@components/app/input/variable/input.jsx";
import {useContext} from "react";
import {WorkspaceContext} from "@contexts/workspace.jsx";

export default function FolderDisplayAuthorization({folder, authorization, setAuthorization, folderCollection}){
	const {workspace} = useContext(WorkspaceContext);

	const handleChangeType = (authType) => {
		setAuthorization(() => ({type: authType, data: {}}));
	}

	const handleChangeData = (field, value) => {
		const clone = _.cloneDeep(authorization);
		clone.data[field] = value;
		setAuthorization(clone);
	}

	const getInheritAuthMessage = () => {
		if(authorization.type === Request.AUTHORIZATION.InheritAuth.value){
			if(folderCollection?.authorization.type === Request.AUTHORIZATION.BasicAuth.value){
				return <div>This request is using Basic Auth from collection <b>{folderCollection.name}</b></div>;
			} else if(folderCollection?.authorization.type === Request.AUTHORIZATION.NoAuth.value){
				return <div>This request is using No Auth from collection <b>{folderCollection.name}</b></div>;
			} else if(folderCollection?.authorization.type === Request.AUTHORIZATION.BearerToken.value){
				return <div>This request is using Bearer Token from collection <b>{folderCollection.name}</b></div>;
			} else if(folderCollection?.authorization.type === Request.AUTHORIZATION.APIKey.value){
				return <div>This request is using API Key from collection <b>{folderCollection.name}</b></div>;
			} else {
				return <div>This request is using JWT Token from collection <b>{folderCollection.name}</b></div>;
			}
		}
	}

	return (
		<div className="collection-display-authorization">
			<p>This authorization method will be used for every request in this collection. You can override this by
				specifying one in the request.</p>
			<div className="left-container">
				<h3>Auth Type</h3>
				<Select
					defaultValue={authorization.type || 0}
					onChange={(value) => handleChangeType(value)}
					options={Object.values(Request.AUTHORIZATION)}
					className="auth-selector"
					popupClassName="auth-selector-items"
					disabled={!workspace.can?.editable}
				/>
			</div>
			<div className="right-container">
				{authorization.type === Request.AUTHORIZATION.InheritAuth.value &&
					<Empty
						image={Empty.PRESENTED_IMAGE_SIMPLE}
						description={
							<div className="empty-message">
								{getInheritAuthMessage()}
							</div>
						}
					>
					</Empty>
				}
				{authorization.type === Request.AUTHORIZATION.NoAuth.value &&
					<Empty
						image={Empty.PRESENTED_IMAGE_SIMPLE}
						description={
							<div className="empty-message">
								This request does not use any authorization.
							</div>
						}
					>
					</Empty>
				}
				{authorization.type === Request.AUTHORIZATION.BasicAuth.value &&
					<div className="form-rows">
						<div className="form-row">
							<div className="title">Username</div>
							<AppInputVariable placeholder="Username"
											  setText={(value) => handleChangeData("username", value)}
											  text={authorization.data.username ?? ""}
											  disabled={!workspace.can?.editable}/>
						</div>
						<div className="form-row">
							<div className="title">Password</div>
							<AppInputVariable placeholder="Password"
											  setText={(value) => handleChangeData("password", value)}
											  text={authorization.data.password ?? ""}
											  disabled={!workspace.can?.editable}/>
						</div>
					</div>
				}
				{authorization.type === Request.AUTHORIZATION.BearerToken.value &&
					<div className="form-rows">
						<div className="form-row">
							<div className="title">Token</div>
							<AppInputVariable placeholder="Token"
											  setText={(value) => handleChangeData("bearer_token", value)}
											  text={authorization.data.bearer_token ?? ""}
											  disabled={!workspace.can?.editable}/>
						</div>
					</div>
				}
				{authorization.type === Request.AUTHORIZATION.JWTBearer.value &&
					<div className="form-rows">
						<div className="form-row">
							<div className="title">Algorithm</div>
							<Select
								className="select"
								style={{width: 280}}
								value={authorization.data.algorithm ?? "HS256"}
								name="algorithm"
								onChange={(value) => handleChangeData("algorithm", value)}
								options={[
									{value: 'HS256', label: 'HS256'},
									{value: 'HS384', label: 'HS384'},
									{value: 'HS512', label: 'HS512'},
								]}
								disabled={!workspace.can?.editable}
							/>
						</div>
						<div className="form-row">
							<div className="title">Secret</div>
							<Input name="secret" value={authorization.data.secret ?? ""}
								   onChange={(e) => handleChangeData("secret", e.target.value)}
								   disabled={!workspace.can?.editable}/>
						</div>
						<div className="form-row">
							<div className="title">Payload</div>
							<div className="input-group">
								<CodeEditor
									value={authorization.data.payload ?? ""}
									setValue={(value) => handleChangeData("payload", value)}
									options={{
										lineNumbers: "off",
										language: "json",
										"readOnly": !workspace.can?.editable
									}}
								/>
							</div>
						</div>
					</div>
				}
				{authorization.type === Request.AUTHORIZATION.APIKey.value &&
					<div className="form-rows">
						<div className="form-row">
							<div className="title">Key</div>
							<AppInputVariable placeholder="Key"
											  setText={(value) => handleChangeData("key", value)}
											  text={authorization.data.key ?? ""}
											  disabled={!workspace?.can?.editable}/>
						</div>
						<div className="form-row">
							<div className="title">Value</div>
							<AppInputVariable placeholder="Value"
											  setText={(value) => handleChangeData("value", value)}
											  text={authorization.data.value ?? ""}
											  disabled={!workspace?.can?.editable}/>
						</div>
						<div className="form-row">
							<div className="title">Add to</div>
							<Select
								className="select"
								style={{width: 280}}
								value={authorization.data.add_to ?? "Params"}
								name="add_to"
								onChange={(value) => handleChangeData("add_to", value)}
								options={[
									{value: 'Header', label: 'Header'},
									{value: 'Params', label: 'Query Params'},
								]}
								disabled={!workspace?.can?.editable}
							/>
						</div>
					</div>
				}
			</div>
		</div>
	)
}