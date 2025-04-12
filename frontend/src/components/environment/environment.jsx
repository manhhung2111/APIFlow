export default class Environment{

	static parseVariable(variableName, variables){
		let variable_scope = null;
		let variable_initial_value = null;
		let variable_current_value = null;
		let variable_type = '';

		if(variables && variables.length > 0){
			for (const variable of variables) {
				if(variable.name === variableName){
					variable_scope = variable.scope;
					variable_initial_value = variable.initial_value;
					variable_current_value = variable.current_value;
					variable_type = variable.type ?? '';
				}
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