import {Authorization} from "@services/authorization/index";
import {HTMLInput} from "@ap/core";

export default class APIKeyAuthorization extends Authorization{
    protected type: number = Authorization.APIKeyAuth;

    readData(): void {
        const key = HTMLInput.inputInline("key");
        const value = HTMLInput.inputInline("value");
        const add_to = HTMLInput.inputInline("add_to");

        this.data.key = key;
        this.data.value = value;
        this.data.add_to = add_to || "Params";
    }

}