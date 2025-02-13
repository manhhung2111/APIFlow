import {Request} from "express";
import {Code, Validation, Word} from "@ap/core";
import {decode as htmlDecode} from "html-entities";

export default class HTMLInput{
	public static GET = 1;
	public static POST = 2;
	public static PUT = 3;
	public static DELETE = -1;

	private static _cur_request: Request | null = null;
	private static MAX_TITLE_CHAR = 1023;
	private static allowed_tags = [
		"b", "center", "i", "u", "br", "p", "h1", "h2", "h3", "h4", "h5", "h6", "ul", "li", "url", "img", "code", "small", "big", "tab", "quote", "sub", "sup", "link", "image", "pre", "label",
	];
	private static _files: any = {};

	public static readRequest(request: Request){
		this._cur_request = request;

		if (!request.files) return;

		if (Array.isArray(request.files)){
			request.files.forEach(file => {
				if (!this._files[file.fieldname]) this._files[file.fieldname] = [];
				this._files[file.fieldname].push(file);
			});
		} else if (typeof request.files === "object"){
			for (const field in Object.keys(request.files)){
				const files = request.files[field];

				this._files[field] = [...files];
			}
		}
	}

	public static param(field: string = ""){
		if (!this._cur_request){
			throw new Code("Please read the request to use request data");
		}

		const value = this._cur_request.params[field];
		if (value === undefined || value === null){
			// throw new Code(`Param \"${field}\" does not exist in the URL.`);
			return "";
		}

		return value;
	}

	public static page() {
		if (!this._cur_request){
			throw new Code("Please read the request to use request data");
		}

		const value = this._cur_request.query["page"];
		if (value === undefined || value === null){
			return 0;
		}

		return value;
	}

	public static query(field: string = ""){
		if (!this._cur_request){
			throw new Code("Please read the request to use request data");
		}

		const value = this._cur_request.query[field];
		if (value === undefined || value === null){
			// throw new Code(`Query \"${field}\" does not exist in the URL.`);
			return "";
		}

		return value as string;
	}

	public static cookies(field: string = ""){
		if (!this._cur_request){
			throw new Code("Please read the request to use request data");
		}

		const value = this._cur_request.cookies[field];

		if (!value) return "";
		return value;
	}


	public static signedCookies(field: string = ""){
		if (!this._cur_request){
			throw new Code("Please read the request to use request data");
		}

		const value = this._cur_request.signedCookies[field];

		if (!value) return "";
		return value;
	}

	public static inputSafe(field: string, limit_character: boolean = true){
		if (!this._cur_request){
			throw new Code("Please read the request to use request data");
		}

		const raw = htmlDecode(this.inputRaw(field));

		let text: string;
		if (limit_character){
			text = Word.addSmartQuote(Word.shorten(raw, this.MAX_TITLE_CHAR, ""));
		} else{
			text = Word.addSmartQuote(raw);
		}
		text = this.sanitize(text);

		return text;
	}

	public static inputInline(field: string){
		if (!this._cur_request){
			throw new Code("Please read the request to use request data");
		}

		let value = this.inputSafe(field)
			.replace(/<br\s*\/?>/gi, "\n") // replacing <br> with newlines
			.replace(/<\/?[^>]+(>|$)/g, ""); // remove HTML tags from a string

		// remove single and double quotes
		value = value.replace(/["']/g, "");

		// replace multiple spaces with a single space
		value = value.replace(/\s+/g, " ");

		// remove control characters (ASCII code 0-31)
		value = value.replace(/[^\x20-\x7E]/g, "");

		return value;
	}

	public static inputInlineNoLimit(field: string){
		if (!this._cur_request){
			throw new Code("Please read the request to use request data");
		}

		let value = this.inputSafe(field, false)
			.replace(/<br\s*\/?>/gi, "\n") // replacing <br> with newlines
			.replace(/<\/?[^>]+(>|$)/g, ""); // remove HTML tags from a string

		// remove single and double quotes
		value = value.replace(/["']/g, "");

		// replace multiple spaces with a single space
		value = value.replace(/\s+/g, " ");

		// remove control characters (ASCII code 0-31)
		value = value.replace(/[^\x20-\x7E]/g, "");

		return value;
	}

	public static inputInt(field: string){
		let value = this.inputRaw(field);

		if (!Validation.isInt(value)) return -1;
		return Number(value);
	}

	public static inputList(field: string, splitter: string = ","){
		let value = this.inputSafe(field);
		if (!value) return [];

		const r = Word.split(splitter, value);

		for (let i = 0; i < r.length; i++){
			r[i] = this.cleanData(r[i]);
		}

		return r;

	}

	public static inputIntList(field: string, splitter: string = ","){
		const result: number[] = [];

		const values = this.inputList(field, splitter);
		for (const value of values){
			if (Validation.isInt(value)){
				result.push(Number(value));
			}
		}

		return result;
	}

	public static inputEditor(field: string){
		return "";
	}

	public static inputFile(field: string){
		return this._files[field];
	}

	private static sanitize(text: string, style: string = ""): string{
		if (!text) return "";

		// Arrays for HTML and BBCode equivalents
		const html: string[] = [];
		const bb: string[] = [];

		// Populate HTML and BBCode arrays
		for (let i = 0; i < this.allowed_tags.length; i++){
			html.push(`<${this.allowed_tags[i]}>`, `</${this.allowed_tags[i]}>`);
			bb.push(`[${this.allowed_tags[i]}]`, `[/${this.allowed_tags[i]}]`);
		}

		// Add line breaks if the style isn't 'html' or 'editor'
		if (style !== "html" && style !== "editor"){
			html.push("\n");
			bb.push("[br]");
		}

		// Step 1: Convert HTML to BBCode
		text = text.replace(new RegExp(html.join("|"), "gi"), (match) => {
			const index = html.indexOf(match);
			return index !== -1 ? bb[index] : match;
		});

		// Step 2: Escape potentially dangerous characters
		const danger: string[] = ["<", ">", "\n", "\\", "'", "\"", "|"];
		const safe: string[] = ["&lt;", "&gt;", "", "&#92;", "&#39;", "&#34;", "&#124;"];
		text = text.replace(
			new RegExp(danger.map((char) => `\\${char}`).join("|"), "g"),
			(match) => {
				const index = danger.indexOf(match);
				return index !== -1 ? safe[index] : match;
			},
		);

		// Step 3: Convert BBCode back to HTML
		text = text.replace(new RegExp(bb.join("|"), "gi"), (match) => {
			const index = bb.indexOf(match);
			return index !== -1 ? html[index] : match;
		});

		return text;
	}

	public static inputRaw(field: string): string{
		let value = this._cur_request?.body[field] || "";

		try{
			let json_value = JSON.parse(value);
			if (typeof json_value === "object" && json_value !== null){
				value = JSON.stringify(json_value); // Convert the object to string
			} else{
				value = json_value?.toString() ?? ""; // If it's not an object, just treat it as a string
			}
		} catch (error){

		}

		return this.cleanData(value);
	}

	private static cleanData(text: string): string{
		return text.replace(/[^\x20-\x7E]/g, "");
	}
}