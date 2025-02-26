import React, { useState, useRef, useEffect, useContext } from "react";
import AppInputVariableTooltip from "@components/app/input/variable/tooltip.jsx";
import Environment from "@components/environment/environment.jsx";
import { WorkspaceContext } from "@contexts/workspace.jsx";
import AppInputVariableSuggestionBox from "@components/app/input/variable/suggestion.box.jsx";
import log from "eslint-plugin-react/lib/util/log.js";

const HighlightedInput = ({ placeholder }) => {
	const { activeCollection, activeEnvironment, environments } = useContext(WorkspaceContext);
	const [variables, setVariables] = useState([]);

	const [text, setText] = useState("{{base}}");
	const contentRef = useRef(null);
	const [tooltipData, setTooltipData] = useState(null);
	const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
	const tooltipTimeoutRef = useRef(null);

	const [suggestions, setSuggestions] = useState(null);
	const [suggestionsPosition, setSuggestionsPosition] = useState({ top: 0, left: 0 });
	const suggestionBoxRef = useRef(null);

	const saveCaretPosition = () => {
		const selection = window.getSelection();
		if (!selection.rangeCount) return null;
		const range = selection.getRangeAt(0);
		const preCaretRange = range.cloneRange();
		preCaretRange.selectNodeContents(contentRef.current);
		preCaretRange.setEnd(range.endContainer, range.endOffset);
		return preCaretRange.toString().length;
	};

	const restoreCaretPosition = (offset) => {
		const selection = window.getSelection();
		const range = document.createRange();
		let charIndex = 0;
		const nodeStack = [contentRef.current];
		let node;

		while ((node = nodeStack.pop())) {
			if (node.nodeType === 3) {
				const nextCharIndex = charIndex + node.length;
				if (offset >= charIndex && offset <= nextCharIndex) {
					range.setStart(node, offset - charIndex);
					range.collapse(true);
					selection.removeAllRanges();
					selection.addRange(range);
					return;
				}
				charIndex = nextCharIndex;
			} else {
				let i = node.childNodes.length;
				while (i--) nodeStack.push(node.childNodes[i]);
			}
		}
	};

	const updateHighlighting = () => {
		if (!contentRef.current) return;

		const caretPos = saveCaretPosition();
		const textContent = text;
		const fragment = document.createDocumentFragment();

		let lastIndex = 0;
		const regex = /\{\{(\w+)\}\}/g; // Match exactly {{word}}
		let match;

		while ((match = regex.exec(textContent)) !== null) {
			const [fullMatch, variableName] = match;
			const startIndex = match.index;
			const endIndex = startIndex + fullMatch.length;

			// Append text before the match
			if (startIndex > lastIndex) {
				fragment.appendChild(document.createTextNode(textContent.slice(lastIndex, startIndex)));
			}

			// Process the variable
			let variable = Environment.parseVariable(variableName, variables);
			let variableClass = variable.scope ? 'resolved' : 'unresolved';

			const span = document.createElement("span");
			span.style.cursor = "auto";
			span.className = `highlighted ${variableClass}`;
			span.textContent = `{{${variableName}}}`; // Include the braces in the span

			span.onmouseover = () => {
				if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current); // Clear hide timeout
				setTooltipData(variable);
				setTooltipPosition({ top: span.getBoundingClientRect().bottom + 5, left: span.getBoundingClientRect().left });
			};

			span.onmouseleave = () => {
				tooltipTimeoutRef.current = setTimeout(() => {
					setTooltipData(null);
				}, 200); // Delay to prevent flickering
			};


			fragment.appendChild(span);
			lastIndex = endIndex;
		}

		// Append any remaining text after the last match
		if (lastIndex < textContent.length) {
			fragment.appendChild(document.createTextNode(textContent.slice(lastIndex)));
		}

		// Update the DOM
		contentRef.current.innerHTML = "";
		contentRef.current.appendChild(fragment);
		restoreCaretPosition(caretPos);
	};

	useEffect(() => {
		if (contentRef.current && contentRef.current.innerHTML.trim() === "") {
			updateHighlighting();
		}

		const handleClickOutside = (event) => {
			if (
				suggestionBoxRef.current &&
				!suggestionBoxRef.current.contains(event.target) &&
				contentRef.current &&
				!contentRef.current.contains(event.target)
			) {
				setSuggestions(null); // Hide suggestions when clicking outside
			}
		};

		document.addEventListener("click", handleClickOutside);

		const editableDiv = contentRef.current;
		if (!editableDiv) return;

		editableDiv.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("click", handleClickOutside);
			editableDiv.removeEventListener("keydown", handleKeyDown);
		};
	}, []);


	useEffect(() => {
		updateHighlighting();
		handleShowSuggestionBox();
	}, [text]);

	useEffect(() => {
		let _variables = getVariablesList();
		setVariables(_variables);
	}, [activeEnvironment, activeCollection]);

	const handleInput = () => {
		setText(contentRef.current.innerText);
	};

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

	const handleShowSuggestionBox = () => {
		const selection = window.getSelection();
		if (!selection.rangeCount) return;

		const range = selection.getRangeAt(0);
		const rect = range.getBoundingClientRect();

		const lastIndexOfOpenBrace = text.lastIndexOf('{');
		const lastIndexOfCloseBrace = text.lastIndexOf('}');

		if (lastIndexOfOpenBrace > lastIndexOfCloseBrace) {
			const query = text.substring(lastIndexOfOpenBrace + 1).trim();
			console.log("helklo", query)
			const suggestions = variables.filter(variable => variable.name.toLowerCase().includes(query.toLowerCase()));
			setSuggestions([...suggestions, ...suggestions]);
			setSuggestionsPosition({
				top: rect.bottom + window.scrollY + 7, // Convert to absolute position
				left: rect.left + window.scrollX
			});

		} else {
			setSuggestions(null);
		}
	}

	const handleKeyDown = (event) => {
		if (event.key === "Enter") {
			event.preventDefault(); // Prevents adding a new line
		}
	};

	const handleSelectSuggestion = (variable) => {
		const lastIndexOfOpenBrace = text.lastIndexOf('{');
		let newText = text;
		if (lastIndexOfOpenBrace !== -1) {
			 newText = newText.slice(0, lastIndexOfOpenBrace + 1);
		}

		while (newText.endsWith('{')) {
			newText = newText.slice(0, -1);
		}

		newText += "{{" + variable.name + "}}";
		setText(newText);
		setSuggestions(null);

		requestAnimationFrame(() => {
			if (contentRef.current) {
				contentRef.current.focus();
				moveCaretToEnd(contentRef.current);
			}
		});

		const moveCaretToEnd = (element) => {
			const selection = window.getSelection();
			const range = document.createRange();
			range.selectNodeContents(element);
			range.collapse(false); // Move caret to the end
			selection.removeAllRanges();
			selection.addRange(range);
		};
	}

	return (
		<div className="app-input-highlight__wrapper">
			<div
				className="editable"
				ref={contentRef}
				contentEditable
				suppressContentEditableWarning
				onInput={handleInput}
				spellCheck={false}
				data-placeholder={placeholder || ""}
				style={{ width: "100%", border: "1px solid #ccc" }}
			/>
			{tooltipData && (
				<div
					style={{
						position: "fixed",
						top: tooltipPosition.top,
						left: tooltipPosition.left,
						zIndex: 101
					}}
					onMouseEnter={() => {
						requestAnimationFrame(() => {
							if (tooltipTimeoutRef.current) {
								clearTimeout(tooltipTimeoutRef.current)
							}
						})
					}}
					onMouseLeave={() => {
						setTooltipData(null);
					}}
				>
					<AppInputVariableTooltip variable={tooltipData} />
				</div>
			)}
			{suggestions && (
				<div style={{
					position: "fixed",
					top: suggestionsPosition.top,
					left: suggestionsPosition.left,
					zIndex: 100
				}}
					 ref={suggestionBoxRef}
				>
					<AppInputVariableSuggestionBox variables={suggestions} onSelect={(value) => handleSelectSuggestion(value)}/>
				</div>
			)}
		</div>
	);
};

export default HighlightedInput;