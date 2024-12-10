import {DBUserAcl} from "@ap/db";
import {DWorkspace} from "@db-schemas";

export default class UserACL extends DBUserAcl<DWorkspace>{

	private _viewable: boolean = false;
	private _commentable: boolean = false;
	private _editable: boolean = false;
	private _full_access: boolean = false;

	public canView(): boolean{
		let viewer_ids = this._obj?.viewers.map(id => id.toString()) ?? [];
		let commenter_ids = this._obj?.commenters.map(id => id.toString()) ?? [];
		let editor_ids = this._obj?.editors.map(id => id.toString()) ?? [];

		return this._obj?.user_id.toString() === this._user_id
			|| viewer_ids.includes(this._user_id)
			|| commenter_ids.includes(this._user_id)
			|| editor_ids.includes(this._user_id);
	}

	public canComment(): boolean{
		let commenter_ids = this._obj?.commenters.map(id => id.toString()) ?? [];
		let editor_ids = this._obj?.editors.map(id => id.toString()) ?? [];

		return this._obj?.user_id.toString() === this._user_id
			|| commenter_ids.includes(this._user_id)
			|| editor_ids.includes(this._user_id);
	}

	public canEdit(): boolean{
		let editor_ids = this._obj?.editors.map(id => id.toString()) ?? [];

		return this._obj?.user_id.toString() === this._user_id
			|| editor_ids.includes(this._user_id);
	}

	public isAdmin(): boolean{
		return this._obj?.user_id.toString() === this._user_id;
	}

	public release(): object{
		return {
			"viewable": this._viewable,
			"commentable": this._commentable,
			"editable": this._editable,
			"full_access": this._full_access,
		};
	}

	protected __init(){
		this._viewable = this.canView();
		this._commentable = this.canComment();
		this._editable = this.canEdit();
		this._full_access = this._obj?.user_id.toString() === this._user_id;
	}
}