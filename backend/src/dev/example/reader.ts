import {HydratedDocument} from "mongoose";
import {DBReader} from "@ap/db";
import {DExample} from "@db-schemas";
import {DBExample} from "@dev/example";
import {RequestServiceReader} from "@services/request";
import UUID from "@utils/uuid";
import {HTMLInput} from "@ap/core";
import BackblazeService from "@services/backblaze";
import Client from "@dev/client";
import {DBRequest} from "@dev/request";

export default class Reader extends DBReader<DExample> {
    constructor(obj: HydratedDocument<DExample> | null | undefined) {
        super(obj);
    }

    public async readResponse() {
        const request_reader = new RequestServiceReader();
        request_reader.readMethod()
            .readURL()
            .readParams()
            .readHeaders()

        this._obj.token = UUID.randomTokenSize32();
        this._obj.user_id = Client.viewer._id.toString();
        this._obj.workspace_id = HTMLInput.inputInline("workspace_id");
        this._obj.collection_id = HTMLInput.inputInline("collection_id");
        this._obj.folder_id = HTMLInput.inputInline("folder_id") ?? null;
        this._obj.request_id = HTMLInput.inputInline("request_id");
        this._obj.name = HTMLInput.inputInline("name");
        this._obj.request = {
            method: request_reader.getMethod(),
            url: request_reader.getURL(),
            params: request_reader.getParams(),
            headers: request_reader.getHeaders(),
            body: {
                type: HTMLInput.inputInt("body_type"),
                data: await this.readBody()
            },
        };

        this._obj.response = this.readResponseData();
    }


    public async readRequest(request: DBRequest) {
        this._obj.token = UUID.randomTokenSize32();
        this._obj.user_id = Client.viewer._id.toString();
        this._obj.workspace_id = request.object!.workspace_id.toString();
        this._obj.collection_id = request.object!.collection_id.toString();
        this._obj.folder_id = request.object!.folder_id?.toString() ?? null;
        this._obj.request_id = request.object!._id.toString();
        this._obj.name = request.object!.name;
        this._obj.request = {
            method: request.object!.method,
            url: request.object!.url,
            params: request.object!.params,
            headers: request.object!.headers,
            body: request.object!.body,
        };

        this._obj.response = {
            body: "",
            headers: {}
        }
    }

    public async read() {

    }

    async duplicate(old_example: DBExample) {

    }

    private async readBody() {
        let data = Buffer.from(HTMLInput.inputRaw("body_data"), 'base64').toString('utf8');
        let body_data = JSON.parse(data);

        // Read form data
        let form_data = [];
        for (let index = 0; index < body_data.form_data.length - 1; index++) {
            const selected = body_data.form_data[index].selected;
            const key = body_data.form_data[index].key;
            const type = body_data.form_data[index].type;
            let value = body_data.form_data[index].value;
            if (type == "file") {
                const files = HTMLInput.inputFile(`form_data_value_${index}`);
                if (files && files.length > 0) {
                    const file_export = await BackblazeService.uploadFile(files[files.length - 1]);
                    value = file_export;
                }

                if (!value && !value.id && !files) {
                    value = "";
                }
            }

            const content = body_data.form_data[index].content;

            form_data.push({selected, key, type, value, content});
        }

        // Read form encoded
        let form_encoded = [];
        for (let index = 0; index < body_data.form_encoded.length - 1; index++) {
            const selected = body_data.form_encoded[index].selected;
            const key = body_data.form_encoded[index].key;
            const value = body_data.form_encoded[index].value;
            const content = body_data.form_encoded[index].content;

            form_encoded.push({selected, key, value, content});
        }

        // Read form raw
        let form_raw = body_data.form_raw;

        return {
            form_data: form_data,
            form_encoded: form_encoded,
            form_raw: form_raw
        };
    }

    private readResponseData() {
        let data = Buffer.from(HTMLInput.inputRaw("response"), 'base64').toString('utf8');
        let response_data = JSON.parse(data);

        return {
            body: response_data.body,
            headers: response_data.headers,
        }
    }
}
