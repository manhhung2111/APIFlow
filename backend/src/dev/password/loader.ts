import {DBCondition} from "@ap/db";
import DBPasswordResetToken from "@dev/password/password";

export default class DBPasswordResetTokenLoader {

    public static async byEmail(email: string) {
        const condition = new DBCondition().setFilter({email: email})
            .setLimit(1);

        return await DBPasswordResetToken.findOne(condition) as DBPasswordResetToken;
    }

    public static async byToken(token: string) {
        const condition = new DBCondition().setFilter({token: token})
            .setLimit(1);

        return await DBPasswordResetToken.findOne(condition) as DBPasswordResetToken;
    }
}