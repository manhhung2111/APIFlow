import DBReader from "../base/DBReader";
import {Document} from "mongoose";
import bcrypt from "bcrypt";
import {UserLoader} from "./index";
import {Validation, Code} from "../../ap";


class Reader extends DBReader {
    constructor(obj: Document) {
        super(obj);
    }

    async read(data: { email: string, password: string, first_name: string, last_name: string }) {
        let {email, password, first_name, last_name} = data;

        if (!Validation.validEmail(email)) {
            throw new Code("Invalid email address.");
        }

        if (await UserLoader.findByEmail(email)) {
            throw new Code("This email is taken by another account");
        }

        this._obj.set("email", email);

        let hashed_password = await this.hashPassword(password);
        this._obj.set("password", hashed_password);

        this._obj.set("first_name", first_name);
        this._obj.set("last_name", last_name);
    }


    private async hashPassword(password: string) {
        let salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }
}

export default Reader;
