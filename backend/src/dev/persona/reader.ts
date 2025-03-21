import {HydratedDocument} from "mongoose";
import {DBReader} from "@ap/db";
import {DEnvironment, DPersona} from "@db-schemas";
import Client from "@dev/client";
import UUID from "@utils/uuid";
import {Code, HTMLInput, Validation} from "@ap/core";
import {DBEnvironment} from "@dev/environment/index";
import {DBPersona} from "@dev/persona/index";
import {RequestServiceReader} from "@services/request";


export default class Reader extends DBReader<DPersona>{
    constructor(obj: HydratedDocument<DPersona> | null | undefined){
        super(obj);
    }

    public async read(){
        if (this.isCreating()){
            this._obj.user_id = Client.viewer._id.toString();
            this._obj.token = UUID.randomTokenSize32();
            this._obj.workspace_id = HTMLInput.inputInline("workspace_id");
            this._obj.name = "New Persona";
        } else {
            this.readName();
            this.readAuthentication();
        }
    }


    public readName(){
        this._obj.name = HTMLInput.inputInline("name");

        if (Validation.isEmpty(this._obj.name)){
            throw new Code("Persona name must not be empty");
        }

        if (this._obj.name.length > 255){
            throw new Code("Persona name must not exceed 255 characters");
        }
    }

    public readAuthentication() {
        const request_reader = new RequestServiceReader();
        request_reader.readAuthorization();
        this._obj.authorization = request_reader.getAuthorization();
    }

    public duplicate(old_persona: DBPersona) {
        this._obj.user_id = Client.viewer._id.toString();
        this._obj.token = UUID.randomTokenSize32();
        this._obj.workspace_id = old_persona.object!.workspace_id.toString();
        this._obj.name =  old_persona.object!.name + " (Copy)";
        this._obj.authorization = old_persona.object!.authorization;
    }
}
