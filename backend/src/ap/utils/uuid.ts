import {v4 as uuidv4} from "uuid";

export default class UUID{

	public static randomTokenSize32(){
		return uuidv4().toString().replace(/-/gi, "");
	}

	public static randomTokenSize24() {
		return uuidv4().replace(/-/g, "").substring(0, 24);
	}
}