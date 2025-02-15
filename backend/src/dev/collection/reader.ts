import {HydratedDocument} from "mongoose";
import {DBReader} from "@ap/db";
import {DCollection} from "@db-schemas";
import Client from "@dev/client";
import UUID from "@utils/uuid";
import {Code, HTMLInput, Validation} from "@ap/core";
import {RequestServiceReader} from "@services/request";


export default class Reader extends DBReader<DCollection> {
    constructor(obj: HydratedDocument<DCollection> | null | undefined) {
        super(obj);
    }

    public read() {
        if (this.isCreating()) {
            this._obj.user_id = Client.viewer._id.toString();
            this._obj.token = UUID.randomTokenSize32();
            this._obj.workspace_id = HTMLInput.inputInline("workspace_id");
            this._obj.name = "New Collection";
            return;
        }

        this.readName();
        this.readContent();
        this.readAuthentication();
        this.readVariables();
        this.readScripts();
    }

    public duplicate() {

    }

    public readContent() {
        this._obj.content = HTMLInput.inputSafe("content", false);
    }

    public readName() {
        this._obj.name = HTMLInput.inputInline("name");
        if (Validation.isEmpty(this._obj.name)) {
            throw new Code("Collection name must not be empty");
        }

        if (this._obj.name.length > 255) {
            throw new Code("Collection name must not exceed 255 characters");
        }
    }


    public readAuthentication() {
        const request_reader = new RequestServiceReader();
        request_reader.readAuthorization();
        this._obj.authorization = request_reader.getAuthorization();
    }


    public readVariables() {
        let data = Buffer.from(HTMLInput.inputRaw("variables"), 'base64').toString('utf8');
        let variables = JSON.parse(data);

        let new_variables = [];

        for (let index = 0; index < variables.length; index++) {
            const selected = variables[index].selected;
            const variable = variables[index].variable;
            const initial_value = variables[index].initial_value;
            const current_value = variables[index].current_value;

            if (!selected && !variable && !initial_value && !current_value) break;
            new_variables.push({selected, variable, initial_value, current_value});
        }

        this._obj.variables = new_variables;
    }

    public readScripts() {
        let data = Buffer.from(HTMLInput.inputRaw("scripts"), 'base64').toString('utf8');
        this._obj.scripts = JSON.parse(data);
    }
}
