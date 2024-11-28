import DBCondition from "../base/DBCondition";
import {User} from "./index";

class Loader {

    public static async findByEmail(email: string) {
        let sc = new DBCondition();
        sc.filter = {email: {$eq: email}};

        const user = new User();

        return await user.findOne(sc);
    }

};

export default Loader;