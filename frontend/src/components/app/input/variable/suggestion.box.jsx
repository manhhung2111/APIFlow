import {useState} from "react";
import {EyeInvisibleOutlined, EyeOutlined} from "@ant-design/icons";
import _ from "lodash";

export default function AppInputVariableSuggestionBox({variables, onSelect}){
	const [activeIndex, setActiveIndex] = useState(0);
	const [showPassword, setShowPassword] = useState(variables.map(() => false));

	const handleHover = (index) => {
		setActiveIndex(index);
	};

	const handleClick = (variable) => {
		onSelect(variable);
	};

	const handleMouseLeave = (index) => {
		const clone = _.cloneDeep(showPassword);
		clone[index] = false;
		setShowPassword(clone);
	}

	const handleSetVisibility = (index, value) => {
		const clone = _.cloneDeep(showPassword);
		clone[index] = value;
		setShowPassword(clone);
	}

	return (
		<div className="app-input-variable-suggestion-box">
			{(!variables || variables.length === 0) && <div className="variable-suggestion__wrapper empty">
				<p className="empty-message">There are no variables to suggest.</p>
			</div>}
			{variables?.length > 0 &&
				<div className="variable-suggestion__wrapper">
					<div className="variable-list">
						{variables.map((variable, index) => (
							<div
								key={index}
								className={`variable-item ${index === activeIndex ? "active" : ""}`}
								onMouseEnter={() => handleHover(index)}
								onClick={() => handleClick(variable)}
								onMouseLeave={() => handleMouseLeave(index)}
							>
								<div className={`variable-icon ${variable.scope.toLowerCase()}`}>
									{variable.scope.charAt(0)}
								</div>
								<p>{variable.name}</p>
								{variable.type === "password" && showPassword[index] && <EyeOutlined className="eye-icon" onClick={(event) => {
										handleSetVisibility(index, false);
										event.stopPropagation();
									}}/>
								}
								{variable.type === "password" && !showPassword[index] && <EyeInvisibleOutlined className="eye-icon" onClick={(event) => {
									handleSetVisibility(index, true);
									event.stopPropagation();
								}}/>
								}
							</div>
						))}
					</div>
					<VariableDetail variable={variables[activeIndex]} visible={showPassword[activeIndex]}/>
				</div>

			}
		</div>
	)
}

const VariableDetail = ({variable, visible = true}) => {
	if(!variable) return null;

	const isOverridden = variable.is_overridden;

	return (
		<div className="variable-detail">
			<div className="row">
				<p>Initial</p>
				<p className={`value ${!visible && variable.type === "password"  ? "password" : ""}`}>{variable.initial_value}</p>
			</div>
			<div className="row">
				<p>Current</p>
				<p className={`value ${!visible && variable.type === "password" ?  "password" : ""}`}>{variable.current_value}</p>
			</div>
			{isOverridden && (
				<div className="row">
					<p></p>
					<p className="overridden-icon">Overridden</p>
				</div>
			)}
			<div className="row">
				<p>Scope</p>
				<p>{variable.scope}</p>
			</div>
			{isOverridden && (
				<div className="overridden-message">
					<p>{overriddenMessage(variable)}</p>
				</div>
			)}
		</div>
	);
};

const overriddenMessage = (variable) => {
	const {scope, is_overridden: overriddenScope} = variable;
	const scopeLower = scope.toLowerCase();
	const overriddenScopeLower = overriddenScope.toLowerCase();

	if(scope === overriddenScope){
		return `The value is overridden because duplicates of this variable are active in the ${scopeLower}. You can enable or disable variables on the ${scopeLower} page.`;
	}

	return `The value exists in both ${overriddenScopeLower} and ${scopeLower} scopes. ${overriddenScope} variables overwrite ${scopeLower} variables.`;
};