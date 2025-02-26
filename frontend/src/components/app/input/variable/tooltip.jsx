import {useState} from "react";
import {
	CheckOutlined,
	CopyOutlined,
	ExclamationCircleOutlined,
	EyeInvisibleOutlined,
	EyeOutlined
} from "@ant-design/icons";

export default function AppInputVariableTooltip({variable}){

	const {scope, type, name, initial_value, current_value} = variable || {};
	const [copied, setCopied] = useState(null);
	const [showPassword, setShowPassword] = useState(false);

	const handleCopy = (value, type) => {
		navigator.clipboard.writeText(value);
		setCopied(type);
		setTimeout(() => setCopied(null), 1000);
	};

	return (
		<div className="app-input-variable-tooltip">
			{(!scope || !name) && (<UnresolvedVariable/>)}
			{scope && name && <div className="variable-information tooltip">
				<div className="variable-header">
					<div className={`env-icon ${scope.toLowerCase()}`}>{scope.charAt(0).toUpperCase()}</div>
					<h4>{name}</h4>
					{type === "secret" && (
						<div className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
							{showPassword ? <EyeOutlined/> : <EyeInvisibleOutlined/>}
						</div>
					)}
				</div>

				<div className="variable-main">
					<Row title="Initial" value={initial_value} copied={copied}
						 onCopy={() => handleCopy(initial_value, "initial")} isSecret={type === "secret"}
						 showPassword={showPassword}/>
					<Row title="Current" value={current_value} copied={copied}
						 onCopy={() => handleCopy(current_value, "current")} isSecret={type === "secret"}
						 showPassword={showPassword}/>
					<div className="row">
						<p>Scope</p>
						<p>{scope}</p>
					</div>
				</div>
			</div>}
		</div>

	);
}

const Row = ({title, value, copied, onCopy, isSecret, showPassword}) => (
	<div className="row">
		<p>{title}</p>
		<p className={`value ${isSecret && !showPassword ? "password" : ""}`}>{value}</p>
		<div className="action" onClick={onCopy}>
			{copied === title.toLowerCase() ? <CheckOutlined/> : <CopyOutlined/>}
		</div>
	</div>
);

const UnresolvedVariable = () => (
	<div className="unresolved-variable">
		<div className="variable-header">
			<ExclamationCircleOutlined style={{fontSize: 18}}/>
			<h3>Unresolved Variable</h3>
		</div>
		<div className="variable-main">
			<p>Make sure the variable is defined and enabled in the active environment, collection, or globals.</p>
		</div>
	</div>
);