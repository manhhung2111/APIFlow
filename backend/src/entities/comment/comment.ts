import {DBModel} from "@ap/db";
import CommentModel from "@models/comment";
import {DComment} from "@db-schemas";
import {CommentReader} from "@entities/comment";
import {Model} from "mongoose";

export default class DBComment extends DBModel<DComment>{
	protected _db: Model<DComment> = CommentModel;

	release(): object{
		return this.export([""]);
	}

	releaseCompact(): object{
		return this.export([""]);
	}

	reader(){
		return new CommentReader(this._object);
	}
}