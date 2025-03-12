import ScriptsExpectation from "@ap/core/testing/expectation";
import ScriptsResponse from "@ap/core/testing/response";
import {DBEnvironment} from "@dev/environment";
import ScriptsVariable from "@ap/core/testing/variable";
import Environment from "@models/environment";
import {DBCollection} from "@dev/collection";

export default class Scripts {
    private _script: string = "";
    public response: ScriptsResponse | null;
    public globals: ScriptsVariable | null;
    public environment: ScriptsVariable | null;
    public collectionVariables: ScriptsVariable | null;
    private _testResults: { status: string; message: string; extra: string }[] = [];

    constructor() {
        this._script = "";
        this.response = null;
        this.globals = null;
        this.environment = null;
        this.collectionVariables = null;
    }

    public setScript(script: string) {
        this._script = script;
        return this;
    }

    public getScripts(): string {
        return this._script;
    }

    public setResponse(response: any) {
        this.response = new ScriptsResponse(response);
        return this;
    }

    public setGlobals(globals: DBEnvironment) {
        const variables = globals.object?.variables ?? [];
        this.globals = new ScriptsVariable(variables);
        return this;
    }

    public setEnvironment(environment: DBEnvironment | null) {
        const variables = environment?.object?.variables ?? [];
        this.environment = new ScriptsVariable(variables);
        return this;
    }

    public setCollectionVariables(collection: DBCollection) {
        const variables = collection.object?.variables ?? [];
        this.collectionVariables = new ScriptsVariable(variables);
        return this;
    }

    public expect(actual: any) {
        return new ScriptsExpectation(actual);
    }

    public test(name: string, testFn: () => void) {
        try {
            testFn();
            this._testResults.push({
                status: "passed",
                message: name,
                extra: "",
            });
        } catch (error: any) {
            this._testResults.push({
                status: "failed",
                message: name,
                extra: `AssertionError: ${error.message}`,
            });
        }
    }

    public getTestResults() {
        return this._testResults;
    }

    public getGlobals() {
        return this.globals?.getVariables() || [];
    }

    public getEnvironment() {
        return this.environment?.getVariables() || [];
    }

    public getCollectionVariables() {
        return this.collectionVariables?.getVariables() || [];
    }
}
