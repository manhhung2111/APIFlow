import DBReader from "../base/DBReader";
import {Document} from "mongoose";
import DBModel from "../base/DBModel";
import DBCondition from "../base/DBCondition";
import Code from "../../ap/code";
import bcrypt from 'bcrypt';
import Validation from "../../ap/validation";

class Reader extends DBReader {

    constructor(obj: Document, db: DBModel<any>) {
        super(obj, db);
    }

    async read(request_body: object): Promise<Code> {
        // @ts-ignore
        let {email, password, first_name, last_name} = request_body;

        if (!Validation.validEmail(email)) {
            return Code.error("Invalid email address.")
        }

        if (await this.userExists(email)) {
            return Code.error("User exists")
        }

        this._obj.set("email", email);

        let hashed_password = await this.hashPassword(password);
        this._obj.set("password", hashed_password);

        this._obj.set("first_name", first_name);
        this._obj.set("last_name", last_name);

        return Code.success("User read", "User data has been read");
    }


    private async userExists(email: string) {
        let sc = new DBCondition();
        sc.filter = {email: {$eq: email}};

        let user = await this._db.findOne(sc);

        return user !== null;
    }

    private async hashPassword(password: string) {
        let salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }
}

export default Reader;