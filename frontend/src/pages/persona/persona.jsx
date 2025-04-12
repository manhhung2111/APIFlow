import React, {useContext, useEffect, useState} from "react";
import {WorkspaceContext} from "@contexts/workspace.jsx";
import {useMatch, useNavigate, useParams} from "react-router";
import PersonaService from "@services/persona.js";
import _ from "lodash";
import {Button, Input, Select, Skeleton, Typography} from "antd";
import Collection from "@components/collection/collection.jsx";
import AppInputVariable from "@components/app/input/variable/input.jsx";
import CodeEditor from "@components/app/editor/code.editor.jsx";
import Request from "@components/request/request.jsx";
import {toast} from "react-toastify";
import {EditOutlined, EnterOutlined, SaveOutlined, UserOutlined} from "@ant-design/icons";
import ActionManager from "@utils/action.manager.jsx";
import AppDeleteModal from "@components/app/modal/delete.jsx";
import "./styles/persona.scss";

const {Paragraph} = Typography;

export default function PersonaPage(){
	const {
		workspace,
		personas,
		setPersonas,
		setActiveMenuKey,
		setActiveCollection,
	} = useContext(WorkspaceContext);
	const [deletePersonaVisible, setDeletePersonaVisible] = useState(false);

	const {persona_id} = useParams();
	const navigate = useNavigate();

	const [persona, setPersona] = useState(null);
	const [name, setName] = useState("");
	const [authorization, setAuthorization] = useState(null);

	const isPageActive = useMatch(`persona/${persona?._id}`);

	useEffect(() => {
		async function fetchPersona(){
			const result = await PersonaService.getById(persona_id, workspace._id);

			if(result.code === 0){
				const persona = result.data.persona;
				setPersona(persona);
				setName(persona.name);
				setAuthorization(persona.authorization);
			} else {
				console.error(result.message);
			}
		}

		if(workspace){
			fetchPersona();
		}
	}, [persona_id, workspace]);

	useEffect(() => {
		setActiveMenuKey(3);
	}, [isPageActive]);

	useEffect(() => {
		setActiveCollection(null);
	}, []);

	const handleChangeType = (type) => {
		setAuthorization(() => ({type: type, data: {}}));
	}

	const handleChangeData = (field, value) => {
		const clone = _.cloneDeep(authorization);
		clone.data[field] = value;
		setAuthorization(clone);
	}

	const handleSave = async() => {
		const result = await PersonaService.save(persona, authorization);

		if(result.code === 0){
			toast.success(result.message);
			setPersona(result.data.persona);
		} else {
			toast.error(result.message);
		}
	}

	const handleDelete = async() => {
		setDeletePersonaVisible(false);
		const result = await PersonaService.delete(persona);

		if(result.code === 0){
			const deletedIndex = personas.findIndex(e => e._id === persona._id);
			const newPersonas = personas.filter(e => e._id !== persona._id);

			setPersonas(newPersonas);

			toast.success(result.message);

			// Redirect logic
			if(newPersonas.length > 0){
				const targetIndex = deletedIndex > 0 ? deletedIndex - 1 : 0;
				const targetPersona = newPersonas[targetIndex];

				navigate(`/workspace/${persona.workspace_id}/persona/${targetPersona._id}`);
			} else {
				navigate(`/workspace/${persona.workspace_id}`);
			}
		} else {
			toast.error(result.message);
		}
	}

	const handleDuplicate = async() => {
		const result = await PersonaService.duplicate(persona);

		if(result.code === 0){
			setPersonas(prev => [...prev, result.data.persona]);
			toast.success(result.message);
			navigate(`/workspace/${workspace._id}/persona/${result.data.persona._id}`);
		} else {
			toast.error(result.message);
		}
	}

	const actionManagers = [
		{key: `duplicate_${persona?._id}`, label: "Duplicate", onClick: handleDuplicate},
		{
			key: `delete_${persona?._id}`,
			label: "Delete",
			onClick: () => setDeletePersonaVisible(true),
			danger: 1
		},
	]

	const handleChangeName = async(value) => {
		if(value == name) return;
		const response = await PersonaService.updateName(persona, value);

		if(response.code === 0){
			await setName(response.data.persona.name);
			await setPersona(response.data.persona);

			const clone = _.cloneDeep(personas);
			for (const e of clone) {
				if(e._id === persona._id){
					e.name = value;
				}
			}
			await setPersonas(clone);
		} else {
			toast.error(response.message);
		}
	}

	return (<div className="persona-page environment-page">
		<div className="header">
			{persona && <div className="inner-header">
				<div className="text">
					<UserOutlined/>
					<Paragraph
						editable={workspace?.can?.editable ? {
							icon: <EditOutlined/>,
							tooltip: 'Click to edit persona',
							onChange: handleChangeName,
							enterIcon: <EnterOutlined/>,
							autoSize: {minRows: 1, maxRows: 2},
						} : null}
					>
						{name}
					</Paragraph>
				</div>
				<div className="side">
					{workspace?.can?.editable &&
						<Button color="default" variant="text" icon={<SaveOutlined/>} onClick={handleSave}>
							Save
						</Button>}
					{workspace?.can?.editable && <ActionManager am={actionManagers}/>}
				</div>
			</div>}
			{!persona && <Skeleton.Input active={true}/>}
		</div>

		<div className="main">
			{!persona && <div style={{paddingTop: 16}}><Skeleton active/></div>}
			{persona && <div className="collection-display-authorization">
				<p>Persona-level authorization takes priority over request-level authorization. To customize
					authorization
					per request, switch personas or manually override it.</p>
				<div className="left-container">
					<h3>Auth Type</h3>
					<Select
						defaultValue={authorization.type || 2}
						onChange={(value) => handleChangeType(value)}
						options={Object.values(Collection.AUTHORIZATION).slice(1)}
						className="auth-selector"
						popupClassName="auth-selector-items"
						disabled={!workspace.can?.editable}
					/>
				</div>
				<div className="right-container">
					{authorization.type === Collection.AUTHORIZATION.BasicAuth.value &&
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
					{authorization.type === Collection.AUTHORIZATION.BearerToken.value &&
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
									disabled={!workspace.can?.editable}
								/>
							</div>
							<div className="form-row">
								<div className="title">Secret</div>
								<div className="input-group">
									<Input name="secret" value={authorization.data.secret ?? ""}
										   onChange={(e) => handleChangeData("secret", e.target.value)}
										   disabled={!workspace.can?.editable}
									/>
								</div>
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
											readOnly: !workspace.can?.editable
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
			</div>}
			<AppDeleteModal
				title={`Delete persona "${persona?.name}"?`}
				content={"Deleting this persona is permanent. All associated settings will be lost forever."}
				visible={deletePersonaVisible}
				setVisible={setDeletePersonaVisible}
				callback={handleDelete}
			/>
		</div>
	</div>)
}