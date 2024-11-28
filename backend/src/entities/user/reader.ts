import DBReader from "../base/DBReader";
import { Document } from "mongoose";
import DBModel from "../base/DBModel";
import DBCondition from "../base/DBCondition";
import Code from "../../ap/code";
import bcrypt from "bcrypt";
import Validation from "../../ap/validation";
import JWTToken from "../../ap/jwt";

class Reader extends DBReader {
  constructor(obj: Document, db: DBModel<any>) {
    super(obj, db);
  }

  async read(request_body: object) {
    // @ts-ignore
    let { email, password, first_name, last_name } = request_body;

    if (!Validation.validEmail(email)) {
      throw new Code("Invalid email address.");
    }

    if (await this.userExists(email)) {
      throw new Code("This email is taken by another account");
    }

    this._obj.set("email", email);

    let hashed_password = await this.hashPassword(password);
    this._obj.set("password", hashed_password);

    this._obj.set("first_name", first_name);
    this._obj.set("last_name", last_name);
  }

  async readLogin(request_body: object) {
    //@ts-ignore
    let { email, password } = request_body;

    if (!Validation.validEmail(email)) {
      throw new Code("Invalid email address.");
    }

    let user = await this.userExists(email);
    if (!user) {
      throw new Code("Invalid Email or Password!");
    }

    try {
      let correct_password = await bcrypt.compare(password, user.get("password"));
      if (!correct_password) {
        throw new Code("Invalid Email or Password!");
      }

      let code = await JWTToken.signToken(this._db_model.releaseCompact());
      if (!code.good()) {
        return code;
      }


    } catch (error) {
      if (error instanceof Error) {
        return Code.error(error.message);
      }
      return Code.unknownError();
    }
  }

  private async userExists(email: string): Promise<Document> {
    let sc = new DBCondition();
    sc.filter = { email: { $eq: email } };

    let user = await this._db_model.findOne(sc);

    return user;
  }

  private async hashPassword(password: string) {
    let salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }
}

export default Reader;
