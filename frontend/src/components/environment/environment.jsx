export default class Environment{

	static getCaretPosition = (element) => {
		let caretOffset = 0;
		const sel = window.getSelection();
		if (sel.rangeCount > 0) {
			const range = sel.getRangeAt(0);
			const preCaretRange = range.cloneRange();
			preCaretRange.selectNodeContents(element);
			preCaretRange.setEnd(range.endContainer, range.endOffset);
			caretOffset = preCaretRange.toString().length;
		}
		return caretOffset;
	};

	static setCaretPosition = (element, offset) => {
		const sel = window.getSelection();
		const range = document.createRange();
		let charIndex = 0;
		const nodeStack = [element];
		let node, found = false;

		while (!found && (node = nodeStack.pop())) {
			if (node.nodeType === 3) {
				const nextCharIndex = charIndex + node.length;
				if (offset >= charIndex && offset <= nextCharIndex) {
					range.setStart(node, offset - charIndex);
					range.setEnd(node, offset - charIndex);
					found = true;
				}
				charIndex = nextCharIndex;
			} else {
				let i = node.childNodes.length;
				while (i--) {
					nodeStack.push(node.childNodes[i]);
				}
			}
		}
		sel.removeAllRanges();
		sel.addRange(range);
	};

	static parseVariable(variableName, variables){
		let variable_scope = null;
		let variable_initial_value = null;
		let variable_current_value = null;
		let variable_type = '';

		for (const variable of variables) {
			if(variable.name === variableName){
				variable_scope = variable.scope;
				variable_initial_value = variable.initial_value;
				variable_current_value = variable.current_value;
				variable_type = variable.type ?? '';
			}
		}

		return {
			type: variable_type,
			scope: variable_scope,
			current_value: variable_current_value,
			initial_value: variable_initial_value,
			name: variableName
		};
	}
}