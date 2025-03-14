import {useContext, useEffect, useRef, useState} from "react";
import {WorkspaceContext} from "@contexts/workspace.jsx";
import {useMatch, useNavigate, useParams} from "react-router";
import EnvironmentService from "@services/environment.js";
import _ from "lodash";
import {Button, Checkbox, Input, Select, Skeleton} from "antd";
import {
	DeleteOutlined,
	EditOutlined, EnterOutlined,
	EyeInvisibleOutlined,
	EyeOutlined,
	SaveOutlined,
	SearchOutlined
} from "@ant-design/icons";
import "./styles/environment.scss";
import ActionManager from "@utils/action.manager.jsx";
import EnvironmentIcon from "@assets/icons/environment.jsx";
import {toast} from "react-toastify";
import {Typography } from 'antd';
import RequestService from "@services/request.jsx";

const { Paragraph } = Typography;

export default function EnvironmentPage(){
	const {workspace, environments, setEnvironments, setActiveMenuKey} = useContext(WorkspaceContext);

	const {environment_id} = useParams();
	const navigate = useNavigate();
	const [visibility, setVisibility] = useState({});
	const [environment, setEnvironment] = useState(null);
	const [name, setName] = useState("");
	const [variables, setVariables] = useState(null);

	const isPageActive = useMatch(`environment/${environment?._id}`);

	const toggleVisibility = (index) => {
		setVisibility(prev => ({...prev, [index]: !prev[index]}));
	};

	useEffect(() => {
		async function fetchEnvironment(){
			const result = await EnvironmentService.getById(environment_id, workspace._id);

			if(result.code === 0){
				const environment = result.data.environment;
				setEnvironment(environment);
				setName(environment.name);
				setVariables([...environment.variables, {
					selected: 0,
					variable: '',
					type: 'text',
					initial_value: '',
					current_value: ''
				}]);
			} else {
				console.error(result.message);
			}
		}

		if(workspace){
			fetchEnvironment();
		}
	}, [environment_id, workspace]);

	useEffect(() => {
		setActiveMenuKey(2);
	}, [isPageActive])

	const containerRef = useRef(null);

	const handleInputChange = (index, field, value) => {
		const cloneDeep = _.cloneDeep(variables);
		cloneDeep[index][field] = value;

		if(field === "type"){
			if(value === "password"){
				setVisibility(prev => ({...prev, [index]: false}));
			}
		}

		// If the last row is being edited, add a new empty row
		if(index === variables.length - 1){
			cloneDeep.push({selected: 0, variable: '', initial_value: '', current_value: ''});
			cloneDeep[index]["selected"] = 1;

			setVariables(cloneDeep);

			setTimeout(() => {
				containerRef.current?.scrollTo({top: containerRef.current.scrollHeight, behavior: "smooth"});
			}, 50);
		} else {
			setVariables(cloneDeep);
		}
	};

	const handleRemoveRow = (index) => {
		const cloneDeep = _.cloneDeep(variables);
		cloneDeep.splice(index, 1);
		setVariables(cloneDeep);
	};

	const handleSave = async() => {
		const result = await EnvironmentService.save(environment, variables);

		if(result.code === 0){
			toast.success(result.message);
			setEnvironment(result.data.environment);

			const clone = _.cloneDeep(environments);
			for (const e of clone) {
				if (e._id === environment._id) {
					e.variables = result.data.environment.variables;
				}
			}
			setEnvironments(clone);
		} else {
			toast.error(result.message);
		}
	}

	const handleDelete = async() => {
		const result = await EnvironmentService.delete(environment);

		if(result.code === 0){
			setEnvironments(prev => {
				return prev.filter(e => e._id !== environment._id);
			});
			toast.success(result.message);
			// navigate(`/workspace/${collection.workspace_id}`);
		} else {
			toast.error(result.message);
		}
	}

	const actionManagers = [
		{key: `duplicate_${environment?._id}`, label: "Duplicate",},
		{key: `export_${environment?._id}`, label: "Export",},
		{key: `delete_${environment?._id}`, label: "Delete", onClick: handleDelete, danger: 1},
	];

	const handleChangeName = async (value) => {
		if (value == name) return;
		const response = await EnvironmentService.updateName(environment, value);

		if (response.code === 0) {
			await setName(response.data.environment.name);
			await setEnvironment(response.data.environment);

			const clone = _.cloneDeep(environments);
			for (const e of clone) {
				if(e._id === environment._id){
					e.name = value;
				}
			}
			await setEnvironments(clone);
		} else {
			toast.error(response.message);
		}
	}

	return (
		<div className="environment-page">
			<div className="header">
				{environment && <div className="inner-header">
					<div className="text">
						<EnvironmentIcon/>
						<Paragraph
							editable={workspace?.can?.editable && environment.scope === 1 ? {
								icon: <EditOutlined />,
								tooltip: 'Click to edit request',
								onChange: handleChangeName,
								enterIcon: <EnterOutlined />,
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
						{environment.scope === 1 && workspace?.can?.editable && <ActionManager am={actionManagers}/>}
					</div>
				</div>}
				{!environment && <Skeleton.Input active={true}/>}
			</div>

			<div className="main">
				{!environment && <div style={{paddingTop: 16}}><Skeleton active/></div>}

				{environment?.scope === 0 &&
					<p className="subtitle">Global variables for a workspace are a set of variables that are always
						available within the scope of that workspace. They can be viewed and edited by anyone in that
						workspace. &nbsp;
						<span>Learn more about workspace globals</span>
					</p>}

				{environment &&
					<Input className="search-btn" placeholder="Filter variables" prefix={<SearchOutlined/>}/>}
				{environment && <div className="variables-table">
					<div className="table-header">
						<div></div>
						<div>Variable</div>
						<div>Type</div>
						<div>Initial value</div>
						<div>Current value</div>
						<div></div>
					</div>
					<div className="table-body">
						{variables?.map((row, index) => {
							let showIcon = row.type === "password" ? visibility[index] ? (
								<EyeOutlined onClick={() => toggleVisibility(index)}/>
							) : (
								<EyeInvisibleOutlined onClick={() => toggleVisibility(index)}/>
							) : null;

							let actionHtml = !(index === variables.length - 1) ?
								<>
									{showIcon}
									{workspace?.can?.editable && <DeleteOutlined className="remove-icon" size='16'
																				 onClick={() => handleRemoveRow(index)}/>}
								</> : '';
							let selectedHtml = !(index === variables.length - 1) ?
								<Checkbox checked={row.selected} onChange={(e) =>
									handleInputChange(index, "selected", e.target.checked)
								} disabled={!workspace?.can?.editable}/> : '';

							return (
								<div className="row" key={index}>
									<div className="col selected-col">
										{selectedHtml}
									</div>
									<div className="col key-col">
										<Input placeholder="Variable" variant="borderless" value={row.variable}
											   onChange={(e) => handleInputChange(index, "variable", e.target.value)}
											   disabled={!workspace?.can?.editable}/>
									</div>
									<div className=" col type-col">
										<Select
											value={row.type ?? "text"}
											size={"small"}
											style={{width: "72px", fontSize: "12px", height: "100%"}}
											onChange={(value) => handleInputChange(index, "type", value)}
											options={[
												{value: 'text', label: 'Text'},
												{value: 'password', label: 'Secret'},
											]}
											disabled={!workspace?.can?.editable}
										/>
									</div>
									<div className="col value-col">
										<Input placeholder="Initial value" variant="borderless"
											   value={row.initial_value}
											   onChange={(e) => handleInputChange(index, "initial_value", e.target.value)}
											   type={row.type === "password" ? visibility[index] ? "text" : "password" : "text"}
											   disabled={!workspace?.can?.editable}
										/>
									</div>
									<div className="col content-col">
										<Input placeholder="Current value" variant="borderless"
											   value={row.current_value}
											   onChange={(e) => handleInputChange(index, "current_value", e.target.value)}
											   type={row.type === "password" ? visibility[index] ? "text" : "password" : "text"}
											   disabled={!workspace?.can?.editable}
										/>
									</div>
									<div className="col action-col">
										{actionHtml}
									</div>
								</div>
							);
						})}
					</div>
				</div>}
			</div>
		</div>
	)
}