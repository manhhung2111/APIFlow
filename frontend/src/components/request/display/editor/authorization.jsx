import {useContext} from "react";
import {RequestContext} from "@contexts/request.jsx";
import Request from "@components/request/request.js";
import {Checkbox, Input, Select} from "antd";
import {NavLink} from "react-router";
import {UnControlled as CodeMirror} from 'react-codemirror2';
import 'codemirror/mode/javascript/javascript';

export default function RequestEditorAuthorization() {
	let {authorization, setAuthorization} = useContext(RequestContext);

	const handleChangeType = (authType) => {
		setAuthorization(() => ({type: authType, data: {}}));
	}

	const handleChangeData = (e) => {

	}

	return (
		<div className="request-editor-authorization">
			<div className="left-container">
				<h3>Auth Type</h3>
				<Select
					defaultValue={0}
					style={{width: 120}}
					onChange={(value) => handleChangeType(value)}
					options={Object.values(Request.AUTHORIZATION)}
				/>
				<p>The authorization header will be automatically generated when you send the request.</p>
			</div>
			<div className="right-container">
				{authorization.type === Request.AUTHORIZATION.InheritAuth.value &&
					<div className="empty-message">
						This request is using No Auth from collection <NavLink to={`collection/${1}`}>Collection
						1</NavLink>
					</div>
				}
				{authorization.type === Request.AUTHORIZATION.NoAuth.value &&
					<div className="empty-message">
						This request does not use any authorization.
					</div>
				}
				{authorization.type === Request.AUTHORIZATION.BasicAuth.value &&
					<>
						<div className="form-row">
							<div className="title">Username</div>
							<Input name="username" onChange={handleChangeData}/>
						</div>
						<div className="form-row">
							<div className="title">Password</div>
							<Input name="password" onChange={handleChangeData}/>
						</div>
					</>
				}
				{authorization.type === Request.AUTHORIZATION.BearerToken.value &&
					<>
						<div className="form-row">
							<div className="title">Token</div>
							<Input name="token" onChange={handleChangeData}/>
						</div>
					</>
				}
				{authorization.type === Request.AUTHORIZATION.JWTBearer.value &&
					<>
						<div className="form-row">
							<div className="title">Algorithm</div>
							<Input name="algorithm" onChange={handleChangeData}/>
						</div>
						<div className="form-row">
							<div className="title">Secret</div>
							<div className="input-group">
								<Input name="algorithm" onChange={handleChangeData}/>
								<Checkbox onChange={handleChangeData}>Secret Base64 encoded</Checkbox>
							</div>
						</div>
						<div className="form-row">
							<div className="title">Payload</div>
							<div className="input-group">
								<CodeMirror
									value='{"key": "value"}'
									options={{
										mode: {name: "javascript", json: true},
										theme: 'xq-light',
										lineNumbers: true
									}}
									onChange={(editor, data, value) => {
										console.log(editor);
										console.log(data);
										console.log(value);
									}}
								/>
							</div>
						</div>
					</>
				}
			</div>
		</div>
	)
}