export default class ScriptsVariable {
    private _variables: Array<{
        selected: boolean,
        variable: string;
        type: "text" | "password";
        initial_value: string;
        current_value: string;
    }>;

    constructor(variables: Array<any>) {
        this._variables = variables;
    }

    public get(key: string) {
        let value = null;
        for (const variable of this._variables) {
            if (variable.selected && variable.variable == key) {
                value = variable.current_value;
                break;
            }
        }

        return value ?? "";
    }

    public set(key: string, value: any) {
        let found = false;
        for (const variable of this._variables) {
            if (variable.selected && variable.variable == key) {
                variable.current_value = value;
                found = true;
            }
        }

        if (!found) {
            this._variables.push({selected: true, variable: key, type: "text", initial_value: value, current_value: value});
        }
    }

    public unset(key: string) {
        this._variables = this._variables.filter((variable) => variable.variable != key);
    }


    public getVariables() {
        return this._variables;
    }
}