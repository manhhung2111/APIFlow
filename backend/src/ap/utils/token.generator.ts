import token from "random-web-token";

export default class TokenGenerator {

    public static generate() {
        return token.genSync("extra", 24);
    }
}