import DBCondition from "../base/DBCondition";
import {User} from "./index";

class Loader {

    public static async findByEmail(email: string) {
        const condition = new DBCondition().setFilter({email: email})
                                        .setLimit(1);

        const user = new User();

        return await user.findOne(condition);
    }
};

export default Loader;