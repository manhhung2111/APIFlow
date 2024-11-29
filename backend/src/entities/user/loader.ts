import {DBCondition} from "@ap/db";
import {User} from "@entities/user";

class Loader {

    public static async findByEmail(email: string) {
        const condition = new DBCondition().setFilter({email: email})
            .setLimit(1);

        const user = new User();

        return await user.findOne(condition);
    }
}

export default Loader;