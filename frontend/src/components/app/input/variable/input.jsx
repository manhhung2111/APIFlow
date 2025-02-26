import AppInputVariableTooltip from "@components/app/input/variable/tooltip.jsx";
import "../../styles/variable.scss";
import {useContext, useEffect, useRef, useState} from "react";
import {WorkspaceContext} from "@contexts/workspace.jsx";
import AppInputVariableSuggestionBox from "@components/app/input/variable/suggestion.box.jsx";
import Environment from "@components/environment/environment.jsx";

export default function AppInputVariable({name, value, onChange, placeholder}) {
	const {activeCollection, activeEnvironment, environments} = useContext(WorkspaceContext);
	const [variables, setVariables] = useState([]);

	const [inputValue, setInputValue] = useState(value);
	const [highlightedContent, setHighlightedContent] = useState(value);
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [tooltipData, setTooltipData] = useState(null);
	const editableDivRef = useRef(null);
	const tooltipRef = useRef(null);


	useEffect(() => {
		setHighlightedContent(highlightVariables(inputValue, variables));
		attachTooltipEvents();
	}, [inputValue]);

	function processVariables(variables_list, scope, seen_variables) {
		let result = [];

		for (let i = variables_list.length - 1; i >= 0; i--) {
			const variable = variables_list[i];
			if (!variable.selected) continue; // Skip unselected variables

			let existing = seen_variables.get(variable.variable);

			let temp_var = {
				scope: scope,
				name: variable.variable,
				type: variable.type || "",
				initial_value: variable.initial_value,
				current_value: variable.current_value,
				is_overridden: ''
			};

			// Check if the variable is overridden by an earlier scope
			if (existing !== undefined) {
				temp_var.is_overridden = existing.scope;
			} else {
				// Add the variable to the seen list if not overridden
				seen_variables.set(variable.variable, {
					scope: scope,
					name: variable.variable,
					initial_value: variable.initial_value,
					current_value: variable.current_value
				});
			}

			// Add the variable to the temporary list
			result.push(temp_var);
		}

		// Return the reversed list (since we iterate backward)
		return result;
	}

	function getVariablesList() {
		const globalEnv = environments.find(e => e.scope === 0) || {};

		let activeEnv = {};
		if (activeEnvironment != -1) {
			activeEnv = environments.find(e => e.scope === 1 && e._id === activeEnvironment) || {};
		}

		let collectionVariables = [];
		if (activeCollection) {
			collectionVariables = activeCollection.variables;
		}

		let _variables = [];
		let seenVariables = new Map();

		_variables.push(...processVariables(activeEnv?.variables || [], 'Environment', seenVariables));
		_variables.push(...processVariables(collectionVariables, 'Collection', seenVariables));
		_variables.push(...processVariables(globalEnv?.variables || [], 'Global', seenVariables));

		_variables = _variables.reverse();

		return _variables;
	}

	const handleInput = (event) => {
		// let caretPosition = Environment.getCaretCharacterOffsetWithin(editableDivRef?.current);
		const rawText = event.target.innerText;

		setInputValue(rawText);
		onChange(rawText);

		// Environment.setCaretPosition(editableDivRef?.current, caretPosition);

		// setShowSuggestions(rawText.includes("{"));
	};



	const highlightVariables = (text, variables) => {
		return text.replace(/{{(\w+)}}/g, (match, variableName) => {
			let variable = Environment.parseVariable(variableName, variables);

			let variable_class = 'unresolved';

			if(variable.scope) {
				variable_class = `resolved`;
			}

			let data_variable = JSON.stringify({
				...variable
			});

			return `<span class='highlighted ${variable_class}' data-variable='${data_variable}' >${match}</span>`;
		});
	};

	const attachTooltipEvents = () => {
		const spans = editableDivRef.current?.querySelectorAll("span.highlighted") || [];
		spans.forEach(span => {
			span.addEventListener("mouseenter", (e) => {
				const variableData = JSON.parse(span.getAttribute("data-variable"));
				setTooltipData(variableData);

				const rect = span.getBoundingClientRect();
				tooltipRef.current.style.position = "fixed";
				tooltipRef.current.style.top = `${rect.bottom + window.scrollY + 5}px`;
				tooltipRef.current.style.left = `${rect.left + window.scrollX}px`;
				tooltipRef.current.style.display = "block";
			});

			span.addEventListener("mouseleave", () => {
				setTimeout(() => {
					tooltipRef.current.style.display = "none";
				}, 200);
			});
		});
	};


	useEffect(() => {
		let _variables = getVariablesList();
		setVariables(_variables);
	}, [activeEnvironment, activeCollection]);

	return (<div className="app-input-highlight__wrapper">
		<div
			className="editable"
			contentEditable
			ref={editableDivRef}
			spellCheck={false}
			onInput={handleInput}
			dangerouslySetInnerHTML={{__html: highlightedContent}}
			data-placeholder={placeholder}
		></div>
		<input type="hidden" value={inputValue} name={name}/>

		<div ref={tooltipRef} className="tooltip" style={{display: "none"}}>
			{tooltipData && <AppInputVariableTooltip variable={tooltipData}/>}
		</div>
		<AppInputVariableSuggestionBox/>
	</div>)
}