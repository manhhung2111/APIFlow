import {RequestBody} from "@services/request/index";
import axios from "axios";
import {Code, HTMLInput, JWT, Scripts} from "@ap/core";
import FormData from "form-data";
import {Authorization} from "@services/authorization";
import BackblazeService from "@services/backblaze";
import {DBRequest} from "@dev/request";
import {DBCollection} from "@dev/collection";
import {DBEnvironment, DBEnvironmentLoader} from "@dev/environment";
import {DBFolder} from "@dev/folder";
import vm from 'vm';
import {DBPersona} from "@dev/persona";

export default class RequestService {
    private _method: string = "";
    private _url: string = "";
    private _params: Array<any> = [];
    private _path_variables: Array<any> = [];
    private _authorization: any = {};
    private _cookies: Array<object> = [];
    private _headers: Array<any> = [];
    private _body: { type?: number, data?: any } = {};
    private _environment: Record<string, string> = {};
    private _scripts: any;

    private persona: DBPersona | null = null;
    private request: DBRequest | null = null;
    private folder: DBFolder | null = null;
    private collection: DBCollection | null = null;
    private active_env: DBEnvironment | null = null;
    private global_env: DBEnvironment | null = null;

    private pm = new Scripts();

    public setMethod(method: string) {
        this._method = method;
        return this;
    }

    public setURL(url: string) {
        this._url = url;
        return this;
    }

    public setParams(params: Array<any>) {
        this._params = params.filter(param => param.selected);

        return this;
    }

    public setPathVariables(path_variables: Array<any>) {
        this._path_variables = path_variables;
        return this;
    }

    public setAuthorization(authorization: object) {
        this._authorization = authorization;
        return this;
    }

    public setCookies(cookies: Array<object>) {
        this._cookies = cookies;
        return this;
    }

    public setHeaders(headers: Array<any>) {
        this._headers = headers.filter(header => header.selected);

        return this;
    }

    public setBody(body: { type: number, data: any }) {
        this._body = body;
        return this;
    }

    public setScripts(scripts: object) {
        this._scripts = scripts;
        return this;
    }

