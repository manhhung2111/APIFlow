import token from "random-web-token";

export default class TokenGenerator {

    public static generate() {
        return token.genSync("extra", 24);
    }

    public static generateOTP() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
}