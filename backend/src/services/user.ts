import {Code, Validation} from "@ap/core";
import {UserLoader} from "@entities/user";
import bcrypt from "bcrypt";

export default class UserService {

    public static async login(data: { email: string; password: string }) {
        if (!Validation.validEmail(data.email)) {
            throw new Code("Invalid email address.");
        }

        let user = await UserLoader.byEmail(data.email);
        if (!user) {
            throw new Code("Invalid Email or Password!");
        }

        let correct_password = await bcrypt.compare(data.password, user.password);
        if (!correct_password) {
            throw new Code("Invalid Email or Password!");
        }

        return user;
    }
}