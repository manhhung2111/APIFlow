import _ from "lodash";
import {Checkbox, Empty, Input, Select} from "antd";
import CodeEditor from "@components/app/editor/code.editor.jsx";
import Collection from "@components/collection/collection.jsx";

export default function CollectionDisplayAuthorization({collection, authorization, setAuthorization}){
	const handleChangeType = (authType) => {
		setAuthorization(() => ({type: authType, data: {}}));
	}

	const handleChangeData = (field, value) => {
		const clone = _.cloneDeep(authorization);
		clone.data[field] = value;
		setAuthorization(clone);
	}

	return (
		<div className="collection-display-authorization">
			<p>This authorization method will be used for every request in this collection. You can override this by
				specifying one in the request.</p>
			<div className="left-container">
				<h3>Auth Type</h3>
				<Select
					defaultValue={authorization.type || 1}
					onChange={(value) => handleChangeType(value)}
					options={Object.values(Collection.AUTHORIZATION)}
					className="auth-selector"
					popupClassName="auth-selector-items"
				/>
			</div>
			<div className="right-container">
				{authorization.type === Collection.AUTHORIZATION.NoAuth.value &&
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
				{authorization.type === Collection.AUTHORIZATION.BasicAuth.value &&
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
				{authorization.type === Collection.AUTHORIZATION.BearerToken.value &&
					<div className="form-rows">
						<div className="form-row">
							<div className="title">Token</div>
							<Input name="token" value={authorization.data.bearer_token ?? ""}
								   onChange={(e) => handleChangeData("bearer_token", e.target.value)}/>
						</div>
					</div>
				}
				{authorization.type === Collection.AUTHORIZATION.JWTBearer.value &&
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