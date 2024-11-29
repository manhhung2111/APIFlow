import bcrypt from "bcrypt";
import {HydratedDocument} from "mongoose";
import {DBReader} from "@ap/db";
import {Code, Validation} from "@ap/core";
import {UserLoader} from "@entities/user";
import {DUser} from "@db-schemas";


class Reader extends DBReader<DUser> {
    constructor(obj: HydratedDocument<DUser>) {
        super(obj);
    }

    public async read(data: { email: string, password: string, first_name: string, last_name: string }) {
        let {email, password, first_name, last_name} = data;

        if (!Validation.validEmail(email)) {
            throw new Code("Invalid email address.");
        }

        if (await UserLoader.findByEmail(email)) {
            throw new Code("This email is taken by another account");
        }

        this._obj.email = email;
        this._obj.password = await this.hashPassword(password);
        this._obj.first_name = first_name;
        this._obj.last_name = last_name;
    }


    public async readPrimary() {

    }

    public async readPassword() {

    }


    private async hashPassword(password: string) {
        let salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }
}

export default Reader;
