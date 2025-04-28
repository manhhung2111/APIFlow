import {DBCondition} from "@ap/db";
import DBDraftUser from "./draft.user";

export default class Loader{

    public static async byEmail(email: string){
        const condition = new DBCondition().setFilter({email: email, is_verified: true})
            .setLimit(1);

        return await DBDraftUser.findOne(condition) as DBDraftUser;
    }

    public static async byVerifiedToken(token: string) {
        const condition = new DBCondition().setFilter({is_verified: false, verification_token: token})
            .setLimit(1);
        return await DBDraftUser.findOne(condition) as DBDraftUser;
    }
}