    public async send() {
        try {
            await this.readAssociatedData();
            this.pm.setEnvironment(this.active_env)
                .setGlobals(this.global_env!)
                .setCollectionVariables(this.collection!);

            await this.runPreRequestScripts(this.collection!.object!.scripts.pre_request);
            if (this.folder) {
                await this.runPreRequestScripts(this.folder.object!.scripts.pre_request);
            }
            await this.runPreRequestScripts(this._scripts.pre_request || "");

            await this.readEnvironments();

            let url = this.convertRequestUrl();
            let headers = await this.convertRequestHeaders();
            let body = await this.convertRequestBody();

            await this.saveEnvironments();

            const startTime = performance.now();
            console.log(url);
            const response = await axios({
                method: this._method,
                url: url,
                headers: headers,
                data: this._method === "GET" ? undefined : body,
            });

            const endTime = performance.now();
            const duration = endTime - startTime;

            // Calculate request and response size
            const request_size = {headers: this.calculateSize(headers), body: this.calculateSize(body)};
            const response_size = {
                headers: this.calculateSize(response.headers),
                body: this.calculateSize(response.data)
            };

            this.pm.setResponse(response);
            let test_results: any;

            // Run Post response request
            test_results = await this.runPostResponseScripts(this.collection!.object!.scripts.post_response);
            if (this.folder && !test_results) {
                test_results = await this.runPostResponseScripts(this.folder.object!.scripts.post_response);
            }
            if (!test_results) {
                test_results = await this.runPostResponseScripts(this._scripts.post_response || "");
            }

            if (!test_results) {
                test_results = this.pm.getTestResults();
                await this.saveEnvironments();
            }

            return {
                ...response,
                time: duration,
                request_size,
                response_size,
                collection: this.collection?.release(),
                test_results
            };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw error;
            }
            throw new Code((error as Error).message);
        }
    }

    private async convertRequestBody() {
        let request_body: any = null;

        if (this._body.type == RequestBody.FormData) {
            const form_data = new FormData();

            for (const row of this._body.data) {
                if (typeof row === "object" && row !== null && "key" in row && "value" in row && "selected" in row && row.selected) {
                    let {key, value} = row as { key: string; value: string | Express.Multer.File | any };
                    if (!value) continue;

                    key = this.replaceEnvVariables(key);

                    if (typeof value === "object" && "buffer" in value) {
                        form_data.append(key, value.buffer, {filename: value.originalname});
                    } else if (typeof value === "object" && "id" in value) {
                        const file = await BackblazeService.downloadFileById(value.id);
                        form_data.append(key, file.data);
                    } else {
                        form_data.append(key, this.replaceEnvVariables(value));
                    }
                }
            }

            request_body = form_data;
        } else if (this._body.type == RequestBody.FormEncoded) {
            request_body = new URLSearchParams(
                Object.fromEntries(
                    this._body.data
                        .filter(({selected}: { selected: boolean }) => selected)
                        .map(({key, value}: { key: string; value: string }) => [
                            this.replaceEnvVariables(key),
                            this.replaceEnvVariables(value)
                        ])
                )
            ).toString();
        } else if (this._body.type == RequestBody.FormRaw) {
            request_body = JSON.stringify(
                JSON.parse(this.replaceEnvVariables(JSON.stringify(this._body.data)))
            );
        }

        return request_body;
    }

    private async convertRequestHeaders() {
        const headers: any = {};
        this._headers.forEach((header) => {
            headers[this.replaceEnvVariables(header.key)] = this.replaceEnvVariables(header.value);
        });

        if (this._body.type == RequestBody.FormData) {
            delete headers["Content-Type"];
        } else if (this._body.type == RequestBody.FormEncoded) {
            headers["Content-Type"] = "application/x-www-form-urlencoded";
        } else if (this._body.type == RequestBody.FormRaw) {
            headers["Content-Type"] = headers["Content-Type"] || "application/json";
        }

        // Construct authorization
        if (this._authorization.type == Authorization.BasicAuth) {
            const credential = this.replaceEnvVariables(this._authorization.data.username) + ":" + this.replaceEnvVariables(this._authorization.data.password);
            headers["Authorization"] = Buffer.from(credential, "utf-8").toString("base64");
        } else if (this._authorization.type == Authorization.BearerTokenAuth) {
            headers["Authorization"] = "Bearer " + this.replaceEnvVariables(this._authorization.data.bearer_token);
        } else if (this._authorization.type == Authorization.JWTBearerAuth) {
            const algorithm = this._authorization.data.algorithm;
            const secret = this._authorization.data.secret;
            const payload = this._authorization.data.payload;

            let payload_decode = {};
            try {
                payload_decode = JSON.parse(payload);
            } catch (error) {
                payload_decode = {};
            }

            const token = await JWT.signToken(payload_decode, secret, algorithm);
            headers["Authorization"] = "Bearer " + token;
        } else if (this._authorization.type == Authorization.APIKeyAuth) {
            if (this._authorization.data.add_to == "Header") {
                headers[this._authorization.data.key] = this._authorization.data.value;
            }
        }


        return headers;
    }

    private convertRequestUrl() {
        let url = this.replaceEnvVariables(this._url);

        for (const variable of this._path_variables) {
            const value = encodeURIComponent(variable.value);
            url = url.replace(new RegExp(`:${variable.key}`, "g"), value);
        }

        const [base_url, queries] = url.split("?");
        const params = new URLSearchParams(queries || "");

        if (this._authorization.type == Authorization.APIKeyAuth) {
            if (this._authorization.data.add_to == "Params") {
                this._params.push({
                    key: this._authorization.data.key,
                    value: this._authorization.data.value,
                    selected: true
                });
            }
        }

        this._params.forEach((param) => {
            if (!param.selected) return;
            params.set(this.replaceEnvVariables(param.key), this.replaceEnvVariables(param.value));
        });

        url = `${base_url}?${params.toString()}`;

        return url;
    }

    private calculateSize(data: any) {
        try {
            return JSON.stringify(data)?.length || 0;
        } catch {
            return 0;
        }
    }

    private async readAssociatedData() {
        const request = await DBRequest.initialize(HTMLInput.param("request_id")) as DBRequest;
        if (!request.good()) {
            return;
        }
        this.request = request;

        if (request.object!.folder_id) {
            const folder = await DBFolder.initialize(request.object!.folder_id) as DBFolder;
            if (!folder.good()) {
                return;
            }
            this.folder = folder;
        }

        // Get collection environment
        const collection = await DBCollection.initialize(request.object!.collection_id) as DBCollection;
        if (!collection.good()) {
            return;
        }
        this.collection = collection;

        // Get globals variable and active variable
        const globalEnv = await DBEnvironmentLoader.globalsEnvByWorkspace(request.object!.workspace_id.toString());
        if (!globalEnv.good()) {
            return;
        }
        this.global_env = globalEnv

        if (HTMLInput.inputInline("active_environment") == "-1" || HTMLInput.inputInt("active_environment") == -1) {
            return;
        }
        let activeEnv = await DBEnvironment.initialize(HTMLInput.inputInline("active_environment")) as DBEnvironment;
        if (!activeEnv.good()) {
            return;
        }

        this.active_env = activeEnv;

        // Read persona
        if (HTMLInput.inputInline("active_persona") == "-1" || HTMLInput.inputInt("active_persona") == -1) {
            return;
        }

        let persona = await DBPersona.initialize(HTMLInput.inputInline("active_persona")) as DBPersona;
        if (!persona || !persona.good()) {
            return;
        }
        this.persona = persona;
        this._authorization = persona.object!.authorization;
    }

    private async readEnvironments() {
        const environments: Record<string, string> = {};

        const globals = this.global_env?.object?.variables ?? [];
        for (const entry of globals) {
            if (entry.selected) {
                environments[entry.variable] = entry.current_value;
            }
        }

        const collection_variables = this.collection?.object?.variables ?? [];
        for (const entry of collection_variables) {
            if (entry.selected) {
                environments[entry.variable] = entry.current_value;
            }
        }

        const environment = this.active_env?.object?.variables ?? [];
        for (const entry of environment) {
            if (entry.selected) {
                environments[entry.variable] = entry.current_value;
            }
        }

        this._environment = environments;
    }

    private replaceEnvVariables(input: any): any {
        if (typeof input === "string") {
            return input.replace(/\{\{(.*?)\}\}/g, (match, variable) => {
                return this._environment[variable.trim()] ?? match; // Replace if found, else keep original
            });
        }
        return input;
    }


    private async runPreRequestScripts(scriptCode: string) {
        try {
            // Create a context where pm can be modified
            const context = vm.createContext({pm: this.pm});
            const script = new vm.Script(scriptCode);

            // Execute the script in the provided context
            script.runInContext(context);
        } catch (error) {
            throw new Error(`There was an error in evaluating the Pre-request Script: ${(error as Error).message}`);
        }
    }


    private async runPostResponseScripts(scriptCode: string) {
        try {
            // Create a context where pm can be modified
            const context = vm.createContext({pm: this.pm});
            const script = new vm.Script(scriptCode);

            // Execute the script in the provided context
            script.runInContext(context);
            return "";
        } catch (error) {
            return `Couldn't evaluate the test script: ${(error as Error).message}`;
        }
    }

    private async saveEnvironments() {
        try {
            this.collection!.object!.variables = this.pm.getCollectionVariables();
            this.global_env!.object!.variables = this.pm.getGlobals();
            if (this.active_env) {
                this.active_env.object!.variables = this.pm.getEnvironment();
            }

            await this.global_env?.save();
            await this.active_env?.save();
            await this.collection?.save();
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }
}