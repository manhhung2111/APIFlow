import {useContext} from "react";
import {RequestContext} from "@contexts/request.jsx";
import Request from "@components/request/request.jsx";
import {Empty, Input, Select} from "antd";
import 'codemirror/mode/javascript/javascript';
import CodeEditor from "@components/app/editor/code.editor.jsx";
import _ from "lodash";

export default function RequestEditorAuthorization(){
	let {authorization, setAuthorization, requestFolder, requestCollection} = useContext(RequestContext);

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
			if(requestFolder?.authorization.type !== Request.AUTHORIZATION.InheritAuth.value){
				if(requestFolder?.authorization.type === Request.AUTHORIZATION.BasicAuth.value){
					return <div>This request is using Basic Auth from folder <b>{requestFolder.name}</b></div>;
				} else if(requestFolder?.authorization.type === Request.AUTHORIZATION.NoAuth.value){
					return <div>This request is using No Auth from folder <b>{requestFolder.name}</b></div>;
				} else if(requestFolder?.authorization.type === Request.AUTHORIZATION.BearerToken.value){
					return <div>This request is using Bearer Token from folder <b>{requestFolder.name}</b></div>;
				} else {
					return <div>This request is using JWT Token from folder <b>{requestFolder.name}</b></div>;
				}
			} else {
				if(requestCollection?.authorization.type === Request.AUTHORIZATION.BasicAuth.value){
					return <div>This request is using Basic Auth from collection <b>{requestCollection.name}</b></div>;
				} else if(requestCollection?.authorization.type === Request.AUTHORIZATION.NoAuth.value){
					return <div>This request is using No Auth from collection <b>{requestCollection.name}</b></div>;
				} else if(requestCollection?.authorization.type === Request.AUTHORIZATION.BearerToken.value){
					return <div>This request is using Bearer Token from collection <b>{requestCollection.name}</b></div>;
				} else {
					return <div>This request is using JWT Token from collection <b>{requestCollection.name}</b></div>;
				}
			}
		}
	}

	return (
		<div className="request-editor request-editor-authorization">
			<div className="left-container">
				<h3>Auth Type</h3>
				<Select
					defaultValue={authorization.type || 0}
					onChange={(value) => handleChangeType(value)}
					options={Object.values(Request.AUTHORIZATION)}
					className="auth-selector"
					popupClassName="auth-selector-items"
				/>
				<p>The authorization header will be automatically generated when you send the request.</p>
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
							<Input name="username" value={authorization.data.username ?? ""}
								   onChange={(e) => handleChangeData("username", e.target.value)}/>
						</div>
						<div className="form-row">
							<div className="title">Password</div>
							<Input name="password" value={authorization.data.password ?? ""}
								   onChange={(e) => handleChangeData("password", e.target.value)}/>
						</div>
					</div>
				}
				{authorization.type === Request.AUTHORIZATION.BearerToken.value &&
					<div className="form-rows">
						<div className="form-row">
							<div className="title">Token</div>
							<Input name="token" value={authorization.data.bearer_token ?? ""}
								   onChange={(e) => handleChangeData("bearer_token", e.target.value)}/>
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
							/>
						</div>
						<div className="form-row">
							<div className="title">Secret</div>
							<div className="input-group">
								<Input name="secret" value={authorization.data.secret ?? ""}
									   onChange={(e) => handleChangeData("secret", e.target.value)}/>
							</div>
						</div>
						<div className="form-row">
							<div className="title">Payload</div>
							<div className="input-group">
								<CodeEditor
									value={authorization.data.payload ?? ""}
									setValue={(value) => handleChangeData("payload", value)}
									options={{lineNumbers: "off", language: "json"}}
								/>
							</div>
						</div>
					</div>
				}
			</div>
		</div>
	)
}