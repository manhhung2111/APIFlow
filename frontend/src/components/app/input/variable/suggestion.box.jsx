import {useState} from "react";

export default function AppInputVariableSuggestionBox({variables, onSelect}) {
	const [activeIndex, setActiveIndex] = useState(0);

	const handleHover = (index) => {
		setActiveIndex(index);
	};

	const handleClick = (variable) => {
		onSelect(variable);
	};

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
							>
								<div className={`variable-icon ${variable.scope.toLowerCase()}`}>
									{variable.scope.charAt(0)}
								</div>
								<p>{variable.name}</p>
							</div>
						))}
					</div>
					<VariableDetail variable={variables[activeIndex]} />
				</div>

			}
		</div>
	)
}

const VariableDetail = ({ variable }) => {
	if (!variable) return null;

	const isOverridden = variable.is_overridden;
	const isSecret = variable.type === "secret";

	return (
		<div className="variable-detail">
			<div className="row">
				<p>Initial</p>
				<p className={`value ${isSecret ? "password" : ""}`}>{variable.initial_value}</p>
			</div>
			<div className="row">
				<p>Current</p>
				<p className={`value ${isSecret ? "password" : ""}`}>{variable.current_value}</p>
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
	const { scope, is_overridden: overriddenScope } = variable;
	const scopeLower = scope.toLowerCase();
	const overriddenScopeLower = overriddenScope.toLowerCase();

	if (scope === overriddenScope) {
		return `The value is overridden because duplicates of this variable are active in the ${scopeLower}. You can enable or disable variables on the ${scopeLower} page.`;
	}

	return `The value exists in both ${overriddenScopeLower} and ${scopeLower} scopes. ${overriddenScope} variables overwrite ${scopeLower} variables.`;
};